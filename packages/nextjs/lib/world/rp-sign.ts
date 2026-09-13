import { getServerWorldConfig } from "./config";
import { signRequest } from "@worldcoin/idkit-server";

export function createRpContext() {
  const config = getServerWorldConfig();
  if (!config) {
    throw new Error("World RP credentials missing. Set WORLD_RP_ID and WORLD_RP_SIGNING_KEY.");
  }

  const signed = signRequest({
    signingKeyHex: config.signingKey,
    action: config.action,
    ttl: 300,
  });

  return {
    rp_id: config.rpId,
    nonce: signed.nonce,
    created_at: signed.createdAt,
    expires_at: signed.expiresAt,
    signature: signed.sig,
  };
}
