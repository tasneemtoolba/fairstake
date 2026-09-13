"use client";

import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

type Props = {
  roundId: bigint;
};

export const RoundStats = ({ roundId }: Props) => {
  const { address } = useAccount();

  const { data: roundCount } = useScaffoldReadContract({
    contractName: "FairStakePool",
    functionName: "roundCount",
  });

  const { data: round } = useScaffoldReadContract({
    contractName: "FairStakePool",
    functionName: "rounds",
    args: [roundId],
    query: { enabled: !!roundCount && roundCount >= roundId },
  });

  const { data: myCommit } = useScaffoldReadContract({
    contractName: "FairStakePool",
    functionName: "committed",
    args: [roundId, address],
    query: { enabled: !!address && !!roundCount && roundCount >= roundId },
  });

  if (!roundCount || roundCount < roundId) {
    return (
      <p className="text-sm text-warning">
        Round {roundId.toString()} not found. Run <code className="text-xs">yarn demo:setup</code>.
      </p>
    );
  }

  const roundTuple = round as [bigint, bigint, bigint, bigint, boolean, `0x${string}`] | undefined;
  if (!roundTuple) return <span className="loading loading-spinner loading-sm" />;

  const [maxPerInvestor, totalCap, totalCommitted, endTime, active] = roundTuple;
  const labels = ["", "Alpha", "Beta"];
  const fillPct = totalCap > 0n ? Math.min(100, Number((totalCommitted * 100n) / totalCap)) : 0;

  return (
    <div className="space-y-2 w-full">
      <div className="relative h-2 rounded-full bg-base-300 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-success transition-all duration-700 rounded-full"
          style={{ width: `${fillPct}%` }}
        />
        <div className="absolute inset-0 flex justify-end items-center pr-1 text-[8px] opacity-50">
          {fillPct}% filled
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 w-full">
        <div className="fs-card px-4 py-3">
          <p className="fs-eyebrow m-0 mb-1">Round #{roundId.toString()}</p>
          <p className="text-lg font-semibold m-0">{labels[Number(roundId)] ?? "Open"}</p>
          <p className="text-xs text-base-content/65 m-0 mt-1">
            {active ? "Open" : "Closed"} · ends {new Date(Number(endTime) * 1000).toLocaleDateString()}
          </p>
        </div>
        <div className="fs-card px-4 py-3">
          <p className="fs-eyebrow m-0 mb-1">Pool</p>
          <p className="text-lg font-semibold m-0 tabular-nums">
            {formatEther(totalCommitted)} / {formatEther(totalCap)}
          </p>
          <p className="text-xs text-base-content/65 m-0 mt-1">USDC committed</p>
        </div>
        <div className="fs-card px-4 py-3">
          <p className="fs-eyebrow m-0 mb-1">You</p>
          <p className="text-lg font-semibold m-0 tabular-nums">{formatEther(myCommit ?? 0n)}</p>
          <p className="text-xs text-base-content/65 m-0 mt-1">max {formatEther(maxPerInvestor)} USDC</p>
        </div>
      </div>
    </div>
  );
};
