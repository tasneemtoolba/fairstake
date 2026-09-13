"use client";

import { useState } from "react";
import { CommitPanel } from "./CommitPanel";
import { FundingBanner } from "./FundingBanner";
import { HeroSection } from "./HeroSection";
import { KycTreadmill } from "./KycTreadmill";
import { PassportCard } from "./PassportCard";
import { ProofJourney } from "./ProofJourney";
import { SybilAttackTheater } from "./SybilAttackTheater";
import { SybilTestPanel } from "./SybilTestPanel";
import { WhyFairStake } from "./WhyFairStake";
import { WorldVerifyButton } from "./WorldVerifyButton";
import { FsCard, FsSection } from "./ui/Design";
import { Address } from "@scaffold-ui/components";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useInvestorCredential } from "~~/hooks/useInvestorCredential";

type Step = "verify" | "credential" | "commit";

const FLOW_STEPS: { id: Step; num: string; title: string; desc: string }[] = [
  { id: "verify", num: "01", title: "Prove you're human", desc: "World Selfie Check — one person, one nullifier." },
  { id: "credential", num: "02", title: "Mint passport", desc: "Portable ENS-shaped credential for every launch." },
  { id: "commit", num: "03", title: "Commit USDC", desc: "Arc pool with per-investor caps. Sybils revert." },
];

export const FairStakeFlow = () => {
  const { address, isConnected } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const { isVerified, refetch } = useInvestorCredential();
  const [activeStep, setActiveStep] = useState<Step>("verify");

  const commitChainId = targetNetwork.id === hardhat.id ? hardhat.id : targetNetwork.id;

  const { data: myCommit } = useScaffoldReadContract({
    contractName: "FairStakePool",
    functionName: "committed",
    args: [1n, address],
    query: { enabled: !!address },
  });

  const hasCommitted = (myCommit ?? 0n) > 0n;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-10 px-1">
      <HeroSection />
      <ProofJourney hasCommitted={hasCommitted} />
      <FundingBanner />
      <KycTreadmill />
      <SybilAttackTheater />
      <WhyFairStake />

      <FsSection title="Live flow" subtitle="Connect wallet on Arc Testnet, then complete each step.">
        {isConnected && address && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <Address address={address} chain={targetNetwork} />
            <span className="text-base-content/40">·</span>
            <span className="text-base-content/60">{targetNetwork.name}</span>
          </div>
        )}

        <div className="space-y-3">
          {FLOW_STEPS.map(step => (
            <FsCard key={step.id} active={activeStep === step.id} className="space-y-3">
              <div className="flex gap-3 items-start">
                <span
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                    activeStep === step.id ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/50"
                  }`}
                >
                  {step.num}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold m-0">{step.title}</h3>
                  <p className="text-sm text-base-content/60 m-0 mt-0.5">{step.desc}</p>
                </div>
              </div>

              {step.id === "verify" && (
                <WorldVerifyButton
                  chainId={commitChainId}
                  onVerified={() => {
                    refetch();
                    setActiveStep("credential");
                  }}
                />
              )}
              {step.id === "credential" && (
                <>
                  <PassportCard />
                  {isVerified && (
                    <button type="button" className="btn btn-outline btn-xs" onClick={() => setActiveStep("commit")}>
                      Continue
                    </button>
                  )}
                </>
              )}
              {step.id === "commit" && <CommitPanel />}
            </FsCard>
          ))}
        </div>
      </FsSection>

      <SybilTestPanel />

      <footer className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-base-content/50 pb-4">
        <a href="/theater" className="link link-hover">
          Theater
        </a>
        <a href="/demo" className="link link-hover">
          Demo
        </a>
        <a href="/architecture" className="link link-hover">
          Architecture
        </a>
        <a
          href="https://github.com/tasneemtoolba/fairstake"
          className="link link-hover"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
};
