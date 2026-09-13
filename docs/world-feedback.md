# World integration feedback — FairStake

## What we built

FairStake uses **World Selfie Check** (via IDKit v4 + legacy selfie preset) to gate investor access to USDC fair-launch pools. Each verified human receives a nullifier-linked passport before any on-chain commit.

## Integration path

1. RP context signed server-side (`@worldcoin/idkit-server`)
2. User scans QR / opens World App
3. Full IDKit result forwarded to `POST /api/v4/verify/{rp_id}`
4. Verifier calls `FairStakePool.setCredential` with nullifier

## What worked well

- Selfie Check is the right assurance level for fair-launch eligibility — lighter than document KYC
- Clear separation: World = humanity, ENS = passport metadata, Arc = money
- Nullifier → on-chain credential mapping prevents double registration

## Friction / suggestions

- IDKit v4 requires RP signing setup in Developer Portal — document clearly for first-time integrators
- Selfie Check still uses legacy preset with `allow_legacy_proofs: true`; native v4 selfie flow would simplify
- Staging vs production environment toggle should be more prominent in portal UI

## Demo

- Local: dev verify path for Hardhat iteration
- Production: World Selfie Check with QR on `/`

## Links

- App: (deploy URL)
- Feedback contact: developers@toolsforhumanity.com (Selfie Check beta)
