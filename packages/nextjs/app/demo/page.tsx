"use client";

import Link from "next/link";
import { hardhat } from "viem/chains";
import { CommitPanel } from "~~/components/fairstake/CommitPanel";
import { PassportCard } from "~~/components/fairstake/PassportCard";
import { SybilTestPanel } from "~~/components/fairstake/SybilTestPanel";
import { WorldVerifyButton } from "~~/components/fairstake/WorldVerifyButton";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

const JUDGE_STEPS = [
  { n: 1, title: "Verify human", detail: "World Selfie Check → passport mints" },
  { n: 2, title: "Commit Round 1", detail: "10 USDC from verified wallet" },
  { n: 3, title: "Sybil attack", detail: "Fresh wallet → commit REVERTS" },
  { n: 4, title: "Round 2 reuse", detail: "Same passport, no second selfie" },
];

export default function DemoPage() {
  const { targetNetwork } = useTargetNetwork();
  const chainId = targetNetwork.id === hardhat.id ? hardhat.id : targetNetwork.id;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div>
        <Link href="/" className="link link-hover text-sm">
          ← Home
        </Link>
        <h1 className="text-3xl font-bold mt-3">Judge Demo</h1>
        <p className="opacity-70 mt-2">3-minute Finalist script — lead with The Sybil Test</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {JUDGE_STEPS.map(step => (
          <div key={step.n} className="card bg-base-100 border border-base-300">
            <div className="card-body p-4">
              <span className="badge badge-primary badge-sm w-fit">Step {step.n}</span>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-xs opacity-70">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <SybilTestPanel />

      <div className="space-y-4">
        <div className="card bg-base-100 border border-primary">
          <div className="card-body">
            <h2 className="card-title text-lg">Live flow</h2>
            <WorldVerifyButton chainId={chainId} onVerified={() => {}} />
            <PassportCard />
            <CommitPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
