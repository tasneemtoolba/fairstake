# ETHGlobal Online — Submission Copy

## Title
**FairStake — Investor Passports for Fair Launches**

## Tagline
Proof of person, not proof of passport.

## Description (paste into ETHGlobal)

Fair launches get sybil-farmed. Full KYC is overkill for small pools. **FairStake** separates human eligibility from capital commitment:

1. **World Selfie Check** — one live human, one nullifier, enforced on-chain
2. **Investor passport** — ENS-shaped credential on Sepolia, reusable across rounds
3. **Arc USDC pool** — fair-launch commits with hard caps; sybils fail closed

**The Sybil Test:** verified investor commits → fresh wallet reverts → same passport works on Round 2 without re-selfie.

Built with Scaffold-ETH 2, World IDKit v4, InvestorPassportRegistry, FairStakePool.

## Sponsors (tag exactly 3)
- World
- ENS
- Arc

## Links
| Link | URL |
|------|-----|
| Live demo | https://fairstake.vercel.app _(or run locally — see DEMO_ONLY.md)_ |
| GitHub | https://github.com/tasneemtoolba/fairstake |
| Arc pool | https://testnet.arcscan.io/address/0x53faf932922b322873d68cd21d0e3581b0273766 |
| Arc passport | https://testnet.arcscan.io/address/0xb032003194e0e03963c5ad9934813d8bca1e599c |
| Sepolia passport | https://sepolia.etherscan.io/address/0x53faf932922b322873d68cd21d0e3581b0273766 |
| Demo video | _your YouTube/Loom link_ |

## How it maps to sponsors

**World:** Selfie Check gates pool access; nullifier → on-chain credential.

**ENS:** Investor passport with ENS-shaped naming and on-chain registry anchor; portable across fair launches.

**Arc:** USDC-native commit pool with per-investor caps on Arc Testnet.

## Rules compliance (ETHGlobal)

- **Boilerplate:** Built on [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) — disclosed in README and [COMPLIANCE.md](./COMPLIANCE.md).
- **Version control:** Incremental commit history during the hackathon (contracts → API → frontend → testnet → UX).
- **AI tools:** Documented in [AI_ATTRIBUTION.md](./AI_ATTRIBUTION.md) — Cursor assisted UI/docs; contracts and on-chain logic human-reviewed.
- **Demo video:** 2–4 minutes, ≥720p, live voice — follow [VIDEO_SCRIPT.md](./VIDEO_SCRIPT.md). No phone recording, AI voiceover, or sped-up footage.
