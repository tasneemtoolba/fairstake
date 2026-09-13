import { deployScript, artifacts } from "../rocketh/deploy.js";

export default deployScript(
  async env => {
    const { deployer } = env.namedAccounts;

    const fairStakePool = await env.deploy("FairStakePool", {
      account: deployer,
      artifact: artifacts.FairStakePool,
      args: [deployer],
    });

    console.log("FairStakePool deployed:", fairStakePool.address);
  },
  {
    tags: ["FairStakePool"],
  },
);
