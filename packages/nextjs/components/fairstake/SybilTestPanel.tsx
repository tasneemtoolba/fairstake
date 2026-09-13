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
      <ol className="fs-card divide-y divide-base-300 m-0 p-0 list-none">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-4 p-4 items-start">
            <span
              className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                step.ok ? "bg-success/15 text-success" : "bg-error/10 text-error"
              }`}
            >
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium m-0">{step.title}</p>
              <p className="text-xs text-base-content/60 m-0 mt-0.5">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="text-xs text-base-content/55 m-0">
        {isVerified
          ? "Step 1 complete — switch wallets for step 2, then Round 2 for step 3."
          : "Start with human verification above."}
      </p>
    </FsSection>
  );
};
