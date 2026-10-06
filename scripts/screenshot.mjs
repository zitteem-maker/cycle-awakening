// Capture d'écran locale d'une page buildée (contrôle visuel mobile / desktop).
// Usage : npm run preview, puis node scripts/screenshot.mjs <url> <largeur> <sortie.png>
import { chromium } from 'playwright-core';

const [url, width = '390', out = 'screenshot.png'] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: out, fullPage: true });
await browser.close();
