import "dotenv/config";
import { ethers } from "ethers";

const SEPOLIA_RPC =
  process.env.SEPOLIA_RPC_URL ??
  `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY ?? "IZYEU2cWBgnFmgiTAgpWD"}`;

async function main() {
  const pk =
    process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY ??
    process.env.DEPLOYER_PRIVATE_KEY ??
    process.env.ENS_PRIVATE_KEY ??
    process.env.VERIFIER_PRIVATE_KEY;

  if (!pk) {
    console.log("Set DEPLOYER_PRIVATE_KEY or VERIFIER_PRIVATE_KEY");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const wallet = new ethers.Wallet(pk.startsWith("0x") ? pk : `0x${pk}`, provider);
  const balance = await provider.getBalance(wallet.address);

  console.log("Sepolia deployer:", wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.log("\n⚠️  Fund at https://sepoliafaucet.com or https://faucet.quicknode.com/ethereum/sepolia");
    process.exit(1);
  }

  console.log("\n✅ Ready: yarn workspace @se-2/hardhat deploy --network sepolia");
}

main().catch(console.error);
