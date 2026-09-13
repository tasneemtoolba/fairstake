import { getServerWorldConfig } from "./config";
import type { WorldVerificationResult, WorldVerifyRequest } from "./types";
import type { IDKitResult } from "@worldcoin/idkit";

const WORLD_VERIFY_V4_URL = "https://developer.world.org/api/v4/verify";

/**
 * Verify a full IDKit result via World Developer Portal v4 API.
 */
export async function verifyIdKitResult(idkitResponse: IDKitResult): Promise<WorldVerificationResult> {
  const config = getServerWorldConfig();
  if (!config) {
    throw new Error("World RP credentials not configured");
  }

  const response = await fetch(`${WORLD_VERIFY_V4_URL}/${config.rpId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(idkitResponse),
  });

  const data = (await response.json()) as { success?: boolean; detail?: string; code?: string };

  if (!response.ok || !data.success) {
    throw new Error(data.detail ?? data.code ?? "World v4 verification failed");
  }

  const nullifierHash = extractNullifier(idkitResponse);
  if (!nullifierHash) {
    throw new Error("No nullifier in IDKit response");
  }

  return {
    verified: true,
    nullifierHash,
    verificationLevel: "selfie",
    verifiedAt: new Date().toISOString(),
  };
}

function extractNullifier(result: IDKitResult): string {
  const response = result.responses?.[0] as { nullifier?: string } | undefined;
  return response?.nullifier ?? "";
}

/**
 * Legacy/dev verification path (World v3 API or dev skip).
 */
export async function verifyWorldProof(payload: WorldVerifyRequest): Promise<WorldVerificationResult> {
  const config = getServerWorldConfig();

  if (process.env.DEV_SKIP_WORLD_VERIFY === "true" && payload.proof === "dev") {
    return devVerification(payload);
  }

  if (!config) {
    throw new Error("World not configured. Set WORLD_* env vars or DEV_SKIP_WORLD_VERIFY=true");
  }

  if (!payload.nullifier_hash || !payload.proof || !payload.merkle_root) {
    return {
      verified: false,
      nullifierHash: "",
      verificationLevel: "selfie",
      verifiedAt: new Date().toISOString(),
    };
  }

  // Legacy v3 verify endpoint (Selfie Check uses v3 proofs)
  const response = await fetch(`https://developer.world.org/api/v2/verify/${config.appId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nullifier_hash: payload.nullifier_hash,
      merkle_root: payload.merkle_root,
      proof: payload.proof,
      verification_level: payload.verification_level ?? "device",
      action: config.action,
      signal_hash: payload.signal_hash,
    }),
  });

  const data = (await response.json()) as { success?: boolean; detail?: string; code?: string };

  if (!response.ok || !data.success) {
    throw new Error(data.detail ?? data.code ?? "World verification failed");
  }

  return {
    verified: true,
    nullifierHash: payload.nullifier_hash,
    verificationLevel: mapVerificationLevel(payload.verification_level),
    verifiedAt: new Date().toISOString(),
  };
}

function devVerification(payload: WorldVerifyRequest): WorldVerificationResult {
  const nullifier = payload.nullifier_hash || `dev-${Date.now()}`;
  return {
    verified: true,
    nullifierHash: nullifier,
    verificationLevel: "selfie",
    verifiedAt: new Date().toISOString(),
  };
}

function mapVerificationLevel(level?: string): WorldVerificationResult["verificationLevel"] {
  if (level === "orb") return "orb";
  if (level === "device") return "device";
  return "selfie";
}
