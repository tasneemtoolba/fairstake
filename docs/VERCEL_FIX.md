# Vercel deploy fix

## Why it failed

FairStake is a **monorepo**. Next.js lives in `packages/nextjs/package.json`, not the repo root. Vercel ran `yarn install` at the root, then looked for `next` in the **root** `package.json` — and failed.

The `YN0007` esbuild/sharp lines are **normal** (native deps building). They are not the error.

## Fix (do this in Vercel dashboard)

1. Open https://vercel.com → your **fairstake** project  
2. **Settings** → **General**  
3. **Root Directory** → click **Edit** → set to:

   ```
   packages/nextjs
   ```

4. **Save**  
5. **Deployments** → latest failed deploy → **Redeploy**

With Root Directory = `packages/nextjs`, Vercel finds `next` in the correct `package.json`.

## Environment variables (required for live verify)

In **Settings → Environment Variables**, add:

| Key | Value |
|-----|--------|
| `VERIFIER_PRIVATE_KEY` | same as `packages/hardhat/.env` |
| `DEV_SKIP_WORLD_VERIFY` | `true` |
| `NEXT_PUBLIC_DEV_MODE` | `true` |
| `NEXT_PUBLIC_ARC_RPC_URL` | `https://rpc.testnet.arc.io` |

No `yarn chain` needed on Vercel — production auto-defaults to **Arc Testnet** (not localhost).

If you still see "Cannot connect to local provider", redeploy after the latest push (scaffold.config fix).

Then redeploy.

## Demo URL after success

```
https://fairstake.vercel.app/theater
```
