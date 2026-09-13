"use client";

import { useState } from "react";
import { RoundSelector } from "./RoundSelector";
import { RoundStats } from "./RoundStats";
import toast from "react-hot-toast";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useInvestorCredential } from "~~/hooks/useInvestorCredential";

export const CommitPanel = () => {
  const { address, isConnected } = useAccount();
  const { isVerified, maxCommit, refetch } = useInvestorCredential();
  const [amount, setAmount] = useState("10");
  const [roundId, setRoundId] = useState(1n);
  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "FairStakePool" });

  const handleCommit = async () => {
    if (!address) return;
    try {
      const value = parseEther(amount);
      await writeContractAsync({
        functionName: "commit",
        args: [roundId, value],
        value,
      });
      toast.success(`Committed to Round ${roundId}!`);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Commit failed");
    }
  };

  if (!isConnected) {
    return <p className="text-sm opacity-60">Connect wallet to commit.</p>;
  }

  if (!isVerified) {
    return (
      <div className="space-y-2 mt-2">
        <p className="text-sm text-error font-medium">Sybil blocked — verify first or on-chain reverts.</p>
        <button className="btn btn-outline btn-sm" disabled>
          Commit USDC (fail-closed)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-2">
      <RoundSelector selectedRound={roundId} onSelect={setRoundId} />
      <RoundStats roundId={roundId} />
      <div className="flex flex-wrap gap-2 items-end">
        <label className="form-control w-full max-w-xs">
          <span className="label-text text-xs">Amount (USDC)</span>
          <input
            type="number"
            min="0"
            step="1"
            className="input input-bordered input-sm"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </label>
        <button className="btn btn-primary btn-sm" disabled={isMining} onClick={handleCommit}>
          {isMining ? <span className="loading loading-spinner loading-xs" /> : `Commit to Round ${roundId}`}
        </button>
      </div>
      {maxCommit && (
        <p className="text-xs opacity-60">Passport cap: {formatEther(maxCommit)} USDC · reusable across rounds</p>
      )}
    </div>
  );
};
