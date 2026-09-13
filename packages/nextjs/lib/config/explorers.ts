import { hardhat, sepolia } from "viem/chains";
import { arcTestnet } from "~~/lib/chains/arcTestnet";

export const EXPLORERS: Record<
  number,
  { name: string; tx: (hash: string) => string; address: (addr: string) => string }
> = {
  [hardhat.id]: {
    name: "Local",
    tx: () => "#",
    address: () => "#",
  },
  [sepolia.id]: {
    name: "Sepolia Etherscan",
    tx: hash => `https://sepolia.etherscan.io/tx/${hash}`,
    address: addr => `https://sepolia.etherscan.io/address/${addr}`,
  },
  [arcTestnet.id]: {
    name: "ArcScan",
    tx: hash => `https://testnet.arcscan.app/tx/${hash}`,
    address: addr => `https://testnet.arcscan.app/address/${addr}`,
  },
};
