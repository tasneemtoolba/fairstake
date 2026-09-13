# Your action checklist — FairStake Finalist push

Everything the **agent cannot do** without you. Same wallet for all chains.

---

## Wallet to fund (one address, three roles)

```
0xc943bF2b3Ee4f94b66208A80EE3D168eCF0Fc7de
```

Private key is in **gitignored** files:
- `packages/hardhat/.env` → `DEPLOYER_PRIVATE_KEY`
- `packages/nextjs/.env.local` → `VERIFIER_PRIVATE_KEY`

Import this wallet into **MetaMask** for the live demo (optional but recommended).

---

## Step 1 — Fund Arc Testnet (required for Arc bounty)

| | |
|--|--|
| **Chain** | Arc Testnet |
| **Chain ID** | `5042002` |
| **RPC** | `https://rpc.testnet.arc.io` |
| **Token** | USDC (native gas token) |
| **Amount** | ≥ 10 USDC (20 from faucet is enough) |
| **Faucet** | [faucet.circle.com](https://faucet.circle.com) → select **Arc Testnet** |

Verify:
```bash
yarn check:arc
```

Deploy:
```bash
yarn deploy:arc
yarn deploy:arc:setup
```

---

## Step 2 — Fund Sepolia (required for ENS/passport bounty)

| | |
|--|--|
| **Chain** | Ethereum Sepolia |
| **Chain ID** | `11155111` |
| **Token** | Sepolia ETH |
| **Amount** | ≥ 0.05 ETH |
| **Faucets** | [sepoliafaucet.com](https://sepoliafaucet.com) · [faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia) |

Verify:
```bash
yarn check:sepolia
```

Deploy passport registry:
```bash
yarn deploy:sepolia
```

---

## Step 3 — World Developer Portal (required for World bounty)

1. [developer.world.org](https://developer.world.org) → create app
2. Enable **World ID 4.0** (RP registration)
3. Email **developers@toolsforhumanity.com** for **Selfie Check (Beta)** if not enabled
4. Copy into `packages/nextjs/.env.local`:

```bash
NEXT_PUBLIC_WORLD_APP_ID=app_xxxxx
NEXT_PUBLIC_WORLD_ACTION_ID=fairstake-verify
WORLD_APP_ID=app_xxxxx
WORLD_ACTION_ID=fairstake-verify
WORLD_RP_ID=rp_xxxxx
WORLD_RP_SIGNING_KEY=0x...secret...
WORLD_ENVIRONMENT=staging
DEV_SKIP_WORLD_VERIFY=false
NEXT_PUBLIC_DEV_MODE=false
```

---

## Step 4 — Deploy frontend (required for submission)

```bash
cd packages/nextjs
yarn vercel
```

Set the same env vars in Vercel dashboard. Copy the live URL into `docs/SUBMISSION.md`.

---

## Step 5 — Record demo video (~3 min)

Follow **`docs/VIDEO_SCRIPT.md`** — lead with **The Sybil Test**:
1. Verify → passport
2. Commit Round 1
3. New wallet → **reverts**
4. Round 2 → **no second selfie**

---

## Step 6 — ETHGlobal submit

- **Title:** FairStake — Investor Passports for Fair Launches
- **Tags:** World · ENS · Arc (max 3)
- **Links:** live URL, GitHub, ArcScan, Sepolia Etherscan
- **Copy:** paste from `docs/SUBMISSION.md`

---

## Quick reference

| Chain | Why | Fund with |
|-------|-----|-----------|
| **Arc Testnet** | USDC commit pool | USDC |
| **Sepolia** | Investor passport registry | ETH |
| **Hardhat** | Local dev only | auto (free) |

Reply **"funded"** in chat after Steps 1–2 and the agent will run testnet deploys.
