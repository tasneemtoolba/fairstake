"use client";

import { useState } from "react";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { CommitPanel } from "~~/components/fairstake/CommitPanel";
import { KycTreadmill } from "~~/components/fairstake/KycTreadmill";
import { PassportCard } from "~~/components/fairstake/PassportCard";
import { ProofJourney } from "~~/components/fairstake/ProofJourney";
import { SybilAttackTheater } from "~~/components/fairstake/SybilAttackTheater";
import { SybilTestPanel } from "~~/components/fairstake/SybilTestPanel";
import { WorldVerifyButton } from "~~/components/fairstake/WorldVerifyButton";
import { FsCard, FsEyebrow } from "~~/components/fairstake/ui/Design";
import { useScaffoldReadContract, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useInvestorCredential } from "~~/hooks/useInvestorCredential";

const ACTS = [
  { id: 1, title: "The problem", subtitle: "KYC treadmill vs passport" },
  { id: 2, title: "The attack", subtitle: "50 sybils vs one pool" },
  { id: 3, title: "Live proof", subtitle: "Arc Testnet demo" },
  { id: 4, title: "Judge checklist", subtitle: "Sybil test script" },
];

export default function TheaterPage() {
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const { isVerified, refetch } = useInvestorCredential();
  const [spotlight, setSpotlight] = useState(1);

  const chainId = targetNetwork.id === hardhat.id ? hardhat.id : targetNetwork.id;

  const { data: myCommit } = useScaffoldReadContract({
    contractName: "FairStakePool",
    functionName: "committed",
    args: [1n, address],
    query: { enabled: !!address },
  });

  const hasCommitted = (myCommit ?? 0n) > 0n;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      <header className="space-y-3">
        <Link href="/" className="link text-xs">
          Back
        </Link>
        <FsEyebrow>Finalist demo</FsEyebrow>
        <h1 className="text-3xl font-semibold tracking-tight m-0">Judge Theater</h1>
        <p className="text-sm text-base-content/65 m-0">Four acts · three minutes · one sybil test.</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {ACTS.map(act => (
            <button
              key={act.id}
              type="button"
              className={`btn btn-xs ${spotlight === act.id ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setSpotlight(act.id)}
            >
              {act.id}
            </button>
          ))}
        </div>
      </header>

      <ProofJourney hasCommitted={hasCommitted} />

      <div className={spotlight === 1 ? "" : "opacity-50"}>
        <KycTreadmill />
      </div>
      <div className={spotlight === 2 ? "" : "opacity-50"}>
        <SybilAttackTheater />
      </div>
      <div className={spotlight === 3 ? "" : "opacity-50"}>
        <FsCard active={spotlight === 3} className="space-y-4">
          <div>
            <FsEyebrow>Act 3</FsEyebrow>
            <p className="text-sm text-base-content/60 m-0 mt-1">
              Network: {targetNetwork.name}
              {!address && " · Connect wallet"}
            </p>
          </div>
          <WorldVerifyButton
            chainId={chainId}
            onVerified={() => {
              refetch();
              setSpotlight(4);
            }}
          />
          <PassportCard />
          <CommitPanel />
        </FsCard>
      </div>
      <div className={spotlight === 4 ? "" : "opacity-50"}>
        <SybilTestPanel />
        {isVerified && (
          <p className="text-xs text-success mt-3 m-0">Step 1 complete — run the sybil wallet test next.</p>
        )}
      </div>
    </div>
  );
}
