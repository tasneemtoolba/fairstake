"use client";

import { hardhat } from "viem/chains";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import scaffoldConfig from "~~/scaffold.config";

export const Footer = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = !scaffoldConfig.liveDeploy && targetNetwork.id === hardhat.id;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        {isLocalNetwork && <Faucet />}
        <SwitchTheme />
      </div>
      <footer className="border-t border-base-300 mt-auto py-6 text-center text-xs text-base-content/45">
        FairStake · ETHGlobal Online · World · ENS · Arc
      </footer>
    </>
  );
};
