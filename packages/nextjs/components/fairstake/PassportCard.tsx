"use client";

import { formatEther } from "viem";
import { useInvestorCredential } from "~~/hooks/useInvestorCredential";

export const PassportCard = () => {
  const { isVerified, ensName, maxCommit, expiresAt, passport, isLoading } = useInvestorCredential();

  if (isLoading) return <span className="loading loading-spinner loading-sm text-accent" />;

  if (!isVerified) {
    return (
      <p className="text-sm text-base-content/55 m-0 py-2">
        Complete human verification to mint your investor passport.
      </p>
    );
  }

  return (
    <div className="mt-2 rounded-md border border-accent/25 bg-base-100 p-4 animate-fairstake-passport-reveal">
      <div className="flex items-center justify-between gap-2 border-b border-base-300 pb-3 mb-3">
        <div>
          <p className="fs-eyebrow m-0">Investor passport</p>
          {ensName && <p className="font-mono text-sm font-medium m-0 mt-1">{ensName}</p>}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-success">Verified</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="fs-eyebrow m-0 mb-0.5">Max commit</p>
          <p className="font-medium m-0">{maxCommit ? `${formatEther(maxCommit)} USDC` : "—"}</p>
        </div>
        <div>
          <p className="fs-eyebrow m-0 mb-0.5">Expires</p>
          <p className="font-medium m-0">{expiresAt ? new Date(Number(expiresAt) * 1000).toLocaleDateString() : "—"}</p>
        </div>
      </div>
      {passport?.explorer && (
        <a href={passport.explorer} target="_blank" rel="noreferrer" className="link text-xs mt-3 inline-block">
          View on Sepolia
        </a>
      )}
    </div>
  );
};
