# World Selfie Check — Setup Guide

## 1. Developer Portal

1. Go to [developer.world.org](https://developer.world.org)
2. Create an app
3. Click **Enable World ID 4.0** (RP registration)
4. Create action: `fairstake-verify`
5. Request **Selfie Check (Beta)** access — email `developers@toolsforhumanity.com` if not enabled
6. Copy these values:

| Portal field | Env variable |
|--------------|--------------|
| App ID | `NEXT_PUBLIC_WORLD_APP_ID` + `WORLD_APP_ID` |
| RP ID | `WORLD_RP_ID` |
| Signing key | `WORLD_RP_SIGNING_KEY` (server only — never expose to client) |
| Action name | `NEXT_PUBLIC_WORLD_ACTION_ID` + `WORLD_ACTION_ID` |

## 2. Environment variables

Add to `packages/nextjs/.env.local`:

```bash
# World (client)
NEXT_PUBLIC_WORLD_APP_ID=app_xxxxxxxx
NEXT_PUBLIC_WORLD_ACTION_ID=fairstake-verify
NEXT_PUBLIC_DEV_MODE=false

# World (server — same app, plus RP secrets)
WORLD_APP_ID=app_xxxxxxxx
WORLD_ACTION_ID=fairstake-verify
WORLD_RP_ID=rp_xxxxxxxx
WORLD_RP_SIGNING_KEY=0x...your_signing_key...
WORLD_ENVIRONMENT=staging   # staging for simulator; production for live

DEV_SKIP_WORLD_VERIFY=false
```

`VERIFIER_PRIVATE_KEY` must be the FairStakePool **owner** (same as deployer).

## 3. How it works in FairStake

```
User clicks "World Selfie Check"
    → GET /api/world/rp-context (server signs with RP key)
    → IDKit shows QR / deep link
    → User completes Selfie in World App
    → POST /api/world/verify (forwards to World v4 API)
    → POST /api/credential/issue (setCredential on Arc/Hardhat)
    → ENS credential displayed
```

## 4. Test without World App

Keep dev mode for local Hardhat testing:

```bash
DEV_SKIP_WORLD_VERIFY=true
NEXT_PUBLIC_DEV_MODE=true
# omit NEXT_PUBLIC_WORLD_APP_ID
```

## 5. Submission deliverable

Complete `docs/world-feedback.md` after integration with real friction notes.
