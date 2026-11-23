// Shared look and motion for every README card: the fonts, icons, card
// frame and animation styles used by update-cards.js and build-profile.js.

const FONT = `font-family="'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif"`;

// Feather icon bodies, drawn on a 24x24 grid.
const ICONS = {
  activity: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
  barChart: `<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>`,
  box: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`,
  clock: `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  code: `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
  calendar: `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  zap: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
  award: `<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>`,
  commit: `<circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/>`,
  pullRequest: `<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/>`,
  issue: `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,
  review: `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,
  star: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  repo: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>`,
  users: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  layers: `<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>`,
  folder: `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>`,
  briefcase: `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
  target: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
  globe: `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
  linkedin: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>`,
  mail: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/>`,
};

const GRADIENTS = `
    <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1A1A1A"/>
      <stop offset="1" stop-color="#262626"/>
    </linearGradient>
    <linearGradient id="num" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#A1A1A1"/>
    </linearGradient>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.09"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>`;

// The intro plays once when the README loads; README images can't tell when
// they scroll into view, so the beam, comet, clock hand and glows keep moving
// after it. Intro animations only set a starting state, so with motion
// reduced every element shows its final state and the moving extras hide.
const MOTION = `
  <style>
    @keyframes rise { from { opacity: 0; transform: translateY(14px); } }
    @keyframes fade { from { opacity: 0; } }
    @keyframes draw { from { stroke-dashoffset: 1; } }
    @keyframes sweep { 0% { stroke-dasharray: 0 100; opacity: 0; } 8% { opacity: 1; } }
    @keyframes grow { from { transform: scaleY(0); } }
    @keyframes pop { 0% { opacity: 0; transform: scale(0); } 70% { transform: scale(1.3); } }
    @keyframes pulse { 50% { opacity: 0.45; } }
    .rise, .tile, .building, .goal, .repo { animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    .fade, .segment, .hour { animation: fade 0.6s ease-out both; }
    .line { animation: draw 1.8s cubic-bezier(0.45, 0, 0.2, 1) both; }
    .progress { animation: sweep 1.5s cubic-bezier(0.45, 0, 0.2, 1) 0.3s both; }
    .day { transform-box: fill-box; transform-origin: bottom; animation: grow 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    .pop { transform-box: fill-box; transform-origin: center; animation: pop 0.5s ease-out both; }
    .pulse { animation: pulse 2.4s ease-in-out 2s infinite; }
    @keyframes beam { 70%, 100% { transform: translateX(1700px); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes breathe { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.75; } }
    .beam { animation: beam 8s ease-in-out 2.4s infinite; }
    .hand { transform-box: view-box; transform-origin: 210px 216px; animation: spin 10s linear infinite; }
    .glow { animation: breathe 3.2s ease-in-out infinite; }
    @keyframes shine-s { 30%, 100% { transform: translateX(290px); } }
    @keyframes shine-m { 25%, 100% { transform: translateX(860px); } }
    @keyframes shine-l { 25%, 100% { transform: translateX(1680px); } }
    @keyframes nudge { 0%, 60%, 100% { transform: translateX(0); } 70% { transform: translateX(5px); } 80% { transform: translateX(0); } 90% { transform: translateX(3px); } }
    @keyframes ping { 0% { opacity: 0.7; transform: scale(1); } 80%, 100% { opacity: 0; transform: scale(2.8); } }
    @keyframes spot { 0%, 100% { opacity: 0; } 8% { opacity: 1; } 22% { opacity: 0; } }
    @keyframes float { 50% { transform: translateY(-10px); } }
    .shine-s { animation: shine-s 6s ease-in-out infinite both; }
    .shine-m { animation: shine-m 11s ease-in-out infinite both; }
    .shine-l { animation: shine-l 10s ease-in-out infinite both; }
    .nudge { animation: nudge 3.5s ease-in-out 2s infinite; }
    .ping { transform-box: fill-box; transform-origin: center; animation: ping 2.6s ease-out infinite; }
    .spot { animation: spot 9s ease-in-out infinite; }
    .float { animation: float 8s ease-in-out infinite; }
    .spin { transform-box: view-box; animation: spin 16s linear infinite; }
    @media (prefers-reduced-motion: reduce) { .hand, .comet, .beam { display: none; } .travel, .spin, .ping, .spot { display: none; } * { animation: none !important; } }
  </style>`;

const delay = (ms) => ` style="animation-delay:${Math.round(ms)}ms"`;

const icon = (name, x, y, scale = 1, stroke = "#FFFFFF", extra = "") =>
  `<g${extra} transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</g>`;

function svg({ width, height, title, label, defs = "", body }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}">
  <title>${title}</title>
  <defs>${GRADIENTS}${defs}
  </defs>${MOTION}
${body.join("\n")}
</svg>
`;
}

// The card frame and header shared with the About and Projects cards.
function card({ width, height, iconName, title, kicker, label, defs, aside = [], body }) {
  return svg({
    width,
    height,
    title,
    label,
    defs,
    body: [
      `  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="20" fill="url(#card)" stroke="#3A3A3A" stroke-width="2"/>`,
      `  <rect x="28" y="28" width="46" height="46" rx="13" fill="#ffffff" fill-opacity="0.06" stroke="#3A3A3A"/>`,
      `  ${icon(iconName, 39, 39)}`,
      `  <text x="90" y="49" ${FONT} font-size="21" font-weight="700" fill="#FFFFFF">${title}</text>`,
      `  <text x="90" y="68" ${FONT} font-size="11" font-weight="700" letter-spacing="2" fill="#8E8E8E">${kicker}</text>`,
      `  <line x1="28" x2="${width - 28}" y1="92" y2="92" stroke="#ffffff" stroke-opacity="0.08"/>`,
      ...aside,
      ...body,
    ],
  });
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// ---------- Light mode ----------

// Every card is drawn in grays only, so a light version is a remap of each
// gray: dark surfaces to near-white, white marks to near-black, mid-grays to
// GitHub-like light-theme tones that keep text above 4.5:1. Points are
// [dark gray, light gray], interpolated in between.
const LIGHT_STOPS = [
  [0x0c, 0xff],
  [0x1a, 0xf6],
  [0x26, 0xee],
  [0x33, 0xe1],
  [0x3a, 0xd0],
  [0x48, 0xc4],
  [0x63, 0xa3],
  [0x6e, 0x91],
  [0x8e, 0x59],
  [0xa1, 0x48],
  [0xd1, 0x31],
  [0xf0, 0x1f],
  [0xff, 0x1a],
];

function lightGray(g) {
  if (g <= LIGHT_STOPS[0][0]) return LIGHT_STOPS[0][1];
  for (let i = 1; i < LIGHT_STOPS.length; i++) {
    const [x1, y1] = LIGHT_STOPS[i];
    const [x0, y0] = LIGHT_STOPS[i - 1];
    if (g <= x1) return y0 + ((g - x0) * (y1 - y0)) / (x1 - x0);
  }
  return LIGHT_STOPS.at(-1)[1];
}

function toLight(svg) {
  return svg.replace(/#([0-9a-fA-F]{6})\b/g, (match, hex) => {
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    if (r !== g || g !== b) return match;
    const v = Math.round(lightGray(r)).toString(16).padStart(2, "0").toUpperCase();
    return `#${v}${v}${v}`;
  });
}

const lightName = (file) => file.replace(/\.svg$/, "-light.svg");

// Wraps each card's <img> in a <picture> whose light-theme source is its
// -light twin. Cards already wrapped are left alone, so it is safe to rerun.
function themeReadme(readme, files) {
  let out = readme;
  for (const file of files) {
    const light = lightName(file);
    if (out.includes(`srcset="assets/${light}"`)) continue;
    const pattern = new RegExp(`<img src="assets/${file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`);
    out = out.replace(pattern, (img) => `<picture><source media="(prefers-color-scheme: light)" srcset="assets/${light}">${img}</picture>`);
  }
  return out;
}

module.exports = { FONT, ICONS, GRADIENTS, MOTION, delay, icon, svg, card, esc, toLight, lightName, themeReadme };
