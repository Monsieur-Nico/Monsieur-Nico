// Regenerates the GitHub Stats cards (streak, skyline, contribution chart,
// coding rhythm, activity, languages) in assets/ and their alt text in
// README.md from your GitHub data, private repos included.
// Needs the GitHub CLI, signed in:  node scripts/update-cards.js
// Runs daily from .github/workflows/update-cards.yml.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const ASSETS = path.join(ROOT, "assets");
const README_PATH = path.join(ROOT, "README.md");

const COLORS = ["#FFFFFF", "#E5E5E5", "#D1D1D1", "#B4B4B4", "#A1A1A1", "#8E8E8E", "#6E6E6E", "#585858"];
const FONT = `font-family="'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif"`;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_MS = 86400000;

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
};

// ---------- GitHub data ----------

function gh(query, vars = {}) {
  const args = ["api", "graphql", "-f", `query=${query}`];
  for (const [key, value] of Object.entries(vars)) args.push("-f", `${key}=${value}`);
  const out = execFileSync("gh", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return JSON.parse(out).data;
}

const REPOS_QUERY = `
query($endCursor: String) {
  viewer {
    repositories(first: 100, after: $endCursor, ownerAffiliations: OWNER, isFork: false) {
      pageInfo { hasNextPage endCursor }
      nodes { isPrivate stargazerCount languages(first: 20, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name } } } }
    }
  }
}`;

const PROFILE_QUERY = `
query {
  viewer {
    id
    followers { totalCount }
    pullRequests { totalCount }
    issues { totalCount }
    contributionsCollection { contributionYears }
  }
}`;

const YEAR_QUERY = `
query($from: DateTime!, $to: DateTime!) {
  viewer {
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestReviewContributions
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
    }
  }
}`;

const COMMIT_REPOS_QUERY = `
query($from: DateTime!, $to: DateTime!) {
  viewer {
    contributionsCollection(from: $from, to: $to) {
      commitContributionsByRepository(maxRepositories: 100) { repository { name owner { login } } }
    }
  }
}`;

// GitTimestamp keeps the author's own UTC offset, so the hour is their local time.
const HISTORY_QUERY = `
query($owner: String!, $name: String!, $since: GitTimestamp!, $author: ID!, $endCursor: String) {
  repository(owner: $owner, name: $name) {
    defaultBranchRef {
      target {
        ... on Commit {
          history(first: 100, after: $endCursor, since: $since, author: { id: $author }) {
            pageInfo { hasNextPage endCursor }
            nodes { authoredDate }
          }
        }
      }
    }
  }
}`;

function fetchRepos() {
  const repos = [];
  let cursor = null;
  do {
    const page = gh(REPOS_QUERY, cursor ? { endCursor: cursor } : {}).viewer.repositories;
    repos.push(...page.nodes);
    cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (cursor);
  return repos;
}

// The API serves contributions at most one year at a time.
function fetchYear(year, now) {
  const to = year === now.getUTCFullYear() ? now.toISOString() : `${year}-12-31T23:59:59Z`;
  return gh(YEAR_QUERY, { from: `${year}-01-01T00:00:00Z`, to }).viewer.contributionsCollection;
}

// Author timestamps of your default-branch commits over the last year, in every repo you committed to.
function fetchCommitTimes(authorId, now) {
  const from = new Date(now.getTime() - 365 * DAY_MS).toISOString();
  const repos = gh(COMMIT_REPOS_QUERY, { from, to: now.toISOString() })
    .viewer.contributionsCollection.commitContributionsByRepository.map((c) => c.repository);
  const times = [];
  for (const repo of repos) {
    let cursor = null;
    do {
      const vars = { owner: repo.owner.login, name: repo.name, since: from, author: authorId };
      if (cursor) vars.endCursor = cursor;
      const branch = gh(HISTORY_QUERY, vars).repository?.defaultBranchRef;
      if (!branch) break;
      const history = branch.target.history;
      times.push(...history.nodes.map((n) => n.authoredDate));
      cursor = history.pageInfo.hasNextPage ? history.pageInfo.endCursor : null;
    } while (cursor);
  }
  return times;
}

function collectStats(now) {
  const repos = fetchRepos();
  assertPrivateVisible(repos);
  const profile = gh(PROFILE_QUERY).viewer;
  const years = profile.contributionsCollection.contributionYears;
  const collections = years.map((year) => fetchYear(year, now));

  const byDate = new Map();
  for (const c of collections) {
    for (const week of c.contributionCalendar.weeks) {
      for (const day of week.contributionDays) byDate.set(day.date, day.contributionCount);
    }
  }
  const days = [...byDate].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }));
  const sum = (pick) => collections.reduce((acc, c) => acc + pick(c), 0);

  return {
    days,
    rhythm: commitRhythm(fetchCommitTimes(profile.id, now)),
    langs: topLanguages(repos),
    activity: {
      commits: sum((c) => c.totalCommitContributions),
      prs: profile.pullRequests.totalCount,
      issues: profile.issues.totalCount,
      reviews: sum((c) => c.totalPullRequestReviewContributions),
      stars: repos.reduce((acc, r) => acc + r.stargazerCount, 0),
      repos: repos.length,
      followers: profile.followers.totalCount,
    },
    streak: {
      contributions: sum((c) => c.contributionCalendar.totalContributions),
      firstYear: Math.min(...years),
      ...streaks(days),
    },
  };
}

// Stops a token without private access from quietly rewriting the cards with public-only numbers.
function assertPrivateVisible(repos) {
  if (!repos.some((repo) => repo.isPrivate)) {
    throw new Error("No private repos visible: the token needs read access to all your repositories");
  }
}

// ---------- Calculations ----------

function topLanguages(repos, count = COLORS.length) {
  const totals = {};
  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      totals[edge.node.name] = (totals[edge.node.name] || 0) + edge.size;
    }
  }
  const top = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, count);
  const sum = top.reduce((acc, [, size]) => acc + size, 0);
  return top.map(([name, size]) => ({ name, share: size / sum, pct: `${((100 * size) / sum).toFixed(1)}%` }));
}

const NO_STREAK = { length: 0, start: null, end: null };

// `days` is sorted oldest first and ends today. Today without contributions
// yet does not break the streak; it is only over once a whole day is missed.
function streaks(days) {
  const runEndingAt = (i) => {
    if (i < 0 || days[i].count === 0) return NO_STREAK;
    let start = i;
    while (start > 0 && days[start - 1].count > 0) start--;
    return { length: i - start + 1, start: days[start].date, end: days[i].date };
  };

  let longest = NO_STREAK;
  for (let i = 0; i < days.length; i++) {
    const run = runEndingAt(i);
    if (run.length && run.length >= longest.length) longest = run;
  }

  const last = days.length - 1;
  const current = last >= 0 && days[last].count === 0 ? runEndingAt(last - 1) : runEndingAt(last);
  return { current, longest };
}

// The grading used by github-readme-stats (MIT): each total is scored against
// a typical GitHub user's median, weighted, and mapped to a percentile.
function rank({ commits, prs, issues, reviews, stars, followers }) {
  const exponential = (x) => 1 - 2 ** -x;
  const logNormal = (x) => x / (1 + x);
  const parts = [
    [2, exponential(commits / 1000)],
    [3, exponential(prs / 50)],
    [1, exponential(issues / 25)],
    [1, exponential(reviews / 2)],
    [4, logNormal(stars / 50)],
    [1, logNormal(followers / 10)],
  ];
  const weight = parts.reduce((acc, [w]) => acc + w, 0);
  const percentile = 100 * (1 - parts.reduce((acc, [w, score]) => acc + w * score, 0) / weight);
  const thresholds = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  const levels = ["S", "A+", "A", "A-", "B+", "B", "B-", "C+", "C"];
  return { level: levels[thresholds.findIndex((t) => percentile <= t)], percentile };
}

// Sums the last `count` full weeks, the final one ending on the last day.
function weeklyTotals(days, count = 52) {
  const recent = days.slice(-count * 7);
  const weeks = [];
  for (let i = recent.length % 7; i < recent.length; i += 7) {
    const week = recent.slice(i, i + 7);
    weeks.push({ start: week[0].date, total: week.reduce((acc, d) => acc + d.count, 0) });
  }
  return weeks;
}

// Rounds an axis maximum up to a value whose half is also a clean number.
function niceMax(value) {
  if (value <= 4) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((s) => s * magnitude >= value);
  return step * magnitude;
}

const weekdayOf = (iso) => new Date(`${iso.slice(0, 10)}T00:00:00Z`).getUTCDay(); // 0 = Sunday

// Counts commits per local hour (0-23) and per weekday, Monday first.
function commitRhythm(timestamps) {
  const hours = Array(24).fill(0);
  const weekdays = Array(7).fill(0);
  for (const ts of timestamps) {
    hours[Number(ts.slice(11, 13))]++;
    weekdays[(weekdayOf(ts) + 6) % 7]++;
  }
  return { hours, weekdays };
}

const argmax = (values) => values.reduce((best, v, i) => (v > values[best] ? i : best), 0);

// Names the part of the day you code most, judged on a 3-hour window so one odd hour can't decide it.
function persona(hours, weekdays) {
  const smoothed = hours.map((_, h) => hours[(h + 23) % 24] + hours[h] + hours[(h + 1) % 24]);
  const window = argmax(smoothed);
  const title =
    window >= 5 && window < 10 ? "Early bird"
    : window >= 10 && window < 17 ? "Daytime builder"
    : window >= 17 && window < 22 ? "Evening coder"
    : "Night owl";
  return { title, peakHour: argmax(hours), busiestDay: WEEKDAYS[argmax(weekdays)] };
}

const formatHour = (h) => `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? "AM" : "PM"}`;

// Lays out the last 53 calendar weeks as columns, Sunday to Saturday as rows.
function skylineCells(days) {
  const start = days.length - 1 - weekdayOf(days.at(-1).date) - 52 * 7;
  const offset = Math.max(0, -start);
  return days.slice(Math.max(0, start)).map((d, i) => ({
    col: Math.floor((i + offset) / 7),
    row: (i + offset) % 7,
    date: d.date,
    count: d.count,
  }));
}

function formatDate(iso, thisYear) {
  const [year, month, day] = iso.split("-").map(Number);
  const short = `${MONTHS[month - 1]} ${day}`;
  return year === thisYear ? short : `${short}, ${year}`;
}

function formatRange(start, end, thisYear) {
  if (!start) return "No active streak";
  if (start === end) return formatDate(start, thisYear);
  return `${formatDate(start, thisYear)} – ${formatDate(end, thisYear)}`;
}

const formatNumber = (n) => n.toLocaleString("en-US");
const formatDays = (n) => `${formatNumber(n)} ${n === 1 ? "day" : "days"}`;
const gray = (level) => {
  const hex = Math.round(Math.max(0, Math.min(255, level))).toString(16).padStart(2, "0").toUpperCase();
  return `#${hex}${hex}${hex}`;
};

// ---------- Rendering ----------

const GRADIENTS = `
    <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1A1A1A"/>
      <stop offset="1" stop-color="#262626"/>
    </linearGradient>
    <linearGradient id="num" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#A1A1A1"/>
    </linearGradient>`;

// Plays once when the README loads. Every animation only sets a starting
// state, so with motion reduced each element simply shows its final state.
const MOTION = `
  <style>
    @keyframes rise { from { opacity: 0; transform: translateY(14px); } }
    @keyframes fade { from { opacity: 0; } }
    @keyframes draw { from { stroke-dashoffset: 1; } }
    @keyframes sweep { 0% { stroke-dasharray: 0 100; opacity: 0; } 8% { opacity: 1; } }
    @keyframes grow { from { transform: scaleY(0); } }
    @keyframes pop { 0% { opacity: 0; transform: scale(0); } 70% { transform: scale(1.3); } }
    @keyframes pulse { 50% { opacity: 0.45; } }
    .rise, .tile, .building { animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    .fade, .segment, .hour { animation: fade 0.6s ease-out both; }
    .line { animation: draw 1.8s cubic-bezier(0.45, 0, 0.2, 1) both; }
    .progress { animation: sweep 1.5s cubic-bezier(0.45, 0, 0.2, 1) 0.3s both; }
    .day { transform-box: fill-box; transform-origin: bottom; animation: grow 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    .pop { transform-box: fill-box; transform-origin: center; animation: pop 0.5s ease-out both; }
    .pulse { animation: pulse 2.4s ease-in-out 2s infinite; }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
  </style>`;

const delay = (ms) => ` style="animation-delay:${Math.round(ms)}ms"`;

const icon = (name, x, y, scale = 1, stroke = "#FFFFFF", extra = "") =>
  `<g${extra} transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</g>`;

// A ring drawn clockwise from 12 o'clock, filled to `share` (0 to 1).
function ring({ cx, cy, r, width, share }) {
  const pct = Math.max(0, Math.min(1, share)) * 100;
  return [
    `  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="${width}"/>`,
    `  <circle class="progress" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#F0F0F0" stroke-width="${width}" stroke-linecap="round" pathLength="100" stroke-dasharray="${pct.toFixed(2)} ${(100 - pct).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"/>`,
  ];
}

function svg({ width, height, title, label, defs = "", body }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}">
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

// The big figure and caption at the right end of a full-width card's header.
const headerFigure = (width, value, caption) => [
  `  <text class="rise" x="${width - 28}" y="56" text-anchor="end" ${FONT} font-size="30" font-weight="800" fill="url(#num)">${value}</text>`,
  `  <text class="rise"${delay(120)} x="${width - 28}" y="75" text-anchor="end" ${FONT} font-size="12.5" fill="#8E8E8E">${caption}</text>`,
];

const activityItems = (a) => [
  ["commit", a.commits, "Commits"],
  ["pullRequest", a.prs, "Pull requests"],
  ["issue", a.issues, "Issues"],
  ["review", a.reviews, "Code reviews"],
  ["star", a.stars, "Stars earned"],
  ["repo", a.repos, "Repositories"],
];

function renderActivitySvg(a) {
  const { level, percentile } = rank(a);
  const rows = activityItems(a).map(([iconName, value, label], i) => {
    const y = 129 + 25 * i;
    return [
      `  <g class="rise"${delay(80 * i)}>`,
      `    ${icon(iconName, 28, y - 13, 0.6667, "#8E8E8E")}`,
      `    <text x="54" y="${y}" ${FONT} font-size="15" fill="#D1D1D1">${label}</text>`,
      `    <text x="336" y="${y}" text-anchor="end" ${FONT} font-size="16" font-weight="700" fill="#FFFFFF">${formatNumber(value)}</text>`,
      `  </g>`,
    ].join("\n");
  });
  const summary = activityItems(a).map(([, value, label]) => `${formatNumber(value)} ${label.toLowerCase()}`).join(", ");
  return card({
    width: 590,
    height: 274,
    iconName: "activity",
    title: "GitHub activity",
    kicker: "ALL TIME",
    label: `GitHub activity, all time: ${summary}. Rank ${level}, top ${percentile.toFixed(0)}%`,
    body: [
      ...rows,
      `  <line x1="372" x2="372" y1="114" y2="252" stroke="#ffffff" stroke-opacity="0.08"/>`,
      ...ring({ cx: 467, cy: 172, r: 54, width: 11, share: (100 - percentile) / 100 }),
      `  <text class="pop"${delay(1500)} x="467" y="186" text-anchor="middle" ${FONT} font-size="38" font-weight="800" fill="url(#num)">${level}</text>`,
      `  <text class="fade"${delay(1700)} x="467" y="254" text-anchor="middle" ${FONT} font-size="11" font-weight="700" letter-spacing="2" fill="#8E8E8E">TOP ${percentile.toFixed(0)}%</text>`,
    ],
  });
}

function renderLanguagesSvg(langs) {
  const [cx, cy, r, width] = [124, 182, 60, 20];
  const gap = langs.length > 1 ? 0.8 : 0;
  let offset = 0;
  const segments = langs.map((l, i) => {
    const pct = l.share * 100;
    const dash = Math.max(pct - gap, 0.2);
    const segment = `  <circle class="segment"${delay(150 + 140 * i)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${COLORS[i]}" stroke-width="${width}" pathLength="100" stroke-dasharray="${dash.toFixed(2)} ${(100 - dash).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"/>`;
    offset += pct;
    return segment;
  });
  const columns = [240, 408];
  const legend = langs.map((l, i) => {
    const x = columns[Math.floor(i / 4)];
    const y = 134 + 34 * (i % 4);
    return [
      `  <g class="rise"${delay(200 + 90 * i)}>`,
      `    <rect class="swatch" x="${x}" y="${y - 10}" width="11" height="11" rx="3" fill="${COLORS[i]}"/>`,
      `    <text x="${x + 19}" y="${y}" ${FONT} font-size="14.5" fill="#D1D1D1">${l.name} <tspan fill="#8E8E8E">${l.pct}</tspan></text>`,
      `  </g>`,
    ].join("\n");
  });
  const top = langs[0];
  return card({
    width: 590,
    height: 274,
    iconName: "code",
    title: "Most used languages",
    kicker: "BY CODE SIZE",
    label: `Most used languages: ${langs.map((l) => `${l.name} ${l.pct}`).join(", ")}`,
    body: [
      ...segments,
      ...(top
        ? [
            `  <text class="pop"${delay(1200)} x="${cx}" y="${cy + 6}" text-anchor="middle" ${FONT} font-size="24" font-weight="800" fill="url(#num)">${Math.round(top.share * 100)}%</text>`,
            `  <text class="fade"${delay(1300)} x="${cx}" y="${cy + 24}" text-anchor="middle" ${FONT} font-size="11.5" fill="#8E8E8E">${top.name}</text>`,
          ]
        : []),
      ...legend,
    ],
  });
}

function renderStreakSvg(s, thisYear) {
  const frame = (x) => `    <rect x="${x}" y="11" width="384" height="172" rx="18" fill="url(#card)" stroke="#3A3A3A" stroke-width="2"/>`;
  const text = (cx, y, size, fill, content, weight = "") =>
    `    <text x="${cx}" y="${y}" text-anchor="middle" ${FONT} font-size="${size}"${weight ? ` font-weight="${weight}"` : ""} fill="${fill}">${content}</text>`;
  const side = (x, wait, iconName, value, label, note) => {
    const cx = x + 192;
    return [
      `  <g class="tile"${delay(wait)}>`,
      frame(x),
      `    ${icon(iconName, cx - 11, 34, 0.9166666666666666)}`,
      text(cx, 106, 42, "url(#num)", value, "800"),
      text(cx, 142, 16, "#D1D1D1", label),
      text(cx, 166, 13.5, "#8E8E8E", note),
      `  </g>`,
    ];
  };

  const currentRange = formatRange(s.current.start, s.current.end, thisYear);
  const longestRange = formatRange(s.longest.start, s.longest.end, thisYear);
  const share = s.longest.length ? s.current.length / s.longest.length : 0;
  const middle = [
    `  <g class="tile"${delay(120)}>`,
    frame(408),
    ...ring({ cx: 600, cy: 76, r: 42, width: 8, share }).map((line) => `  ${line}`),
    `    <circle cx="600" cy="34" r="14" fill="#212121"/>`,
    `    ${icon("zap", 593, 27, 0.5833, "#FFFFFF", ` class="pulse"`)}`,
    text(600, 87, 30, "url(#num)", formatNumber(s.current.length), "800"),
    text(600, 142, 16, "#D1D1D1", "day streak"),
    text(600, 166, 13.5, "#8E8E8E", currentRange),
    `  </g>`,
  ];

  const label =
    `GitHub contribution streak: ${formatNumber(s.contributions)} contributions since ${s.firstYear}, ` +
    `current streak ${formatDays(s.current.length)} (${currentRange}), longest streak ${formatDays(s.longest.length)} (${longestRange})`;
  return svg({
    width: 1200,
    height: 194,
    title: "Contribution streak",
    label,
    body: [
      ...side(1, 0, "calendar", formatNumber(s.contributions), "contributions", `since ${s.firstYear}`),
      ...middle,
      ...side(815, 240, "award", formatDays(s.longest.length), "longest streak", longestRange),
    ],
  });
}

function renderContributionsSvg(days) {
  const weeks = weeklyTotals(days, 52);
  const total = weeks.reduce((acc, w) => acc + w.total, 0);
  const best = weeks.reduce((top, w, i) => (w.total >= weeks[top].total ? i : top), 0);
  const max = niceMax(weeks[best].total);
  const [x0, x1, yTop, yBase] = [72, 1164, 128, 262];
  const xAt = (i) => x0 + (i * (x1 - x0)) / Math.max(weeks.length - 1, 1);
  const yAt = (v) => yBase - (v / max) * (yBase - yTop);
  const points = weeks.map((w, i) => [xAt(i), yAt(w.total)]);
  const f = (n) => n.toFixed(1);

  // Horizontal tangents at every point keep the curve from overshooting the data.
  let line = `M${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1];
    const [x, y] = points[i];
    const mid = (px + x) / 2;
    line += ` C${f(mid)} ${f(py)} ${f(mid)} ${f(y)} ${f(x)} ${f(y)}`;
  }
  const area = `${line} L${f(x1)} ${yBase} L${f(x0)} ${yBase} Z`;

  const grid = [max, max / 2, 0].flatMap((v) => [
    `  <line x1="${x0}" x2="${x1}" y1="${f(yAt(v))}" y2="${f(yAt(v))}" stroke="#ffffff" stroke-opacity="${v ? 0.06 : 0.14}"${v ? ` stroke-dasharray="4 6"` : ""}/>`,
    `  <text x="${x0 - 14}" y="${f(yAt(v) + 4)}" text-anchor="end" ${FONT} font-size="12" fill="#8E8E8E">${formatNumber(v)}</text>`,
  ]);

  const months = weeks.flatMap((w, i) => {
    const month = Number(w.start.slice(5, 7));
    if (i === 0 || month === Number(weeks[i - 1].start.slice(5, 7))) return [];
    return [`  <text x="${f(xAt(i))}" y="290" text-anchor="middle" ${FONT} font-size="12.5" fill="#8E8E8E">${MONTHS[month - 1]}</text>`];
  });

  const [bx, by] = points[best];
  const labelX = Math.min(Math.max(bx, x0 + 60), x1 - 60);
  const bestAt = 300 + 1500 * (best / Math.max(weeks.length - 1, 1));
  return card({
    width: 1200,
    height: 320,
    iconName: "barChart",
    title: "Contribution activity",
    kicker: "LAST 12 MONTHS · WEEKLY",
    label: `Contribution activity over the last 12 months: ${formatNumber(total)} contributions, best week ${formatNumber(weeks[best].total)}`,
    defs: `
    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.24"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>`,
    aside: headerFigure(1200, formatNumber(total), "contributions in the last year"),
    body: [
      ...grid,
      `  <path class="fade"${delay(900)} d="${area}" fill="url(#area)"/>`,
      `  <path class="line"${delay(200)} d="${line}" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1 2"/>`,
      `  <circle class="pop"${delay(bestAt)} cx="${f(bx)}" cy="${f(by)}" r="5.5" fill="#FFFFFF" stroke="#1F1F1F" stroke-width="3"/>`,
      `  <text class="rise"${delay(bestAt + 150)} x="${f(labelX)}" y="${f(by - 14)}" text-anchor="middle" ${FONT} font-size="12.5" font-weight="700" fill="#FFFFFF">Best week: ${formatNumber(weeks[best].total)}</text>`,
      ...months,
    ],
  });
}

// Isometric grid: each week steps right and toward the viewer, each weekday steps left and toward the viewer.
const SKY = { ox: 121, oy: 290, wx: 19.5, wy: 1.8, dx: -12, dy: 8.5, fill: 0.84, maxHeight: 180 };

function renderSkylineSvg(days, current, thisYear) {
  const cells = skylineCells(days);
  const max = Math.max(1, ...cells.map((c) => c.count));
  const best = cells.reduce((top, c, i) => (c.count > cells[top].count ? i : top), 0);
  const f = (n) => n.toFixed(1);
  const at = (col, row) => [SKY.ox + col * SKY.wx + row * SKY.dx, SKY.oy + col * SKY.wy + row * SKY.dy];
  const inStreak = (date) => current.start !== null && date >= current.start && date <= current.end;
  const poly = (points, fill) => `<polygon points="${points.map(([x, y]) => `${f(x)},${f(y)}`).join(" ")}" fill="${fill}"/>`;

  // Columns draw left to right and rows back to front, so nearer buildings cover farther ones.
  const buildings = cells.map((c) => {
    const [x, y] = at(c.col, c.row);
    const a = [x, y];
    const b = [x + SKY.wx * SKY.fill, y + SKY.wy * SKY.fill];
    const d = [x + SKY.dx * SKY.fill, y + SKY.dy * SKY.fill];
    const cc = [b[0] + SKY.dx * SKY.fill, b[1] + SKY.dy * SKY.fill];
    const streak = inStreak(c.date);
    const wait = 100 + c.col * 26 + c.row * 6;
    const attrs = `class="building"${delay(wait)}${streak ? ` data-streak="true"` : ""}`;
    if (!c.count) return `  <g ${attrs}>${poly([a, b, cc, d], "#2C2C2C")}</g>`;

    const level = Math.sqrt(c.count / max);
    const h = 5 + (SKY.maxHeight - 5) * level;
    const up = ([px, py]) => [px, py - h];
    const top = streak ? 255 : 95 + 115 * level;
    return `  <g ${attrs}>${[
      poly([d, cc, up(cc), up(d)], gray(top * 0.7)),
      poly([b, cc, up(cc), up(b)], gray(top * 0.5)),
      poly([up(a), up(b), up(cc), up(d)], gray(top)),
    ].join("")}</g>`;
  });

  const months = cells.flatMap((c, i) => {
    if (c.row !== 0 || c.col === 0) return [];
    const prev = cells[i - 7];
    if (!prev || prev.date.slice(5, 7) === c.date.slice(5, 7)) return [];
    const [x, y] = at(c.col, 7);
    return [`  <text x="${f(x + 8)}" y="${f(y + 16)}" text-anchor="middle" ${FONT} font-size="12" fill="#8E8E8E">${MONTHS[Number(c.date.slice(5, 7)) - 1]}</text>`];
  });

  const cube = (x, y, topFill) =>
    `<g transform="translate(${x} ${y})">${poly([[0, 4], [9, 6], [9, 16], [0, 14]], gray(parseInt(topFill.slice(1, 3), 16) * 0.7))}${poly([[9, 6], [13, 2], [13, 12], [9, 16]], gray(parseInt(topFill.slice(1, 3), 16) * 0.5))}${poly([[0, 4], [4, 0], [13, 2], [9, 6]], topFill)}</g>`;
  const legend = [
    `  <g class="fade"${delay(1800)}>`,
    `    ${cube(28, 430, "#FFFFFF")}`,
    `    <text x="50" y="443" ${FONT} font-size="12.5" fill="#D1D1D1">current streak</text>`,
    `    ${cube(28, 454, "#A0A0A0")}`,
    `    <text x="50" y="467" ${FONT} font-size="12.5" fill="#8E8E8E">height = contributions that day</text>`,
    `  </g>`,
  ];

  const bestCell = cells[best];
  return card({
    width: 1200,
    height: 500,
    iconName: "box",
    title: "Contribution skyline",
    kicker: "LAST 12 MONTHS · ONE BUILDING PER DAY",
    label: `Contribution skyline, one building per day over the last 12 months. Best day: ${formatNumber(bestCell.count)} contributions on ${formatDate(bestCell.date, thisYear)}`,
    aside: headerFigure(1200, formatNumber(bestCell.count), `best day · ${formatDate(bestCell.date, thisYear)}`),
    body: [...buildings, ...months, ...legend],
  });
}

function renderRhythmSvg({ hours, weekdays }) {
  const p = persona(hours, weekdays);
  const total = hours.reduce((acc, n) => acc + n, 0);
  const f = (n) => n.toFixed(1);

  const [cx, cy, inner, outer] = [210, 216, 30, 86];
  const maxHour = Math.max(1, ...hours);
  const bars = hours.map((n, h) => {
    const angle = ((h + 0.5) / 24) * 2 * Math.PI - Math.PI / 2;
    const length = Math.max(2, ((outer - inner - 4) * n) / maxHour);
    const [r0, r1] = [inner + 4, inner + 4 + length];
    const color = h === p.peakHour ? "#FFFFFF" : gray(95 + 110 * (n / maxHour));
    return `  <line class="hour"${delay(200 + 45 * h)} x1="${f(cx + r0 * Math.cos(angle))}" y1="${f(cy + r0 * Math.sin(angle))}" x2="${f(cx + r1 * Math.cos(angle))}" y2="${f(cy + r1 * Math.sin(angle))}" stroke="${color}" stroke-width="8" stroke-linecap="round"/>`;
  });
  const clockLabels = [0, 6, 12, 18].map((h) => {
    const angle = (h / 24) * 2 * Math.PI - Math.PI / 2;
    return `  <text x="${f(cx + 103 * Math.cos(angle))}" y="${f(cy + 103 * Math.sin(angle) + 4)}" text-anchor="middle" ${FONT} font-size="11.5" fill="#8E8E8E">${formatHour(h)}</text>`;
  });

  const [left, right, base, tallest, barWidth] = [450, 1172, 292, 135, 54];
  const slot = (right - left) / 7;
  const maxDay = Math.max(1, ...weekdays);
  const busiest = WEEKDAYS.indexOf(p.busiestDay);
  const dayBars = weekdays.flatMap((n, i) => {
    const h = Math.max(4, (tallest * n) / maxDay);
    const x = left + i * slot + (slot - barWidth) / 2;
    const name = WEEKDAYS[i].slice(0, 3);
    return [
      `  <rect class="day"${delay(300 + 90 * i)} x="${f(x)}" y="${f(base - h)}" width="${barWidth}" height="${f(h)}" rx="8" fill="${i === busiest ? "#FFFFFF" : "url(#bar)"}"/>`,
      `  <text class="fade"${delay(900 + 90 * i)} x="${f(x + barWidth / 2)}" y="${f(base - h - 10)}" text-anchor="middle" ${FONT} font-size="13" fill="#D1D1D1">${formatNumber(n)}</text>`,
      `  <text x="${f(x + barWidth / 2)}" y="316" text-anchor="middle" ${FONT} font-size="13" fill="#8E8E8E">${name}</text>`,
    ];
  });

  const subtitle = `peaks at ${formatHour(p.peakHour)} · busiest on ${p.busiestDay}s`;
  return card({
    width: 1200,
    height: 340,
    iconName: "clock",
    title: "When I code",
    kicker: "LAST 12 MONTHS · LOCAL TIME",
    label: `When I code, from ${formatNumber(total)} commits over the last 12 months: ${p.title}, ${subtitle}`,
    defs: `
    <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8E8E8E"/>
      <stop offset="1" stop-color="#4A4A4A"/>
    </linearGradient>`,
    aside: headerFigure(1200, p.title, subtitle),
    body: [
      `  <text x="28" y="124" ${FONT} font-size="11" font-weight="700" letter-spacing="2" fill="#8E8E8E">BY HOUR</text>`,
      `  <circle cx="${cx}" cy="${cy}" r="${inner}" fill="none" stroke="#ffffff" stroke-opacity="0.06"/>`,
      `  <circle cx="${cx}" cy="${cy}" r="${outer}" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-dasharray="3 5"/>`,
      ...bars,
      ...clockLabels,
      `  <text class="pop"${delay(1400)} x="${cx}" y="${cy + 5}" text-anchor="middle" ${FONT} font-size="13" font-weight="700" fill="#FFFFFF">${formatHour(p.peakHour)}</text>`,
      `  <line x1="410" x2="410" y1="112" y2="318" stroke="#ffffff" stroke-opacity="0.08"/>`,
      `  <text x="${left}" y="124" ${FONT} font-size="11" font-weight="700" letter-spacing="2" fill="#8E8E8E">BY WEEKDAY</text>`,
      `  <line x1="${left}" x2="${right}" y1="${base}" y2="${base}" stroke="#ffffff" stroke-opacity="0.14"/>`,
      ...dayBars,
    ],
  });
}

function setAlt(readme, file, alt) {
  const escaped = file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(<img src="assets/${escaped}" alt=")[^"]*(")`);
  if (!pattern.test(readme)) throw new Error(`README has no image with src assets/${file}`);
  return readme.replace(pattern, (_, open, close) => `${open}${alt}${close}`);
}

if (require.main === module) {
  const now = new Date();
  const thisYear = now.getUTCFullYear();
  const { days, rhythm, langs, activity, streak } = collectStats(now);

  const cards = [
    ["streak.svg", renderStreakSvg(streak, thisYear)],
    ["skyline.svg", renderSkylineSvg(days, streak.current, thisYear)],
    ["contributions.svg", renderContributionsSvg(days)],
    ["rhythm.svg", renderRhythmSvg(rhythm)],
    ["github-activity.svg", renderActivitySvg(activity)],
    ["languages.svg", renderLanguagesSvg(langs)],
  ];
  let readme = fs.readFileSync(README_PATH, "utf8");
  for (const [file, content] of cards) {
    fs.writeFileSync(path.join(ASSETS, file), content);
    readme = setAlt(readme, file, content.match(/aria-label="([^"]*)"/)[1]);
  }
  fs.writeFileSync(README_PATH, readme);
  console.log(cards.map(([file]) => file).join(", "));
}

module.exports = {
  topLanguages,
  streaks,
  rank,
  weeklyTotals,
  niceMax,
  commitRhythm,
  persona,
  formatHour,
  skylineCells,
  formatRange,
  renderActivitySvg,
  renderLanguagesSvg,
  renderStreakSvg,
  renderContributionsSvg,
  renderSkylineSvg,
  renderRhythmSvg,
  setAlt,
  assertPrivateVisible,
};
