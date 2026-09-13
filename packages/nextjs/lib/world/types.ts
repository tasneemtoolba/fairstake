export type WorldVerificationResult = {
  verified: boolean;
  nullifierHash: string;
  verificationLevel: "selfie" | "orb" | "device";
  verifiedAt: string;
};

export type WorldVerifyRequest = {
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  verification_level: string;
  signal_hash?: string;
  wallet_address?: string;
  chain_id?: number;
};
