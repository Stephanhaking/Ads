// Uso: node render.js <pasta> <largura> <altura> — converte cada .svg da pasta em .png
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const [dir, w, h] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: +w, height: +h } });
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) {
    await page.setContent(`<html><body style="margin:0">${fs.readFileSync(path.join(dir, f), 'utf8')}</body></html>`);
    await page.screenshot({ path: path.join(dir, f.replace(/\.svg$/, '.png')) });
  }
  await browser.close();
})();
