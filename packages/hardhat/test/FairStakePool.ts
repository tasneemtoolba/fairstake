import { expect } from "chai";
import { network } from "hardhat";

describe("FairStakePool", function () {
  it("creates a round and accepts verified commits", async function () {
    const { ethers } = await network.connect();
    const [owner, investor] = await ethers.getSigners();

    const FairStakePool = await ethers.getContractFactory("FairStakePool");
    const pool = await FairStakePool.deploy(owner.address);
    await pool.waitForDeployment();

    await pool.createRound(ethers.parseEther("100"), ethers.parseEther("1000"), 86400, ethers.ZeroAddress);

    await pool.setCredential(
      investor.address,
      true,
      ethers.parseEther("100"),
      Math.floor(Date.now() / 1000) + 3600,
      ethers.id("nullifier-1"),
    );

    await expect(pool.connect(investor).commit(1, ethers.parseEther("50"), { value: ethers.parseEther("50") }))
      .to.emit(pool, "Committed")
      .withArgs(investor.address, 1n, ethers.parseEther("50"));

    expect(await pool.committed(1, investor.address)).to.equal(ethers.parseEther("50"));
  });

  it("reverts when investor is not verified", async function () {
    const { ethers } = await network.connect();
    const [owner, investor] = await ethers.getSigners();

    const FairStakePool = await ethers.getContractFactory("FairStakePool");
    const pool = await FairStakePool.deploy(owner.address);
    await pool.waitForDeployment();

    await pool.createRound(ethers.parseEther("100"), ethers.parseEther("1000"), 86400, ethers.ZeroAddress);

    await expect(
      pool.connect(investor).commit(1, ethers.parseEther("10"), { value: ethers.parseEther("10") }),
    ).to.be.revertedWith("Human not verified");
  });

  it("rejects reused nullifier", async function () {
    const { ethers } = await network.connect();
    const [owner, investor, other] = await ethers.getSigners();

    const FairStakePool = await ethers.getContractFactory("FairStakePool");
    const pool = await FairStakePool.deploy(owner.address);
    await pool.waitForDeployment();

    const nullifier = ethers.id("nullifier-reuse");

    await pool.setCredential(
      investor.address,
      true,
      ethers.parseEther("100"),
      Math.floor(Date.now() / 1000) + 3600,
      nullifier,
    );

    await expect(
      pool.setCredential(
        other.address,
        true,
        ethers.parseEther("100"),
        Math.floor(Date.now() / 1000) + 3600,
        nullifier,
      ),
    ).to.be.revertedWith("Nullifier already used");
  });
});
