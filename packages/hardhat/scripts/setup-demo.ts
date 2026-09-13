import "dotenv/config";
import * as fs from "fs";
import { network } from "hardhat";

/**
 * Creates demo rounds on FairStakePool (Round 1: open fair launch, Round 2: reuse passport).
 * Run after: yarn chain && yarn deploy
 */
async function main() {
  const { ethers } = await network.connect();
  const networkArgIndex = process.argv.indexOf("--network");
  const networkFlag = networkArgIndex !== -1 ? process.argv[networkArgIndex + 1] : "default";
  const networkName = networkFlag === "hardhat" ? "default" : networkFlag;
  const deploymentPath = `./deployments/${networkName}/FairStakePool.json`;

  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`No deployment at ${deploymentPath}. Run yarn deploy first.`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8")) as { address: string };
  const pool = await ethers.getContractAt("FairStakePool", deployment.address);
  const [owner] = await ethers.getSigners();

  const roundCount = await pool.roundCount();
  const maxPerInvestor = ethers.parseEther("100");
  const totalCap = ethers.parseEther("10000");
  const duration = 7 * 24 * 60 * 60;

  if (roundCount === 0n) {
    const tx1 = await pool.connect(owner).createRound(maxPerInvestor, totalCap, duration, ethers.ZeroAddress);
    await tx1.wait();
    console.log("Round #1 created — Fair Launch Alpha");
  }

  const afterFirst = await pool.roundCount();
  if (afterFirst === 1n) {
    const tx2 = await pool.connect(owner).createRound(maxPerInvestor, totalCap, duration, ethers.ZeroAddress);
    await tx2.wait();
    console.log("Round #2 created — Fair Launch Beta (reuse passport demo)");
  }

  console.log("FairStakePool:", deployment.address);
  console.log("roundCount =", (await pool.roundCount()).toString());
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
