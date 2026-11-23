const test = require("node:test");
const assert = require("node:assert/strict");
const {
  topLanguages,
  streaks,
  rank,
  weeklyTotals,
  niceMax,
  formatRange,
  renderActivitySvg,
  renderLanguagesSvg,
  renderStreakSvg,
  renderContributionsSvg,
  commitRhythm,
  persona,
  formatHour,
  skylineCells,
  renderRhythmSvg,
  renderSkylineSvg,
  setAlt,
  assertPrivateVisible,
  assertNoDrop,
} = require("./update-cards");

const repo = (langs) => ({
  languages: { edges: Object.entries(langs).map(([name, size]) => ({ size, node: { name } })) },
});

// Builds consecutive days from 2026-11-01 with the given contribution counts.
const days = (...counts) =>
  counts.map((count, i) => ({ date: `2026-11-${String(i + 1).padStart(2, "0")}`, count }));

// Builds `n` consecutive days ending on 2026-11-23, every one with `count` contributions.
const daysEndingNov23 = (n, count = 1) => {
  const end = Date.UTC(2026, 10, 23);
  return Array.from({ length: n }, (_, i) => ({
    date: new Date(end - (n - 1 - i) * 86400000).toISOString().slice(0, 10),
    count,
  }));
};

const NO_STREAK_FOR_TEST = { length: 0, start: null, end: null };

const activity = { commits: 1534, prs: 129, issues: 127, reviews: 12, stars: 4, repos: 55, followers: 10 };

test("topLanguages sums across repos, keeps the top N and normalizes to them", () => {
  const repos = [repo({ TypeScript: 600, CSS: 100 }), repo({ TypeScript: 100, Lua: 200, Shell: 50 })];
  const langs = topLanguages(repos, 3);

  assert.deepEqual(langs.map((l) => l.name), ["TypeScript", "Lua", "CSS"]);
  assert.deepEqual(langs.map((l) => l.pct), ["70.0%", "20.0%", "10.0%"]);
});

test("topLanguages skips repos that report no languages", () => {
  const langs = topLanguages([repo({}), repo({ Python: 300, Shell: 100 }), repo({})], 3);

  assert.deepEqual(langs.map((l) => l.name), ["Python", "Shell"]);
  assert.deepEqual(langs.map((l) => l.pct), ["75.0%", "25.0%"]);
});

test("streaks counts a current streak that includes today", () => {
  const { current, longest } = streaks(days(1, 0, 2, 3, 1));

  assert.deepEqual(current, { length: 3, start: "2026-11-03", end: "2026-11-05" });
  assert.deepEqual(longest, current);
});

test("streaks keeps the current streak alive when today has no contributions yet", () => {
  const { current } = streaks(days(0, 4, 4, 0));

  assert.deepEqual(current, { length: 2, start: "2026-11-02", end: "2026-11-03" });
});

test("streaks resets the current streak after a full day without contributions", () => {
  const { current, longest } = streaks(days(1, 1, 1, 0, 0));

  assert.deepEqual(current, { length: 0, start: null, end: null });
  assert.deepEqual(longest, { length: 3, start: "2026-11-01", end: "2026-11-03" });
});

test("streaks prefers the most recent run when two longest streaks tie", () => {
  const { longest } = streaks(days(1, 1, 0, 1, 1, 0));

  assert.deepEqual(longest, { length: 2, start: "2026-11-04", end: "2026-11-05" });
});

test("rank grades an empty profile C and a profile at every median B+", () => {
  const none = { commits: 0, prs: 0, issues: 0, reviews: 0, stars: 0, followers: 0 };
  const medians = { commits: 1000, prs: 50, issues: 25, reviews: 2, stars: 50, followers: 10 };

  assert.deepEqual(rank(none), { level: "C", percentile: 100 });
  assert.deepEqual(rank(medians), { level: "B+", percentile: 50 });
});

test("rank grades a very active, well-starred profile S", () => {
  const huge = { commits: 50000, prs: 5000, issues: 2000, reviews: 500, stars: 500000, followers: 100000 };

  assert.equal(rank(huge).level, "S");
});

test("weeklyTotals sums the last N full weeks ending on the last day", () => {
  const weeks = weeklyTotals([...days(5, 5, 5), ...days(1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2)], 2);

  assert.deepEqual(weeks.map((w) => w.total), [7, 14]);
  assert.deepEqual(weeks.map((w) => w.start), ["2026-11-01", "2026-11-08"]);
});

test("niceMax rounds up to a value whose half is also a clean axis label", () => {
  assert.equal(niceMax(0), 4);
  assert.equal(niceMax(37), 40);
  assert.equal(niceMax(118), 150);
  assert.equal(niceMax(410), 500);
});

test("formatRange shows the year only for dates outside the current year", () => {
  assert.equal(formatRange("2026-08-31", "2026-11-22", 2026), "Aug 31 – Nov 22");
  assert.equal(formatRange("2025-12-30", "2026-01-04", 2026), "Dec 30, 2025 – Jan 4");
  assert.equal(formatRange("2026-03-05", "2026-03-05", 2026), "Mar 5");
  assert.equal(formatRange(null, null, 2026), "No active streak");
});

test("renderActivitySvg lists each total and draws the rank ring", () => {
  const svg = renderActivitySvg(activity);

  for (const text of ["1,534", "Commits", "129", "Pull requests", "127", "Issues", "12", "Code reviews", "4", "Stars earned", "55", "Repositories"]) {
    assert.match(svg, new RegExp(`>${text}<`));
  }
  const { level, percentile } = rank(activity);
  assert.match(svg, new RegExp(`>${level.replace("+", "\\+")}<`));
  assert.match(svg, new RegExp(`>TOP ${percentile.toFixed(0)}%<`));
  assert.match(svg, /viewBox="0 0 590 274"/);
  assert.match(svg, /rx="20" fill="url\(#card\)" stroke="#3A3A3A" stroke-width="2"/);
});

test("renderLanguagesSvg draws one donut segment and legend entry per language", () => {
  const svg = renderLanguagesSvg(topLanguages([repo({ TypeScript: 700, Lua: 200, CSS: 100 })], 3));

  assert.equal((svg.match(/class="segment"/g) || []).length, 3);
  // Filled wedges, not dashed strokes, so no slice can bleed past its end.
  assert.equal((svg.match(/<path class="segment"/g) || []).length, 3);
  assert.doesNotMatch(svg, /class="segment"[^>]*stroke-dasharray/);
  assert.equal((svg.match(/class="swatch"/g) || []).length, 3);
  assert.match(svg, />70%</);
  assert.match(svg, />TypeScript</);
  assert.match(svg, />Lua <tspan fill="#8E8E8E">20\.0%<\/tspan>/);
  assert.match(svg, /viewBox="0 0 590 274"/);
});

test("renderLanguagesSvg merges languages under 3% into one donut slice that their swatches share", () => {
  const sizes = { TypeScript: 600, JavaScript: 200, Python: 100, HTML: 40, Lua: 25, CSS: 20, Shell: 15 };
  const svg = renderLanguagesSvg(topLanguages([repo(sizes)], 7));

  const segments = [...svg.matchAll(/class="segment"[^>]* fill="(#[0-9A-F]{6})"/g)].map((m) => m[1]);
  assert.equal(segments.length, 5);
  const other = segments[4];
  const swatches = [...svg.matchAll(/class="swatch"[^>]* fill="(#[0-9A-F]{6})"/g)].map((m) => m[1]);
  assert.equal(swatches.length, 7);
  assert.deepEqual(swatches.slice(4), [other, other, other]);
  assert.ok(!swatches.slice(0, 4).includes(other));
});

test("renderStreakSvg shows totals, both streaks and their date ranges", () => {
  const svg = renderStreakSvg(
    {
      contributions: 5501,
      firstYear: 2020,
      current: { length: 84, start: "2026-08-31", end: "2026-11-22" },
      longest: { length: 84, start: "2026-08-31", end: "2026-11-22" },
    },
    2026
  );

  assert.match(svg, />5,501</);
  assert.match(svg, />since 2020</);
  assert.match(svg, />84</);
  assert.match(svg, />84 days</);
  assert.match(svg, />day streak</);
  assert.equal((svg.match(/>Aug 31 – Nov 22</g) || []).length, 2);
  assert.match(svg, /viewBox="0 0 1200 194"/);
});

test("renderStreakSvg fills the ring by how close the current streak is to the longest", () => {
  const svg = renderStreakSvg(
    {
      contributions: 10,
      firstYear: 2026,
      current: { length: 5, start: "2026-11-19", end: "2026-11-23" },
      longest: { length: 20, start: "2026-01-01", end: "2026-01-20" },
    },
    2026
  );
  const [, dash, circumference] = svg.match(/class="progress"[^>]*stroke-dasharray="([\d.]+) ([\d.]+)"/);

  assert.equal((Number(dash) / (Number(dash) + Number(circumference))).toFixed(2), "0.25");
});

test("renderStreakSvg uses the singular for a one-day streak", () => {
  const one = { length: 1, start: "2026-11-23", end: "2026-11-23" };
  const svg = renderStreakSvg({ contributions: 1, firstYear: 2026, current: one, longest: one }, 2026);

  assert.match(svg, />1 day</);
});

test("renderContributionsSvg plots 52 weeks with the yearly total, best week and month labels", () => {
  const year = daysEndingNov23(364, 1);
  year[300].count = 30;
  const svg = renderContributionsSvg(year);

  const line = svg.match(/class="line"[^>]* d="([^"]*)"/)[1];
  assert.equal((line.match(/C/g) || []).length, 51);
  assert.match(svg, />393</);
  assert.match(svg, />Best week: 36</);
  for (const month of ["Dec", "Mar", "Jun", "Sep", "Nov"]) assert.match(svg, new RegExp(`>${month}<`));
  assert.match(svg, /viewBox="0 0 1200 320"/);
});

test("commitRhythm buckets commits by the author's local hour and weekday, Monday first", () => {
  const { hours, weekdays } = commitRhythm([
    "2026-11-22T23:10:00-05:00",
    "2026-11-23T23:30:00-05:00",
    "2026-11-24T09:00:00-05:00",
  ]);

  assert.equal(hours.length, 24);
  assert.equal(hours[23], 2);
  assert.equal(hours[9], 1);
  assert.deepEqual(weekdays, [1, 1, 0, 0, 0, 0, 1]);
});

test("persona names the time of day around the peak hour and the busiest weekday", () => {
  const hours = Array(24).fill(1);
  hours[23] = 9;
  hours[22] = 6;
  hours[0] = 5;
  const night = persona(hours, [3, 9, 2, 2, 2, 1, 1]);

  assert.deepEqual(night, { title: "Night owl", peakHour: 23, busiestDay: "Tuesday" });

  const morning = Array(24).fill(0);
  morning[7] = 4;
  assert.equal(persona(morning, [1, 0, 0, 0, 0, 0, 0]).title, "Early bird");

  const afternoon = Array(24).fill(0);
  afternoon[14] = 4;
  assert.equal(persona(afternoon, [1, 0, 0, 0, 0, 0, 0]).title, "Daytime builder");

  const evening = Array(24).fill(0);
  evening[19] = 4;
  assert.equal(persona(evening, [1, 0, 0, 0, 0, 0, 0]).title, "Evening coder");
});

test("formatHour reads as a 12-hour clock", () => {
  assert.equal(formatHour(0), "12 AM");
  assert.equal(formatHour(9), "9 AM");
  assert.equal(formatHour(12), "12 PM");
  assert.equal(formatHour(23), "11 PM");
});

test("skylineCells lays the last 53 weeks on a grid with Sunday as row 0", () => {
  const cells = skylineCells(daysEndingNov23(400, 2));

  // Nov 23, 2026 is a Monday, so the last week holds Sunday and Monday only.
  assert.equal(cells.length, 52 * 7 + 2);
  assert.deepEqual(cells[0], { col: 0, row: 0, date: "2025-11-23", count: 2 });
  assert.deepEqual(cells.at(-1), { col: 52, row: 1, date: "2026-11-23", count: 2 });
});

test("renderSkylineSvg draws a building per day, the best day and month labels", () => {
  const year = daysEndingNov23(400, 1);
  year[350].count = 40;
  const svg = renderSkylineSvg(year, { start: "2026-11-20", end: "2026-11-23" }, 2026);

  assert.equal((svg.match(/class="building"/g) || []).length, 52 * 7 + 2);
  assert.equal((svg.match(/data-streak="true"/g) || []).length, 4);
  assert.match(svg, />40</);
  assert.match(svg, />best day · Oct 5</);
  for (const month of ["Dec", "Mar", "Jun", "Sep"]) assert.match(svg, new RegExp(`>${month}<`));
  assert.match(svg, /viewBox="0 0 1200 500"/);
});

test("renderRhythmSvg draws the 24-hour clock, weekday bars and the persona", () => {
  const hours = Array(24).fill(2);
  hours[23] = 12;
  const svg = renderRhythmSvg({ hours, weekdays: [5, 9, 4, 4, 3, 2, 1] });

  assert.equal((svg.match(/class="hour"/g) || []).length, 24);
  assert.equal((svg.match(/class="day"/g) || []).length, 7);
  for (const day of ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]) assert.match(svg, new RegExp(`>${day}<`));
  assert.match(svg, />Night owl</);
  assert.match(svg, />peaks at 11 PM · busiest on Tuesdays</);
  assert.match(svg, /viewBox="0 0 1200 340"/);
});

test("every card animates on load and stays still for reduced motion", () => {
  const svgs = [
    renderActivitySvg(activity),
    renderLanguagesSvg(topLanguages([repo({ TypeScript: 1 })], 1)),
    renderStreakSvg({ contributions: 1, firstYear: 2026, current: NO_STREAK_FOR_TEST, longest: NO_STREAK_FOR_TEST }, 2026),
    renderContributionsSvg(daysEndingNov23(364, 1)),
    renderSkylineSvg(daysEndingNov23(371, 1), NO_STREAK_FOR_TEST, 2026),
    renderRhythmSvg({ hours: Array(24).fill(1), weekdays: Array(7).fill(1) }),
  ];

  for (const svg of svgs) {
    assert.match(svg, /@keyframes/);
    assert.match(svg, /@media \(prefers-reduced-motion: reduce\)/);
  }
});

test("the skyline, chart, clock and rings keep moving after the intro, and hold still for reduced motion", () => {
  const skyline = renderSkylineSvg(daysEndingNov23(371, 1), NO_STREAK_FOR_TEST, 2026);
  const chart = renderContributionsSvg(daysEndingNov23(364, 1));
  const rhythm = renderRhythmSvg({ hours: Array(24).fill(1), weekdays: Array(7).fill(1) });
  const rankCard = renderActivitySvg(activity);

  assert.match(skyline, /class="beam"/);
  assert.match(chart, /<animateMotion[^>]*repeatCount="indefinite"[^>]*><mpath href="#trend"/);
  assert.match(chart, /id="trend"/);
  assert.match(rhythm, /class="hand"/);
  assert.match(rankCard, /class="glow"/);
  for (const svg of [skyline, chart, rhythm]) {
    assert.match(svg, /prefers-reduced-motion: reduce\) \{[^}]*\.hand, \.comet, \.beam \{ display: none; \}/);
  }
});

test("assertNoDrop stops a run whose all-time totals fall, the sign of a token without private access", () => {
  const before = { commits: 4230, prs: 535, issues: 628, contributions: 5505 };

  assert.throws(() => assertNoDrop(before, { ...before, commits: 1180, prs: 129 }), /commits.*4,230.*1,180/);
  assert.doesNotThrow(() => assertNoDrop(before, { ...before, commits: 4200 }));
  assert.doesNotThrow(() => assertNoDrop(before, { ...before, contributions: 5600 }));
  assert.doesNotThrow(() => assertNoDrop(null, before));
});

test("setAlt swaps the alt text of the image with the given source", () => {
  const readme = `<img src="assets/streak.svg" alt="old" width="100%" />\n<img src="assets/languages.svg" alt="keep" />`;

  assert.equal(
    setAlt(readme, "streak.svg", "new"),
    `<img src="assets/streak.svg" alt="new" width="100%" />\n<img src="assets/languages.svg" alt="keep" />`
  );
});

test("setAlt throws when the README has no image with that source", () => {
  assert.throws(() => setAlt("# Hello", "streak.svg", "new"), /streak\.svg/);
});

test("assertPrivateVisible throws when the token can only see public repos", () => {
  assert.throws(() => assertPrivateVisible([{ isPrivate: false }, { isPrivate: false }]), /private/);
});

test("assertPrivateVisible passes when at least one private repo is visible", () => {
  assert.doesNotThrow(() => assertPrivateVisible([{ isPrivate: false }, { isPrivate: true }]));
});
