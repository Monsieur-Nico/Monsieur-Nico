const test = require("node:test");
const assert = require("node:assert/strict");
const { toLight, lightName, themeReadme, esc } = require("./svg-kit");

// WCAG relative luminance and contrast for a #RRGGBB gray.
const luminance = (hex) => {
  const c = parseInt(hex.slice(1, 3), 16) / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const light = (hex) => toLight(`fill="${hex}"`).slice(6, 13);

test("toLight turns dark surfaces near-white and white marks near-black", () => {
  assert.equal(light("#1A1A1A"), "#F6F6F6");
  assert.equal(light("#0C0C0C"), "#FFFFFF");
  assert.equal(light("#FFFFFF"), "#1A1A1A");
  assert.equal(light("#ffffff"), "#1A1A1A");
});

test("toLight keeps opacity and leaves non-gray colours alone", () => {
  assert.equal(toLight(`<rect fill="#ffffff" fill-opacity="0.06"/>`), `<rect fill="#1A1A1A" fill-opacity="0.06"/>`);
  assert.equal(toLight(`stroke="#4493F8"`), `stroke="#4493F8"`);
});

test("text stays readable in light mode", () => {
  const surfaces = ["#1A1A1A", "#262626"].map(light);
  const texts = { body: "#D1D1D1", muted: "#8E8E8E", secondary: "#A1A1A1", heading: "#FFFFFF" };
  for (const surface of surfaces) {
    for (const [role, hex] of Object.entries(texts)) {
      assert.ok(contrast(light(hex), surface) >= 4.5, `${role} ${light(hex)} on ${surface}: ${contrast(light(hex), surface).toFixed(2)}`);
    }
  }
});

test("text stays readable in dark mode", () => {
  for (const hex of ["#D1D1D1", "#8E8E8E", "#A1A1A1"]) {
    for (const surface of ["#1A1A1A", "#262626"]) assert.ok(contrast(hex, surface) >= 4.5, `${hex} on ${surface}`);
  }
});

test("lightName adds -light before the extension", () => {
  assert.equal(lightName("stack.svg"), "stack-light.svg");
});

test("themeReadme gives each card a light-mode source, once", () => {
  const readme = `<a href="x"><img src="assets/stack.svg" alt="Stack" width="100%" /></a>\n<img src="assets/other.svg" alt="" />`;
  const themed = themeReadme(readme, ["stack.svg"]);

  assert.equal(
    themed,
    `<a href="x"><picture><source media="(prefers-color-scheme: light)" srcset="assets/stack-light.svg"><img src="assets/stack.svg" alt="Stack" width="100%" /></picture></a>\n<img src="assets/other.svg" alt="" />`
  );
  assert.equal(themeReadme(themed, ["stack.svg"]), themed);
});

test("esc makes text safe inside SVG markup and attributes", () => {
  assert.equal(esc(`Tom & "Jerry" <3 'x'`), "Tom &amp; &quot;Jerry&quot; &lt;3 &#39;x&#39;");
});
