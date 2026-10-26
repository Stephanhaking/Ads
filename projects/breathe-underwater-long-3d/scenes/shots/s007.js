// s007 — "Two hundred and fifty." Hero number card.
import { registerShot } from '/engine/api.js';
registerShot('s007', { look: 'clay', ui(U, t, info) { U.stat({ kicker: 'Resting adult', value: '250', label: 'millilitres of oxygen / minute', sub: 'physiology teaching' }, { style: 'hero', at: info.w('two hundred', 0.2) - 0.05 }); } });
