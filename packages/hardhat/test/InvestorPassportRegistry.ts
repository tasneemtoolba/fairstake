import { expect } from "chai";
import { network } from "hardhat";

describe("InvestorPassportRegistry", function () {
  it("issues a passport with ENS-shaped fields", async function () {
    const { ethers } = await network.connect();
    const [owner, investor] = await ethers.getSigners();

    const Registry = await ethers.getContractFactory("InvestorPassportRegistry");
    const registry = await Registry.deploy(owner.address);
    await registry.waitForDeployment();

    const nullifier = ethers.id("world-nullifier-1");
    const expiresAt = Math.floor(Date.now() / 1000) + 86400;

    await expect(
      registry
        .connect(owner)
        .issuePassport(investor.address, "ac0974be.investor.fairstake.eth", 100, expiresAt, nullifier),
    )
      .to.emit(registry, "PassportIssued")
      .withArgs(investor.address, "ac0974be.investor.fairstake.eth", 100, expiresAt, nullifier);

    const passport = await registry.passports(investor.address);
    expect(passport.ensName).to.equal("ac0974be.investor.fairstake.eth");
    expect(passport.maxCommitUsd).to.equal(100n);
    expect(passport.humanVerified).to.equal(true);
    expect(passport.worldNullifier).to.equal(nullifier);
  });

  it("rejects non-owner issuance", async function () {
    const { ethers } = await network.connect();
    const [owner, investor, attacker] = await ethers.getSigners();

    const Registry = await ethers.getContractFactory("InvestorPassportRegistry");
    const registry = await Registry.deploy(owner.address);
    await registry.waitForDeployment();

    await expect(
      registry
        .connect(attacker)
        .issuePassport(investor.address, "x.investor.fairstake.eth", 50, 9999999999, ethers.ZeroHash),
    ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
  });
});
