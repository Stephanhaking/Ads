// uso: node render3d.js jobs.json outdir [w h]  — jobs: [{f:"00012", shot, u, d}]
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const jobs = JSON.parse(fs.readFileSync(process.argv[2])); const out = process.argv[3];
  const w = process.argv[4] || 1080, h = process.argv[5] || 1920, st = process.argv[6] || '';
  const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const pg = await br.newPage({ viewport: { width: +w, height: +h } });
  pg.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text()); }); pg.on('pageerror', e => console.log('PAGEERR', e.message));
  await pg.goto(`http://localhost:8765/cena3d.html?w=${w}&h=${h}&style=${st}`); await pg.waitForFunction('window.ready===true', null, { timeout: 120000 });
  for (const j of jobs) {
    const t0 = Date.now(); const d = await pg.evaluate(([s, u, dd]) => window.renderShot(s, u, dd), [j.shot, j.u, j.d]);
    fs.writeFileSync(`${out}/${j.f}.jpg`, Buffer.from(d.split(',')[1], 'base64'));
    if (jobs.length < 12) console.log(j.f, Date.now() - t0, 'ms');
  }
  await br.close();
})();
