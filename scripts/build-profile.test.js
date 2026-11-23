const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { PROFILE, pillWidth, buildCards, renderProject, renderGoals, renderButton } = require("./build-profile");

const cards = buildCards(PROFILE);
const byFile = Object.fromEntries(cards);
const readme = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8");

test("buildCards draws every static README card", () => {
  assert.deepEqual(Object.keys(byFile).sort(), [
    "about-intro.svg",
    "banner.svg",
    "btn-email.svg",
    "btn-linkedin.svg",
    "btn-portfolio.svg",
    "card-audience.svg",
    "card-nicoscript-sites.svg",
    "card-principles.svg",
    "card-self-education.svg",
    "card-textconvert.svg",
    "card-toolfurnace.svg",
    "experience.svg",
    "goals.svg",
    "stack.svg",
    "stats.svg",
  ]);
});

test("the README shows every generated card", () => {
  for (const file of Object.keys(byFile)) assert.match(readme, new RegExp(`src="assets/${file.replace(".", "\\.")}"`));
});

test("every card animates, describes itself and holds still for reduced motion", () => {
  for (const [file, svg] of cards) {
    assert.match(svg, /@keyframes/, file);
    assert.match(svg, /@media \(prefers-reduced-motion: reduce\)/, file);
    assert.match(svg, /(aria-label|<title)/, file);
  }
});

test("cards keep their content", () => {
  assert.match(byFile["banner.svg"], />Nicolas Alkhoury</);
  assert.match(byFile["banner.svg"], />Full-Stack Developer • AI Toolmaker</);
  assert.match(byFile["stats.svg"], />2\.7M\+</);
  assert.match(byFile["card-principles.svg"], />Test early, refactor often</);
  assert.match(byFile["experience.svg"], /·  Rok Commander</);
  assert.match(byFile["stack.svg"], />Automation pipelines</);
  assert.match(byFile["card-toolfurnace.svg"], />toolfurnace\.com<\/text>\s*<text class="nudge"[^>]*>→</);
});

test("pillWidth sizes tech pills to their label like the original stack card", () => {
  assert.equal(pillWidth("React"), 88);
  assert.equal(pillWidth("Git"), 69);
  assert.equal(pillWidth("Automation pipelines"), 232);
});

test("every tech stack pill carries its logo in a round badge, in the card's light gray", () => {
  const svg = byFile["stack.svg"];
  const pills = PROFILE.stack.flatMap(([, items]) => items);

  assert.equal((svg.match(/class="logo"/g) || []).length, pills.length);
  assert.equal((svg.match(/class="badge"/g) || []).length, pills.length);
  for (const logo of svg.match(/<g class="logo"[^>]*>/g)) assert.match(logo, /(fill|stroke)="#F0F0F0"/);
});

test("the about card's quote mark stays still", () => {
  assert.doesNotMatch(byFile["about-intro.svg"], /class="float"[^>]*>“/);
});

test("project tags sit clear of the description", () => {
  for (const project of PROFILE.projects) {
    const svg = renderProject(project, 0);
    const lastLine = Math.max(...[...svg.matchAll(/<text class="desc" x="\d+" y="(\d+)"/g)].map((m) => Number(m[1])));
    const tagTop = Math.min(...[...svg.matchAll(/<rect class="tag" x="[\d.]+" y="(\d+)"/g)].map((m) => Number(m[1])));
    assert.ok(tagTop - lastLine >= 14, `${project.name}: tags at ${tagTop}, text ends at ${lastLine}`);
  }
});

test("live projects get a pulsing status dot and every project a shine", () => {
  const live = PROFILE.projects.find((p) => p.status === "LIVE");
  assert.match(renderProject(live, 0), /class="ping"/);
  for (const project of PROFILE.projects) assert.match(renderProject(project, 0), /class="shine-m"/);
});

test("renderGoals lists each goal as an open item", () => {
  const svg = renderGoals(PROFILE.goals);

  assert.equal((svg.match(/class="goal"/g) || []).length, PROFILE.goals.length);
  for (const goal of PROFILE.goals) assert.match(svg, new RegExp(`>${goal.replace("'", "&#39;")}<`));
  assert.match(svg, /aria-label="2026 goals: Launch NicoScript Sites/);
});

test("buttons shine and nudge their arrow", () => {
  const svg = renderButton(PROFILE.buttons[0]);

  assert.match(svg, /class="shine-s"/);
  assert.match(svg, /class="nudge"[^>]*>→</);
});
