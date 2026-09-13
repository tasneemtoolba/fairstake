import { type Chain, createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";
import { arcTestnet } from "~~/lib/chains/arcTestnet";

const FAIRSTAKE_POOL_ABI = [
  {
    type: "function",
    name: "setCredential",
    stateMutability: "nonpayable",
    inputs: [
      { name: "investor", type: "address" },
      { name: "verified", type: "bool" },
      { name: "maxCommit", type: "uint256" },
      { name: "expiresAt", type: "uint256" },
      { name: "nullifierHash", type: "bytes32" },
    ],
    outputs: [],
  },
] as const;

function getChain(chainId: number): Chain {
  if (chainId === hardhat.id) return hardhat;
  if (chainId === arcTestnet.id) return arcTestnet;
  throw new Error(`Unsupported chain for verifier: ${chainId}`);
}

function getPoolAddress(chainId: number): `0x${string}` {
  const envAddress = process.env.FAIRSTAKE_POOL_ADDRESS;
  if (envAddress) {
    return envAddress as `0x${string}`;
  }

  const contractsByChain = deployedContracts as Record<number, { FairStakePool?: { address: string } }>;
  const pool = contractsByChain[chainId]?.FairStakePool;
  if (!pool?.address) {
    throw new Error(`FairStakePool not deployed on chain ${chainId}. Run yarn deploy first.`);
  }
  return pool.address as `0x${string}`;
}

function getVerifierAccount() {
  const rawKey = process.env.VERIFIER_PRIVATE_KEY ?? process.env.DEPLOYER_PRIVATE_KEY;
  if (!rawKey) {
    throw new Error("Set VERIFIER_PRIVATE_KEY or DEPLOYER_PRIVATE_KEY for credential issuance");
  }
  const privateKey = (rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`) as `0x${string}`;
  return privateKeyToAccount(privateKey);
}

export async function issueOnChainCredential(params: {
  chainId: number;
  investor: `0x${string}`;
  nullifierHash: `0x${string}`;
  maxCommitUsd?: number;
  expiresInSeconds?: number;
}) {
  const chain = getChain(params.chainId);
  const rpcUrl =
    params.chainId === hardhat.id
      ? "http://127.0.0.1:8545"
      : (process.env.ARC_TESTNET_RPC_URL ?? "https://rpc.testnet.arc.io");

  const account = getVerifierAccount();
  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  });
  const publicClient = createPublicClient({ chain, transport: http(rpcUrl) });

  const maxCommit = parseEther(String(params.maxCommitUsd ?? 100));
  const expiresAt = BigInt(Math.floor(Date.now() / 1000) + (params.expiresInSeconds ?? 86400 * 30));

  const hash = await walletClient.writeContract({
    address: getPoolAddress(params.chainId),
    abi: FAIRSTAKE_POOL_ABI,
    functionName: "setCredential",
    args: [params.investor, true, maxCommit, expiresAt, params.nullifierHash],
  });

  await publicClient.waitForTransactionReceipt({ hash });
  return { hash, maxCommit, expiresAt };
}
