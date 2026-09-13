# FairStake — Demo & Test Guide

## Two ways to run

| Mode | When to use |
|------|-------------|
| **Local (Hardhat)** | Fast iteration, no faucets, full flow in ~5 min |
| **Arc Testnet** | Sponsor demo, real Arc USDC commits |

---

## Local demo (recommended first)

### 1. Install & compile

```bash
cd hackathons/fairstake
yarn install
yarn compile
yarn test
```

### 2. Terminal A — start chain

```bash
yarn chain
```

Leave this running. Hardhat node on `http://127.0.0.1:8545`.

### 3. Terminal B — deploy + demo round

```bash
yarn deploy
yarn demo:setup
```

Expected output:
- `FairStakePool deployed: 0x...`
- `Demo round #1 created`

### 4. Terminal B — frontend

```bash
yarn start
```

Open **http://localhost:3000**

`.env.local` is preconfigured with:
- `DEV_SKIP_WORLD_VERIFY=true` — skip World app for local testing
- `VERIFIER_PRIVATE_KEY` — Hardhat account #0 (pool owner)

### 5. Walk through the demo

1. **Connect wallet** — use Burner wallet (auto on Hardhat) or MetaMask on Localhost 8545, chain ID **31337**
2. **Step 1 — Verify (dev mode)** — click **Verify (dev mode)**
   - Calls `/api/world/verify` → `/api/credential/issue`
   - Owner wallet writes `setCredential` on-chain
   - ENS-style credential name appears (e.g. `ac0974be.investor.fairstake.eth`)
3. **Step 2 — Credential** — confirm text records + max commit (100 USDC)
4. **Step 3 — Commit** — enter amount (e.g. `10`) → **Commit to pool**
   - Uses native ETH on Hardhat as stand-in for USDC (same 18-decimal pattern as Arc native gas token)

### 6. Fail-closed test

1. Switch to a **second wallet** (Burner → new account, or another MetaMask account)
2. **Do not verify**
3. Try to commit → transaction **reverts** with `Human not verified`

Or use Debug Contracts (`/debug`) → `commit` on FairStakePool with an unverified address.

### 7. Contract debug UI

Go to **http://localhost:3000/debug**

- Read `credentials(yourAddress)`
- Read `committed(1, yourAddress)`
- Owner can call `createRound`, `setCredential`, `closeRound`

---

## Arc Testnet demo (submission)

Full guide: [docs/ARC_DEPLOY.md](ARC_DEPLOY.md)

```bash
# 1. Set deployer key in packages/hardhat/.env
DEPLOYER_PRIVATE_KEY=0x...

# 2. Check balance (fund via Circle faucet if 0)
yarn check:arc

# 3. Deploy + create demo round
yarn deploy:arc
yarn deploy:arc:setup

# 4. Match verifier to pool owner in packages/nextjs/.env.local
VERIFIER_PRIVATE_KEY=0x...same_as_deployer...
```

## World Selfie Check (production)

Full guide: [docs/WORLD_SETUP.md](WORLD_SETUP.md)

1. Create app at [developer.world.org](https://developer.world.org)
2. Enable World ID 4.0 + request Selfie Check beta
3. Set `WORLD_RP_ID`, `WORLD_RP_SIGNING_KEY`, `NEXT_PUBLIC_WORLD_APP_ID` in `.env.local`
4. Set `DEV_SKIP_WORLD_VERIFY=false` and restart `yarn start`
5. Click **World Selfie Check** → scan QR with World App

### Frontend

1. Switch wallet network to **Arc Testnet** (5042002)
2. RPC: `https://rpc.testnet.arc.io`
3. Run verify → commit flow (World widget if configured, else dev mode)

---

## Automated tests

```bash
yarn test
```

Covers:
- Verified investor can commit
- Unverified investor reverts

---

## 3-minute judge demo script

1. **Problem** (20s): Fair launches get sybil-farmed; full KYC is overkill for small pools.
2. **Verify** (40s): Connect → World Selfie (or dev verify locally) → green badge.
3. **Credential** (40s): Show ENS investor name + `fairstake.maxCommitUsd` record.
4. **Commit** (40s): Commit 10 USDC → show tx on explorer.
5. **Fail-closed** (20s): Second wallet → commit fails on-chain.
6. **Close** (20s): World + ENS + Arc architecture recap.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `FairStakePool not deployed` | Run `yarn deploy` while chain is up |
| `No active round` | Run `yarn demo:setup` |
| Verify fails API | Ensure `yarn chain` running; check `VERIFIER_PRIVATE_KEY` is pool owner |
| Wrong network | Select **Hardhat** / **Arc Testnet** in wallet dropdown (top-right) |
| Commit reverts | Verify first; check amount ≤ 100 and round not full |

---

## Production checklist

- [ ] Deploy to Arc Testnet + verify on ArcScan
- [ ] World Developer app + real Selfie Check
- [ ] Vercel deploy with env vars
- [ ] 3-min demo video
- [ ] ETHGlobal submit — tags: **World, ENS, Arc**
