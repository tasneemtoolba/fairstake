"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export type PassportData = {
  ensName: string;
  maxCommitUsd: number;
  expiresAt: number;
  humanVerified: boolean;
  registryAddress?: string;
  chainId?: number;
  explorer?: string;
};

export function useInvestorCredential() {
  const { address } = useAccount();

  const onChain = useScaffoldReadContract({
    contractName: "FairStakePool",
    functionName: "credentials",
    args: [address],
    query: { enabled: !!address },
  });

  const passportQuery = useQuery({
    queryKey: ["passport", address],
    queryFn: async (): Promise<PassportData | null> => {
      const res = await fetch(`/api/ens/sepolia?address=${address}`);
      if (res.ok) {
        const json = (await res.json()) as { passport?: PassportData };
        if (json.passport) return json.passport;
      }
      const fallback = await fetch(`/api/ens/credential?address=${address}`);
      if (!fallback.ok) return null;
      const fb = (await fallback.json()) as {
        credential?: { ensName: string; maxCommitUsd: number; expiresAt: number };
      };
      const c = fb.credential;
      if (!c) return null;
      return { ...c, humanVerified: true };
    },
    enabled: !!address,
  });

  const cred = onChain.data as [boolean, bigint, bigint, `0x${string}`] | undefined;

  return {
    isVerified: cred?.[0] ?? false,
    maxCommit: cred?.[1],
    expiresAt: cred?.[2],
    nullifierHash: cred?.[3],
    ensName: passportQuery.data?.ensName,
    passport: passportQuery.data,
    isLoading: onChain.isLoading || passportQuery.isLoading,
    refetch: () => {
      void onChain.refetch();
      void passportQuery.refetch();
    },
  };
}
