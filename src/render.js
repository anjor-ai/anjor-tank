import { SITE, CASES, CHAPTERS, PHOTOS, ALT, LOVES, EDU } from "./content.js";
import { WM } from "./wm.js";
import { LABS } from "./lab-data.js";
export const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const rich = (v) => esc(v).replace(/\*([^*]+)\*/g, "<em>$1</em>");
const link = (href, label, cls = "button") =>
  `<a class="${cls}" href="${href}">${label}<span aria-hidden="true">↗</span></a>`;
const label = (t) => `<p class="eyebrow">${t}</p>`;
const intro = (k, h, p) =>
  `<header class="page-head wrap">${label(k)}<h1>${h}</h1><p class="lead">${p}</p></header>`;
const navItems = [
  ["/work", "Work"],
  ["/experience", "Experience"],
  ["/founder", "MESHHETU"],
  ["/about", "Outside work"],
];
export function reel(size = "nav") {
  return `<span class="rl rl--${size}" data-rl="${size}" role="img" aria-label="Anjor Tank">${WM.boxes
    .map(([a, b]) => {
      const bw = b - a,
        p = (a / (WM.w - bw)) * 100;
      return `<span class="rl__slot" style="left:${(a / WM.w) * 100}%;width:${(bw / WM.w) * 100}%"><span class="rl__ch" style="mask-size:${(WM.w / bw) * 100}% 100%;mask-position:${p}% 0;-webkit-mask-size:${(WM.w / bw) * 100}% 100%;-webkit-mask-position:${p}% 0"></span><span class="rl__tile" aria-hidden="true"><canvas></canvas></span></span>`;
    })
    .join("")}</span>`;
}
const cta = () =>
  `<section class="closing wrap">${label("NEXT / START A CONVERSATION")}<h2>Bring a problem.<br><em>Let’s find the useful next step.</em></h2>${link("/contact", "Work with me")}<a class="text-link" href="mailto:${SITE.email}">${SITE.email} ↗</a></section>`;
export function shell(r) {
  return `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(r.title)} | Anjor Tank</title><meta name="description" content="${esc(r.desc)}"><meta name="theme-color" content="#090d18"><meta name="color-scheme" content="dark light"><link rel="canonical" href="${SITE.origin}${r.path === "/" ? "" : r.path}"><link rel="icon" href="/favicon.svg"><meta property="og:title" content="${esc(r.title)} | Anjor Tank"><meta property="og:description" content="${esc(r.desc)}"><meta property="og:image" content="${SITE.origin}/og-image.jpg"><meta property="og:type" content="website"><meta property="og:url" content="${SITE.origin}${r.path}"><meta name="twitter:card" content="summary_large_image">${r.path === "/404" ? '<meta name="robots" content="noindex">' : ""}<script src="/theme-init.js"></script></head><body><a class="skip" href="#main">Skip to content</a><header class="nav"><a class="brand" href="/" aria-label="Anjor Tank home">${reel()}</a><nav aria-label="Main navigation">${navItems.map(([u, t]) => `<a href="${u}" ${r.path.startsWith(u) ? 'aria-current="page"' : ""}>${t}</a>`).join("")}</nav><div class="nav-actions"><button id="theme" aria-label="Switch colour theme">◐</button>${link("/hire", "Let’s talk", "button small")}<button id="menu" aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-nav">☰</button></div><nav id="mobile-nav" aria-label="Mobile navigation" hidden>${[...navItems, ["/hire", "Consulting"], ["/contact", "Contact"]].map(([u, t]) => `<a href="${u}">${t} ↗</a>`).join("")}</nav></header><main id="main">${r.body()}</main><footer class="wrap"><div class="footer-top"><p>Product Manager at GNC India.<br>Founder, MESHHETU.</p><div><a href="${SITE.linkedin}">LinkedIn ↗</a><a href="${SITE.meshhetu}">MESHHETU ↗</a><a href="mailto:${SITE.email}">Email ↗</a></div><span>Mumbai, India<br>© 2026 Anjor Tank</span></div><a href="/" class="footer-word" aria-label="Anjor Tank home">${reel("foot")}</a><div class="footer-bottom"><span>Curiosity in. Useful things out.</span><button id="motion" aria-pressed="false">Pause motion</button><a href="#main">Back to top ↑</a></div></footer><script type="module" src="/src/main.js"></script></body></html>`;
}
const destinations = [
  ["W", "Work", "/work", "Product decisions", "monitor"],
  ["E", "Experience", "/experience", "The career so far", "steps"],
  ["M", "MESHHETU", "/founder", "Building my own company", "nodes"],
  ["C", "Consulting", "/hire", "Two ways to work together", "orbit"],
  ["A", "Outside work", "/about", "Life beyond the backlog", "mountain"],
  ["↵", "Say hello", "/contact", "Start a conversation", "mail"],
];
function keyboard() {
  return `<div class="keyboard-scene" data-keyboard-root><div class="orbital-line" aria-hidden="true"></div><div class="keyboard"><div class="keyboard-top"><span>AT / FIELD NOTES 001</span><span class="led">EXPLORE THE WORKSPACE</span><span>EST. MUMBAI</span></div><div class="destination-row">${destinations.map(([key, t, url, desc, shape], i) => `<a class="destination destination-${i}" href="${url}" data-key="${key}" data-caption="${desc}" aria-label="${t}: ${desc}"><span class="key-number">0${i + 1}</span><span class="sculpture ${shape}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="key-label">${t}</span><kbd>${key}</kbd></a>`).join("")}</div><div class="typing-rows" aria-hidden="true">${[
    "ESC 1 2 3 4 5 6 7 8 9 0 − + DEL",
    "TAB Q W E R T Y U I O P [ ]",
    "CAPS A S D F G H J K L ; ENTER",
    "SHIFT Z X C V B N M , . / ↑",
  ]
    .map(
      (row) =>
        `<div class="typing-row">${row
          .split(" ")
          .map(
            (k) =>
              `<span class="physical-key ${k.length > 1 ? "wide" : ""}" data-letter="${k}">${k}</span>`,
          )
          .join("")}</div>`,
    )
    .join(
      "",
    )}<div class="typing-row"><span class="physical-key">fn</span><span class="physical-key">ctrl</span><span class="physical-key">⌘</span><span class="physical-key space">CURIOSITY IS THE OPERATING SYSTEM.</span><span class="physical-key">←</span><span class="physical-key">↓</span><span class="physical-key">→</span></div></div><div class="keyboard-lip"><span>ANJOR TANK</span><span>PRODUCT / SYSTEMS / PEOPLE</span><i></i></div></div></div><div class="keyboard-caption"><span class="led" id="key-preview">Choose a key. Open a different part of my world.</span><span>CLICK TO EXPLORE · TAB + ENTER</span></div><div class="mobile-destinations">${destinations.map(([k, t, u]) => `<a href="${u}">${t} <span>↗</span></a>`).join("")}</div><div class="terminal"><label for="hello-input">TRY THE KEYS <span aria-hidden="true">›</span></label><input id="hello-input" maxlength="32" placeholder="Type hello…" autocomplete="off"><output id="hello-output" aria-live="polite">A small hello goes a long way.</output></div>`;
}
const names = [
  "Make the price a promise.",
  "Give growth the controls.",
  "Catch the stockout earlier.",
  "Close the loop after the click.",
  "Find the intent behind the query.",
  "Automate the simple. Own the exceptions.",
  "Give every issue an owner.",
];
function cards(all = false) {
  return `<div class="work-grid">${CASES.slice(0, all ? 7 : 3)
    .map(
      (c, i) =>
        `<a class="work-card" href="/work/${c.slug}" data-category="${c.tag}"><div class="card-art art-${i}"><span class="art-tag">${c.tag.toUpperCase()} / ${c.n}</span><div class="mini-system">${LABS[c.slug].flow.map((x, k) => `<span><i>${k === 3 ? "✓" : String(k + 1).padStart(2, "0")}</i>${esc(x)}</span>`).join("")}</div><strong>${esc(c.metrics[0][0])}</strong><small>${esc(c.metrics[0][1])}</small></div><div class="card-copy"><span class="eyebrow">TRUEMEDS · ${esc(c.cat)}</span><h3>${names[i]}</h3><p>${esc(c.line)}</p><span class="card-link">Explore the decision <b>↗</b></span></div></a>`,
    )
    .join("")}</div>`;
}
function founderBlock() {
  return `<section class="founder-feature wrap"><div class="founder-art" aria-hidden="true"><div class="node-network"><i></i><i></i><i></i><i></i><i></i><i></i><b>हेतु</b></div><span>MESHHETU</span><small>RETHINK HOW SYSTEMS WORK.</small></div><div>${label("FOUNDER / A COMPANY OF MY OWN")}<h2>Build with a purpose.<br><em>Connect what matters.</em></h2><p>I founded MESHHETU to bring product thinking and systems engineering to the gaps between commercial tools, teams and decisions.</p><p>My focus: define the problem, design the decision logic, and turn it into work a team can act on.</p><div class="inline-actions">${link("/founder", "Inside MESHHETU")}${link("/hire", "Explore consulting", "text-link")}</div><div class="track-strip"><span>A / STRATEGY</span><span>B / INTELLIGENCE</span><span>C / ROQIVA · IN DEVELOPMENT</span></div></div></section>`;
}
function home() {
  return `<section class="hero wrap">${label('<span class="status-dot"></span> ANJOR TANK / PRODUCT MANAGER & FOUNDER')}<h1>Find the friction.<br>Build what <em>moves things forward.</em></h1><p class="hero-lead">I connect customer behaviour, product decisions and the systems behind them. <br>Currently at GNC India. Building MESHHETU alongside it.</p>${keyboard()}</section><section class="identity-bar wrap"><span>CONSUMER PRODUCT</span><span>GROWTH & PAYMENTS</span><span>INTERNAL PLATFORMS</span><span>GTM & REVENUE SYSTEMS</span></section><section class="section wrap"><div class="section-heading"><div>${label("01 / SELECTED WORK")}<h2>See the decisions.<br><em>Then explore the systems.</em></h2></div><p>From checkout to the warehouse floor: product work that connects the customer experience to what happens underneath it.</p></div>${cards()}${link("/work", "Explore all seven case studies", "text-link")}</section>${founderBlock()}<section class="section wrap home-xp"><div class="section-heading"><div>${label("03 / THE WORK, TODAY")}<h2>Consumer instincts.<br><em>Systems thinking.</em></h2></div>${link("/experience", "Follow the career", "text-link")}</div><div class="role-pair"><article><span class="eyebrow">OCT 2026 — NOW</span><h3>GNC India</h3><p>Product Manager</p><p>Ecommerce, growth and the internal platforms behind the customer experience.</p></article><article><span class="eyebrow">DEC 2023 — JUL 2026</span><h3>Truemeds</h3><p>Associate Product Manager</p><p>Payments, discovery, retention and operations. A product education that extended all the way to the warehouse.</p></article></div></section><section class="personal-teaser wrap"><div>${label("04 / OFF THE CLOCK")}<h2>There’s more to me<br><em>than the next release.</em></h2><p>Karting lines. Live music. The long way home.<br>Curiosity tends to follow me outside work.</p>${link("/about", "Meet the person", "text-link")}</div><div class="photo-fan">${["kart-grid", "paddle", "laser"].map((p, i) => `<img src="/img/adventure/${p}.webp" alt="${esc(ALT[p])}" loading="lazy" style="--i:${i}">`).join("")}</div></section>${cta()}`;
}
function work() {
  return `${intro("WORK / THE DECISIONS BEHIND THE OUTPUT", "Useful products start with<br><em>a problem worth understanding.</em>", "Explore seven projects from my time at Truemeds. Each includes the context, the trade-offs, and an interactive explanation of the underlying logic.")}<section class="wrap section compact"><div class="filters" aria-label="Filter case studies">${["All", "Payments", "Growth", "Operations", "Search", "AI"].map((t, i) => `<button data-filter="${t}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div>${cards(true)}<p class="note">Results are reported from prior project records. Interactive examples use illustrative inputs; they are not live company systems.</p></section>${cta()}`;
}
function lab(c) {
  const l = LABS[c.slug];
  return `<section class="case-lab" data-lab="${c.slug}"><div class="workspace-top"><span><i class="status-dot"></i> DECISION WORKSPACE / ${c.n}</span><span>ILLUSTRATIVE · INTERACTIVE</span></div><div class="workspace-body"><aside>${label("CHOOSE A SCENARIO")}${l.choices.map((x, i) => `<button data-scenario="${i}" aria-pressed="${i === 0}"><span>0${i + 1}</span>${x}<b>↗</b></button>`).join("")}</aside><div class="lab-stage"><h3>${l.title}</h3><div class="flow">${l.flow.map((x, i) => `<span><i>0${i + 1}</i>${x}</span>`).join("")}</div><div class="lab-result" aria-live="polite"><span data-result-number>${l.results[0][0]}</span><div><b data-result-title>${l.results[0][1]}</b><p data-result-copy>${l.results[0][2]}</p></div></div><button class="text-link" data-reset>Reset scenario ↺</button></div></div></section>`;
}
function bodySection(b) {
  return `<section class="case-section" id="${b.id}">${label(b.id.toUpperCase())}<h2>${esc(b.h)}</h2>${(b.p || []).map((p) => `<p>${rich(p)}</p>`).join("")}${b.call ? `<blockquote>${rich(b.call)}</blockquote>` : ""}${b.bullets ? `<ul>${b.bullets.map((x) => `<li>${rich(x)}</li>`).join("")}</ul>` : ""}${b.items ? `<div class="build-items">${b.items.map((x) => `<article><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></article>`).join("")}</div>` : ""}${b.table ? `<div class="table-scroll"><table><thead><tr>${b.table.head.map((x) => `<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${b.table.rows.map((row) => `<tr>${row.map((x) => `<td>${esc(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : ""}${["skipped", "validation", "after"].map((k) => (b[k] ? `<p><b>${{ skipped: "The trade-off", validation: "Validation", after: "The learning" }[k]}.</b> ${esc(b[k])}</p>` : "")).join("")}</section>`;
}
function casePage(c) {
  return `${intro(`WORK / ${c.cat.toUpperCase()} · TRUEMEDS`, names[CASES.indexOf(c)], esc(c.line))}<section class="wrap"><div class="metrics">${c.metrics.map(([v, t]) => `<div><strong>${esc(v)}</strong><span>${esc(t)}</span></div>`).join("")}</div><p class="note">Reported project outcomes · Associate Product Manager · ${c.year}. The illustrative workspace below does not calculate these reported outcomes.</p>${lab(c)}<div class="case-layout"><nav class="case-index" aria-label="Case study sections">${c.body.map((b) => `<a href="#${b.id}">${esc(b.h)}</a>`).join("")}</nav><div>${c.body.map(bodySection).join("")}</div></div><div class="case-next">${link("/work", "All case studies", "text-link")}${link("/work/" + CASES[(CASES.indexOf(c) + 1) % CASES.length].slug, "Next decision")}</div></section>${cta()}`;
}
function experience() {
  const roles = CHAPTERS.flatMap((c) => c.roles)
    .filter((r) => r.org !== "MESHHETU")
    .reverse();
  return `${intro("EXPERIENCE / 2021 — NOW", "Understand the customer.<br><em>Then build the system.</em>", "Marketing taught me how demand is created. Product taught me how much has to work after someone decides to buy.")}<section class="wrap section compact"><div class="timeline">${roles.map((r, i) => `<article class="timeline-row"><div><span class="eyebrow">${esc(r.when)}</span><span class="timeline-num">0${i + 1}</span></div><div><h2>${esc(r.org)}</h2><h3>${esc(r.role)}</h3><p>${esc(r.text)}</p>${r.tags ? `<div class="tags">${r.tags.map((t) => `<span>${t}</span>`).join("")}</div>` : ""}</div></article>`).join("")}</div><div class="education">${label("FOUNDATIONS")}${EDU.map(([a, b]) => `<p><b>${a}</b><br>${b}</p>`).join("")}</div></section><section class="wrap founder-note">${label("SEPARATELY / FOUNDER")}<h2>And a company I’m building.</h2><p>MESHHETU is my independent founding role, with its own services, product direction and ambition.</p>${link("/founder", "Explore MESHHETU")}</section>${cta()}`;
}
function founder() {
  return `${intro("MESHHETU / FOUNDER & PRODUCT ARCHITECT", "Rethink how<br><em>systems work.</em>", "I’m building a company around a recurring observation: capable teams and good tools still lose momentum at the handoffs between them.")}${founderBlock()}<section class="section wrap"><div class="section-heading"><div>${label("MY FOUNDER ROLE")}<h2>Give every system<br><em>a reason to exist.</em></h2></div><p>I shape product direction, commercial problem framing, decision logic and requirements. The work connects strategy to practical delivery, with evidence and clear owners at each step.</p></div><div class="principles">${[
    [
      "01",
      "Find the missing connection.",
      "Start with the signals, the people who use them, and the decision that is failing.",
    ],
    [
      "02",
      "Choose the practical response.",
      "Compare the options. Make the trade-off explicit. Build on the tools already in place.",
    ],
    [
      "03",
      "Stay accountable to the outcome.",
      "Agree what success means, who approves the work, and how the result will be reviewed.",
    ],
  ]
    .map(
      ([n, h, p]) =>
        `<article><span>${n}</span><h3>${h}</h3><p>${p}</p></article>`,
    )
    .join(
      "",
    )}</div></section>${tracks()}<section class="roqiva wrap"><div>${label("TRACK C / PRODUCT IN DEVELOPMENT")}<h2>One intelligence layer.<br><em>A connected decision history.</em></h2><p>ROQIVA explores how a brand’s signals, context, specialist agents and human approvals can work together inside its existing architecture.</p>${link("https://meshhetu.com/roqiva", "Explore the ROQIVA concept")}</div><div class="roqiva-system"><span>SIGNALS</span><div><b>BRAND BRAIN</b><small>Context · Decisions · Evidence</small></div><span>AGENTS DRAFT</span><span>PEOPLE APPROVE</span><span>OUTCOMES REVIEWED</span></div></section>${cta()}`;
}
function tracks() {
  return `<section class="section wrap home-consult" id="consulting"><div class="section-heading"><div>${label("WORK WITH ME / THROUGH MESHHETU")}<h2>Choose the help<br><em>your team needs now.</em></h2></div><p>Two ways to turn a commercial problem into useful next steps. Scope the work around your team and the systems you already have.</p></div><div class="track-grid"><article id="track-a"><span class="track-letter">A</span><span class="eyebrow">TRACK A · AVAILABLE NOW</span><h3>Strategic consulting</h3><p>Clarify the problem. Compare the options. Give your team a plan they can act on.</p><ul><li>Decision audits and research briefs</li><li>Growth strategy and prioritisation</li><li>PRDs and execution-ready requirements</li><li>Delivery governance and outcome reviews</li></ul>${link("/contact?track=A", "Discuss a consulting brief", "text-link")}</article><article id="track-b"><span class="track-letter">B</span><span class="eyebrow">TRACK B · AVAILABLE NOW</span><h3>Modular systems intelligence</h3><p>Keep important signals visible without rebuilding your stack.</p><ul><li>Focused context and diagnostics</li><li>Recurring findings from approved inputs</li><li>Monitoring at an agreed cadence</li><li>Evidence and recommendations for review</li></ul>${link("/contact?track=B", "Discuss an intelligence module", "text-link")}</article></div><p class="note">Implementation and release responsibilities are agreed in scope. ROQIVA is a separate product in development.</p></section>`;
}
function hire() {
  return `${intro("CONSULTING / LET’S MAKE SOMETHING USEFUL", "Bring one stuck metric.<br><em>Or one broken handoff.</em>", "I work with ecommerce and consumer teams through MESHHETU: from diagnosing friction to specifying the next change and reviewing what happened.")}<div class="wrap">${link("/contact", "Start with a conversation")}</div>${tracks()}<section class="wrap section"><div class="section-heading"><div>${label("HOW WE START")}<h2>A useful first conversation.<br><em>A clear next step.</em></h2></div></div><div class="principles">${[
    [
      "01",
      "Bring the context.",
      "One problem, the tools involved, and what you have already tried.",
    ],
    [
      "02",
      "Choose the right scope.",
      "Agree the question, approved inputs, deliverables and decision owner.",
    ],
    [
      "03",
      "Review the evidence.",
      "Separate what is known from what still needs testing. Decide what happens next.",
    ],
  ]
    .map(
      ([n, h, p]) =>
        `<article><span>${n}</span><h3>${h}</h3><p>${p}</p></article>`,
    )
    .join("")}</div></section>${cta()}`;
}
function about() {
  return `<section class="about-head wrap"><div>${label("OUTSIDE WORK / STILL CURIOUS")}<h1>Good questions.<br>Fast corners.<br><em>Loud rooms.</em></h1><p class="lead">I’m Anjor. Product manager, founder, and usually curious about how something works—or where the next detour leads.</p><div class="tags"><span>MUMBAI</span><span>F1 & KARTING</span><span>EDM & TECHNO</span></div></div><img src="/img/anjor.webp" alt="Anjor Tank" fetchpriority="high"></section><section class="wrap section"><div class="section-heading"><div>${label("THE PERSONAL OPERATING SYSTEM")}<h2>Notice the details.<br><em>Follow the curiosity.</em></h2></div><p>Whether it is a customer journey, a watch mechanism or a racing line, I like understanding the choices that make something feel right.</p></div><div class="interests">${LOVES.map(([t, p]) => `<article><h3>${t}</h3><p>${p}</p></article>`).join("")}</div></section><section class="wrap section compact"><div class="filters" aria-label="Filter photographs">${["All", "Speed", "Live", "Wander"].map((x, i) => `<button data-photo-filter="${x}" aria-pressed="${i === 0}">${x}</button>`).join("")}</div><div class="photo-grid">${PHOTOS.map((p) => `<figure data-photo-category="${p.g}"><img src="/img/adventure/${p.src}.webp" alt="${esc(ALT[p.src])}" loading="lazy"><figcaption><span>${p.cap}</span><small>${p.g}</small></figcaption></figure>`).join("")}</div></section>${cta()}`;
}
function contact() {
  return `${intro("CONTACT / OPEN A CONVERSATION", "Tell me what<br><em>you’re trying to change.</em>", "A product challenge, a consulting brief, or an interesting idea. Start with a little context and we can take it from there.")}<section class="contact-grid wrap"><div class="contact-card">${label("DIRECT LINE")}<a class="email-link" href="mailto:${SITE.email}">${SITE.email} ↗</a><p>Based in Mumbai. Working across product, growth and the systems that connect them.</p>${link(SITE.linkedin, "Connect on LinkedIn", "text-link")}${link(SITE.calendly, "Find a time to talk", "text-link")}</div><form id="brief-form"><label for="intent">What brings you here?</label><select id="intent"><option value="A">Track A · Strategic consulting</option><option value="B">Track B · Modular intelligence</option><option value="Product">Product opportunity</option><option value="Hello">Just saying hello</option></select><label for="brief-name">Your name</label><input id="brief-name" required maxlength="100" autocomplete="name" placeholder="What should I call you?"><label for="brief">The short version</label><textarea id="brief" required maxlength="3000" rows="5" placeholder="The problem, the context, and what a useful outcome looks like…"></textarea><button class="button" type="submit">Prepare email <span>↗</span></button><p class="note">Opens a draft in your email app. You review and send it.</p><output id="brief-status" aria-live="polite"></output></form></section>${cta()}`;
}
export function routes() {
  return [
    { path: "/", title: "Product thinking. Connected systems.", body: home },
    { path: "/work", title: "Selected work", body: work },
    ...CASES.map((c) => ({
      path: "/work/" + c.slug,
      title: c.title,
      desc: c.line,
      body: () => casePage(c),
    })),
    { path: "/experience", title: "Experience", body: experience },
    { path: "/founder", title: "Founder of MESHHETU", body: founder },
    { path: "/hire", title: "Consulting · MESHHETU Track A & B", body: hire },
    { path: "/about", title: "Outside work", body: about },
    { path: "/contact", title: "Let’s talk", body: contact },
    {
      path: "/404",
      title: "Page not found",
      body: () =>
        intro(
          "404 / A SMALL DETOUR",
          "This page took<br><em>a different turn.</em>",
          '<a href="/">Back to the homepage ↗</a>',
        ),
    },
  ].map((r) => ({
    ...r,
    file:
      r.path === "/"
        ? "index.html"
        : r.path === "/404"
          ? "404.html"
          : r.path.slice(1) + "/index.html",
    desc:
      r.desc ||
      "Anjor Tank. Product Manager at GNC India and founder of MESHHETU. Explore product work, systems thinking, consulting and life outside work.",
  }));
}
export const renderRoute = (r) => shell(r);
