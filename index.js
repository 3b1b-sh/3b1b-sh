/**
 * Profile generator — single source of truth for this repo.
 *
 * `node index.js` regenerates:
 *   - README.md
 *   - assets/hero-{light,dark}.svg            (name banner with waving robot)
 *   - assets/stats/year-{light,dark}.svg      (year progress bar)
 *   - assets/stats/overview-{light,dark}.svg  (live GitHub stats)
 *   - assets/stats/languages-{light,dark}.svg (repo language mix)
 *   - assets/stats/wakatime-{light,dark}.svg  (coding-time mix, static data below)
 *
 * Live stats come from the GitHub GraphQL API when GITHUB_TOKEN is set
 * (always true in Actions); otherwise the last fetched values in
 * assets/stats/data.json are reused, so the script never fails offline.
 *
 * To update your bio, projects, links or skills, edit PROFILE below.
 */

const fs = require("fs");
const path = require("path");

const USERNAME = "3b1b-sh";

const PROFILE = {
  name: "Gubin (Eric) Hu",
  greeting: "HELLO, I AM",
  tagline: "Embodied AI · Humanoid Robot Learning",
  affiliation: "B.Eng. @ ShanghaiTech University → incoming PhD @ Fudan University · Shanghai, China",
  chips: ["Whole-body Control", "Motion Imitation", "Unitree G1 · Real Robot"],

  about: [
    "🤖 I work on **embodied AI** — teaching humanoid robots to move: whole-body motion control, imitation from human motion, and sim-to-real transfer.",
    "🦾 Hands-on with real humanoid hardware (**Unitree G1**): motion retargeting, tracking policies, and deployment on the physical robot.",
    "🧠 Earlier projects span deep learning for medical imaging (MRI reconstruction), classic AI, and computer systems (a RISC-V CPU, bare-metal embedded).",
    "🎓 B.Eng. from **ShanghaiTech University** (2026) → incoming PhD student at **Fudan University**, working on embodied AI.",
    "📫 Always happy to chat about robots — reach me via the badges above.",
  ],

  // Contact badges under the hero. Add a homepage / Google Scholar entry here
  // when you have one: { label, message, color, logo, href }.
  links: [
    {
      label: "Email",
      message: "303570417sh@gmail.com",
      color: "4f46e5",
      logo: "gmail",
      href: "mailto:303570417sh@gmail.com",
    },
    {
      label: "LinkedIn",
      message: "Eric Hu",
      color: "4f46e5",
      logo: "linkedinDataUri", // simple-icons dropped LinkedIn; we embed our own glyph
      href: "https://www.linkedin.com/in/eric-hu-0aa9252a8",
    },
    {
      label: "GitHub",
      message: "3b1b-sh",
      color: "4f46e5",
      logo: "github",
      href: "https://github.com/3b1b-sh",
    },
  ],

  // Featured repositories: laid out 2 per row, in this order.
  projects: [
    {
      repo: "Deep_learning_Dynamic_MRI_Reconstruction",
      title: "Dynamic MRI Reconstruction",
      desc: "Deep learning for dynamic MRI reconstruction — BME 1312 course project.",
    },
    {
      repo: "2D_Self_Driving_Simulator",
      title: "2D Self-Driving Simulator",
      desc: "A 2D self-driving simulator with search & planning agents — CS181 (AI) final project.",
    },
    {
      repo: "Deep_learning_Cardiac_Cine_MRI",
      title: "Cardiac Cine MRI",
      desc: "Deep learning for cardiac cine MRI analysis.",
    },
    {
      repo: "Flappy-bird-game-on-Longan-Nano",
      title: "Flappy Bird on Longan Nano",
      desc: "Flappy Bird running bare-metal on a RISC-V Longan Nano board — CS110.",
    },
    {
      repo: "Project-Performance-Evaluation-of-Bandit-Algorithms",
      title: "Bandit Algorithms Evaluation",
      desc: "Empirical study of multi-armed bandit algorithms — SI140 (Probability).",
    },
    {
      repo: "Building-a-toy-RVC-CPU",
      title: "Toy RISC-V CPU",
      desc: "A toy RISC-V CPU built from scratch — CS110 (Computer Architecture).",
    },
  ],

  skills: "py,cpp,c,pytorch,latex,matlab,git,github,docker,linux,bash,vscode",

  // Static WakaTime snapshot (WakaTime has no keyless public API).
  // Update occasionally from https://wakatime.com/dashboard.
  wakatime: {
    since: "Sep 2024",
    editors: "VS Code 86.4% · Claude Code 13.6%",
    items: [
      { name: "Python", pct: 49.6, color: "#3572A5" },
      { name: "Markdown", pct: 20.6, color: "#083fa1" },
      { name: "TeX", pct: 14.6, color: "#3D6117" },
      { name: "Text / YAML", pct: 4.5, color: "#f6c915" },
      { name: "Other", pct: 10.7, color: "#8c959f" },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Themes                                                              */
/* ------------------------------------------------------------------ */

const THEMES = {
  light: {
    suffix: "light",
    bg: "#ffffff",
    text: "#1f2328",
    muted: "#57606a",
    faint: "#8c959f",
    border: "#d0d7de",
    track: "#eaeef2",
    accentA: "#4f46e5",
    accentB: "#0891b2",
  },
  dark: {
    suffix: "dark",
    bg: "#0d1117",
    text: "#e6edf3",
    muted: "#9198a1",
    faint: "#6e7681",
    border: "#30363d",
    track: "#21262d",
    accentA: "#818cf8",
    accentB: "#22d3ee",
  },
};

const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const LANG_COLORS = {
  Python: "#3572A5",
  "Jupyter Notebook": "#DA5B0B",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  C: "#555555",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#663399",
  MATLAB: "#e16737",
  TeX: "#3D6117",
  Shell: "#89e051",
  Rust: "#dea584",
  Go: "#00ADD8",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function mixHex(hex, withHex, t) {
  const a = hex.replace("#", "");
  const b = withHex.replace("#", "");
  const c = [0, 2, 4].map((i) => {
    const x = parseInt(a.slice(i, i + 2), 16);
    const y = parseInt(b.slice(i, i + 2), 16);
    return Math.round(x + (y - x) * t)
      .toString(16)
      .padStart(2, "0");
  });
  return `#${c.join("")}`;
}

// Very dark language colors (e.g. C #555555) disappear on a dark card.
function visibleOn(theme, color) {
  if (theme.suffix !== "dark") return color;
  const v = color.replace("#", "");
  const lum =
    0.299 * parseInt(v.slice(0, 2), 16) +
    0.587 * parseInt(v.slice(2, 4), 16) +
    0.114 * parseInt(v.slice(4, 6), 16);
  return lum < 90 ? mixHex(color, "#ffffff", 0.45) : color;
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function card(theme, w, h, body) {
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="10" fill="${theme.bg}" stroke="${theme.border}"/>
${body}
</svg>
`;
}

function stackedBar(theme, id, x, y, w, h, segments) {
  // segments: [{pct, color}] — normalised to fill the full width.
  const total = segments.reduce((s, seg) => s + seg.pct, 0) || 1;
  let cursor = x;
  const rects = segments
    .map((seg) => {
      const sw = (seg.pct / total) * w;
      const r = `    <rect x="${cursor.toFixed(2)}" y="${y}" width="${(sw + 0.6).toFixed(2)}" height="${h}" fill="${visibleOn(theme, seg.color)}"/>`;
      cursor += sw;
      return r;
    })
    .join("\n");
  return `  <defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/></clipPath></defs>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${theme.track}"/>
  <g clip-path="url(#${id})">
${rects}
  </g>`;
}

/* ------------------------------------------------------------------ */
/* SVG: hero banner                                                    */
/* ------------------------------------------------------------------ */

function heroSVG(theme) {
  const t = theme;
  const chips = PROFILE.chips
    .map((label, i) => {
      const w = Math.round(label.length * 6.1 + 26);
      return { label, w };
    })
    .reduce(
      (acc, c) => {
        acc.items.push({ ...c, x: acc.x });
        acc.x += c.w + 12;
        return acc;
      },
      { items: [], x: 26 }
    )
    .items.map(
      (c) => `  <rect x="${c.x}" y="162" width="${c.w}" height="26" rx="13" fill="none" stroke="${t.border}"/>
  <text x="${c.x + c.w / 2}" y="179" text-anchor="middle" font-family="${FONT}" font-size="11.5" font-weight="600" fill="${t.muted}">${esc(c.label)}</text>`
    )
    .join("\n");

  return `<svg width="880" height="230" viewBox="0 0 880 230" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(PROFILE.name)} — ${esc(PROFILE.tagline)}">
  <defs>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${t.accentA}"/>
      <stop offset="1" stop-color="${t.accentB}"/>
    </linearGradient>
  </defs>

  <text x="26" y="46" font-family="${FONT}" font-size="14" font-weight="700" letter-spacing="4" fill="${t.accentA}">${esc(PROFILE.greeting)}</text>
  <text x="24" y="92" font-family="${FONT}" font-size="42" font-weight="800" fill="${t.text}">${esc(PROFILE.name)}</text>
  <text x="26" y="124" font-family="${FONT}" font-size="18" font-weight="600" fill="${t.muted}">${esc(PROFILE.tagline)}</text>
  <text x="26" y="148" font-family="${FONT}" font-size="13" fill="${t.faint}">${esc(PROFILE.affiliation)}</text>

${chips}

  <!-- waving robot -->
  <g stroke-linecap="round">
    <ellipse cx="778" cy="208" rx="46" ry="6" fill="${t.track}"/>
    <!-- antenna -->
    <line x1="778" y1="42" x2="778" y2="31" stroke="${t.muted}" stroke-width="3"/>
    <circle cx="778" cy="26" r="4" fill="${t.accentA}">
      <animate attributeName="opacity" values="1;0.25;1" dur="2.6s" repeatCount="indefinite"/>
    </circle>
    <!-- head -->
    <rect x="757" y="42" width="42" height="32" rx="9" fill="none" stroke="${t.muted}" stroke-width="4"/>
    <circle cx="770" cy="58" r="3.4" fill="${t.accentA}"/>
    <circle cx="786" cy="58" r="3.4" fill="${t.accentA}"/>
    <!-- torso -->
    <line x1="778" y1="78" x2="778" y2="132" stroke="${t.muted}" stroke-width="6"/>
    <!-- left arm -->
    <polyline points="778,92 748,112 740,138" stroke="${t.muted}" stroke-width="5" fill="none"/>
    <!-- right arm: upper + waving forearm -->
    <line x1="778" y1="92" x2="812" y2="76" stroke="${t.muted}" stroke-width="5"/>
    <g>
      <line x1="812" y1="76" x2="830" y2="50" stroke="${t.muted}" stroke-width="5"/>
      <circle cx="830" cy="50" r="6" fill="${t.accentB}"/>
      <animateTransform attributeName="transform" type="rotate" values="0 812 76; 24 812 76; -8 812 76; 24 812 76; 0 812 76" keyTimes="0;0.3;0.5;0.7;1" dur="2.6s" repeatCount="indefinite"/>
    </g>
    <!-- legs -->
    <polyline points="778,132 760,170 758,202" stroke="${t.muted}" stroke-width="5" fill="none"/>
    <polyline points="778,132 796,170 798,202" stroke="${t.muted}" stroke-width="5" fill="none"/>
    <!-- joints -->
    <circle cx="778" cy="92" r="4.5" fill="${t.accentA}"/>
    <circle cx="748" cy="112" r="4.5" fill="${t.accentB}"/>
    <circle cx="812" cy="76" r="4.5" fill="${t.accentB}"/>
    <circle cx="778" cy="132" r="4.5" fill="${t.accentA}"/>
    <circle cx="760" cy="170" r="4.5" fill="${t.accentB}"/>
    <circle cx="796" cy="170" r="4.5" fill="${t.accentB}"/>
  </g>

  <rect x="24" y="214" width="832" height="3" rx="1.5" fill="url(#rule)"/>
</svg>
`;
}

/* ------------------------------------------------------------------ */
/* SVG: year progress                                                  */
/* ------------------------------------------------------------------ */

function yearProgress() {
  const year = new Date().getUTCFullYear();
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  return { year, p: (Date.now() - start) / (end - start) };
}

function yearSVG(theme) {
  const t = theme;
  const { year, p } = yearProgress();
  const x = 96;
  const w = 690;
  const y = 28;
  const h = 10;
  const fillW = Math.max(h, w * p);
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const tx = x + (w * (i + 1)) / 12;
    return `  <line x1="${tx.toFixed(1)}" y1="${y - 1}" x2="${tx.toFixed(1)}" y2="${y + h + 1}" stroke="${t.bg}" stroke-width="2"/>`;
  }).join("\n");

  return `<svg width="880" height="56" viewBox="0 0 880 56" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Year progress: ${(p * 100).toFixed(2)}%">
  <defs>
    <linearGradient id="yp" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${t.accentA}"/>
      <stop offset="1" stop-color="${t.accentB}"/>
    </linearGradient>
    <clipPath id="ypc"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/></clipPath>
  </defs>
  <text x="24" y="${y + 10}" font-family="${FONT}" font-size="20" font-weight="800" fill="${t.text}">${year}</text>
  <text x="${x}" y="${y - 10}" font-family="${FONT}" font-size="10" font-weight="700" letter-spacing="3" fill="${t.faint}">YEAR PROGRESS</text>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${t.track}"/>
  <g clip-path="url(#ypc)">
    <rect x="${x}" y="${y}" width="${fillW.toFixed(1)}" height="${h}" fill="url(#yp)"/>
  </g>
${ticks}
  <circle cx="${(x + fillW).toFixed(1)}" cy="${y + h / 2}" r="5" fill="${t.accentB}" stroke="${t.bg}" stroke-width="2">
    <animate attributeName="r" values="4.5;6;4.5" dur="2s" repeatCount="indefinite"/>
  </circle>
  <text x="856" y="${y + 10}" text-anchor="end" font-family="${FONT}" font-size="17" font-weight="700" fill="${t.accentA}">${(p * 100).toFixed(2)}%</text>
</svg>
`;
}

/* ------------------------------------------------------------------ */
/* SVG: overview card                                                  */
/* ------------------------------------------------------------------ */

const ICONS = {
  star: 'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z',
  person:
    'M10.561 8.073a6 6 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6 6 0 0 1 3.431-5.142 4 4 0 1 1 5.123 0ZM8 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  repo: 'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z',
  graph:
    'M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0Zm14.28 2.53-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06 4.28 9.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0L10 7.94l4.72-4.72a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z',
};

function overviewSVG(theme, stats) {
  const t = theme;
  const cells = [
    { icon: "star", color: t.accentA, value: stats.totalStars, label: "Total Stars" },
    { icon: "person", color: t.accentB, value: stats.followers, label: "Followers" },
    { icon: "repo", color: t.accentB, value: stats.publicRepos, label: "Public Repos" },
    { icon: "graph", color: t.accentA, value: stats.totalContributions, label: `Contributions · since ${stats.sinceYear}` },
  ];
  const grid = cells
    .map((c, i) => {
      const cx = i % 2 === 0 ? 28 : 230;
      const cy = i < 2 ? 64 : 118;
      return `  <g transform="translate(${cx} ${cy})">
    <path transform="scale(1.15)" d="${c.icon === "star" ? ICONS.star : c.icon === "person" ? ICONS.person : c.icon === "repo" ? ICONS.repo : ICONS.graph}" fill="${c.color}"/>
    <text x="30" y="16" font-family="${FONT}" font-size="22" font-weight="800" fill="${t.text}">${c.value}</text>
    <text x="30" y="34" font-family="${FONT}" font-size="11" font-weight="500" fill="${t.muted}">${esc(c.label)}</text>
  </g>`;
    })
    .join("\n");

  return card(
    t,
    430,
    180,
    `  <text x="24" y="33" font-family="${FONT}" font-size="16" font-weight="700" fill="${t.accentA}">GitHub Overview</text>
  <text x="406" y="33" text-anchor="end" font-family="${FONT}" font-size="12" font-weight="600" fill="${t.faint}">@${USERNAME}</text>
${grid}`
  );
}

/* ------------------------------------------------------------------ */
/* SVG: languages card                                                 */
/* ------------------------------------------------------------------ */

function languagesSVG(theme, stats) {
  const t = theme;
  const total = stats.languages.reduce((s, l) => s + l.count, 0) || 1;
  const top = stats.languages.slice(0, 6);
  const segs = top.map((l) => ({
    pct: l.count,
    color: l.color || LANG_COLORS[l.name] || "#8c959f",
  }));
  const legend = top
    .map((l, i) => {
      const x = i % 2 === 0 ? 28 : 230;
      const y = 106 + Math.floor(i / 2) * 24;
      const pct = ((l.count / total) * 100).toFixed(1);
      const color = visibleOn(t, l.color || LANG_COLORS[l.name] || "#8c959f");
      return `  <circle cx="${x}" cy="${y - 4}" r="5" fill="${color}"/>
  <text x="${x + 14}" y="${y}" font-family="${FONT}" font-size="12.5" font-weight="600" fill="${t.text}">${esc(l.name)}</text>
  <text x="${x + 14 + l.name.length * 7.5 + 10}" y="${y}" font-family="${FONT}" font-size="11.5" fill="${t.faint}">${pct}%</text>`;
    })
    .join("\n");

  return card(
    t,
    430,
    180,
    `  <text x="24" y="33" font-family="${FONT}" font-size="16" font-weight="700" fill="${t.accentA}">Repository Languages</text>
  <text x="24" y="52" font-family="${FONT}" font-size="11" fill="${t.faint}">by primary language · ${total} public repos</text>
${stackedBar(t, "langbar", 24, 66, 382, 12, segs)}
${legend}`
  );
}

/* ------------------------------------------------------------------ */
/* SVG: wakatime card                                                  */
/* ------------------------------------------------------------------ */

function wakatimeSVG(theme) {
  const t = theme;
  const wk = PROFILE.wakatime;
  const segs = wk.items.map((l) => ({ pct: l.pct, color: l.color }));
  const legend = wk.items
    .map((l, i) => {
      const x = 24 + i * 168;
      const color = visibleOn(t, l.color);
      return `  <circle cx="${x + 5}" cy="106" r="5" fill="${color}"/>
  <text x="${x + 19}" y="110" font-family="${FONT}" font-size="12.5" font-weight="600" fill="${t.text}">${esc(l.name)}</text>
  <text x="${x + 19}" y="128" font-family="${FONT}" font-size="11.5" fill="${t.faint}">${l.pct.toFixed(1)}%</text>`;
    })
    .join("\n");

  return card(
    t,
    880,
    150,
    `  <text x="24" y="33" font-family="${FONT}" font-size="16" font-weight="700" fill="${t.accentA}">Coding Activity</text>
  <text x="24" y="52" font-family="${FONT}" font-size="11" fill="${t.faint}">all-time via WakaTime · tracked since ${esc(wk.since)} · editors: ${esc(wk.editors)}</text>
${stackedBar(t, "wkbar", 24, 66, 832, 12, segs)}
${legend}`
  );
}

/* ------------------------------------------------------------------ */
/* Live stats (GraphQL with cache fallback)                            */
/* ------------------------------------------------------------------ */

const CACHE_PATH = path.join(__dirname, "assets", "stats", "data.json");

async function gql(token, query) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": USERNAME,
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function fetchLiveStats(token) {
  const base = await gql(
    token,
    `query {
      user(login: "${USERNAME}") {
        createdAt
        followers { totalCount }
        allRepos: repositories(ownerAffiliations: OWNER, privacy: PUBLIC) { totalCount }
        repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false) {
          totalCount
          nodes { stargazerCount primaryLanguage { name color } }
        }
      }
    }`
  );
  const user = base.user;
  const sinceYear = new Date(user.createdAt).getUTCFullYear();
  const thisYear = new Date().getUTCFullYear();

  const aliases = [];
  for (let y = sinceYear; y <= thisYear; y++) {
    aliases.push(
      `y${y}: contributionsCollection(from: "${y}-01-01T00:00:00Z", to: "${y}-12-31T23:59:59Z") { contributionCalendar { totalContributions } }`
    );
  }
  const contrib = await gql(token, `query { user(login: "${USERNAME}") { ${aliases.join("\n")} } }`);
  const totalContributions = Object.values(contrib.user).reduce(
    (s, c) => s + c.contributionCalendar.totalContributions,
    0
  );

  const langCount = new Map();
  for (const repo of user.repositories.nodes) {
    if (!repo.primaryLanguage) continue;
    const { name, color } = repo.primaryLanguage;
    const cur = langCount.get(name) || { name, color, count: 0 };
    cur.count += 1;
    langCount.set(name, cur);
  }
  const languages = [...langCount.values()].sort((a, b) => b.count - a.count);

  return {
    fetchedAt: new Date().toISOString(),
    sinceYear,
    followers: user.followers.totalCount,
    publicRepos: user.allRepos.totalCount,
    totalStars: user.repositories.nodes.reduce((s, r) => s + r.stargazerCount, 0),
    totalContributions,
    languages,
  };
}

async function getStats() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) {
    try {
      const stats = await fetchLiveStats(token);
      fs.writeFileSync(CACHE_PATH, JSON.stringify(stats, null, 2) + "\n");
      console.log(`stats: live (fetched ${stats.fetchedAt})`);
      return stats;
    } catch (err) {
      console.warn(`stats: live fetch failed (${err.message}), falling back to cache`);
    }
  }
  const cached = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  console.log(`stats: cached from ${cached.fetchedAt}`);
  return cached;
}

/* ------------------------------------------------------------------ */
/* README                                                              */
/* ------------------------------------------------------------------ */

const LINKEDIN_GLYPH =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>';

function badgeURL(link) {
  const logo =
    link.logo === "linkedinDataUri"
      ? `data:image/svg+xml;base64,${Buffer.from(LINKEDIN_GLYPH).toString("base64")}`
      : link.logo;
  const enc = (s) => encodeURIComponent(s).replace(/-/g, "--").replace(/_/g, "__");
  return `https://img.shields.io/badge/${enc(link.label)}-${enc(link.message)}-${link.color}?style=flat-square&labelColor=18181b&logo=${encodeURIComponent(logo)}&logoColor=white`;
}

function raw(file, ver) {
  return `https://raw.githubusercontent.com/${USERNAME}/${USERNAME}/master/${file}?v=${ver}`;
}

function pic(lightURL, darkURL, alt, width) {
  const w = width ? ` width="${width}"` : "";
  return `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="${darkURL}">
  <img alt="${alt}" src="${lightURL}"${w}>
</picture>`;
}

function readmeMD(stats, ver) {
  const badges = PROFILE.links
    .map((l) => `  <a href="${l.href}"><img alt="${esc(l.label)}" src="${badgeURL(l)}"></a>`)
    .join("\n");

  const rows = [];
  for (let i = 0; i < PROFILE.projects.length; i += 2) {
    const pair = PROFILE.projects.slice(i, i + 2);
    const cells = pair
      .map((p) => {
        const url = `https://github.com/${USERNAME}/${p.repo}`;
        return `<td width="50%">
  <a href="${url}"><b>${esc(p.title)}</b></a><br/>
  <sub>${esc(p.desc)}</sub><br/><br/>
  <a href="${url}"><img alt="top language" src="https://img.shields.io/github/languages/top/${USERNAME}/${p.repo}?style=flat-square"></a>
  <a href="${url}/stargazers"><img alt="stars" src="https://img.shields.io/github/stars/${USERNAME}/${p.repo}?style=flat-square&label=%E2%98%85&color=4f46e5"></a>
</td>`;
      })
      .join("\n");
    rows.push(`<tr>\n${cells}\n</tr>`);
  }

  const about = PROFILE.about.map((line) => `- ${line}`).join("\n");
  const updated = new Date().toUTCString();

  return `<div align="center">

${pic(raw("assets/hero-light.svg", ver), raw("assets/hero-dark.svg", ver), `${PROFILE.name} — ${PROFILE.tagline}`, 880)}

<p>
${badges}
</p>

${pic(raw("assets/stats/year-light.svg", ver), raw("assets/stats/year-dark.svg", ver), "Year progress", 880)}

</div>

## 🧭 About

${about}

## 🔬 Featured Projects

<table>
${rows.join("\n")}
</table>

## 🛠️ Tech Stack

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://skillicons.dev/icons?i=${PROFILE.skills}&theme=dark">
    <img alt="Tech stack" src="https://skillicons.dev/icons?i=${PROFILE.skills}&theme=light">
  </picture>
</div>

## 📊 Stats

<div align="center">

${pic(raw("assets/stats/overview-light.svg", ver), raw("assets/stats/overview-dark.svg", ver), "GitHub overview")}&nbsp;${pic(raw("assets/stats/languages-light.svg", ver), raw("assets/stats/languages-dark.svg", ver), "Repository languages")}

${pic(raw("assets/stats/wakatime-light.svg", ver), raw("assets/stats/wakatime-dark.svg", ver), "Coding activity")}

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${USERNAME}/${USERNAME}/output/github-contribution-grid-snake-dark.svg">
  <img alt="Contribution snake" src="https://raw.githubusercontent.com/${USERNAME}/${USERNAME}/output/github-contribution-grid-snake.svg">
</picture>

</div>

---

<div align="center">
<sub>⏰ Auto-refreshed every 6 hours by GitHub Actions · last update ${updated} · <img alt="profile views" src="https://komarev.com/ghpvc/?username=${USERNAME}&abbreviated=true&color=4f46e5&style=flat-square"></sub>
</div>
`;
}

/* ------------------------------------------------------------------ */
/* Local preview (gitignored) — full README mock-up in both themes    */
/* ------------------------------------------------------------------ */

function previewHTML(stats) {
  const bold = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

  const pane = (t) => {
    const s = t.suffix;
    const badges = PROFILE.links
      .map((l) => `<a href="${l.href}"><img alt="${esc(l.label)}" src="${badgeURL(l)}"></a>`)
      .join("\n        ");
    const about = PROFILE.about.map((line) => `<li>${bold(line)}</li>`).join("\n      ");
    const rows = [];
    for (let i = 0; i < PROFILE.projects.length; i += 2) {
      const cells = PROFILE.projects
        .slice(i, i + 2)
        .map((p) => {
          const url = `https://github.com/${USERNAME}/${p.repo}`;
          return `<td><a href="${url}"><b>${esc(p.title)}</b></a><br><sub>${esc(p.desc)}</sub><br><br>
          <img src="https://img.shields.io/github/languages/top/${USERNAME}/${p.repo}?style=flat-square">
          <img src="https://img.shields.io/github/stars/${USERNAME}/${p.repo}?style=flat-square&label=%E2%98%85&color=4f46e5"></td>`;
        })
        .join("\n        ");
      rows.push(`<tr>\n        ${cells}\n        </tr>`);
    }
    const snake =
      s === "dark"
        ? `https://raw.githubusercontent.com/${USERNAME}/${USERNAME}/output/github-contribution-grid-snake-dark.svg`
        : `https://raw.githubusercontent.com/${USERNAME}/${USERNAME}/output/github-contribution-grid-snake.svg`;
    return `
  <div class="pane ${s}">
    <div class="markdown-body">
      <div class="center">
        <img src="assets/hero-${s}.svg" width="880">
        <p>
        ${badges}
        </p>
        <img src="assets/stats/year-${s}.svg" width="880">
      </div>
      <h2>🧭 About</h2>
      <ul>
      ${about}
      </ul>
      <h2>🔬 Featured Projects</h2>
      <table>
        ${rows.join("\n        ")}
      </table>
      <h2>🛠️ Tech Stack</h2>
      <div class="center">
        <img src="https://skillicons.dev/icons?i=${PROFILE.skills}&theme=${s}">
      </div>
      <h2>📊 Stats</h2>
      <div class="center">
        <img src="assets/stats/overview-${s}.svg">&nbsp;<img src="assets/stats/languages-${s}.svg">
        <br><br>
        <img src="assets/stats/wakatime-${s}.svg">
      </div>
      <details open>
        <summary>🐍 Contribution snake</summary>
        <br>
        <div class="center"><img src="${snake}"></div>
      </details>
      <hr>
      <div class="center"><sub>⏰ Auto-refreshed every 6 hours by GitHub Actions · last update ${new Date().toUTCString()} · <img src="https://komarev.com/ghpvc/?username=${USERNAME}&abbreviated=true&color=4f46e5&style=flat-square"></sub></div>
    </div>
  </div>`;
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Profile README preview — @${USERNAME}</title>
<style>
  body { margin: 0; font: 16px/1.6 -apple-system, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif; }
  .banner { padding: 10px 24px; background: #fff8c5; color: #1f2328; font-size: 13px; border-bottom: 1px solid #d4a72c66; position: sticky; top: 0; }
  .pane { padding: 40px 16px; }
  .pane.light { background: #ffffff; color: #1f2328; }
  .pane.dark { background: #0d1117; color: #e6edf3; }
  .markdown-body { max-width: 896px; margin: 0 auto; }
  .center { text-align: center; }
  img { max-width: 100%; vertical-align: middle; }
  h2 { font-size: 1.5em; font-weight: 600; padding-bottom: .3em; margin: 24px 0 16px; border-bottom: 1px solid; }
  .light h2, .light hr { border-color: #d8dee4; }
  .dark h2, .dark hr { border-color: #30363d; }
  hr { border: 0; border-top: 1px solid; margin: 24px 0; }
  a { text-decoration: none; }
  .light a { color: #0969da; }
  .dark a { color: #58a6ff; }
  table { border-collapse: collapse; width: 100%; }
  td { width: 50%; padding: 6px 13px; border: 1px solid; vertical-align: top; }
  .light td { border-color: #d8dee4; }
  .dark td { border-color: #30363d; }
  sub { opacity: .8; }
  details { margin: 16px 0; }
  summary { cursor: pointer; }
</style>
</head>
<body>
<div class="banner">⚠️ Local preview of README.md — top: light mode, bottom: dark mode. GitHub picks one automatically via <code>prefers-color-scheme</code>. The snake images load from the <code>output</code> branch (need network; regenerated daily by CI).</div>
${pane(THEMES.light)}
${pane(THEMES.dark)}
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

(async () => {
  const stats = await getStats();
  const ver = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 12);

  const out = (file, content) => {
    fs.mkdirSync(path.dirname(path.join(__dirname, file)), { recursive: true });
    fs.writeFileSync(path.join(__dirname, file), content);
    console.log(`wrote ${file}`);
  };

  for (const theme of Object.values(THEMES)) {
    const s = theme.suffix;
    out(`assets/hero-${s}.svg`, heroSVG(theme));
    out(`assets/stats/year-${s}.svg`, yearSVG(theme));
    out(`assets/stats/overview-${s}.svg`, overviewSVG(theme, stats));
    out(`assets/stats/languages-${s}.svg`, languagesSVG(theme, stats));
    out(`assets/stats/wakatime-${s}.svg`, wakatimeSVG(theme));
  }
  out("README.md", readmeMD(stats, ver));
  out("preview.html", previewHTML(stats));
})();
