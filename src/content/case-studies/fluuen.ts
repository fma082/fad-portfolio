import type { Block, CaseStudy, CaseLinks } from "@/types/case-study";
import { fluuenData as f } from "./_data/fluuen";

/* Every figure below is derived from `_data/fluuen.ts`, which was read out of
   Figma, the token repo and the product repo. Nothing here restates a number.

   Two rules this file has to keep, both from the data file's own comments:
   - The Overview publishes the Figma count alone. The CSS count appears once,
     in section 03, beside the drift — never on its own, never above it.
   - Nothing from the Fluuen repo's May 2026 CLAUDE.md that does not exist in
     the code is mentioned anywhere. That document was a starting spec, written
     before the product existed, and was never reconciled. */

/* ── Derivations ────────────────────────────────────────────────────────── */

const link = (id: (typeof f.links)[number]["id"]) =>
  f.links.find((l) => l.id === id && l.linked)?.href;

/* Three in the hero: `live` comes first and gets the solid treatment.
   The token repo is deliberately not here — it is the least actionable of the
   four for a visitor, and a fourth button dilutes the other three. It is linked
   inside section 02 instead, next to the pipeline it is the source for.
   The product repo is private, so it has `linked: false` in the data file and
   resolves to undefined — CaseLinks renders nothing for a missing key. */
const links: CaseLinks = {
  live: link("demo"),
  figma: link("figma"),
  storybook: link("storybook"),
};

const { published, alternate, drift, layers } = f.tokens;

/* Product captures. Dimensions are read from the PNG header at build time by
   ImageFrame, so the frame takes the shape of the file and no ratio is
   restated here. Integrations.png is in the folder and deliberately unplaced. */
const SHOT = (name: string) =>
  `/images/projects/fluuen/${encodeURIComponent(name)}.png`;

const divergenceCount = drift.cssOnly + drift.figmaOnly;

/* Section 04 covers the Agent Builder sweep: entries 1-6. Entry 7 is the
   pipeline-wide typography drift and 8 is the screens boundary, and both are
   argued in their own sections. */
const agentBuilderDivergences = f.divergences.filter((d) => d.id <= 6);

/* Looked up by id rather than by index: the ids are stable in the data file,
   the array order is not guaranteed to stay that way. */
const divergence = (id: number) => {
  const found = f.divergences.find((d) => d.id === id);
  if (!found) throw new Error(`fluuen: divergence ${id} is missing from _data`);
  return found;
};

const CATEGORY_LABEL: Record<string, string> = {
  "mechanical-sync": "Mechanical sync",
  "product-decision": "Product decision",
  "figma-ahead": "Figma-ahead",
  pipeline: "Pipeline",
  "by-design": "By design",
};

const STATUS_LABEL: Record<string, string> = {
  permanent: "Permanent",
  debt: "Debt",
};

const statusLabel = (d: (typeof f.divergences)[number]) =>
  d.priority === "high"
    ? `${STATUS_LABEL[d.status]} · high priority`
    : STATUS_LABEL[d.status];

/* ── 00 · Overview ──────────────────────────────────────────────────────── */

const overview: Block[] = [
  {
    type: "section",
    num: "00",
    label: "Overview",
    title: "A design system, and a product built to find out whether it held",
    body: [
      "Fluuen is a B2B no-code automation platform with AI agents, built and shipped as a navigable demo. It has a public landing page, an authenticated app — dashboard, agents, run history, integrations, settings — and an Agent Builder: a full-screen node canvas that is the product's flagship screen.",
      "The order of events was not the order the finished thing suggests. The system came first: primitives, the River Styx scale, a typographic migration, component tokens by layer. The product came four months later, and it came as a portfolio demo — something to send in a proposal. What changed along the way was the reading, not the plan. Building the product was what tested whether the system held, and the test turned out to be worth more than the artefact it was built to demonstrate.",
      `That is the claim this case study can make and defend: ${published.total} color tokens across ${layers.length} layers, generated from Figma into a product that runs on them. Not a finished design system — a system that survived contact with production, and a record of what that contact exposed.`,
    ],
  },
];

/* ── 01 · Where truth lives ─────────────────────────────────────────────── */

const truth: Block[] = [
  {
    type: "section",
    num: "01",
    label: "Where truth lives",
    title: "Every artefact declares what it is the source of",
    body: [
      "A design system spread across Figma and a repository has to answer one question before anything else: when the two disagree, which one is wrong? Answering it per artefact rather than globally is what makes the rest of this project legible.",
      "For tokens, the source is Figma. Colour is authored there, pushed through Tokens Studio to a repository, and generated into CSS — the code never originates a value. For screens, the source is the code. The shipped screens do not exist in Figma, and that is the boundary, not a gap in the work.",
    ],
  },
  {
    type: "tokenChain",
    title: "One token, three layers",
    /* The chain behind the label colour of a success agent badge. Read from
       tokens-source.json; the readable names are the flattened form the CSS
       ships, not the Figma paths they came from. */
    steps: [
      { layer: "Component", name: "status badge", detail: "success-text" },
      { layer: "Semantic", name: f.tokens.badgeStates[0].semantic },
      { layer: "Primitive", name: f.tokens.badgeStates[0].primitive },
      { layer: "Value", name: f.tokens.badgeStates[0].hex },
    ],
    caption:
      "Four boxes, one direction. The badge asks the component layer for a success label; that layer asks the semantic layer what success means; the semantic layer points at a step on a ramp. Only the last box holds a colour.",
  },
  {
    type: "prose",
    body: [
      "A component never learns what colour it is using. The status badge asks for a run-success background; that resolves to a success surface, which resolves to a step on the green ramp, which is a hex. Change the ramp and every component that ever asked for success moves with it — which is the only reason the layering is worth its verbosity.",
    ],
  },
  {
    type: "decision",
    title: "Shipped screens live only in code",
    body: divergence(8).reason,
  },
  /* TODO: copy needed — the argument for why the screens boundary is a systems
     decision rather than an excuse for not having drawn them. The fact and the
     date are in _data (divergence 8); what is missing is the reasoning a
     reviewer would push back on. */
];

/* ── 02 · The pipeline ──────────────────────────────────────────────────── */

const pipeline: Block[] = [
  {
    type: "section",
    num: "02",
    label: "The pipeline",
    title: "A generator, written rather than installed",
    body: [
      f.pipeline.flow.join("  →  "),
      `${f.pipeline.scriptPath} is ${f.pipeline.scriptLines} lines with ${f.pipeline.dependencies} dependencies. It fetches the token JSON, flattens Figma's hierarchy into paths, resolves the alias chain to a literal, decides what each token is publicly called, and writes a block into globals.css without touching the hand-authored CSS below it.`,
    ],
  },
  {
    type: "specList",
    items: f.pipeline.steps.map((step) => ({
      label: `${step.marker} · ${step.title}`,
      value: step.fn,
      note: step.does,
    })),
  },
  ...f.pipeline.snippets.map(
    (snippet): Block => ({
      type: "codePeek",
      file: snippet.file,
      lines: snippet.lines,
      title: snippet.title,
      code: snippet.code,
      decision: snippet.decision,
    }),
  ),
  {
    type: "linkOut",
    href: f.links.find((l) => l.id === "tokensRepo")!.href,
    label: "Token repo",
    body: "The repository the script fetches from is public. It is the one artefact that makes the pipeline inspectable rather than described — the same JSON the generator reads, at the commit it last read.",
  },
  {
    type: "decision",
    title: "Custom script over Style Dictionary",
    body:
      "Four reasons, in the order they actually carried weight. The Tokens Studio JSON has quirks Style Dictionary does not eat out of the box — collections are named with emoji and carry Figma's scopes, so custom transformers were needed either way, which meant paying the learning curve on top of writing the code anyway. The required output was one format, CSS variables for Tailwind v4: no SCSS, no iOS, no Android, so all of Style Dictionary's extensibility was idle capacity. Setup was faster, roughly sixty minutes against ninety or more. And understanding how an alias tree is parsed, flattened and resolved is knowledge that transfers to any pipeline, including Style Dictionary if it is ever needed. Migrating later was noted at the time as a lateral move, not rework.",
  },
  {
    type: "tradeoff",
    title: "What owning the pipeline cost",
    body:
      "The segment dedup was repair, not design: the first version emitted names like --color-status-success-success, and fixing it meant going back through the naming function and hand-cleaning the manual block of everything Figma already covered under a different name. That is a full session of debt the standard path would probably not have produced. The naming is inherited verbatim from Figma, so the product code reads text-text-primary and bg-status-success — ugly, accepted knowingly in exchange for a 1:1 match with the design file. There is no light mode and no second output format; if either is ever needed it gets hand-written. There is no community and no documentation behind it, so exactly one person can debug it. And the script counts and writes but never validates or reports — which is how a divergence lived in the pipeline for months without anything failing.",
  },
];

/* ── 03 · What the pipeline didn't guarantee ────────────────────────────── */

const findings: Block[] = [
  /* Sits before the section opens, so it belongs to 02 and breaks the wall of
     text ahead of the densest section on the page. */
  {
    type: "image",
    src: SHOT("Workflow Builder"),
    alt: "The Fluuen Agent Builder: a node canvas with a trigger, two action nodes and an AI node wired together, the node catalog on the left and the inspector open on the right",
    caption: "Agent Builder — the screen the component layer was built for",
    tag: "Product",
  },
  {
    type: "section",
    num: "03",
    label: "The drift",
    title: "What the pipeline didn't guarantee",
    body: [
      "The generator guaranteed that the CSS reflected the JSON exactly. Nothing guaranteed that the JSON reflected Figma. The push from Tokens Studio is manual, and it is the one link in the chain that leaves no trace.",
      "So the CSS was perfectly synchronised with an old photograph of the design file. The divergence is not a bug in the generator — the generator did its job. It is a link that never had verification.",
    ],
  },
  {
    type: "metrics",
    items: [
      {
        value: String(published.total),
        label: "In Figma",
        note: "COLOR variables, the declared source of truth",
      },
      {
        value: String(alternate.total),
        label: "In the CSS",
        note: "Generated custom properties in globals.css",
      },
      {
        value: String(drift.cssOnly),
        label: "In the CSS only",
        note: "Names Figma no longer has",
      },
      {
        value: String(drift.figmaOnly),
        label: "In Figma only",
        note: "Designed, never exported",
      },
    ],
  },
  {
    type: "prose",
    body: [
      `Comparing totals gave a difference of ${drift.net}, and for months every explanation of that number was a guess. ${drift.whyItHid}`,
      drift.methodLesson,
    ],
  },
  {
    type: "specList",
    items: drift.groups.map((group) => ({
      label: `${group.key} · ${group.title}`,
      value: `${group.count} ${group.side === "css-only" ? "in CSS" : "in Figma"}`,
      note: group.cause,
    })),
  },
  /* A classification, not an impact metric — and it follows the counts above,
     which are. Two fields of large numbers in a row would compete. */
  {
    type: "specList",
    items: [
      {
        label: "Mechanical",
        value: `${drift.mapping.mechanical} tokens`,
        note: "One unambiguous destination. A verified find and replace.",
      },
      {
        label: "Needs judgement",
        value: `${drift.mapping.judgement} tokens`,
        note: "A destination exists, but choosing it is a design call — which variant a destructive button is, whether the old default meant unchecked.",
      },
      {
        label: "No destination",
        value: `${drift.mapping["no-destination"]} tokens`,
        note: "The structure they named no longer exists. Not a rename, a gap.",
      },
    ],
  },
  { type: "prose", body: [drift.headline] },
  {
    type: "decision",
    title: "A whole component the code has never seen",
    body: drift.groups.find((g) => g.key === "I")!.cause,
  },
  {
    type: "prose",
    body: [
      drift.groups.find((g) => g.key === "I")!.note!,
      `Of the ${drift.cssOnly} stale names, ${drift.staleInCode.length} are actually referenced by product components — four status dots on the dashboard and five input tokens across the four wizard steps. Every one of them falls in the two mechanical groups, so the remap is direct substitution with no design decisions in it. The rest live only in derived copies of globals.css.`,
    ],
  },
  {
    type: "specList",
    items: [
      {
        label: "Last token sync — when the script ran",
        value: f.source.lastTokenSync,
        note: "Recorded in globals.css, on every run",
      },
      {
        label: "Last token push — when Figma last reached the JSON",
        value: f.source.lastTokenPush ?? "not recorded",
        note: "Nothing in the chain writes this down. That absence is the finding.",
      },
    ],
  },
  {
    type: "tradeoff",
    title: drift.status === "open" ? "Open, not closed" : "Closed",
    body: `${drift.systemReading} None of it is applied: the Fluuen repo and both Figma files were left untouched by the analysis. What prevents recurrence is not the remap — it is a check that diffs Figma's variable names and values against the JSON and fails when they part, plus an export date on the JSON. The diff that produced everything above was about forty lines of Node.`,
  },
  /* TODO: copy needed — the closing argument of the section, and the one
     Facundo said he would write himself. Everything above is the finding; what
     is missing is what it is evidence of. */
];

/* ── 04 · Divergence, classified ────────────────────────────────────────── */

const classified: Block[] = [
  {
    type: "section",
    num: "04",
    label: "Classified",
    title: "Divergence, classified rather than absorbed",
    body: [
      "A second set of divergences, found earlier and by hand, comparing the Agent Builder's code against its component library in Figma. They were classified as they appeared rather than reconciled afterwards, which is the only reason the categories are worth anything: a list written after the fact would not have had to choose.",
      "The classification is what decides the response. A mechanical sync gets applied. A product decision does not get applied at all until someone makes the call. And a divergence where Figma is ahead is not drift — it is the code owing the design.",
    ],
  },
  {
    type: "divergenceTable",
    summary: `${agentBuilderDivergences.length} entries · Agent Builder · recorded 2026-07-02 to 07-04, re-read ${f.source.extractedAt}`,
    rows: agentBuilderDivergences.map((d) => ({
      item: d.item,
      code: d.code.value,
      codeAt: d.code.location ?? undefined,
      figma: d.figma.value,
      figmaAt: d.figma.location ?? undefined,
      category: CATEGORY_LABEL[d.category] ?? d.category,
      status: statusLabel(d),
      note: d.reason,
    })),
  },
  {
    type: "statusBadgeDemo",
    title: "The most reused pattern in the system",
    intro:
      "The status badge is where the layering earns its keep. Pick a state and the badge repaints — and so does the chain underneath it, which is the same four boxes from section 01 with a different middle.",
    states: f.tokens.badgeStates.map((state) => ({
      id: state.id,
      label: state.label,
      icon: state.icon,
      semantic: state.semantic,
      primitive: state.primitive,
      hex: state.hex,
      bg: state.bg,
      border: state.border,
      note: state.note,
    })),
    vocabularies: f.tokens.badgeVocabularies.map((vocabulary) => ({
      name: vocabulary.name,
      surface: vocabulary.surface,
      states: vocabulary.states,
    })),
    caption:
      "One base badge, three vocabularies. An agent pauses; a run cancels; neither word exists in the other's family. Which states a surface has is a product decision, and the system is what keeps that decision from turning into a colour decision as well.",
  },
  {
    type: "tradeoff",
    title: "One of these is filed wrong",
    body: divergence(4).note!,
  },
];

/* ── 05 · What's true ───────────────────────────────────────────────────── */

const whatsTrue: Block[] = [
  {
    type: "section",
    num: "05",
    label: "What's true",
    title: "Finished, deliberately partial, and still open",
    body: [
      "A portfolio demo is worth less than the accuracy of its own description. Three columns, and the third one is not an apology.",
    ],
  },
  {
    type: "image",
    src: SHOT("Agents"),
    alt: "The Fluuen agents grid: agent cards showing success, running, paused and error states side by side",
    caption: "Agents — every state the badge vocabulary defines, including the failures",
    tag: "Product",
  },
  {
    type: "specList",
    items: [
      {
        label: "Finished",
        value: "Token system and pipeline",
        note: "Figma → Tokens Studio → repository → tokens:sync → globals.css, running end to end",
      },
      {
        label: "Finished",
        value: "The product screens",
        note: "Landing, dashboard, agents, Agent Builder, run detail, integrations, settings — twelve sprints",
      },
      {
        label: "Finished",
        value: "The Agent Builder in Figma",
        note: "Node, edges, topbar, node catalog and an assembled screen, built as a component library",
      },
      {
        label: "Finished",
        value: "Accessibility · Lighthouse 100",
        note: "Up from 94",
      },
      {
        label: "Finished",
        value: "Typed analytics",
        note: "A closed union of eleven events",
      },
      {
        label: "Finished",
        value: "Storybook, deployed",
        note: "Foundations parses the tokens out of the production build, so the documentation cannot drift from the CSS",
      },
    ],
  },
  {
    type: "prose",
    body: [
      "The demo runs on simulated data. Access was a deliberate choice: a sandbox with no login, so that anyone sent a link is inside the product in under three seconds rather than in front of a sign-up form. The integrations — Gmail, Slack, Sheets — are simulated against curated seed data, and there are no production users. It is a portfolio product, and it is described as one everywhere it is described at all.",
    ],
  },
  {
    type: "specList",
    items: [
      {
        label: "Open · high priority",
        value: divergence(1).item,
        note: `${divergence(1).code.value} in code against ${divergence(1).figma.value} in Figma. The only entry in either table with a user-facing effect: it is a contrast failure on live text, and the correct value already exists in the CSS under another name.`,
      },
      {
        label: "Open",
        value: "The re-export, and the remap behind it",
        note: `${drift.cssOnly} stale names, ${drift.staleInCode.length} of them referenced in product code. Nothing has been applied.`,
      },
      {
        label: "Open · a gap in the system, not in the code",
        value: `${drift.mapping["no-destination"]} tokens with no destination`,
        note: "Six hover states and one focus border that the redesigned SelectionControl no longer tokenises. Solving them in code with hardcoded values would be exactly what the design system exists to prevent.",
      },
      {
        label: "Open",
        value: divergence(7).item,
        note: "The token repository still declares the original typefaces because the migration happened in Figma and the JSON was never re-exported. It never reaches production — the script only emits colour — so it is latent rather than active.",
      },
    ],
  },
];

/* ── 06 · Live ──────────────────────────────────────────────────────────── */

const live: Block[] = [
  {
    type: "section",
    num: "06",
    label: "Live",
    title: "The artefacts",
    body: [
      "Four things are open. The Figma file is the source of truth for tokens. The token repository is what the pipeline fetches, so the generator is inspectable rather than described. The Storybook documents the system by parsing it out of the production build. And the product is where all of it ends up.",
      "The product repository is private, so it is not linked. Every file and line referenced above points into it as provenance, not as an invitation.",
    ],
  },
  {
    type: "image",
    src: SHOT("Run Detail"),
    alt: "A Fluuen run detail view: a timeline of executed steps, each with its status, duration and logged output",
    caption: "Run detail — the run vocabulary of the same badge, on its own surface",
    tag: "Product",
  },
  {
    type: "figmaEmbed",
    url: link("figma")!,
    caption: `${f.source.figmaFileName} — ${published.total} colour variables across ${layers.length} collections`,
    height: 640,
  },
];

/* ── Case study ─────────────────────────────────────────────────────────── */

export const fluuen: CaseStudy = {
  meta: {
    slug: "fluuen",
    title: "*Fluuen*",
    subtitle:
      "A three-layer token system generated from Figma into a shipped AI automation product — and a record of what the generator could not guarantee.",
    year: "2026",
    role: "Product Designer · Design Systems",
    type: "Design system · B2B SaaS product",
    tools: "Figma · Tokens Studio · Next.js · Tailwind v4 · Storybook",
    accent: "violet",
  },
  tags: ["Design system", "Design tokens", "AI agents", "B2B SaaS"],
  links,
  cover: {
    src: SHOT("Dashboard"),
    alt: "The Fluuen dashboard: metric cards, a runs chart, agent status list and recent run history, on the dark River Styx surface",
    caption: "Dashboard — the system in production",
    tag: "Product",
  },
  stats: [
    { value: String(published.total), label: "Color tokens" },
    { value: String(layers.length), label: "Token layers" },
    { value: String(divergenceCount), label: "Divergences found" },
    { value: String(f.pipeline.steps.length), label: "Pipeline steps" },
  ],
  blocks: [
    ...overview,
    ...truth,
    ...pipeline,
    ...findings,
    ...classified,
    ...whatsTrue,
    ...live,
  ],
  seo: {
    title: "Fluuen — design system and token pipeline",
    description: `A three-layer colour system of ${published.total} tokens, generated from Figma into a shipped product, and the drift the generator could not catch.`,
  },
};
