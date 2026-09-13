# AI tool attribution — ETHGlobal requirement

Per [ETHOnline 2026 rules](https://ethglobal.com/events/ethonline2026/info/details#use-of-ai-tools), this documents where AI assisted FairStake.

## Tools used

| Tool | Usage |
|------|--------|
| **Cursor** | Code scaffolding, refactors, UI components, docs, deploy troubleshooting |
| **AI image generation** | Submission logo (`docs/submission-assets/logo-512x512.png`) and cover banner (`cover-640x360.png`) |

## Human-led / reviewed

- Smart contract design and tests (`FairStakePool.sol`, `InvestorPassportRegistry.sol`)
- On-chain sybil fail-closed logic and nullifier enforcement
- Testnet deployment decisions and contract addresses
- Demo narrative (Judge Theater, Sybil Test script)
- Final submission copy and sponsor alignment

## Files primarily AI-assisted

- `packages/nextjs/components/fairstake/**` — UI layout and styling iterations
- `packages/nextjs/styles/globals.css` — Credential theme tokens
- `docs/*.md` — planning and submission documentation drafts
- `docs/submission-assets/*` — generated marketing images

## Files primarily human-directed

- `packages/hardhat/contracts/*.sol`
- `packages/hardhat/test/*.ts`
- `packages/hardhat/deploy/**`
- `packages/nextjs/lib/world/verify.ts`
- `packages/nextjs/lib/ens/passport-registry.ts`

## Paste into submission form

> Cursor AI assisted with Scaffold-ETH integration, React UI, documentation, and submission assets. Smart contracts, on-chain access control, testnet deployments, and the Sybil Test demo flow were designed and verified by the team. AI-generated images were used only for the logo and cover banner. See `docs/AI_ATTRIBUTION.md` in our repo for full details.
