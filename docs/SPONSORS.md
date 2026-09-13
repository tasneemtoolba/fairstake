# Sponsor alignment — ETHGlobal Online

**Tagged sponsors (max 3):** World · ENS · Arc

## World ($7,000)

**Integration:** Selfie Check for sybil-resistant human verification before pool access.

**Demo path:**
1. User runs Selfie Check in app
2. Backend validates proof
3. On-chain credential written to FairStakePool

**Deliverable:** `docs/world-feedback.md` with integration notes.

## ENS ($5,000)

**Integration:** ENSv2 investor credential subnames with Enhanced Access Control text records.

**Demo path:**
1. Verified user mints `*.investor.fairstake.eth`
2. Records encode max commit USD and round scope
3. Frontend reads credential before enabling commit UI

## Arc ($10,000)

**Integration:** USDC-native fair-launch commit pool on Arc Testnet.

**Demo path:**
1. Deploy `FairStakePool` to Arc Testnet
2. Create round with per-investor cap
3. Verified users commit USDC; unverified users fail closed

**Deliverable:** Architecture diagram in `docs/ARCHITECTURE.md`.

## Prize estimate

| Sponsor | Realistic range |
|---------|-----------------|
| Arc 1st | $3,500 |
| World | $1,000–2,000 |
| ENS | $500–1,500 |
| **Total** | **~$1,500–4,000** |
