# FairStake

**Human-verified investing in onchain USDC pools** — eligibility without the KYC treadmill.

ETHGlobal Online submission targeting **World**, **ENS**, and **Arc** bounties.

## Stack

| Layer | Tool |
|-------|------|
| Monorepo | [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) |
| Contracts | Hardhat + OpenZeppelin |
| Frontend | Next.js + RainbowKit + wagmi |
| Human proof | World Selfie Check |
| Credential | ENSv2 Enhanced Access Control (Sepolia) |
| Settlement | Arc Testnet (USDC-native) |

## Quick start

```bash
cd fairstake
yarn install
yarn chain          # local Hardhat (optional)
yarn compile
yarn test
yarn start          # http://localhost:3000
```

### Deploy to Arc Testnet

1. Copy `.env.example` → `.env` and set `DEPLOYER_PRIVATE_KEY`
2. Fund deployer from [Circle faucet](https://faucet.circle.com) (Arc Testnet)
3. Deploy:

```bash
yarn deploy:arc
```

## Project layout

```
fairstake/
├── packages/hardhat/
│   ├── contracts/FairStakePool.sol   # Human-gated USDC commit pool
│   ├── deploy/                       # Rocketh deploy scripts
│   └── test/                         # Contract tests
├── packages/nextjs/
│   ├── app/                          # Next.js App Router
│   ├── components/fairstake/         # FairStake UI
│   ├── lib/world/                    # World verification stubs
│   └── lib/ens/                      # ENS credential helpers
└── docs/                             # Architecture & sponsor notes
```

## Flow

1. **Verify** — User completes World Selfie Check (unique human, not document KYC)
2. **Credential** — Mint ENSv2 investor subname with scoped commit limits
3. **Commit** — Invest USDC in a fair-launch round on Arc (contract enforces caps)

## The Sybil Test (Finalist demo)

1. **Verify** → mint investor passport  
2. **Commit Round 1** → success  
3. **Switch wallet** → commit **reverts** (fail-closed)  
4. **Round 2** → same passport, **no second selfie**

See [docs/VIDEO_SCRIPT.md](docs/VIDEO_SCRIPT.md) and [/architecture](http://localhost:3000/architecture).

## Your actions (fund wallets, World app, submit)

**Start here:** [docs/YOUR_ACTIONS.md](docs/YOUR_ACTIONS.md)

## Demo & test

**Full walkthrough:** [docs/DEMO.md](docs/DEMO.md)

```bash
# Terminal 1
yarn chain

# Terminal 2
yarn deploy && yarn demo:setup && yarn start
# → http://localhost:3000
```

## Docs

- [Build plan](docs/PLAN.md)
- [Demo guide](docs/DEMO.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Sponsors & bounties](docs/SPONSORS.md)
- [World integration feedback](docs/world-feedback.md)
- [ETHGlobal rules compliance](docs/COMPLIANCE.md)
- [AI attribution](docs/AI_ATTRIBUTION.md)

## Commands

| Command | Description |
|---------|-------------|
| `yarn start` | Dev frontend |
| `yarn chain` | Local Hardhat node |
| `yarn compile` | Compile contracts |
| `yarn test` | Run Hardhat tests |
| `yarn deploy` | Deploy to default network |
| `yarn deploy:arc` | Deploy to Arc Testnet |
