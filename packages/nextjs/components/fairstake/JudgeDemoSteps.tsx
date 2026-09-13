"use client";

import { FsCard, FsEyebrow } from "./ui/Design";

export type JudgeDemoStep = {
  n: number;
  title: string;
  detail: string;
  tone?: "neutral" | "success" | "danger";
};

export const JUDGE_DEMO_STEPS: JudgeDemoStep[] = [
  { n: 1, title: "Verify human", detail: "World Selfie Check → passport mints", tone: "neutral" },
  { n: 2, title: "Commit Round 1", detail: "10 USDC from verified wallet", tone: "success" },
  { n: 3, title: "Sybil attack", detail: "Fresh wallet → commit REVERTS", tone: "danger" },
  { n: 4, title: "Round 2 reuse", detail: "Same passport, no second selfie", tone: "success" },
];

const toneClass = {
  neutral: "fs-step-badge",
  success: "fs-step-badge fs-step-badge-success",
  danger: "fs-step-badge fs-step-badge-danger",
} as const;

export const JudgeDemoSteps = ({ activeStep }: { activeStep?: number }) => (
  <section className="space-y-4">
    <div className="space-y-2">
      <FsEyebrow>The Sybil Test</FsEyebrow>
      <p className="text-sm text-base-content/70 m-0">Four moves judges should see in your demo video.</p>
      <div className="fs-divider-gold" />
    </div>

    <ol className="grid sm:grid-cols-2 gap-4 m-0 p-0 list-none">
      {JUDGE_DEMO_STEPS.map(step => {
        const isActive = activeStep === step.n;
        return (
          <li key={step.n} className="relative">
            <FsCard active={isActive} className="h-full flex flex-col gap-3 p-5 transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <span className={toneClass[step.tone ?? "neutral"]}>{step.n}</span>
                {step.tone === "danger" && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-error/80">Fail closed</span>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold tracking-tight m-0">{step.title}</h3>
                <p className="text-sm text-base-content/60 m-0 leading-relaxed">{step.detail}</p>
              </div>
            </FsCard>
          </li>
        );
      })}
    </ol>
  </section>
);
