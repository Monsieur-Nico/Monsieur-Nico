const test = require("node:test");
const assert = require("node:assert/strict");
const { topLanguages, renderSvg, updateAltText, assertPrivateVisible } = require("./update-languages");

const repo = (langs) => ({
  languages: { edges: Object.entries(langs).map(([name, size]) => ({ size, node: { name } })) },
});

test("topLanguages sums across repos, keeps the top N and normalizes to them", () => {
  const repos = [repo({ TypeScript: 600, CSS: 100 }), repo({ TypeScript: 100, Lua: 200, Shell: 50 })];
  const langs = topLanguages(repos, 3);

  assert.deepEqual(langs.map((l) => l.name), ["TypeScript", "Lua", "CSS"]);
  assert.deepEqual(langs.map((l) => l.pct), ["70.0%", "20.0%", "10.0%"]);
});

test("renderSvg draws one bar segment and legend entry per language across the full bar", () => {
  const langs = topLanguages([repo({ TypeScript: 700, Lua: 200, CSS: 100 })], 3);
  const svg = renderSvg(langs);

  const bars = [...svg.matchAll(/<rect x="([\d.]+)" y="56" width="([\d.]+)" height="10" fill/g)];
  assert.equal(bars.length, 3);
  assert.equal(bars[0][1], "25.00");
  const last = bars[bars.length - 1];
  assert.equal((Number(last[1]) + Number(last[2])).toFixed(2), "442.50");

  assert.equal((svg.match(/<circle /g) || []).length, 3);
  assert.match(svg, /aria-label="Most used languages: TypeScript 70\.0%, Lua 20\.0%, CSS 10\.0%"/);
  assert.match(svg, />Lua <tspan fill="#8E8E8E">20\.0%<\/tspan>/);
});

test("updateAltText swaps the language summary in the README image alt", () => {
  const readme = `<img src="assets/languages.svg" alt="Someone's most used languages: Ruby 100.0%" height="165" />`;

  assert.equal(
    updateAltText(readme, "TypeScript 70.0%, Lua 30.0%"),
    `<img src="assets/languages.svg" alt="Someone's most used languages: TypeScript 70.0%, Lua 30.0%" height="165" />`
  );
});

test("updateAltText throws when the README has no languages alt text", () => {
  assert.throws(() => updateAltText("# Hello", "TypeScript 100.0%"), /alt text/);
});

test("assertPrivateVisible throws when the token can only see public repos", () => {
  assert.throws(() => assertPrivateVisible([{ isPrivate: false }, { isPrivate: false }]), /private/);
});

test("assertPrivateVisible passes when at least one private repo is visible", () => {
  assert.doesNotThrow(() => assertPrivateVisible([{ isPrivate: false }, { isPrivate: true }]));
});
