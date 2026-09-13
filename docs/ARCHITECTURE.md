# FairStake Architecture

## One-liner
**Verify once (World) → carry eligibility (ENS passport) → commit anywhere (Arc).**

## Flow diagram

```
┌──────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│ World ID     │────▶│ InvestorPassport     │────▶│ FairStakePool   │
│ Selfie Check │     │ Registry (Sepolia)   │     │ (Arc Testnet)   │
└──────────────┘     └──────────────────────┘     └─────────────────┘
   nullifier              ENS-shaped records           USDC + caps
```

## Components

### World — humanity
- Selfie Check via IDKit v4
- Server verifies via World Developer Portal API
- Nullifier stored in `FairStakePool.usedNullifiers`

### ENS — passport
- `InvestorPassportRegistry` on Sepolia stores ENS-compatible text records
- Subname format: `{addr}.investor.fairstake.eth`
- Portable across Round 1 and Round 2 (The Sybil Test)

### Arc — capital
- `FairStakePool`: rounds, per-investor caps, native USDC commits
- Fail-closed: `Human not verified` revert for sybils

## Networks

| Chain | Contract | Role |
|-------|----------|------|
| Sepolia | InvestorPassportRegistry | Passport anchor |
| Arc Testnet | FairStakePool | USDC commits |
| Hardhat | Both (local dev) | Full flow testing |

## Security (MVP)
- Centralized verifier for hackathon speed
- Nullifier anti-reuse on-chain
- Credential expiry checked at commit time
