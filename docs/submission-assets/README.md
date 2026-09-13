# ETHGlobal submission images — FairStake

Upload these files to the **Images** section of your ETHGlobal project submission.

## Upload mapping

| Form field | File to upload | Size |
|------------|----------------|------|
| **Logo** | `logo-512x512.png` | 512×512 |
| **Cover image** | `cover-640x360.png` | 640×360 (16:9) |
| **Screenshot 1** | `screenshot-01-hero.png` | Home — hero + value prop |
| **Screenshot 2** | `screenshot-02-judge-theater.png` | Judge Theater — sybil demo narrative |
| **Screenshot 3** | `screenshot-03-live-flow.png` | Live demo — verify → passport → commit flow |

## Optional extras

- `cover-1280x720.png` — higher-res cover if the form accepts larger files

## Regenerating screenshots

With the app running locally (`yarn chain` + `yarn start` from repo root):

```bash
cd /path/to/fairstake
node scripts/capture-submission-screenshots.mjs
```

Requires `playwright` and Chromium (`npx playwright install chromium` once).
