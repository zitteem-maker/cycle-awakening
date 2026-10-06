// Génère les images statiques de marque à partir des tokens :
//  - public/images/share/og-default.png (1200×630, Open Graph / Twitter)
//  - public/apple-touch-icon.png (180×180), public/icon-192.png, public/icon-512.png, public/favicon.ico (32×32)
// Rendu via Chromium (Playwright). Visuel typographique provisoire : à remplacer par une version avec photo
// quand les photos de marque seront disponibles.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { loadTokens, flatten } from './tokens-lib.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const t = flatten(loadTokens());
// Polices intégrées en base64 : une page chargée par setContent ne peut pas lire de fichiers locaux.
const font = (p) => `data:font/woff2;base64,${readFileSync(`${root}node_modules/@fontsource/${p}`).toString('base64')}`;
const faviconSvg = readFileSync(`${root}public/favicon.svg`, 'utf8');
const markLight = readFileSync(`${root}public/brand/marque-clair.svg`, 'utf8').replace('<svg ', '<svg width="260" height="260" ');

const fontFaces = `
  @font-face { font-family: 'Cormorant Garamond'; font-weight: 500; src: url(${font('cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2')}); }
  @font-face { font-family: 'Cormorant Garamond'; font-style: italic; font-weight: 500; src: url(${font('cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2')}); }
  @font-face { font-family: 'Inter'; font-weight: 500; src: url(${font('inter/files/inter-latin-500-normal.woff2')}); }
`;

const shareHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
  ${fontFaces}
  html, body { margin: 0; width: 1200px; height: 630px; }
  body {
    background: ${t['semantic-bg']}; color: ${t['semantic-text']};
    display: grid; grid-template-columns: 1fr 360px; align-items: center;
    padding: 0 0 0 96px; box-sizing: border-box; overflow: hidden;
  }
  .eyebrow { font: 500 20px/1 Inter, sans-serif; letter-spacing: .18em; text-transform: uppercase; color: ${t['semantic-text-muted']}; margin: 0 0 36px; }
  h1 { font: 500 92px/1.02 'Cormorant Garamond', serif; margin: 0 0 32px; }
  p { font: italic 500 34px/1.3 'Cormorant Garamond', serif; color: ${t['semantic-text-muted']}; margin: 0; }
  .rule { width: 72px; height: 2px; background: ${t['semantic-accent']}; margin: 0 0 32px; }
  .side { height: 630px; background: ${t['semantic-bg-deep']}; position: relative; }
  .side svg { position: absolute; left: 50%; top: 50%; margin: -130px 0 0 -130px; }
</style></head><body>
  <div>
    <div class="eyebrow">Cycle Awakening</div>
    <h1>Redevenir toi.<br>Chaque mois.</h1>
    <div class="rule"></div>
    <p>Tu n’es pas instable. Tu es cyclique.</p>
  </div>
  <div class="side">${markLight}</div>
</body></html>`;

const iconHtml = (size) => `<!doctype html><html><head><style>
  html, body { margin: 0; width: ${size}px; height: ${size}px; background: ${t['semantic-bg-deep']}; }
  svg { width: ${size}px; height: ${size}px; display: block; }
</style></head><body>${faviconSvg.replace(/rx="14"/, 'rx="0"')}</body></html>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

async function shoot(html, width, height, out) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ type: 'png' });
  await page.close();
  if (out) writeFileSync(out, buf);
  return buf;
}

mkdirSync(`${root}public/images/share`, { recursive: true });
await shoot(shareHtml, 1200, 630, `${root}public/images/share/og-default.png`);
await shoot(iconHtml(180), 180, 180, `${root}public/apple-touch-icon.png`);
await shoot(iconHtml(192), 192, 192, `${root}public/icon-192.png`);
await shoot(iconHtml(512), 512, 512, `${root}public/icon-512.png`);
const ico32 = await shoot(iconHtml(32).replace('rx="0"', 'rx="14"'), 32, 32);
writeFileSync(`${root}public/favicon.ico`, pngToIco(ico32, 32));
await browser.close();
console.log('images de marque générées : og-default.png, apple-touch-icon.png, icon-192/512.png, favicon.ico');

// Un .ico peut contenir directement un PNG (supporté par tous les navigateurs actuels).
function pngToIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}
