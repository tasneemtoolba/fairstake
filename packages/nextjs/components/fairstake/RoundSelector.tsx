"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

type Props = {
  selectedRound: bigint;
  onSelect: (roundId: bigint) => void;
};

export const RoundSelector = ({ selectedRound, onSelect }: Props) => {
  const { data: roundCount } = useScaffoldReadContract({
    contractName: "FairStakePool",
    functionName: "roundCount",
  });

  if (!roundCount || roundCount === 0n) return null;

  const rounds = Array.from({ length: Number(roundCount) }, (_, i) => BigInt(i + 1));

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs opacity-60">Fair launch round:</span>
      {rounds.map(id => (
        <button
          key={id.toString()}
          type="button"
          className={`btn btn-xs ${selectedRound === id ? "btn-primary" : "btn-ghost"}`}
          onClick={() => onSelect(id)}
        >
          Round {id.toString()}
          {id === 2n && <span className="ml-1 opacity-70">· reuse passport</span>}
        </button>
      ))}
    </div>
  );
};
