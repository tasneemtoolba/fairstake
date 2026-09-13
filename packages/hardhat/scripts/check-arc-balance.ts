import "dotenv/config";
import { ethers } from "ethers";

const ARC_RPC = process.env.ARC_TESTNET_RPC_URL ?? "https://rpc.testnet.arc.io";

async function main() {
  const pk =
    process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY ??
    process.env.DEPLOYER_PRIVATE_KEY ??
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  const provider = new ethers.JsonRpcProvider(ARC_RPC);
  const wallet = new ethers.Wallet(pk, provider);
  const balance = await provider.getBalance(wallet.address);

  console.log("Arc Testnet deployer:", wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "USDC (native gas)");
  console.log("Chain ID:", (await provider.getNetwork()).chainId.toString());

  if (balance === 0n) {
    console.log("\n⚠️  Fund this address at https://faucet.circle.com (select Arc Testnet)");
    process.exit(1);
  }

  console.log("\n✅ Ready to deploy: yarn deploy:arc");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
