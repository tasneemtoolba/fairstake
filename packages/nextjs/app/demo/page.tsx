"use client";

import Link from "next/link";
import { hardhat } from "viem/chains";
import { CommitPanel } from "~~/components/fairstake/CommitPanel";
import { JudgeDemoSteps } from "~~/components/fairstake/JudgeDemoSteps";
import { PassportCard } from "~~/components/fairstake/PassportCard";
import { SybilTestPanel } from "~~/components/fairstake/SybilTestPanel";
import { WorldVerifyButton } from "~~/components/fairstake/WorldVerifyButton";
import { FsCard, FsEyebrow, FsPartners } from "~~/components/fairstake/ui/Design";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useInvestorCredential } from "~~/hooks/useInvestorCredential";

export default function DemoPage() {
  const { targetNetwork } = useTargetNetwork();
  const { isVerified } = useInvestorCredential();
  const chainId = targetNetwork.id === hardhat.id ? hardhat.id : targetNetwork.id;

  const activeStep = !isVerified ? 1 : 2;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      <header className="fs-page-header">
        <Link href="/" className="link text-xs w-fit">
          ← Home
        </Link>
        <FsEyebrow>Finalist demo</FsEyebrow>
        <h1 className="fs-page-title">Judge Demo</h1>
        <p className="fs-page-lead">Three-minute script — lead with The Sybil Test, then run the live flow below.</p>
        <FsPartners />
      </header>

      <JudgeDemoSteps activeStep={activeStep} />

      <SybilTestPanel />

      <section className="space-y-4">
        <div className="space-y-2">
          <FsEyebrow>Live flow</FsEyebrow>
          <p className="text-sm text-base-content/65 m-0">
            Network: <span className="font-medium text-base-content">{targetNetwork.name}</span>
          </p>
          <div className="fs-divider-gold" />
        </div>

        <FsCard active className="space-y-5">
          <div className="space-y-1">
            <p className="text-sm font-medium m-0">Step 1 — Verify human</p>
            <WorldVerifyButton chainId={chainId} onVerified={() => {}} />
          </div>

          <div className="border-t border-base-300 pt-5 space-y-3">
            <p className="text-sm font-medium m-0">Passport</p>
            <PassportCard />
          </div>

          <div className="border-t border-base-300 pt-5 space-y-3">
            <p className="text-sm font-medium m-0">Step 2 — Commit USDC</p>
            <CommitPanel />
          </div>
        </FsCard>
      </section>
    </div>
  );
}
