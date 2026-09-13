"use client";

import { useCallback, useState } from "react";
import { IDKit, type IDKitResult, selfieCheckLegacy } from "@worldcoin/idkit";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { isClientWorldConfigured } from "~~/lib/world/config";

type Props = {
  onVerified: (nullifierHash: string) => void;
  chainId?: number;
};

type RpContextResponse = {
  ok: boolean;
  app_id: `app_${string}`;
  action: string;
  environment: "production" | "staging" | "sandbox";
  allow_legacy_proofs: boolean;
  rp_context: {
    rp_id: string;
    nonce: string;
    created_at: number;
    expires_at: number;
    signature: string;
  };
  error?: string;
};

export const WorldVerifyButton = ({ onVerified, chainId = hardhat.id }: Props) => {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [qrUri, setQrUri] = useState<string | null>(null);

  const issueCredential = useCallback(
    async (nullifierHash: string) => {
      const issueRes = await fetch("/api/credential/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          nullifierHash,
          chainId,
        }),
      });
      const issueJson = (await issueRes.json()) as { ok?: boolean; error?: string; ensName?: string };
      if (!issueRes.ok || !issueJson.ok) {
        throw new Error(issueJson.error ?? "Credential issuance failed");
      }
      setDone(true);
      setQrUri(null);
      onVerified(nullifierHash);
      toast.success(`Verified! Credential: ${issueJson.ensName ?? "issued"}`);
    },
    [address, chainId, onVerified],
  );

  const verifyAndIssue = useCallback(
    async (idkitResult: IDKitResult) => {
      const verifyRes = await fetch("/api/world/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(idkitResult),
      });
      const verifyJson = (await verifyRes.json()) as {
        ok?: boolean;
        error?: string;
        result?: { nullifierHash: string };
      };
      if (!verifyRes.ok || !verifyJson.ok) {
        throw new Error(verifyJson.error ?? "World verification failed");
      }
      await issueCredential(verifyJson.result?.nullifierHash ?? "");
    },
    [issueCredential],
  );

  const runDevVerification = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const nullifier_hash = `dev-${address}-${Date.now()}`;
      const verifyRes = await fetch("/api/world/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proof: "dev",
          merkle_root: "dev",
          nullifier_hash,
          verification_level: "selfie",
          wallet_address: address,
          chain_id: chainId,
        }),
      });
      const verifyJson = (await verifyRes.json()) as {
        ok?: boolean;
        error?: string;
        result?: { nullifierHash: string };
      };
      if (!verifyRes.ok || !verifyJson.ok) {
        throw new Error(verifyJson.error ?? "Verification failed");
      }
      await issueCredential(verifyJson.result?.nullifierHash ?? nullifier_hash);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const runWorldSelfieCheck = async () => {
    if (!address) return;
    setLoading(true);
    setQrUri(null);
    try {
      const configRes = await fetch("/api/world/rp-context");
      const config = (await configRes.json()) as RpContextResponse;
      if (!configRes.ok || !config.ok) {
        throw new Error(config.error ?? "Failed to load World RP context");
      }

      const request = await IDKit.request({
        app_id: config.app_id,
        action: config.action,
        rp_context: config.rp_context,
        allow_legacy_proofs: config.allow_legacy_proofs,
        environment: config.environment,
      }).preset(selfieCheckLegacy({ signal: address }));

      setQrUri(request.connectorURI);
      toast.success("Scan QR with World App");

      const completion = await request.pollUntilCompletion({ timeout: 120_000 });

      if (!completion.success) {
        throw new Error(completion.error ?? "World verification cancelled");
      }

      await verifyAndIssue(completion.result);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "World verification failed");
      setQrUri(null);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <span className="text-xs font-medium text-success border border-success/25 bg-success/5 px-2.5 py-1 rounded-full">
        Human verified
      </span>
    );
  }

  if (!isConnected) {
    return <p className="text-sm text-base-content/55 m-0">Connect wallet to continue.</p>;
  }

  const worldConfigured = isClientWorldConfigured();
  const devMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";

  return (
    <div className="space-y-3 mt-2">
      {worldConfigured ? (
        <button className="btn btn-primary btn-sm w-fit" disabled={loading} onClick={runWorldSelfieCheck}>
          {loading ? <span className="loading loading-spinner loading-xs" /> : "World Selfie Check"}
        </button>
      ) : (
        <button className="btn btn-primary btn-sm w-fit" disabled={loading} onClick={runDevVerification}>
          {loading ? <span className="loading loading-spinner loading-xs" /> : "Verify human (dev mode)"}
        </button>
      )}

      {devMode && worldConfigured && (
        <button className="btn btn-ghost btn-xs" disabled={loading} onClick={runDevVerification}>
          Skip — dev verify
        </button>
      )}

      {qrUri && (
        <div className="p-3 bg-base-200 rounded-lg space-y-2 max-w-xs">
          <p className="text-xs font-medium">Scan with World App</p>
          <div className="flex justify-center bg-white p-2 rounded w-fit mx-auto">
            <QRCodeSVG value={qrUri} size={160} />
          </div>
          <a href={qrUri} target="_blank" rel="noreferrer" className="link link-xs block text-center">
            Open in World App
          </a>
        </div>
      )}

      {!worldConfigured && (
        <p className="text-xs opacity-50 max-w-md">
          Local dev mode. Configure World credentials in <code>.env.local</code> for real Selfie Check — see{" "}
          <code>docs/WORLD_SETUP.md</code>.
        </p>
      )}
    </div>
  );
};
