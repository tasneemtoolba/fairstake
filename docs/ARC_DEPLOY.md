# Arc Testnet Deploy Guide

## Prerequisites

- Arc Testnet USDC from [Circle faucet](https://faucet.circle.com) (select **Arc Testnet**)
- Deployer private key in `packages/hardhat/.env`

## Option A — Plain private key (fastest)

```bash
# packages/hardhat/.env
DEPLOYER_PRIVATE_KEY=0x...your_key...
```

Also set in `packages/nextjs/.env.local`:

```bash
VERIFIER_PRIVATE_KEY=0x...same_key...
```

## Option B — Encrypted key (Scaffold-ETH default)

```bash
cd packages/hardhat
yarn generate   # creates DEPLOYER_PRIVATE_KEY_ENCRYPTED
```

## Check balance

```bash
yarn check:arc
```

Expected: non-zero USDC balance on chain ID **5042002**.

## Deploy pool + demo round

```bash
yarn deploy:arc
yarn deploy:arc:setup
```

Contract address is written to:
- `packages/hardhat/deployments/arcTestnet/FairStakePool.json`
- `packages/nextjs/contracts/deployedContracts.ts` (auto-generated)

## Verify on ArcScan

```bash
yarn workspace @se-2/hardhat hardhat verify --network arcTestnet <POOL_ADDRESS> <OWNER_ADDRESS>
```

Explorer: [testnet.arcscan.app](https://testnet.arcscan.app)

## Frontend

1. Switch wallet to **Arc Testnet** (5042002)
2. RPC: `https://rpc.testnet.arc.io`
3. Run `yarn start` and complete verify → commit flow

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Insufficient funds | Circle faucet → Arc Testnet |
| Wrong network in UI | Select Arc in wallet + app network switcher |
| setCredential fails | `VERIFIER_PRIVATE_KEY` must be pool owner |
| No round | Run `yarn deploy:arc:setup` |
