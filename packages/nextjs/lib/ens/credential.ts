import type { InvestorCredentialMetadata } from "./types";

/**
 * ENSv2-compatible text record builders for investor passports.
 * On-chain anchor: InvestorPassportRegistry (Sepolia / Hardhat).
 * @see https://docs.ens.domains/ensv2/enhanced-access-control
 */
export function buildCredentialRecords(metadata: InvestorCredentialMetadata): Record<string, string> {
  return {
    "fairstake.humanVerified": metadata.humanVerified ? "true" : "false",
    "fairstake.maxCommitUsd": String(metadata.maxCommitUsd),
    "fairstake.roundId": metadata.roundId,
    "fairstake.expiresAt": String(metadata.expiresAt),
    description: `FairStake investor credential for ${metadata.ensName}`,
  };
}

export function parseMaxCommitFromRecords(records: Record<string, string>): number | null {
  const raw = records["fairstake.maxCommitUsd"];
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}
