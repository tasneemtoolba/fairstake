import { type Chain, createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat, sepolia } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";

const REGISTRY_ABI = parseAbi([
  "function issuePassport(address holder, string ensName, uint256 maxCommitUsd, uint256 expiresAt, bytes32 worldNullifier)",
  "function passports(address holder) view returns (string ensName, uint256 maxCommitUsd, uint256 expiresAt, bool humanVerified, bytes32 worldNullifier)",
]);

const PASSPORT_CHAIN_IDS = [hardhat.id, sepolia.id] as const;

function getRegistryAddress(chainId: number): `0x${string}` | null {
  if (chainId === sepolia.id && process.env.INVESTOR_PASSPORT_REGISTRY_ADDRESS) {
    return process.env.INVESTOR_PASSPORT_REGISTRY_ADDRESS as `0x${string}`;
  }

  const contracts = deployedContracts[chainId as keyof typeof deployedContracts] as
    | { InvestorPassportRegistry?: { address: string } }
    | undefined;

  return (contracts?.InvestorPassportRegistry?.address as `0x${string}`) ?? null;
}

function getChain(chainId: number): Chain | null {
  if (chainId === hardhat.id) return hardhat;
  if (chainId === sepolia.id) return sepolia;
  return null;
}

function getRpc(chainId: number): string | null {
  if (chainId === hardhat.id) return "http://127.0.0.1:8545";
  if (chainId === sepolia.id) {
    return (
      process.env.SEPOLIA_RPC_URL ??
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "IZYEU2cWBgnFmgiTAgpWD"}`
    );
  }
  return null;
}

function getIssuerAccount() {
  const rawKey = process.env.ENS_PRIVATE_KEY ?? process.env.VERIFIER_PRIVATE_KEY;
  if (!rawKey) return null;
  return privateKeyToAccount((rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`) as `0x${string}`);
}

export async function issuePassportOnChain(params: {
  passportChainId: number;
  holder: `0x${string}`;
  ensName: string;
  maxCommitUsd: number;
  expiresAt: number;
  worldNullifier: `0x${string}`;
}) {
  const chain = getChain(params.passportChainId);
  const address = getRegistryAddress(params.passportChainId);
  const account = getIssuerAccount();
  const rpc = getRpc(params.passportChainId);

  if (!chain || !address || !account || !rpc) {
    return { skipped: true as const, reason: "Passport registry not configured for chain" };
  }

  const walletClient = createWalletClient({ account, chain, transport: http(rpc) });
  const publicClient = createPublicClient({ chain, transport: http(rpc) });

  const hash = await walletClient.writeContract({
    address,
    abi: REGISTRY_ABI,
    functionName: "issuePassport",
    args: [params.holder, params.ensName, BigInt(params.maxCommitUsd), BigInt(params.expiresAt), params.worldNullifier],
  });

  await publicClient.waitForTransactionReceipt({ hash });

  const explorer = params.passportChainId === sepolia.id ? `https://sepolia.etherscan.io/tx/${hash}` : undefined;

  return { skipped: false as const, hash, chainId: params.passportChainId, explorer };
}

export async function readPassport(holder: `0x${string}`, preferredChainId?: number) {
  const chainIds = preferredChainId ? [preferredChainId] : [...PASSPORT_CHAIN_IDS];

  for (const chainId of chainIds) {
    const address = getRegistryAddress(chainId);
    const rpc = getRpc(chainId);
    const chain = getChain(chainId);
    if (!address || !rpc || !chain) continue;

    try {
      const publicClient = createPublicClient({ chain, transport: http(rpc) });
      const result = await publicClient.readContract({
        address,
        abi: REGISTRY_ABI,
        functionName: "passports",
        args: [holder],
      });

      const [ensName, maxCommitUsd, expiresAt, humanVerified] = result;
      if (!humanVerified || !ensName) continue;

      return {
        ensName,
        maxCommitUsd: Number(maxCommitUsd),
        expiresAt: Number(expiresAt),
        humanVerified,
        registryAddress: address,
        chainId,
        explorer: chainId === sepolia.id ? `https://sepolia.etherscan.io/address/${address}` : undefined,
      };
    } catch {
      continue;
    }
  }

  return null;
}
