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
      <div className="stats stats-vertical sm:stats-horizontal shadow bg-base-200 w-full">
        <div className="stat py-3">
          <div className="stat-title text-xs">Round #{roundId.toString()}</div>
          <div className="stat-value text-lg">{labels[Number(roundId)] ?? "Open"}</div>
          <div className="stat-desc">
            {active ? "Open" : "Closed"} · ends {new Date(Number(endTime) * 1000).toLocaleDateString()}
          </div>
        </div>
        <div className="stat py-3">
          <div className="stat-title text-xs">Pool</div>
          <div className="stat-value text-lg text-sm md:text-lg">
            {formatEther(totalCommitted)} / {formatEther(totalCap)}
          </div>
        </div>
        <div className="stat py-3">
          <div className="stat-title text-xs">You</div>
          <div className="stat-value text-lg">{formatEther(myCommit ?? 0n)}</div>
          <div className="stat-desc">max {formatEther(maxPerInvestor)}</div>
        </div>
      </div>
    </div>
  );
};
