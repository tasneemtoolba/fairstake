import { buildCredentialRecords } from "./credential";
import type { InvestorCredentialMetadata } from "./types";
import { saveEnsCredential } from "~~/lib/credential/store";
import type { EnsCredentialRecord } from "~~/lib/credential/types";

const PARENT = process.env.NEXT_PUBLIC_ENS_PARENT_NAME ?? "fairstake.eth";

export function buildInvestorEnsName(walletAddress: string): string {
  const label = walletAddress.slice(2, 10).toLowerCase();
  return `${label}.investor.${PARENT}`;
}

/** Builds ENS-shaped credential metadata; persisted via InvestorPassportRegistry. */
export async function registerEnsCredential(params: {
  walletAddress: `0x${string}`;
  maxCommitUsd: number;
  roundId?: string;
  expiresAt: number;
}): Promise<EnsCredentialRecord> {
  const ensName = buildInvestorEnsName(params.walletAddress);
  const metadata: InvestorCredentialMetadata = {
    ensName,
    maxCommitUsd: params.maxCommitUsd,
    roundId: params.roundId ?? "1",
    humanVerified: true,
    expiresAt: params.expiresAt,
  };

  const record: EnsCredentialRecord = {
    ensName,
    maxCommitUsd: params.maxCommitUsd,
    roundId: metadata.roundId,
    humanVerified: true,
    expiresAt: params.expiresAt,
    walletAddress: params.walletAddress,
  };

  saveEnsCredential(record);

  // Expose records for demo / Sepolia mirror
  void buildCredentialRecords(metadata);

  return record;
}
