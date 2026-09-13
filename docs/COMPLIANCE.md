# ETHGlobal Online 2026 — Rules compliance

Reference: [Event details & rules](https://ethglobal.com/events/ethonline2026/info/details) · [Code of conduct & pre-existing work](https://ethglobal.com/rules)

## Track

**Classic — From Scratch.** All FairStake-specific work began during ETHOnline 2026. No prior FairStake codebase existed before the event.

## Boilerplate & reused open source (disclosed)

| Component | Source | Role in FairStake |
|-----------|--------|-------------------|
| [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) | Public starter kit | Monorepo, wagmi/RainbowKit, deploy pipeline |
| [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) | Library | Access control patterns |
| [@worldcoin/idkit](https://github.com/worldcoin/idkit-js) | Library | Selfie Check UI + verification |
| Hardhat, Next.js, viem, wagmi | Libraries | Standard Ethereum stack |

**Built during the hackathon (FairStake-specific):**

- `FairStakePool.sol` — human-gated USDC commit pool on Arc
- `InvestorPassportRegistry.sol` — passport anchor (Sepolia + Arc)
- World verify API + IDKit integration
- ENS-shaped investor credential helpers + on-chain registry wiring
- Judge Theater, Sybil Test, KYC vs Passport UX
- Testnet deployments, demo scripts, submission docs

## Version control

Commit history shows incremental progress (contracts → API → frontend → testnet → docs → UX polish). See `git log --oneline`.

Planning artifacts included in repo: `docs/PLAN.md`, `docs/ARCHITECTURE.md`, `docs/VIDEO_SCRIPT.md`, `docs/SUBMISSION.md`.

## AI tools

Documented in [AI_ATTRIBUTION.md](./AI_ATTRIBUTION.md). Summary: Cursor assisted scaffolding and UI; human review on contracts and on-chain logic.

## Submission checklist

| Requirement | Status |
|-------------|--------|
| Submit before **Sun Sep 13, 12:00 pm EDT** | ⏳ Your action |
| GitHub repo with version history | ✅ |
| 2–4 min demo video, ≥720p, live voice | ⏳ Your action — see `VIDEO_SCRIPT.md` |
| Max **3** partner prizes (World · ENS · Arc) | ✅ Planned |
| Disclose boilerplate + AI usage | ✅ This file + `AI_ATTRIBUTION.md` |
| Demo video: no phone recording, no AI voiceover, no sped-up footage | ⏳ Your action |

## Honest integration notes (for judges & partners)

**World:** IDKit v4 integrated; dev bypass available via `DEV_SKIP_WORLD_VERIFY` for demo without Portal keys. Production path documented in `WORLD_SETUP.md`.

**ENS:** Investor passports use **ENS-shaped naming and text-record metadata**, anchored on-chain via `InvestorPassportRegistry` on Sepolia. Full ENSv2 subname minting is documented as the production path; hackathon demo emphasizes portable credential semantics.

**Arc:** `FairStakePool` deployed on Arc Testnet with live USDC commits and sybil fail-closed behavior.
