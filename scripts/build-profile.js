// Draws the README's static cards (banner, buttons, numbers, about, projects,
// stack, experience, goals) into assets/ from the PROFILE below. Edit the
// content here, then run:  node scripts/build-profile.js
// The GitHub Stats cards come from update-cards.js instead.

const fs = require("fs");
const path = require("path");
const { FONT, ICONS, delay, icon, svg, card, esc, toLight, lightName, themeReadme } = require("./svg-kit");
const BRANDS = require("./brand-icons");

const ASSETS = path.join(__dirname, "..", "assets");

const PROFILE = {
  name: "Nicolas Alkhoury",
  role: "Full-Stack Developer • AI Toolmaker",
  tagline: "Web apps end to end — front end, back end, and the AI in between.",
  location: "Ottawa, Canada",
  // Shown as a pulsing badge on the banner; also sets the contact card's wording. Set to null to hide.
  availability: "Available for projects",
  email: "info@nicoscript.com",
  buttons: [
    { file: "btn-portfolio.svg", label: "Portfolio", icon: "globe", primary: true },
    { file: "btn-linkedin.svg", label: "LinkedIn", icon: "linkedin" },
    { file: "btn-email.svg", label: "Email me", icon: "mail" },
  ],
  numbers: [
    { icon: "users", value: "2.7M+", label: "Discord bot users" },
    { icon: "folder", value: "50+", label: "projects shipped" },
    { icon: "briefcase", value: "4+ yrs", label: "running NicoScript" },
    { icon: "code", value: "7 yrs", label: "building software" },
  ],
  about: {
    headline: "Self-taught full-stack developer based in Ottawa, Canada.",
    lines: ["I design and ship web apps end to end: front end, back end,", "and the AI automation in between."],
  },
  lists: [
    {
      file: "card-audience.svg",
      icon: "users",
      title: "Who I build for",
      kicker: "AUDIENCE",
      items: [
        "Devs & designers who want smart automation",
        "Content creators & educators",
        "Small businesses looking to scale",
        "My own curiosity and future independence",
      ],
    },
    {
      file: "card-principles.svg",
      icon: "code",
      title: "How I work",
      kicker: "PRINCIPLES",
      items: ["Clarity over cleverness", "Test early, refactor often", "Build with purpose, not hype", "Always be learning"],
    },
  ],
  projects: [
    {
      file: "card-nicoscript-sites.svg",
      icon: "layers",
      name: "NicoScript Sites",
      status: "IN DEVELOPMENT",
      badge: "MAIN FOCUS",
      lines: ["Local business websites with a client-editable", "dashboard, built and managed on one platform."],
      tags: ["Private", "TypeScript"],
    },
    {
      file: "card-toolfurnace.svg",
      icon: "zap",
      name: "ToolFurnace",
      status: "LIVE",
      lines: ["Automated, SEO-optimized AI tools aggregator", "built for passive organic growth."],
      tags: ["AI", "SEO", "Automation"],
      link: "toolfurnace.com",
    },
    {
      file: "card-textconvert.svg",
      icon: "code",
      name: "textConvert",
      status: "OPEN SOURCE",
      lines: ["Dependency-free TypeScript text utilities: PII", "redaction, case conversion, validation, analysis."],
      tags: ["TypeScript", "Zero dependencies"],
      link: "View on GitHub",
    },
    {
      file: "card-self-education.svg",
      icon: "folder",
      name: "Self-Education in CS",
      status: "OPEN SOURCE",
      lines: ["A low-cost, self-paced program to learn", "computer science course by course."],
      tags: ["Curriculum", "Self-paced"],
      link: "View on GitHub",
    },
  ],
  stack: [
    ["FRONTEND", ["React", "Next.js", "TypeScript", "JavaScript", "TailwindCSS"]],
    ["BACKEND", ["Node.js", "Express"]],
    ["DATA", ["PostgreSQL", "MongoDB"]],
    ["TOOLING", ["Git", "VS Code", "ESLint", "Jest", "Cypress", "Storybook"]],
    ["AI", ["AI APIs", "Automation pipelines"]],
  ],
  experience: [
    {
      when: "2022 – Present",
      role: "Owner & Developer",
      org: "NicoScript",
      lines: ["Design and build custom web apps, UI/UX, and performance-tuned sites", "for clients. 50+ projects shipped."],
    },
    {
      when: "2021 – 2022",
      role: "Web Developer",
      org: "Lighthouse Labs",
      lines: ["Completed a 12-week intensive full-stack program covering data", "modelling, testing, and software architecture."],
    },
    {
      when: "2019 – 2022",
      role: "Owner & Developer",
      org: "Rok Commander",
      lines: ["Built and ran a Discord bot that grew to 2.7M+ users. Owned support,", "roadmap, and UX end to end."],
    },
  ],
  goals: [
    "Launch NicoScript Sites and onboard the first clients",
    "Grow ToolFurnace into a self-sustaining traffic engine",
    "Go deeper on API security and AI-driven automation pipelines",
    "Grow NicoScript's client base and my personal brand",
  ],
};

// Matches the original stack card: 40px of padding plus about 9.6px per character at 16px.
const pillWidth = (label) => Math.round(40 + 9.6 * label.length);
const tagWidth = (label) => Math.round(26 + 7.2 * label.length);

// A slanted band of light that crosses the card every few seconds, clipped to its shape.
function sheen({ width, height, rx, band, size, wait, id = "frame", gradient = "sheen" }) {
  return {
    defs: `\n    <clipPath id="${id}"><rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${rx}"/></clipPath>`,
    body: `  <g clip-path="url(#${id})"><g class="shine-${size}"${delay(wait)}><rect x="${-band}" y="0" width="${band}" height="${height}" fill="url(#${gradient})" transform="skewX(-20)"/></g></g>`,
  };
}

const ping = (cx, cy, r, wait, stroke = "#FFFFFF") =>
  `  <circle class="ping"${delay(wait)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="1.5" opacity="0"/>`;

// A brighter pill beside the location, with a live dot, while taking on work.
function availabilityBadge(text) {
  if (!text) return [];
  const width = Math.round(46 + 7.9 * text.length);
  return [
    `  <g class="rise"${delay(950)}>`,
    `    <rect x="438" y="288" width="${width}" height="34" rx="17" fill="#ffffff" fill-opacity="0.1" stroke="#8E8E8E"/>`,
    `    <circle cx="460" cy="305" r="4.5" fill="#FFFFFF"/>`,
    `  ${ping(460, 305, 4.5, 1400)}`,
    `    <text x="476" y="310" ${FONT} font-size="15" font-weight="600" fill="#FFFFFF">${esc(text)}</text>`,
    `  </g>`,
  ];
}

function renderBanner(p) {
  const shine = sheen({ width: 1200, height: 360, rx: 24, band: 300, size: "l", wait: 2600 });
  return svg({
    width: 1200,
    height: 360,
    title: esc(p.name),
    label: `${esc(p.name)}, ${esc(p.role.replace(" • ", " and "))} based in ${esc(p.location)}.`,
    defs: `
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0C0C0C"/>
      <stop offset="0.6" stop-color="#1A1A1A"/>
      <stop offset="1" stop-color="#333333"/>
    </linearGradient>
    <radialGradient id="glowA"><stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowB"><stop offset="0" stop-color="#ffffff" stop-opacity="0.07"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#636363"/></linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3A3A3A"/><stop offset="0.5" stop-color="#D1D1D1"/><stop offset="1" stop-color="#3A3A3A"/></linearGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#ffffff" fill-opacity="0.07"/></pattern>${shine.defs}`,
    body: [
      `  <g clip-path="url(#frame)">`,
      `    <rect width="1200" height="360" fill="url(#bg)"/>`,
      `    <rect width="1200" height="360" fill="url(#dots)"/>`,
      `    <circle class="float" style="animation-duration:9s" cx="1030" cy="60" r="240" fill="url(#glowA)"/>`,
      `    <circle class="float" style="animation-duration:12s;animation-direction:reverse" cx="90" cy="350" r="220" fill="url(#glowB)"/>`,
      `    <text class="float" style="animation-duration:14s" x="1150" y="270" text-anchor="end" font-family="'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace" font-size="200" font-weight="800" fill="#ffffff" fill-opacity="0.045">&lt;/&gt;</text>`,
      `  </g>`,
      `  <circle cx="140" cy="180" r="74" fill="none" stroke="url(#ring)" stroke-width="3"/>`,
      `  <circle cx="140" cy="180" r="62" fill="#0C0C0C"/>`,
      `  <text class="pop"${delay(150)} x="140" y="203" text-anchor="middle" ${FONT} font-size="68" font-weight="800" fill="url(#num)">${esc(p.name[0])}</text>`,
      // A small moon that circles the monogram ring.
      `  <g class="spin" style="transform-origin:140px 180px"><circle cx="140" cy="106" r="10" fill="#FFFFFF" opacity="0.14"/><circle cx="140" cy="106" r="4.5" fill="#F0F0F0"/></g>`,
      `  <text class="fade"${delay(200)} x="250" y="116" ${FONT} font-size="15" font-weight="700" letter-spacing="4" fill="#8E8E8E">HELLO, I'M</text>`,
      `  <text class="rise"${delay(300)} x="250" y="180" ${FONT} font-size="60" font-weight="800" fill="url(#num)">${esc(p.name)}</text>`,
      `  <text class="rise"${delay(480)} x="250" y="224" ${FONT} font-size="27" font-weight="600" fill="#D1D1D1">${esc(p.role)}</text>`,
      `  <text class="rise"${delay(640)} x="250" y="264" ${FONT} font-size="19" fill="#8E8E8E">${esc(p.tagline)}</text>`,
      `  <g class="rise"${delay(800)}>`,
      `    <rect x="250" y="288" width="176" height="34" rx="17" fill="#ffffff" fill-opacity="0.06" stroke="#636363"/>`,
      `    <circle cx="272" cy="305" r="4.5" fill="#D1D1D1"/>`,
      `  ${ping(272, 305, 4.5, 2000, "#D1D1D1")}`,
      `    <text x="288" y="310" ${FONT} font-size="15" fill="#F0F0F0">${esc(p.location)}</text>`,
      `  </g>`,
      ...availabilityBadge(p.availability),
      shine.body,
      `  <g clip-path="url(#frame)"><rect y="352" width="1200" height="8" fill="url(#bar)"/></g>`,
    ],
  });
}

function renderButton(b) {
  const [fg, extraDefs, frame] = b.primary
    ? [
        "#0C0C0C",
        `\n    <linearGradient id="face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D1D1D1"/></linearGradient>
    <linearGradient id="gloss" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.95"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>`,
        `  <rect x="1" y="1" width="188" height="46" rx="24" fill="url(#face)"/>`,
      ]
    : ["#F0F0F0", "", `  <rect x="1" y="1" width="188" height="46" rx="24" fill="#1A1A1A" stroke="#636363" stroke-width="2"/>`];
  const wait = 2000 + 600 * PROFILE.buttons.indexOf(b);
  const shine = sheen({ width: 190, height: 48, rx: 24, band: 60, size: "s", wait, id: "pill", gradient: b.primary ? "gloss" : "sheen" });
  return svg({
    width: 190,
    height: 48,
    title: esc(b.label),
    label: esc(b.label),
    defs: `${extraDefs}${shine.defs}`,
    body: [
      frame,
      `  ${icon(b.icon, 26, 12, 1, fg)}`,
      shine.body,
      `  <text x="62" y="30" ${FONT} font-size="17" font-weight="700" fill="${fg}">${esc(b.label)}</text>`,
      // Pinned to the right edge so every button's arrow lines up, whatever its label.
      `  <text class="nudge" x="166" y="30" text-anchor="end" ${FONT} font-size="17" font-weight="700" fill="${fg}">→</text>`,
    ],
  });
}

function renderNumbers(numbers) {
  const tiles = numbers.flatMap((n, i) => {
    const x = 1 + 305 * i;
    const cx = x + 141.5;
    return [
      `  <g class="rise"${delay(120 * i)}>`,
      `    <rect x="${x}" y="11" width="283" height="148" rx="18" fill="url(#card)" stroke="#3A3A3A" stroke-width="2"/>`,
      `    ${icon(n.icon, cx - 11, 26, 0.9166666666666666)}`,
      `    <text x="${cx}" y="92" text-anchor="middle" ${FONT} font-size="48" font-weight="800" fill="url(#num)">${esc(n.value)}</text>`,
      `    <text x="${cx}" y="128" text-anchor="middle" ${FONT} font-size="17" fill="#8E8E8E">${esc(n.label)}</text>`,
      `  </g>`,
      // A spotlight that walks across the four tiles in turn.
      `  <rect class="spot"${delay(2400 + 900 * i)} x="${x}" y="11" width="283" height="148" rx="18" fill="#FFFFFF" fill-opacity="0.04" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="2" opacity="0"/>`,
    ];
  });
  return svg({
    width: 1200,
    height: 170,
    title: "Nicolas Alkhoury by the numbers",
    label: numbers.map((n) => `${esc(n.value)} ${esc(n.label)}`).join(", "),
    body: tiles,
  });
}

const PANEL = `
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0C0C0C"/>
      <stop offset="1" stop-color="#1A1A1A"/>
    </linearGradient>`;

function renderAbout(a) {
  return svg({
    width: 1200,
    height: 196,
    title: "About Nicolas Alkhoury",
    label: `${esc(a.headline)} ${esc(a.lines.join(" "))}`,
    defs: `${PANEL}
    <linearGradient id="rule" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#636363"/></linearGradient>`,
    body: [
      `  <rect x="1" y="1" width="1198" height="194" rx="22" fill="url(#panel)" stroke="#3A3A3A" stroke-width="2"/>`,
      `  <text x="44" y="140" font-family="Georgia,'Times New Roman',serif" font-size="150" fill="#ffffff" fill-opacity="0.12">“</text>`,
      `  <rect x="120" y="44" width="4" height="108" rx="2" fill="url(#rule)"/>`,
      // A spark of light running down the quote rule.
      `  <rect class="travel" x="119" y="44" width="6" height="26" rx="3" fill="#FFFFFF" opacity="0" filter="url(#soft)">`,
      `    <animate attributeName="y" values="44;126" dur="3.6s" begin="2s" repeatCount="indefinite"/>`,
      `    <animate attributeName="opacity" values="0;0.9;0" dur="3.6s" begin="2s" repeatCount="indefinite"/>`,
      `  </rect>`,
      `  <text class="rise"${delay(100)} x="150" y="88" ${FONT} font-size="27" font-weight="700" fill="#FFFFFF">${esc(a.headline)}</text>`,
      ...a.lines.map((line, i) => `  <text class="rise"${delay(260 + 120 * i)} x="150" y="${126 + 26 * i}" ${FONT} font-size="19" fill="#A1A1A1">${esc(line)}</text>`),
    ],
  });
}

function renderList(list, index) {
  const shine = sheen({ width: 590, height: 274, rx: 20, band: 160, size: "m", wait: 3000 + 1800 * index });
  const items = list.items.flatMap((item, i) => [
    `  <g class="rise"${delay(120 + 110 * i)}>`,
    `    <circle cx="35" cy="${123 + 32 * i}" r="3.5" fill="#FFFFFF"/>`,
    `    <text x="52" y="${128 + 32 * i}" ${FONT} font-size="15.5" fill="#D1D1D1">${esc(item)}</text>`,
    `  </g>`,
    ping(35, 123 + 32 * i, 3.5, 2200 + 650 * i),
  ]);
  return card({
    width: 590,
    height: 274,
    iconName: list.icon,
    title: esc(list.title),
    kicker: list.kicker,
    label: `${esc(list.title)}. ${list.items.map(esc).join("; ")}.`,
    defs: shine.defs,
    body: [...items, shine.body],
  });
}

function renderProject(p, index) {
  const shine = sheen({ width: 590, height: 200, rx: 20, band: 160, size: "m", wait: 2000 + 2600 * index });
  const live = p.status === "LIVE";
  let tagX = 28;
  const tags = p.tags.flatMap((tag) => {
    const w = tagWidth(tag);
    const x = tagX;
    tagX += w + 8;
    return [
      `    <rect class="tag" x="${x}" y="150" width="${w}" height="28" rx="14" fill="#ffffff" fill-opacity="0.06" stroke="#484848"/>`,
      `    <text x="${x + w / 2}" y="168.5" text-anchor="middle" ${FONT} font-size="12" fill="#F0F0F0">${esc(tag)}</text>`,
    ];
  });
  return svg({
    width: 590,
    height: 200,
    title: esc(p.name),
    label: `${esc(p.name)}. ${p.badge ? `${esc(p.badge.toLowerCase())}, ` : ""}${esc(p.status.toLowerCase())}. ${esc(p.lines.join(" "))} ${p.tags.map(esc).join(", ")}.`,
    defs: shine.defs,
    body: [
      `  <rect x="1" y="1" width="588" height="198" rx="20" fill="url(#card)" stroke="#3A3A3A" stroke-width="2"/>`,
      `  <rect x="28" y="28" width="46" height="46" rx="13" fill="#ffffff" fill-opacity="0.06" stroke="#3A3A3A"/>`,
      `  ${icon(p.icon, 39, 39)}`,
      `  <text x="90" y="49" ${FONT} font-size="21" font-weight="700" fill="#FFFFFF">${esc(p.name)}</text>`,
      ...(live
        ? [`  <circle cx="94" cy="64" r="3.5" fill="#FFFFFF"/>`, ping(94, 64, 3.5, 1800), `  <text x="104" y="68" ${FONT} font-size="11" font-weight="700" letter-spacing="2" fill="#D1D1D1">${p.status}</text>`]
        : [`  <text x="90" y="68" ${FONT} font-size="11" font-weight="700" letter-spacing="2" fill="#8E8E8E">${p.status}</text>`]),
      ...(p.badge
        ? [
            `  <rect x="459" y="30" width="103" height="26" rx="13" fill="#FFFFFF"/>`,
            `  <text x="510.5" y="47.5" text-anchor="middle" ${FONT} font-size="11" font-weight="800" letter-spacing="1.5" fill="#0C0C0C">${esc(p.badge)}</text>`,
          ]
        : []),
      `  <line x1="28" x2="562" y1="88" y2="88" stroke="#ffffff" stroke-opacity="0.08"/>`,
      ...p.lines.map((line, i) => `  <text class="desc" x="28" y="${114 + 22 * i}" ${FONT} font-size="15.5" fill="#D1D1D1">${esc(line)}</text>`),
      `  <g class="rise"${delay(200)}>`,
      ...tags,
      `  </g>`,
      ...(p.link
        ? [
            `  <text x="540" y="169" text-anchor="end" ${FONT} font-size="13" font-weight="600" fill="#D1D1D1">${esc(p.link)}</text>`,
            `  <text class="nudge" x="545" y="169" ${FONT} font-size="13" font-weight="600" fill="#D1D1D1">→</text>`,
          ]
        : []),
      shine.body,
    ],
  });
}

// Outline stand-ins where no brand logo fits. VS Code's logo was withdrawn
// from Simple Icons, and the AI items aren't brands.
const STAND_INS = {
  "VS Code": ICONS.code,
  "AI APIs": `<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>`,
  "Automation pipelines": `<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>`,
};

// A 17px logo centred on (cx, cy) inside a round badge. The badge gives solid
// marks (TS, JS, Next.js) and line marks (Express, Cypress) the same footprint,
// like the icon tiles on the other cards.
function logo(item, cx, cy) {
  const size = 17;
  const badge = `<circle class="badge" cx="${cx}" cy="${cy}" r="14" fill="#FFFFFF" fill-opacity="0.09" stroke="#FFFFFF" stroke-opacity="0.14"/>`;
  const place = `transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${(size / 24).toFixed(4)})"`;
  if (BRANDS[item]) return `${badge}<g class="logo" ${place} fill="#F0F0F0"><path d="${BRANDS[item]}"/></g>`;
  if (STAND_INS[item]) {
    return `${badge}<g class="logo" ${place} fill="none" stroke="#F0F0F0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${STAND_INS[item]}</g>`;
  }
  throw new Error(`No logo for "${item}": add it to scripts/brand-icons.js or STAND_INS`);
}

function renderStack(stack) {
  const rows = stack.flatMap(([label, items], r) => {
    const y = 30 + 60 * r;
    let x = 230;
    const pills = items.flatMap((item, c) => {
      // The label keeps its old padding; the logo adds 24px on the left.
      const w = pillWidth(item) + 24;
      const at = x;
      x += w + 12;
      return [
        `  <g class="rise"${delay(80 * r + 60 * c)}>`,
        `    <rect x="${at}" y="${y}" width="${w}" height="40" rx="20" fill="#262626" stroke="#484848"/>`,
        `    ${logo(item, at + 22, y + 20)}`,
        `    <text x="${at + w / 2 + 12}" y="${y + 25.5}" text-anchor="middle" ${FONT} font-size="16" font-weight="600" fill="#F0F0F0">${esc(item)}</text>`,
        `  </g>`,
        // A wave of light that runs left to right across every row.
        `  <rect class="spot"${delay(2400 + ((at - 230) / 700) * 1600)} x="${at}" y="${y}" width="${w}" height="40" rx="20" fill="#FFFFFF" fill-opacity="0.07" stroke="#FFFFFF" stroke-opacity="0.7" opacity="0"/>`,
      ];
    });
    return [`  <text x="48" y="${y + 25}" ${FONT} font-size="14" font-weight="800" letter-spacing="3" fill="#8E8E8E">${label}</text>`, ...pills];
  });
  return svg({
    width: 1200,
    height: 340,
    title: "Tech stack",
    label: `Tech stack. ${stack.map(([label, items]) => `${label[0]}${label.slice(1).toLowerCase()}: ${items.map(esc).join(", ")}`).join(". ")}.`,
    defs: PANEL,
    body: [`  <rect x="1" y="1" width="1198" height="338" rx="22" fill="url(#panel)" stroke="#3A3A3A" stroke-width="2"/>`, ...rows],
  });
}

function renderExperience(jobs) {
  const step = 104;
  const last = 42 + step * (jobs.length - 1);
  const entries = jobs.flatMap((job, i) => {
    const y = 42 + step * i;
    const current = i === 0;
    return [
      current
        ? `  <circle cx="262" cy="${y}" r="7" fill="#FFFFFF"/>`
        : `  <circle cx="262" cy="${y}" r="6" fill="#1A1A1A" stroke="#8E8E8E" stroke-width="2"/>`,
      ...(current ? [ping(262, y, 7, 1600)] : []),
      `  <g class="rise"${delay(250 + 220 * i)}>`,
      `    <text x="48" y="${y + 6}" ${FONT} font-size="16" font-weight="700" fill="${current ? "#FFFFFF" : "#D1D1D1"}">${esc(job.when)}</text>`,
      `    <text x="296" y="${y + 6}" ${FONT} font-size="19" font-weight="700" fill="#FFFFFF">${esc(job.role)} <tspan fill="#8E8E8E" font-weight="600">·  ${esc(job.org)}</tspan></text>`,
      ...job.lines.map((line, j) => `    <text x="296" y="${y + 34 + 21 * j}" ${FONT} font-size="15" fill="#A1A1A1">${esc(line)}</text>`),
      `  </g>`,
    ];
  });
  // A pulse of light that runs down the timeline, from now into the past.
  const pulse = (r, opacity) =>
    `  <circle class="travel" cx="262" cy="42" r="${r}" fill="#FFFFFF" opacity="0"><animate attributeName="cy" values="42;${last}" dur="3.4s" begin="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;${opacity};${opacity};0" keyTimes="0;0.15;0.8;1" dur="3.4s" begin="2.2s" repeatCount="indefinite"/></circle>`;
  return svg({
    width: 1200,
    height: 356,
    title: "Experience",
    label: `Experience. ${jobs.map((j) => `${esc(j.when)}: ${esc(j.role)}, ${esc(j.org)}. ${esc(j.lines.join(" "))}`).join(" ")}`,
    defs: PANEL,
    body: [
      `  <rect x="1" y="1" width="1198" height="354" rx="22" fill="url(#panel)" stroke="#3A3A3A" stroke-width="2"/>`,
      `  <line class="day" style="transform-origin:top;animation-duration:1.2s" x1="262" y1="42" x2="262" y2="${last}" stroke="#484848" stroke-width="2"/>`,
      pulse(9, 0.18),
      pulse(3.5, 1),
      ...entries,
    ],
  });
}

// No header of its own: the README's "2026 Goals" heading sits right above it.
function renderGoals(goals) {
  const rows = goals.flatMap((goal, i) => {
    const y = 24 + 58 * i;
    return [
      `  <g class="goal"${delay(150 + 120 * i)}>`,
      `    <rect x="28" y="${y}" width="1144" height="46" rx="14" fill="#ffffff" fill-opacity="0.03" stroke="#3A3A3A"/>`,
      `    <text x="52" y="${y + 30}" ${FONT} font-size="17" font-weight="800" fill="url(#num)">${String(i + 1).padStart(2, "0")}</text>`,
      `    <text x="96" y="${y + 29}" ${FONT} font-size="16.5" fill="#D1D1D1">${esc(goal)}</text>`,
      `    <circle cx="1144" cy="${y + 23}" r="9" fill="none" stroke="#636363" stroke-width="2"/>`,
      `  </g>`,
      `  <rect class="spot"${delay(2400 + 900 * i)} x="28" y="${y}" width="1144" height="46" rx="14" fill="#FFFFFF" fill-opacity="0.04" stroke="#FFFFFF" stroke-opacity="0.5" opacity="0"/>`,
    ];
  });
  const height = 36 + 58 * goals.length;
  return svg({
    width: 1200,
    height,
    title: "2026 goals",
    label: `2026 goals: ${goals.map(esc).join("; ")}`,
    defs: PANEL,
    body: [`  <rect x="1" y="1" width="1198" height="${height - 2}" rx="22" fill="url(#panel)" stroke="#3A3A3A" stroke-width="2"/>`, ...rows],
  });
}

// The closing call to action. The README links the whole card to your email.
function renderContact(p) {
  const [kicker, headline, line] = p.availability
    ? ["LET'S WORK TOGETHER", "Have a project in mind?", "I design and build web apps end to end. Tell me what you're working on."]
    : ["GET IN TOUCH", "Let's talk", "Questions, ideas or just saying hi: my inbox is open."];
  const shine = sheen({ width: 1200, height: 220, rx: 22, band: 300, size: "l", wait: 2200 });
  const button = { x: 812, y: 82, w: 344, h: 56 };
  return svg({
    width: 1200,
    height: 220,
    title: "Get in touch",
    label: `${esc(headline)} Email ${esc(p.email)}`,
    defs: `${PANEL}${shine.defs}`,
    body: [
      `  <rect x="1" y="1" width="1198" height="218" rx="22" fill="url(#panel)" stroke="#3A3A3A" stroke-width="2"/>`,
      `  <circle cx="52" cy="62" r="4.5" fill="#FFFFFF"/>`,
      ping(52, 62, 4.5, 1200),
      `  <text class="fade" x="68" y="67" ${FONT} font-size="12" font-weight="700" letter-spacing="3" fill="#8E8E8E">${esc(kicker)}</text>`,
      `  <text class="rise"${delay(150)} x="44" y="122" ${FONT} font-size="38" font-weight="800" fill="url(#num)">${esc(headline)}</text>`,
      `  <text class="rise"${delay(300)} x="44" y="160" ${FONT} font-size="18" fill="#A1A1A1">${esc(line)}</text>`,
      `  <g class="rise"${delay(450)}>`,
      `    <rect x="${button.x}" y="${button.y}" width="${button.w}" height="${button.h}" rx="28" fill="#FFFFFF"/>`,
      `    ${icon("mail", button.x + 26, button.y + 16, 1, "#0C0C0C")}`,
      `    <text x="${button.x + 62}" y="${button.y + 35}" ${FONT} font-size="19" font-weight="700" fill="#0C0C0C">${esc(p.email)}</text>`,
      `    <text class="nudge" x="${button.x + button.w - 26}" y="${button.y + 35}" text-anchor="end" ${FONT} font-size="19" font-weight="700" fill="#0C0C0C">→</text>`,
      `  </g>`,
      shine.body,
    ],
  });
}

function buildCards(p) {
  return [
    ["banner.svg", renderBanner(p)],
    ...p.buttons.map((b) => [b.file, renderButton(b)]),
    ["stats.svg", renderNumbers(p.numbers)],
    ["about-intro.svg", renderAbout(p.about)],
    ...p.lists.map((list, i) => [list.file, renderList(list, i)]),
    ...p.projects.map((project, i) => [project.file, renderProject(project, i)]),
    ["stack.svg", renderStack(p.stack)],
    ["experience.svg", renderExperience(p.experience)],
    ["goals.svg", renderGoals(p.goals)],
    ["contact.svg", renderContact(p)],
  ];
}

if (require.main === module) {
  const cards = buildCards(PROFILE);
  for (const [file, content] of cards) {
    fs.writeFileSync(path.join(ASSETS, file), content);
    fs.writeFileSync(path.join(ASSETS, lightName(file)), toLight(content));
  }
  const readmePath = path.join(ASSETS, "..", "README.md");
  fs.writeFileSync(readmePath, themeReadme(fs.readFileSync(readmePath, "utf8"), cards.map(([file]) => file)));
  console.log("Built the README cards in assets/");
}

module.exports = { PROFILE, pillWidth, buildCards, renderProject, renderGoals, renderButton };
