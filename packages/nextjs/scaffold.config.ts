import * as chains from "viem/chains";
import { arcTestnet } from "~~/lib/chains/arcTestnet";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  /** Chain ID used on first load (Arc on Vercel, Hardhat locally). */
  defaultNetworkId: number;
  /** Hide Hardhat faucet / burner on deployed builds. */
  liveDeploy: boolean;
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
  burnerWalletMode: "localNetworksOnly" | "allNetworks" | "disabled";
};

export const DEFAULT_ALCHEMY_API_KEY = "IZYEU2cWBgnFmgiTAgpWD";

/** Set at build time on Vercel — baked into client bundle. */
const liveDeploy = process.env.VERCEL === "1" || process.env.NEXT_PUBLIC_LIVE_DEPLOY === "true";

const scaffoldConfig = {
  targetNetworks: liveDeploy ? [arcTestnet, chains.sepolia] : [chains.hardhat, arcTestnet, chains.sepolia],
  defaultNetworkId: liveDeploy ? arcTestnet.id : chains.hardhat.id,
  liveDeploy,

  pollingInterval: 3000,

  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,

  rpcOverrides: {
    [arcTestnet.id]: process.env.NEXT_PUBLIC_ARC_RPC_URL ?? "https://rpc.testnet.arc.io",
  },

  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  burnerWalletMode: liveDeploy ? "disabled" : "localNetworksOnly",
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
