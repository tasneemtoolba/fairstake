# Demo Video Script — read this aloud (2:45–3:30)

**Record at:** [fairstake.vercel.app/theater](https://fairstake.vercel.app/theater)  
**Before recording:** MetaMask on **Arc Testnet** · funded wallet · second empty wallet ready  
**Rules:** 720p+ · your real voice · 2–4 minutes · laptop screen (not phone)

Click the **1–4 act buttons** at the top as you move through each section (gold bar = current act).

---

## 0:00 — Hook (15 sec)

**Screen:** `/theater` loaded · click act **1**

**Say exactly:**
> "Fair launches get sybil-farmed. Every pool asks for KYC again. **FairStake** separates two things: prove you're a unique human once, then commit capital on-chain. We call it **proof of person, not proof of passport**."

---

## 0:15 — Act 1: The problem (25 sec)

**Screen:** scroll to **KYC Treadmill vs Passport** · point at scrolling red forms, then the passport card

**Say exactly:**
> "Legacy fair launches look like this — upload ID, utility bill, selfie number three, form seven-B, every single time. Fifty sybil wallets still slip through. FairStake replaces that treadmill with one **investor passport** — verify once, reuse everywhere."

---

## 0:40 — Act 2: Sybil attack (30 sec)

**Screen:** click act **2** · click **Launch 50 sybils** · wait for REVERTED

**Say exactly:**
> "Here's the attack. Fifty bots hit one pool. Watch the simulation — **fifty launched, zero admitted, result reverted**. On Arc Testnet this isn't cosmetic: unverified wallets hit the contract and **fail closed**. Sybils never get a seat."

---

## 1:10 — Act 3: Live proof (55 sec)

**Screen:** click act **3** · **Connect Wallet** · click **Verify human** (dev mode or World Selfie Check)

**Say exactly:**
> "Live on Arc Testnet. I connect my wallet and run **World Selfie Check** — one human, one nullifier."

**Screen:** passport card appears with ENS-shaped name

**Say exactly:**
> "That mints my **investor passport** — ENS-shaped credential, max commit and expiry on-chain. World verifies the human, ENS carries the credential."

**Screen:** enter **10** USDC · click **Commit to Round 1** · confirm MetaMask

**Say exactly:**
> "Now I commit ten USDC to Round 1. Arc settles native USDC — the pool enforces per-investor caps. Verified investor: **success**."

---

## 2:05 — Act 4: The Sybil Test (45 sec)

**Screen:** click act **4** · switch MetaMask to **second wallet** (never verified) · try **Commit**

**Say exactly:**
> "Sybil test. Fresh wallet — never verified. I try to commit… and the transaction **reverts**. Fail closed."

**Screen:** switch back to verified wallet · click **Round 2** · commit again (no re-verify)

**Say exactly:**
> "Same human, same passport — Round 2. **No second selfie.** The credential is portable. Sybils blocked, humans reuse."

---

## 2:50 — Close (10 sec)

**Screen:** scroll to top or home hero

**Say exactly:**
> "**FairStake** — investor passports for fair launches. Proof of person, not proof of passport. Built with World, ENS, and Arc."

---

## Quick checklist while recording

| # | Show | Say the key line |
|---|------|------------------|
| 1 | KYC treadmill vs passport | "Verify once, reuse everywhere" |
| 2 | Launch 50 sybils → REVERTED | "Fifty launched, zero admitted" |
| 3 | Verify → passport → Round 1 commit | "World · ENS · Arc — live on testnet" |
| 4 | Fresh wallet reverts | "Sybils blocked" |
| 5 | Round 2 without re-selfie | "Same passport, no second selfie" |

---

## If something breaks on camera

| Issue | What to say |
|-------|-------------|
| Verify button slow | "World IDKit confirms humanity off-device; passport mints server-side." |
| Commit pending | "Arc Testnet confirmation — native USDC commit." |
| Revert on sybil wallet | "That's the point — contract reverts unverified addresses." |

---

## UI note (why sections looked gray)

Judge Theater used to dim non-active acts with 50% opacity — they looked disabled but were still clickable. **Fixed:** active act now gets a **gold left bar** only; everything stays full brightness.
