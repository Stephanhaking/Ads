// Set: near-Earth space. Black sky with stars, the Earth below (a textured sphere with oceans, land, clouds and a thin glow).
// Space station, spaceship, cockpit frame and people are 2D.
import { registerSet, K, THREE } from '/engine/api.js';
registerSet('space', async (W) => {
  const r = (s) => { let x = s; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }; const R = r(7);
  const n = 2500, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const u = R() * 2 - 1, a = R() * Math.PI * 2, s = Math.sqrt(1 - u * u); pos.set([s * Math.cos(a) * 900, u * 900, s * Math.sin(a) * 900], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  W.add(new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffffff', size: 1.6, sizeAttenuation: false, fog: false })));
  const tex = K.canvasTex(2048, 1024, (c, w, h) => {
    c.fillStyle = '#1d4f8f'; c.fillRect(0, 0, w, h); const RR = r(3);
    c.fillStyle = '#3f7a45'; for (let k = 0; k < 6; k++) { const cx = RR() * w, cy = h * 0.25 + RR() * h * 0.5; for (let i = 0; i < 14; i++) { c.beginPath(); c.ellipse(cx + (RR() - 0.5) * 260, cy + (RR() - 0.5) * 180, 30 + RR() * 70, 20 + RR() * 50, RR() * 3, 0, 7); c.fill(); } }
    c.fillStyle = '#c8b27a'; for (let i = 0; i < 12; i++) { c.beginPath(); c.ellipse(RR() * w, h * 0.35 + RR() * h * 0.3, 30 + RR() * 60, 20 + RR() * 40, RR() * 3, 0, 7); c.fill(); }
    c.fillStyle = 'rgba(255,255,255,.75)'; for (let i = 0; i < 140; i++) { c.beginPath(); c.ellipse(RR() * w, RR() * h, 20 + RR() * 120, 6 + RR() * 18, RR() * 0.6, 0, 7); c.fill(); }
    c.fillStyle = '#eef3f6'; c.fillRect(0, 0, w, 50); c.fillRect(0, h - 50, w, 50);
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(60, 96, 64), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 })); earth.position.set(0, -72, -20); W.add(earth);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(61.6, 96, 64), new THREE.MeshBasicMaterial({ color: '#7fc4ff', transparent: true, opacity: 0.22, side: THREE.BackSide })); glow.position.copy(earth.position); W.add(glow);
  const sun = new THREE.DirectionalLight('#fff6e8', 3.2); sun.position.set(80, 40, 60); W.add(sun);
  const mtex = K.canvasTex(1024, 512, (c, w, h) => { c.fillStyle = '#b9b5ad'; c.fillRect(0, 0, w, h); const RR = r(11); for (let i = 0; i < 120; i++) { c.fillStyle = `rgba(90,86,80,${0.15 + RR() * 0.35})`; c.beginPath(); c.arc(RR() * w, RR() * h, 4 + RR() * 30, 0, 7); c.fill(); } });
  const moon = new THREE.Mesh(new THREE.SphereGeometry(16, 64, 48), new THREE.MeshStandardMaterial({ map: mtex, roughness: 1 })); moon.position.set(-150, 40, -320); W.add(moon);
  const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 24), new THREE.MeshBasicMaterial({ color: '#fff4d6', fog: false })); sunDisc.position.set(320, 160, 240); W.add(sunDisc);
  return { earth, moon, sunDisc };
});
