"use client";

import { FsSection } from "./ui/Design";

const TREADMILL_DOCS = ["Passport.pdf", "Utility bill", "Selfie #3", "Form 7B", "Re-verify", "Wait 48h"];

export const KycTreadmill = () => (
  <FsSection title="The problem" subtitle="KYC repeats every launch. Sybils still slip through.">
    <div className="fs-card overflow-hidden grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-base-300">
      <div className="p-5 md:p-6">
        <p className="fs-eyebrow text-error m-0 mb-2">Legacy path</p>
        <h3 className="text-base font-semibold m-0 mb-2">The KYC treadmill</h3>
        <p className="text-sm text-base-content/65 m-0 mb-4">
          Every pool. Same documents. Same wait. Farms still get in.
        </p>
        <div className="relative h-12 overflow-hidden rounded-md bg-base-200 border border-base-300">
          <div className="flex gap-2 absolute animate-fairstake-treadmill whitespace-nowrap py-3 px-2">
            {[...TREADMILL_DOCS, ...TREADMILL_DOCS].map((doc, i) => (
              <span
                key={`${doc}-${i}`}
                className="text-[10px] font-medium px-2 py-0.5 rounded border border-error/30 text-error/80 bg-base-100 shrink-0"
              >
                {doc}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs text-base-content/50 mt-3 m-0">50+ sybil wallets per fair launch</p>
      </div>

      <div className="p-5 md:p-6 bg-secondary/50">
        <p className="fs-eyebrow text-success m-0 mb-2">FairStake path</p>
        <h3 className="text-base font-semibold m-0 mb-2">Investor passport</h3>
        <p className="text-sm text-base-content/65 m-0 mb-4">Verify once. Reuse everywhere. Bots fail closed.</p>
        <div className="rounded-md border border-accent/30 bg-base-100 p-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="fs-eyebrow m-0">FairStake credential</p>
              <p className="font-mono text-sm font-medium mt-1 m-0">you.fairstake.eth</p>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-success border border-success/30 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-base-content/60 m-0">
            <div>
              <dt className="inline opacity-60">humanVerified</dt>
              <dd className="inline m-0"> true</dd>
            </div>
            <div>
              <dt className="inline opacity-60">nullifier</dt>
              <dd className="inline m-0"> locked</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </FsSection>
);
