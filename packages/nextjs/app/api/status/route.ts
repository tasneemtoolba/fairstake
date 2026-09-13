import { NextResponse } from "next/server";
import { createPublicClient, formatEther, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";
import { arcTestnet } from "~~/lib/chains/arcTestnet";

const DEPLOYER = "0xc943bF2b3Ee4f94b66208A80EE3D168eCF0Fc7de";

async function getBalance(chainId: number, rpc: string) {
  const client = createPublicClient({ transport: http(rpc) });
  const balance = await client.getBalance({ address: DEPLOYER });
  return formatEther(balance);
}

export async function GET() {
  const arcRpc = process.env.ARC_TESTNET_RPC_URL ?? "https://rpc.testnet.arc.io";
  const sepoliaRpc =
    process.env.SEPOLIA_RPC_URL ??
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "IZYEU2cWBgnFmgiTAgpWD"}`;

  let arcBalance = "0";
  let sepoliaBalance = "0";
  try {
    arcBalance = await getBalance(arcTestnet.id, arcRpc);
  } catch {
    /* ignore */
  }
  try {
    sepoliaBalance = await getBalance(sepolia.id, sepoliaRpc);
  } catch {
    /* ignore */
  }

  const hasVerifier = Boolean(process.env.VERIFIER_PRIVATE_KEY ?? process.env.ENS_PRIVATE_KEY);
  let deployerAddress = DEPLOYER;
  if (process.env.VERIFIER_PRIVATE_KEY) {
    try {
      deployerAddress = privateKeyToAccount(
        (process.env.VERIFIER_PRIVATE_KEY.startsWith("0x")
          ? process.env.VERIFIER_PRIVATE_KEY
          : `0x${process.env.VERIFIER_PRIVATE_KEY}`) as `0x${string}`,
      ).address;
    } catch {
      /* keep default */
    }
  }

  const byChain = deployedContracts as Record<
    number,
    {
      FairStakePool?: { address: string };
      InvestorPassportRegistry?: { address: string };
    }
  >;

  return NextResponse.json({
    deployer: deployerAddress,
    funding: {
      arc: { balance: arcBalance, funded: Number(arcBalance) > 0, faucet: "https://faucet.circle.com" },
      sepolia: { balance: sepoliaBalance, funded: Number(sepoliaBalance) > 0, faucet: "https://sepoliafaucet.com" },
    },
    deployments: {
      hardhat: {
        pool: byChain[31337]?.FairStakePool?.address ?? null,
        passport: byChain[31337]?.InvestorPassportRegistry?.address ?? null,
      },
      sepolia: {
        passport: byChain[11155111]?.InvestorPassportRegistry?.address ?? null,
      },
      arc: {
        pool: byChain[5042002]?.FairStakePool?.address ?? null,
      },
    },
    worldConfigured: Boolean(process.env.NEXT_PUBLIC_WORLD_APP_ID && process.env.WORLD_RP_SIGNING_KEY),
    verifierConfigured: hasVerifier,
  });
}
