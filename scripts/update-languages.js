// Regenerates assets/languages.svg and its alt text in README.md from the
// language byte counts of every non-fork repo you own, private ones included.
// Needs the GitHub CLI, signed in:  node scripts/update-languages.js
// Runs weekly from .github/workflows/update-languages.yml.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const SVG_PATH = path.join(ROOT, "assets", "languages.svg");
const README_PATH = path.join(ROOT, "README.md");

const COLORS = ["#FFFFFF", "#E5E5E5", "#D1D1D1", "#B4B4B4", "#A1A1A1", "#8E8E8E", "#6E6E6E", "#585858"];
const FONT = `font-family="'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif"`;
const BAR_X = 25;
const BAR_WIDTH = 417;
const LEGEND_COLUMNS = [30, 175, 320];

const QUERY = `
query($endCursor: String) {
  viewer {
    repositories(first: 100, after: $endCursor, ownerAffiliations: OWNER, isFork: false) {
      pageInfo { hasNextPage endCursor }
      nodes { isPrivate languages(first: 20, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name } } } }
    }
  }
}`;

function fetchRepos() {
  const repos = [];
  let cursor = null;
  do {
    const args = ["api", "graphql", "-f", `query=${QUERY}`];
    if (cursor) args.push("-f", `endCursor=${cursor}`);
    const out = execFileSync("gh", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    const page = JSON.parse(out).data.viewer.repositories;
    repos.push(...page.nodes);
    cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (cursor);
  return repos;
}

// Stops a token without private access from quietly rewriting the card with public-only numbers.
function assertPrivateVisible(repos) {
  if (!repos.some((repo) => repo.isPrivate)) {
    throw new Error("No private repos visible: the token needs read access to all your repositories");
  }
}

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

const summarize = (langs) => langs.map((l) => `${l.name} ${l.pct}`).join(", ");

function renderSvg(langs) {
  let x = BAR_X;
  const bars = langs.map((l, i) => {
    const width = l.share * BAR_WIDTH;
    const rect = `  <rect x="${x.toFixed(2)}" y="56" width="${(width + 0.5).toFixed(2)}" height="10" fill="${COLORS[i]}"/>`;
    x += width;
    return rect;
  });
  const legend = langs.flatMap((l, i) => {
    const cx = LEGEND_COLUMNS[i % LEGEND_COLUMNS.length];
    const cy = 92 + 24 * Math.floor(i / LEGEND_COLUMNS.length);
    return [
      `  <circle cx="${cx}" cy="${cy}" r="5" fill="${COLORS[i]}"/>`,
      `  <text x="${cx + 11}" y="${cy + 4}" ${FONT} font-size="12.5" fill="#D1D1D1">${l.name} <tspan fill="#8E8E8E">${l.pct}</tspan></text>`,
    ];
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 467 165" width="467" height="165" role="img" aria-label="Most used languages: ${summarize(langs)}">
  <title>Most used languages</title>
  <defs>
    <clipPath id="bar"><rect x="${BAR_X}" y="56" width="${BAR_WIDTH}" height="10" rx="5"/></clipPath>
  </defs>
  <rect x="0.5" y="0.5" width="466" height="164" rx="6" fill="#1C1C1C" stroke="#3A3A3A"/>
  <text x="25" y="35" ${FONT} font-size="18" font-weight="600" fill="#FFFFFF">Most Used Languages</text>
  <g clip-path="url(#bar)">
${bars.join("\n")}
  </g>
${legend.join("\n")}
</svg>
`;
}

function updateAltText(readme, summary) {
  const pattern = /(most used languages: )[^"]*(")/;
  if (!pattern.test(readme)) throw new Error("README has no most used languages alt text to update");
  return readme.replace(pattern, `$1${summary}$2`);
}

if (require.main === module) {
  const repos = fetchRepos();
  assertPrivateVisible(repos);
  const langs = topLanguages(repos);
  fs.writeFileSync(SVG_PATH, renderSvg(langs));
  fs.writeFileSync(README_PATH, updateAltText(fs.readFileSync(README_PATH, "utf8"), summarize(langs)));
  console.log(summarize(langs));
}

module.exports = { topLanguages, renderSvg, updateAltText, assertPrivateVisible };
