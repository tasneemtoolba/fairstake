# FairStake — Build Plan

> **ETHGlobal Online** · Sponsors: **World · ENS · Arc**  
> One submission, three integrations, one coherent demo story.

---

## 1. Vision

**Pitch:** *Proof of person, not proof of passport.*

FairStake lets users join **sybil-resistant, fair-launch USDC pools** on Arc after proving they are a unique live human (World Selfie Check) and receiving a scoped **ENSv2 investor credential** — without a full document KYC flow.

**What judges should remember:** Human eligibility → portable credential → onchain commit with hard caps. Fail-closed everywhere.

**What we are NOT building:** Securities trading, KYC bypass for regulated products, or hardware signing (Ledger dropped).

---

## 2. Current state (done)

| Area | Status |
|------|--------|
| Scaffold-ETH 2 monorepo | ✅ Cloned & renamed |
| `FairStakePool.sol` | ✅ Core commit + credential gating |
| Hardhat tests | ✅ 2 passing |
| Arc Testnet config | ✅ Hardhat + viem chain |
| Sepolia as 2nd network | ✅ In `scaffold.config.ts` |
| Frontend shell | ✅ 3-step flow (stub buttons) |
| World API route | ✅ Stub at `/api/world/verify` |
| ENS helpers | ✅ Record builders (stub) |
| Docs skeleton | ✅ ARCHITECTURE, SPONSORS, world-feedback |
| Deploy script | ✅ `yarn deploy:arc` ready |

---

## 3. Success criteria (submission-ready)

### Must-have (MVP)

- [ ] Live demo URL (Vercel or similar)
- [ ] `FairStakePool` deployed on **Arc Testnet** (verified on ArcScan)
- [ ] **World Selfie Check** works end-to-end (real proof, not stub)
- [ ] **ENS credential** minted on Sepolia with FairStake text records
- [ ] Frontend: verify → mint → commit flow with real wallet txs
- [ ] **Fail-closed demo:** unverified wallet cannot commit (reverts on-chain)
- [ ] 3-minute demo video
- [ ] ETHGlobal submission tagged **World, ENS, Arc**

### Sponsor deliverables

| Sponsor | Required artifact |
|---------|-------------------|
| World | Completed `docs/world-feedback.md` |
| ENS | Working ENSv2 subname + EAC text records in demo |
| Arc | Architecture in `docs/ARCHITECTURE.md` + Arc testnet deployment |

### Nice-to-have (Finalist polish)

- [ ] Round admin UI (create round, view totals)
- [ ] Investor dashboard (credential status, commit history)
- [ ] Arc architecture diagram (Mermaid or image in docs)
- [ ] Sepolia ↔ Arc cross-chain story in README (same wallet, two roles)
- [ ] Contract verified on ArcScan

---

## 4. Architecture (target)

```
┌──────────────────────────────────────────────────────────────────┐
│                         FairStake App (Next.js)                  │
├─────────────┬────────────────────┬───────────────────────────────┤
│ World IDKit │ ENS mint UI        │ Commit UI (Scaffold hooks)    │
│ (Selfie)    │ (Sepolia)          │ (Arc Testnet)                 │
└──────┬──────┴─────────┬──────────┴──────────────┬──────────────┘
       │                │                         │
       ▼                ▼                         ▼
┌──────────────┐  ┌──────────────┐        ┌───────────────────┐
│ POST         │  │ ENS Registry │        │ FairStakePool     │
│ /api/world/  │  │ + EAC records│        │ (Arc Testnet)     │
│ verify       │  │ (Sepolia)    │        │ commit()          │
└──────┬───────┘  └──────────────┘        └───────────────────┘
       │
       ▼
┌──────────────┐
│ Verifier     │── setCredential(investor, maxCommit, nullifier)
│ wallet       │
└──────────────┘
```

**Chain roles**

| Chain | Purpose | Why |
|-------|---------|-----|
| Arc Testnet | USDC commits | Sponsor requirement; USDC-native gas |
| Sepolia | ENS credentials | ENSv2 / EAC dev environment |
| Hardhat | Local iteration | Fast contract + UI dev |

---

## 5. Build phases

### Phase 0 — Accounts & env (≈30 min)

**Goal:** All external services configured before coding integrations.

| Task | Output |
|------|--------|
| World Developer Portal: create app + Selfie Check action | `WORLD_APP_ID`, `WORLD_ACTION_ID` |
| Generate deployer key (`yarn generate`) | `DEPLOYER_PRIVATE_KEY` |
| Fund Arc deployer ([Circle faucet](https://faucet.circle.com)) | ≥0.5 test USDC |
| Fund Sepolia deployer ([faucets](https://sepoliafaucet.com)) | ≥0.05 ETH |
| Register / prepare ENS parent name (or use test subname strategy) | `NEXT_PUBLIC_ENS_PARENT_NAME` |
| Copy `.env.example` → `.env` (root + nextjs) | Secrets in place |
| Optional: Vercel project linked | Preview deploys |

**Exit criteria:** `.env` filled; wallets funded on Arc + Sepolia.

---

### Phase 1 — Arc contract on testnet (≈2 h)

**Goal:** Real deployed pool; owner can create rounds; verified users can commit.

| # | Task | Files / commands |
|---|------|------------------|
| 1.1 | Deploy `FairStakePool` to Arc | `yarn deploy:arc` |
| 1.2 | Record address in `deployedContracts.ts` (auto via SE2 deploy) | `packages/nextjs/contracts/` |
| 1.3 | Owner script: create demo round (cap $100/investor, $10k total, 7 days) | Hardhat task or debug UI |
| 1.4 | Manual test: `setCredential` + `commit` via Debug Contracts | `/debug` |
| 1.5 | Verify contract on ArcScan | `yarn verify --network arcTestnet` |
| 1.6 | Confirm native USDC decimals (18 vs 6) — align UI formatting | `lib/chains/arcTestnet.ts`, UI |

**Contract gaps to decide (Phase 1):**

- Native USDC only for MVP, or ERC-20 USDC on Arc?
- Add `usedNullifiers` mapping to block credential reuse? (recommended)
- Refund / close-round UX needed for demo? (optional)

**Exit criteria:** ArcScan link works; commit tx succeeds for credentialed wallet; reverts for uncredentialed.

---

### Phase 2 — World Selfie Check (≈3–4 h)

**Goal:** Real human verification → backend → on-chain credential.

| # | Task | Files |
|---|------|-------|
| 2.1 | Install `@worldcoin/idkit` | `packages/nextjs/package.json` |
| 2.2 | Add IDKit widget to verify step | `components/fairstake/WorldVerifyButton.tsx` |
| 2.3 | Implement server-side proof verification | `lib/world/verify.ts` |
| 2.4 | API: validate proof, return nullifier + level | `app/api/world/verify/route.ts` |
| 2.5 | API: call `setCredential` via verifier wallet | `app/api/credential/issue/route.ts` (new) |
| 2.6 | Store nullifier server-side (SQLite/JSON) to prevent double-issue | `lib/world/nullifier-store.ts` |
| 2.7 | UI: show verification status + expiry | `FairStakeFlow.tsx` |
| 2.8 | Complete `docs/world-feedback.md` | friction, setup time, suggestions |

**World bounty checklist:**

- [ ] Selfie Check (not just Orb) used in demo
- [ ] Proof validated server-side (not client-only)
- [ ] Clear link between World nullifier and on-chain credential
- [ ] Feedback doc submitted / linked in README

**Exit criteria:** Fresh wallet completes Selfie → sees “Verified” → can commit on Arc (after Phase 1 credential write).

---

### Phase 3 — ENSv2 investor credential (≈3–4 h)

**Goal:** Mint subname with FairStake text records; frontend reads before enabling commit.

| # | Task | Files |
|---|------|-------|
| 3.1 | Choose ENS strategy: own `fairstake.eth` vs hackathon test parent | docs decision |
| 3.2 | Implement subname mint (ENS SDK or direct contract calls) | `lib/ens/mint-credential.ts` |
| 3.3 | Set text records via `buildCredentialRecords()` | `lib/ens/credential.ts` |
| 3.4 | EAC: scoped records if required by ENS bounty wording | `lib/ens/eac.ts` |
| 3.5 | API route or client tx: mint after World verify | `app/api/ens/mint/route.ts` |
| 3.6 | Read credential on frontend; gate commit button | `hooks/useInvestorCredential.ts` |
| 3.7 | Display ENS name in UI (e.g. `0xabc…123.investor.fairstake.eth`) | `FairStakeFlow.tsx` |

**ENS bounty checklist:**

- [ ] ENSv2 / EAC mentioned in submission copy
- [ ] Text records readable on Sepolia explorer
- [ ] Credential encodes max commit + round scope
- [ ] Demo shows mint → read → commit alignment

**Exit criteria:** Sepolia tx mints subname; UI reads `fairstake.maxCommitUsd`; commit amount respects cap.

---

### Phase 4 — Frontend & demo UX (≈3 h)

**Goal:** One polished path a judge can follow in under 3 minutes.

| # | Task | Notes |
|---|------|-------|
| 4.1 | Replace all stub buttons with real flows | Phase 2 + 3 |
| 4.2 | Network switcher hints (Sepolia for ENS, Arc for commit) | Header / step banners |
| 4.3 | `CommitPanel`: amount input, max cap display, tx feedback | New component |
| 4.4 | `RoundStats`: total committed, your commit, time left | Read from contract |
| 4.5 | Admin panel (owner): create round | Debug UI or `/admin` |
| 4.6 | Landing copy: problem → solution → sponsors | `page.tsx` hero |
| 4.7 | Mobile-friendly layout | Test on phone |

**Demo script (3 min):**

1. **Problem** (20s): Fair launches get sybil-farmed; KYC is heavy for small pools.
2. **Verify** (40s): Connect wallet → World Selfie Check → verified badge.
3. **Credential** (40s): Mint ENS investor passport → show text records.
4. **Commit** (40s): Switch to Arc → commit $50 USDC → show ArcScan tx.
5. **Fail-closed** (20s): Second wallet tries to commit → revert.
6. **Close** (20s): Recap three sponsors + architecture diagram.

**Exit criteria:** Non-technical friend can follow demo script without help.

---

### Phase 5 — Deploy, video, submit (≈2 h)

| # | Task |
|---|------|
| 5.1 | Deploy frontend to Vercel |
| 5.2 | Set production env vars (World, verifier key, RPC) |
| 5.3 | Record 3-min demo video (Loom / OBS) |
| 5.4 | Write ETHGlobal description (problem, solution, tech, links) |
| 5.5 | Tag sponsors: **World, ENS, Arc** (max 3) |
| 5.6 | Final README polish: live links, contract addresses, setup |
| 5.7 | Optional: tweet / World feedback form submission |

**Exit criteria:** Submission live with working URL + video + Arc contract link.

---

## 6. File map (what to build next)

```
packages/nextjs/
├── components/fairstake/
│   ├── FairStakeFlow.tsx          # orchestrator (exists)
│   ├── WorldVerifyButton.tsx      # Phase 2
│   ├── PassportCard.tsx           # Phase 3
│   ├── SybilTestPanel.tsx         # Phase 4
│   ├── CommitPanel.tsx            # Phase 4
│   └── RoundStats.tsx             # Phase 4
├── hooks/
│   └── useInvestorCredential.ts   # Phase 3
├── lib/world/
│   ├── verify.ts                  # Phase 2 — real API
│   └── nullifier-store.ts         # Phase 2
├── lib/ens/
│   ├── mint-credential.ts         # Phase 3
│   └── eac.ts                     # Phase 3 (if needed)
└── app/api/
    ├── world/verify/route.ts      # Phase 2
    ├── credential/issue/route.ts  # Phase 2 — on-chain write
    └── ens/mint/route.ts          # Phase 3

packages/hardhat/
├── contracts/FairStakePool.sol    # optional: nullifier reuse guard
└── scripts/create-demo-round.ts   # Phase 1
```

---

## 7. Risks & mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| World sandbox / Selfie setup friction | Blocks Phase 2 | Start Phase 0 today; use World docs + test action early |
| ENS parent name not owned | Blocks mint demo | Use Sepolia test registrar or pre-minted demo names |
| Arc USDC decimals confusion | Wrong amounts in UI | Verify on first test tx; use `formatUnits` consistently |
| Verifier key on server | Security concern | Hackathon-only hot wallet; document as MVP limitation |
| Prior art (AgentPassport, etc.) | Judge fatigue | Lead with **fair-launch pool** angle, not generic agent passport |
| Single submission / 3 sponsor max | Can't add Uniswap later | Locked: World + ENS + Arc |

---

## 8. Recommended build order

```
Phase 0 (env)
    ↓
Phase 1 (Arc deploy + manual commit)  ← proves money path early
    ↓
Phase 2 (World verify → setCredential)
    ↓
Phase 3 (ENS mint + read)
    ↓
Phase 4 (polish UI + demo script)
    ↓
Phase 5 (deploy + submit)
```

**Parallelization:** While waiting on World app approval, do Phase 1 + ENS research (Phase 3 docs).

---

## 9. Time estimate

| Phase | Optimistic | Realistic |
|-------|------------|-----------|
| 0 — Env | 30 min | 1 h |
| 1 — Arc | 2 h | 3 h |
| 2 — World | 3 h | 5 h |
| 3 — ENS | 3 h | 5 h |
| 4 — UX | 2 h | 4 h |
| 5 — Submit | 2 h | 3 h |
| **Total** | **~12 h** | **~21 h** |

---

## 10. Definition of done

The project is **submission-ready** when:

1. A new user can complete the full flow on production URL.
2. Arc contract address is public and verified.
3. At least one ENS credential exists on Sepolia with FairStake records.
4. Unverified commit attempt fails on-chain (demo recorded on video).
5. All three sponsor integrations are named in README and demo video.
6. `docs/world-feedback.md` is complete (not TODO placeholders).

---

## 11. Next action

**Start Phase 0:** Set up World Developer app + fund wallets, then **Phase 1** deploy to Arc so the commit path is proven before integration work.

When ready, say which phase to implement first (recommended: **Phase 0 + 1**).
