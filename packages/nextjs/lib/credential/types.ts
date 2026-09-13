export type OnChainCredential = {
  verified: boolean;
  maxCommit: bigint;
  expiresAt: bigint;
  nullifierHash: `0x${string}`;
};

export type EnsCredentialRecord = {
  ensName: string;
  maxCommitUsd: number;
  roundId: string;
  humanVerified: boolean;
  expiresAt: number;
  walletAddress: `0x${string}`;
};
