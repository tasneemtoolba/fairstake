"use client";

import { FsSection } from "./ui/Design";
import { useInvestorCredential } from "~~/hooks/useInvestorCredential";

const STEPS = [
  { title: "Verified investor", body: "Selfie → passport → commit on Round 1.", ok: true },
  { title: "Sybil wallet", body: "Fresh wallet without verify → commit reverts.", ok: false },
  { title: "Passport reuse", body: "Same wallet → Round 2 without a second selfie.", ok: true },
  { title: "Nullifier lock", body: "Second human cannot reuse the same World identity.", ok: false },
];

export const SybilTestPanel = () => {
  const { isVerified } = useInvestorCredential();

  return (
    <FsSection title="Judge checklist" subtitle="What finalists demonstrate in the demo video.">
      <div className="fs-card overflow-hidden">
        <ol className="m-0 p-0 list-none">
          {STEPS.map((step, i) => (
            <li key={step.title} className="fs-checklist-row">
              <span
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  step.ok
                    ? "bg-success/12 text-success border border-success/25"
                    : "bg-error/10 text-error border border-error/20"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold m-0">{step.title}</p>
                <p className="text-sm text-base-content/60 m-0 mt-1 leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p
        className={`text-sm m-0 px-1 ${isVerified ? "text-success font-medium" : "text-base-content/55"}`}
      >
        {isVerified
          ? "Step 1 complete — switch to a fresh wallet for the sybil test, then try Round 2."
          : "Start with human verification in the live flow below."}
      </p>
    </FsSection>
  );
};
