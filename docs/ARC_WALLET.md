# Arc Testnet Wallet

**Fund this address on Arc Testnet:**

```
0xc943bF2b3Ee4f94b66208A80EE3D168eCF0Fc7de
```

## Faucet

1. Open [Circle Faucet](https://faucet.circle.com)
2. Select **Arc Testnet**
3. Paste address: `0xc943bF2b3Ee4f94b66208A80EE3D168eCF0Fc7de`
4. Request test USDC (native gas on Arc)

## After funding

```bash
cd hackathons/fairstake
yarn check:arc          # should show balance > 0
yarn deploy:arc         # deploy FairStakePool
yarn deploy:arc:setup   # create demo round #1
```

Private key is stored in (gitignored):
- `packages/hardhat/.env`
- `packages/nextjs/.env.local` (`VERIFIER_PRIVATE_KEY`)

**Do not commit or share these files.**
