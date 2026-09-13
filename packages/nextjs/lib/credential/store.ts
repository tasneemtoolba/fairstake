import type { EnsCredentialRecord } from "./types";

const credentials = new Map<string, EnsCredentialRecord>();

export function saveEnsCredential(record: EnsCredentialRecord): EnsCredentialRecord {
  credentials.set(record.walletAddress.toLowerCase(), record);
  return record;
}

export function getEnsCredential(walletAddress: string): EnsCredentialRecord | null {
  return credentials.get(walletAddress.toLowerCase()) ?? null;
}
