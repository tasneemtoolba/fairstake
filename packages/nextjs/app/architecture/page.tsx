import Link from "next/link";
import type { NextPage } from "next";

const Architecture: NextPage = () => (
  <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
    <div>
      <Link href="/" className="link link-hover text-sm">
        ← Back to FairStake
      </Link>
      <h1 className="text-3xl font-bold mt-4">Architecture</h1>
      <p className="opacity-70 mt-2">Eligibility (World + ENS passport) is separated from execution (Arc USDC pool).</p>
    </div>

    <pre className="bg-base-200 p-4 rounded-lg text-xs overflow-x-auto leading-relaxed">
      {`
┌──────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│  World ID    │────▶│ Investor Passport   │────▶│  FairStakePool  │
│ Selfie Check │     │ Registry (Sepolia)  │     │  (Arc Testnet)  │
└──────────────┘     └─────────────────────┘     └─────────────────┘
   humanity               credential                  USDC commit
   nullifier              ENS-shaped records          fail-closed
`.trim()}
    </pre>

    <div className="space-y-4 text-sm">
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="font-bold">World — humanity layer</h2>
          <p className="opacity-80">
            Selfie Check proves a unique live person. Nullifier hash is written on-chain so one face = one investor
            slot.
          </p>
        </div>
      </div>
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="font-bold">ENS — passport layer</h2>
          <p className="opacity-80">
            Investor passport uses ENSv2-compatible text records (maxCommitUsd, expiry, round scope). Minted on Sepolia
            registry; portable across Round 1 and Round 2.
          </p>
        </div>
      </div>
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="font-bold">Arc — capital layer</h2>
          <p className="opacity-80">
            USDC-native fair-launch pools with per-investor caps. Contract enforces passport limits; sybils revert.
          </p>
        </div>
      </div>
    </div>

    <div className="alert alert-info text-sm">
      <span>
        <strong>The Sybil Test:</strong> verified wallet commits → sybil wallet reverts → same passport works on Round 2
        without re-KYC.
      </span>
    </div>
  </div>
);

export default Architecture;
