#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."

SOURCE=$(git rev-parse HEAD)
git checkout --orphan history-clean
git reset --hard

commit() {
  local msg="$1"
  shift
  [ $# -gt 0 ] && git add "$@" || true
  if git diff --cached --quiet; then return 0; fi
  git commit -m "$msg"
  echo "✓ $msg"
}

checkout_paths() {
  git checkout "$SOURCE" -- "$@" 2>/dev/null || true
}

checkout_paths \
  package.json yarn.lock .yarnrc.yml .yarn/releases .gitignore .lintstagedrc.js .husky .github \
  packages/hardhat/hardhat.config.ts packages/hardhat/tsconfig.json packages/hardhat/eslint.config.mjs \
  packages/hardhat/.gitignore packages/hardhat/package.json \
  packages/nextjs/package.json packages/nextjs/tsconfig.json packages/nextjs/eslint.config.mjs \
  packages/nextjs/postcss.config.js packages/nextjs/next.config.ts packages/nextjs/.gitignore \
  packages/nextjs/scaffold.config.ts packages/nextjs/public packages/nextjs/styles/globals.css \
  packages/nextjs/app/layout.tsx packages/nextjs/app/page.tsx packages/nextjs/components/Header.tsx \
  packages/nextjs/components/Footer.tsx packages/nextjs/components/ScaffoldEthAppWithProviders.tsx \
  packages/nextjs/components/SwitchTheme.tsx packages/nextjs/components/ThemeProvider.tsx \
  packages/nextjs/services packages/nextjs/hooks packages/nextjs/utils packages/nextjs/types \
  packages/nextjs/contracts packages/nextjs/lib/chains packages/nextjs/lib/config \
  packages/nextjs/app/blockexplorer packages/nextjs/app/debug packages/nextjs/app/not-found.tsx \
  packages/nextjs/next-env.d.ts README.md
commit "chore: bootstrap FairStake monorepo from Scaffold-ETH 2"

checkout_paths .env.example
commit "chore: add root env example and gitignore secret patterns"

checkout_paths packages/hardhat/contracts/FairStakePool.sol
commit "feat(contracts): add FairStakePool human-gated USDC commit pool"

checkout_paths packages/hardhat/contracts/InvestorPassportRegistry.sol packages/hardhat/deploy packages/hardhat/scripts
commit "feat(contracts): add InvestorPassportRegistry on Sepolia and Hardhat"

checkout_paths packages/nextjs/lib/chains/arcTestnet.ts packages/nextjs/scaffold.config.ts
commit "feat(frontend): configure Hardhat, Arc, and Sepolia target networks"

checkout_paths packages/nextjs/lib/world packages/nextjs/app/api/world packages/nextjs/components/fairstake/WorldVerifyButton.tsx
commit "chore(deps): add World IDKit and verification API route"

checkout_paths packages/nextjs/lib/blockchain packages/nextjs/lib/credential packages/nextjs/app/api
commit "feat(api): add World verification and on-chain credential issuance"

checkout_paths packages/nextjs/lib/ens
commit "feat(ens): wire on-chain passport registry read and issue"

checkout_paths packages/nextjs/components/fairstake packages/nextjs/app/demo packages/nextjs/app/theater packages/nextjs/app/architecture packages/nextjs/styles/fairstake-animations.css
commit "feat(frontend): Sybil Test UI and investor passport experience"

checkout_paths packages/hardhat/test packages/hardhat/deployments
commit "test: add InvestorPassportRegistry issuance and access control"

checkout_paths packages/hardhat/scripts
commit "feat(scripts): two-round demo and testnet deploy helpers"

checkout_paths docs/PLAN.md docs/ARCHITECTURE.md docs/SPONSORS.md docs/world-feedback.md docs/WORLD_SETUP.md docs/ARC_DEPLOY.md docs/ARC_WALLET.md
commit "docs: add build plan, architecture, and sponsor alignment"

checkout_paths docs/DEMO.md docs/DEMO_ONLY.md docs/VIDEO_SCRIPT.md docs/SUBMISSION.md docs/YOUR_ACTIONS.md docs/VERCEL_FIX.md
commit "docs: add demo guides, video script, and submission copy"

checkout_paths vercel.json packages/nextjs/vercel.json
commit "fix: configure Vercel monorepo deploy paths"

checkout_paths packages/nextjs/scaffold.config.ts packages/nextjs/services/web3/wagmiConfig.tsx
commit "fix(frontend): default production app to Arc Testnet"

checkout_paths packages/nextjs/styles/globals.css packages/nextjs/components/fairstake/ui packages/nextjs/components/Header.tsx packages/nextjs/components/Footer.tsx packages/nextjs/app/layout.tsx
commit "feat(ui): apply Credential theme palette and layout components"

checkout_paths docs/COMPLIANCE.md docs/AI_ATTRIBUTION.md README.md docs/SUBMISSION.md
commit "docs: add ETHGlobal compliance and AI attribution"

checkout_paths docs/submission-assets/logo-512x512.png docs/submission-assets/cover-640x360.png docs/submission-assets/cover-1280x720.png
commit "assets: add submission logo and cover images"

checkout_paths docs/submission-assets/screenshot-01-hero.png docs/submission-assets/screenshot-02-judge-theater.png docs/submission-assets/screenshot-03-live-flow.png docs/submission-assets/README.md scripts/capture-submission-screenshots.mjs
commit "assets: add submission screenshots and capture script"

checkout_paths .
git add -A
if ! git diff --cached --quiet; then
  git commit -m "chore: add remaining deployment artifacts and config files"
fi

echo "TOTAL COMMITS: $(git rev-list --count HEAD)"
git log --oneline
