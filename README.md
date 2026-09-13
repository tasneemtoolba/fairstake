# FairStake

**Proof of person, not proof of passport.**

Sybil-resistant fair-launch USDC pools — verify once with World, carry an ENS-shaped investor passport, commit on Arc.

**ETHGlobal Online 2026** · Sponsors: **World · ENS · Arc**

---

## Links

| | |
|---|---|
| **Live demo** | [fairstake.vercel.app](https://fairstake.vercel.app) |
| **Judge Theater** | [fairstake.vercel.app/theater](https://fairstake.vercel.app/theater) |
| **GitHub** | [github.com/tasneemtoolba/fairstake](https://github.com/tasneemtoolba/fairstake) |
| **Arc pool** | [0x53fa…3766 on ArcScan](https://testnet.arcscan.io/address/0x53faf932922b322873d68cd21d0e3581b0273766) |
| **Arc passport registry** | [0xb032…599c on ArcScan](https://testnet.arcscan.io/address/0xb032003194e0e03963c5ad9934813d8bca1e599c) |
| **Sepolia passport registry** | [0x53fa…3766 on Etherscan](https://sepolia.etherscan.io/address/0x53faf932922b322873d68cd21d0e3581b0273766) |

---

## Problem

Fair launches get **sybil-farmed**. Full document KYC is overkill for small community pools — but without human checks, bots grab allocations.

## Solution

FairStake separates **human eligibility** from **capital commitment**:

1. **World Selfie Check** — one live human, one nullifier, enforced on-chain
2. **Investor passport** — ENS-shaped credential, reusable across rounds
3. **Arc USDC pool** — fair-launch commits with hard caps; sybils fail closed

```
World (verify)  →  ENS-shaped passport  →  Arc (USDC commit)
   nullifier         portable credential      fail-closed pool
```

---

## The Sybil Test

The demo judges should remember:

| Step | Action | Result |
|------|--------|--------|
| 1 | Verified wallet → commit Round 1 | ✅ Success |
| 2 | Fresh wallet → commit | ❌ Reverts (not verified) |
| 3 | Same passport → Round 2 | ✅ No second selfie |

Try it live at [/theater](https://fairstake.vercel.app/theater).

---

## Sponsor integration

| Sponsor | Integration |
|---------|-------------|
| **World** | IDKit v4 Selfie Check → server verify → on-chain credential + nullifier lock |
| **ENS** | Investor passport with ENS-shaped naming (`*.investor.fairstake.eth`) anchored on `InvestorPassportRegistry` (Sepolia) |
| **Arc** | `FairStakePool` on Arc Testnet — native USDC commits, per-investor caps, sybil fail-closed |

Details: [docs/SPONSORS.md](docs/SPONSORS.md) · Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Tech stack

| Layer | Tools |
|-------|-------|
| Monorepo | [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) |
| Contracts | Solidity, Hardhat, OpenZeppelin |
| Frontend | Next.js, React, Tailwind, daisyUI, wagmi, RainbowKit |
| Human proof | [World IDKit v4](https://github.com/worldcoin/idkit-js) |
| Settlement | Arc Testnet (USDC-native) |
| Hosting | Vercel |

No off-chain database — passport state is anchored on-chain.

---

## Quick start (local)

```bash
git clone https://github.com/tasneemtoolba/fairstake.git
cd fairstake
yarn install
yarn chain          # Terminal 1 — local Hardhat
yarn deploy && yarn demo:setup && yarn start   # Terminal 2
```

Open [http://localhost:3000/theater](http://localhost:3000/theater)

### Tests

```bash
yarn compile
yarn test           # 5 passing — FairStakePool + InvestorPassportRegistry
```

### Arc Testnet deploy

```bash
cp .env.example .env   # set DEPLOYER_PRIVATE_KEY
# Fund wallet: https://faucet.circle.com (Arc Testnet)
yarn deploy:arc
yarn deploy:arc:setup
```

See [docs/ARC_DEPLOY.md](docs/ARC_DEPLOY.md) and [docs/WORLD_SETUP.md](docs/WORLD_SETUP.md).

---

## Project structure

```
fairstake/
├── packages/hardhat/
│   ├── contracts/FairStakePool.sol              # Human-gated USDC commit pool
│   ├── contracts/InvestorPassportRegistry.sol   # Passport anchor
│   ├── deploy/                                  # Deploy scripts
│   └── test/                                    # Contract tests
├── packages/nextjs/
│   ├── app/theater/                             # Judge Theater demo
│   ├── components/fairstake/                    # FairStake UI
│   ├── lib/world/                               # World ID verification
│   └── lib/ens/                                 # Credential helpers
└── docs/                                        # Guides & submission copy
```

---

## Environment variables

**Local:** copy `packages/nextjs/.env.example` → `packages/nextjs/.env.local`

**Vercel:** import `packages/nextjs/.env.vercel` (see [docs/VERCEL_FIX.md](docs/VERCEL_FIX.md))

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_LIVE_DEPLOY` | `true` on Vercel — Arc Testnet, not Hardhat |
| `NEXT_PUBLIC_ARC_RPC_URL` | Arc RPC (`https://rpc.testnet.arc.io`) |
| `DEV_SKIP_WORLD_VERIFY` | Demo mode without World Portal keys |
| `VERIFIER_PRIVATE_KEY` | Server key — issues credentials after verify |

---

## Documentation

| Doc | Description |
|-----|-------------|
| [SUBMISSION.md](docs/SUBMISSION.md) | ETHGlobal form copy |
| [DEMO_ONLY.md](docs/DEMO_ONLY.md) | Minimal demo checklist |
| [COMPLIANCE.md](docs/COMPLIANCE.md) | Hackathon rules & boilerplate disclosure |
| [AI_ATTRIBUTION.md](docs/AI_ATTRIBUTION.md) | AI tool usage disclosure |
| [YOUR_ACTIONS.md](docs/YOUR_ACTIONS.md) | Fund wallets, World Portal, deploy |

---

## Built during ETHGlobal Online 2026

- **Boilerplate:** [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) — monorepo, wagmi, deploy pipeline
- **Built for FairStake:** contracts, World/ENS/Arc integration, Judge Theater UX, testnet deployments
- **AI assistance:** documented in [docs/AI_ATTRIBUTION.md](docs/AI_ATTRIBUTION.md)

---

## License

See [LICENCE](LICENCE).
