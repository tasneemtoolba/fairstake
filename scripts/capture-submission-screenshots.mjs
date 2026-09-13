import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../docs/submission-assets");
const base = process.env.FAIRSTAKE_URL ?? "http://127.0.0.1:3000";

const shots = [
  { url: `${base}/`, file: "screenshot-01-hero.png", w: 1280, h: 800, fullPage: false },
  { url: `${base}/theater`, file: "screenshot-02-judge-theater.png", w: 1280, h: 900, fullPage: true },
  { url: `${base}/demo`, file: "screenshot-03-live-flow.png", w: 1280, h: 900, fullPage: true },
];

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

for (const s of shots) {
  await page.setViewportSize({ width: s.w, height: s.h });
  await page.goto(s.url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(out, s.file), fullPage: s.fullPage });
  console.log("saved", s.file);
}

await browser.close();
