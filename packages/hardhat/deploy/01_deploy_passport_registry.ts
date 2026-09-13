import { deployScript, artifacts } from "../rocketh/deploy.js";

export default deployScript(
  async env => {
    const { deployer } = env.namedAccounts;

    const registry = await env.deploy("InvestorPassportRegistry", {
      account: deployer,
      artifact: artifacts.InvestorPassportRegistry,
      args: [deployer],
    });

    console.log("InvestorPassportRegistry deployed:", registry.address);
  },
  {
    tags: ["InvestorPassportRegistry"],
  },
);
