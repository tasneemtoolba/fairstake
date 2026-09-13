import "dotenv/config";
import { ethers } from "ethers";
import { spawnSync } from "child_process";

const ARC_RPC = process.env.ARC_TESTNET_RPC_URL ?? "https://rpc.testnet.arc.io";

async function main() {
  const pk = process.env.DEPLOYER_PRIVATE_KEY;
  if (!pk) {
    console.error("Set DEPLOYER_PRIVATE_KEY in packages/hardhat/.env");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(ARC_RPC);
  const wallet = new ethers.Wallet(pk.startsWith("0x") ? pk : `0x${pk}`, provider);
  const balance = await provider.getBalance(wallet.address);

  console.log("Arc deployer:", wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "USDC");

  if (balance === 0n) {
    console.log("\n⏳ Waiting for faucet funds at https://faucet.circle.com (Arc Testnet)");
    process.exit(1);
  }

  console.log("\n🚀 Deploying to Arc Testnet...");
  const deploy = spawnSync("yarn", ["deploy:arc"], {
    stdio: "inherit",
    cwd: process.cwd().replace(/packages\/hardhat.*/, "") || ".",
  });
  if (deploy.status !== 0) process.exit(deploy.status ?? 1);

  console.log("\n📦 Creating demo rounds...");
  spawnSync("yarn", ["deploy:arc:setup"], { stdio: "inherit" });
}

main().catch(console.error);
