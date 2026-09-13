"use client";

import { useQuery } from "@tanstack/react-query";

type StatusResponse = {
  deployer: string;
  funding: { arc: { funded: boolean }; sepolia: { funded: boolean } };
  deployments: { arc: { pool: string | null }; sepolia: { passport: string | null } };
};

export const FundingBanner = () => {
  const { data } = useQuery({
    queryKey: ["fairstake-status"],
    queryFn: async () => {
      const res = await fetch("/api/status");
      return (await res.json()) as StatusResponse;
    },
    refetchInterval: 30_000,
  });

  if (!data) return null;

  const live = data.funding.arc.funded && data.deployments.arc.pool && data.deployments.sepolia.passport;

  if (live) {
    return (
      <div className="flex justify-center">
        <span className="text-xs font-medium text-success border border-success/25 bg-success/5 px-3 py-1.5 rounded-full">
          Testnet live — Arc pool & Sepolia passport deployed
        </span>
      </div>
    );
  }

  return (
    <div className="fs-card border-warning/30 bg-warning/5 p-4 text-sm space-y-2">
      <p className="font-medium m-0">Deployer wallet needs funding</p>
      <code className="text-xs block break-all opacity-80">{data.deployer}</code>
    </div>
  );
};
