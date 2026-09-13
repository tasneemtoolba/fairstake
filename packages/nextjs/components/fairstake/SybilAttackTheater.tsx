"use client";

import { useCallback, useState } from "react";
import { FsSection, FsStat } from "./ui/Design";

const BOT_COUNT = 50;

type BotState = "idle" | "marching" | "blocked";

export const SybilAttackTheater = () => {
  const [state, setState] = useState<BotState>("idle");
  const [wave, setWave] = useState(0);

  const launchAttack = useCallback(() => {
    setState("marching");
    setWave(w => w + 1);
    window.setTimeout(() => setState("blocked"), 2200);
  }, []);

  const isActive = state !== "idle";

  return (
    <FsSection title="Sybil test" subtitle="Fifty wallets attack one pool. Zero are admitted.">
      <div className="fs-card p-5 md:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-base-content/70 m-0 max-w-md">
            Simulates on-chain fail-closed behavior — unverified commits revert.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={state === "marching"}
            onClick={launchAttack}
          >
            {state === "marching" ? <span className="loading loading-spinner loading-xs" /> : "Launch 50 sybils"}
          </button>
        </div>

        <div className="relative h-24 rounded-md bg-base-200 border border-base-300 overflow-hidden">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10">
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-bold uppercase tracking-wide bg-base-100 ${
                state === "blocked" ? "border-success text-success" : "border-base-300 text-base-content/40"
              }`}
            >
              Pool
            </div>
          </div>

          {isActive &&
            Array.from({ length: BOT_COUNT }).map((_, i) => (
              <span
                key={`${wave}-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-error/70"
                style={{
                  left: `${6 + (i % 12) * 0.4}%`,
                  top: `${22 + (i % 6) * 10}%`,
                  animation: `fairstake-bot-march 1.8s ease-out ${i * 0.04}s forwards`,
                }}
              />
            ))}

          {!isActive && (
            <p className="absolute inset-0 flex items-center justify-center text-xs text-base-content/40 m-0">
              Run simulation
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <FsStat label="Launched" value={isActive ? String(BOT_COUNT) : "0"} />
          <FsStat label="Admitted" value="0" tone="ok" />
          <FsStat
            label="Result"
            value={state === "blocked" ? "REVERTED" : state === "marching" ? "…" : "—"}
            tone={state === "blocked" ? "bad" : "default"}
          />
        </div>
      </div>
    </FsSection>
  );
};
