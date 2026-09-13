"use client";

import { useInvestorCredential } from "~~/hooks/useInvestorCredential";

const STEPS = [
  { id: "world", num: "01", label: "World", sub: "Selfie check" },
  { id: "ens", num: "02", label: "ENS", sub: "Passport mint" },
  { id: "arc", num: "03", label: "Arc", sub: "USDC commit" },
] as const;

type Props = {
  hasCommitted?: boolean;
};

export const ProofJourney = ({ hasCommitted = false }: Props) => {
  const { isVerified } = useInvestorCredential();
  const progress = hasCommitted ? 3 : isVerified ? 2 : 0;

  return (
    <div className="fs-card px-4 py-5 max-w-lg mx-auto">
      <p className="fs-eyebrow text-center m-0 mb-4">Proof journey</p>
      <div className="flex items-start justify-between gap-2">
        {STEPS.map((step, i) => {
          const stepNum = i + 1;
          const done = progress >= stepNum;
          const active = progress === i;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1 relative">
              {i < STEPS.length - 1 && (
                <div
                  className={`absolute top-4 left-[calc(50%+1rem)] right-[calc(-50%+1rem)] h-px ${
                    progress > stepNum ? "bg-success" : "bg-base-300"
                  }`}
                />
              )}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold border transition-colors ${
                  done
                    ? "bg-success text-success-content border-success"
                    : active
                      ? "bg-primary text-primary-content border-primary"
                      : "bg-base-200 text-base-content/40 border-base-300"
                }`}
              >
                {step.num}
              </div>
              <p
                className={`text-xs font-medium mt-2 m-0 ${done || active ? "text-base-content" : "text-base-content/40"}`}
              >
                {step.label}
              </p>
              <p className="text-[10px] text-base-content/50 m-0 mt-0.5">{step.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
