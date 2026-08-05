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

const { published, alternate, drift, layers, openingChain } = f.tokens;

/* Product captures. Dimensions are read from the PNG header at build time by
   ImageFrame, so the frame takes the shape of the file and no ratio is
   restated here. Integrations.png is in the folder and deliberately unplaced. */
const SHOT = (name: string) =>
  `/images/projects/fluuen/${encodeURIComponent(name)}.png`;

const divergenceCount = drift.cssOnly + drift.figmaOnly;

const inspectorTokens = drift.groups.find((g) => g.key === "I")!.count;

const demoHref = f.links.find((l) => l.id === "demo")!.href;

/* Looked up by id rather than by index: the ids are stable in the data file,
   the array order is not guaranteed to stay that way. */
const divergence = (id: number) => {
  const found = f.divergences.find((d) => d.id === id);
  if (!found) throw new Error(`fluuen: divergence ${id} is missing from _data`);
  return found;
};

/* ── 00 · Overview ──────────────────────────────────────────────────────── */

const overview: Block[] = [
  {
    type: "section",
    num: "00",
    label: "Overview",
    title: "A system first, then a product to test it",
    body: [
      "Fluuen is a no-code automation platform with AI agents, shipped as a navigable demo. But the product was never the deliverable — it was the test. I built the token system, then built something real on top to find out whether it held.",
      `It mostly did. This is the account of the ${divergenceCount} places where it didn't.`,
    ],
  },
];

/* ── 01 · Where truth lives ─────────────────────────────────────────────── */

const truth: Block[] = [
  {
    type: "section",
    num: "01",
    label: "Where truth lives",
    title: "Each artefact has one source of truth",
    body: [
      "When Figma and the code disagree, which one is wrong? I answered it per artefact. Tokens: Figma is the source. Screens: the code is. The shipped screens don't exist in Figma — that's a boundary, not a gap.",
    ],
  },
  {
    type: "tokenChain",
    steps: [
      {
        layer: "Component",
        name: openingChain.component,
        detail: openingChain.componentDetail,
      },
      { layer: "Semantic", name: openingChain.semantic },
      { layer: "Primitive", name: openingChain.primitive },
      { layer: "Value", name: openingChain.hex },
    ],
  },
  {
    type: "prose",
    body: [
      "A component never learns its colour. It asks for a success label; three layers resolve that to a hex. Change the ramp, and everything that asked for success moves with it.",
    ],
  },
];

/* ── 02 · The pipeline ──────────────────────────────────────────────────── */

const pipeline: Block[] = [
  {
    type: "section",
    num: "02",
    label: "The pipeline",
    title: "I wrote the generator instead of using Style Dictionary",
    body: [
      `Tokens Studio exports a verbose JSON tree — emoji-prefixed, Figma scopes, redundant segments. A ${f.pipeline.scriptLines}-line script flattens it, resolves the alias chain, and writes clean CSS variables. Style Dictionary would have meant its learning curve plus the same custom transformers, for one output I could write directly.`,
    ],
  },
  {
    type: "linkOut",
    href: f.links.find((l) => l.id === "storybook")!.href,
    label: "Storybook",
    body: "The output is public and inspectable: the Storybook parses the generated CSS at build time, so its documentation can't drift from what ships.",
  },
  {
    type: "prose",
    body: [
      "What it cost: the naming is owned by the script, not copied from Figma — so the code reads bg-status-success, ugly but 1:1 with the source. No light mode, no second format, and I'm the only one who can debug it.",
    ],
  },
];

/* ── 03 · What the pipeline didn't guarantee ────────────────────────────── */

const findings: Block[] = [
  /* Closes 02 rather than opening 03: it breaks the wall of text ahead of the
     densest section, and the CTA under it belongs to the builder, not to the
     drift. */
  {
    type: "image",
    src: SHOT("Workflow Builder"),
    alt: "The Fluuen Agent Builder: a node canvas with a trigger, two action nodes and an AI node wired together, the node catalog on the left and the inspector open on the right",
    caption: "The agent workflow builder — the token system in a real interface",
    tag: "New",
  },
  {
    type: "cta",
    body: "Build an agent yourself in the demo.",
    label: "Open the builder →",
    href: demoHref,
  },
  {
    type: "section",
    num: "03",
    label: "The drift",
    title: "The pipeline kept CSS in sync with JSON — not with Figma",
    body: [
      `The gap hid for months because every check I had was a count. ${alternate.total} in code against ${published.total} in Figma looked like ${drift.net} missing. It was ${drift.cssOnly} stale names against ${drift.figmaOnly} that never arrived, netting out. Counting answers how many. It doesn't answer: are these the same?`,
    ],
  },
  {
    type: "specList",
    items: [
      {
        label: "Mechanical",
        value: `${drift.mapping.mechanical} tokens`,
        note: "Pure renames — one clear destination.",
      },
      {
        label: "Needs judgement",
        value: `${drift.mapping.judgement} tokens`,
        note: "Renames needing a design call to resolve.",
      },
      {
        label: "No destination",
        value: `${drift.mapping["no-destination"]} tokens`,
        note: "No destination — six hovers and a focus border.",
      },
    ],
  },
  {
    type: "prose",
    body: [
      `A whole component — the Agent Builder inspector, ${inspectorTokens} tokens — existed in Figma and not in code. Its neighbours shipped; it didn't. The drift wasn't decay. The system evolved and the code kept speaking last year's version of the same language.`,
    ],
  },
];

/* ── 04 · Divergence, classified ────────────────────────────────────────── */

const nodeState = (id: string) => f.tokens.nodeStates.find((n) => n.id === id)!;

const classified: Block[] = [
  {
    type: "section",
    num: "04",
    label: "Classified",
    title: "Where they diverge, I classify rather than absorb",
    body: [
      "Select a state. The node's border is a token, not a colour — and this is the exact component where Figma and code drifted.",
    ],
  },
  {
    type: "nodeDemo",
    title: "Live component · agent builder node",
    states: f.tokens.nodeStates.map((state) => ({
      id: state.id,
      label: state.label,
      token: state.token,
      semantic: state.semantic,
      primitive: state.primitive,
      hex: state.hex,
      note: state.note,
    })),
    structure: {
      canvas: f.tokens.nodeStructure.portBg,
      bg: f.tokens.nodeStructure.bg,
      label: f.tokens.nodeStructure.label,
      sublabel: f.tokens.nodeStructure.sublabel,
      divider: f.tokens.nodeStructure.divider,
      bodyText: f.tokens.nodeStructure.bodyText,
      accent: f.tokens.nodeStructure.accent,
      portBg: f.tokens.nodeStructure.portBg,
      portBorder: f.tokens.nodeStructure.portBorder,
    },
  },
  {
    type: "divergenceTable",
    rows: [
      {
        item: "node sublabel",
        code: divergence(1).code.value.split(" ")[0],
        codeAt: divergence(1).code.location?.split(", ")[0],
        codeSwatch: "#6b7280",
        figma: divergence(1).figma.value.split(" ")[0],
        figmaAt: "Control/Node/*",
        figmaSwatch: "#868e9e",
        pill: "debt",
      },
      {
        item: "border-selected",
        /* Token names rather than hexes: the divergence is one step on the
           same ramp, and the step is what the row is about. */
        code: "brand.500",
        codeAt: divergence(4).code.location ?? undefined,
        codeSwatch: "#6366f1",
        figma: nodeState("selected").primitive,
        figmaAt: nodeState("selected").token,
        figmaSwatch: nodeState("selected").hex,
        pill: "affordance",
      },
      {
        item: "shipped screens",
        code: "code is truth",
        codeAt: "app/",
        figma: "not in Figma",
        pill: "by design",
      },
    ],
  },
];

/* ── 05 · What's true ───────────────────────────────────────────────────── */

const whatsTrue: Block[] = [
  {
    type: "section",
    num: "05",
    label: "What's true",
    title: "What's done, what's partial by choice",
    body: [
      /* Prose renders literally — no markdown parser — so the three labels
         carry the structure by position, not by bold. */
      "Done: the token system and pipeline, the shipped screens, a Storybook that parses the production build so its docs can't drift. Partial by design: the demo runs on simulated data — a sandbox with no login, so anyone with the link is inside the product in seconds. Open debt: a sublabel contrast fix and the seven tokens with no home.",
      "These aren't bugs — they're classified divergences. In a live product each has a one-line fix; as a portfolio piece, finding and naming them was the point.",
    ],
  },
  {
    type: "image",
    src: SHOT("Agents"),
    alt: "The Fluuen agents grid: agent cards showing active, paused and error states side by side",
    caption:
      "Agent states, failure included — the error card is designed, not an afterthought",
    tag: "New",
  },
];

/* ── 06 · Live ──────────────────────────────────────────────────────────── */

const live: Block[] = [
  {
    type: "section",
    num: "06",
    label: "Live",
    title: "See it running",
  },
  {
    type: "figmaEmbed",
    url: link("figma")!,
    caption: `${f.source.figmaFileName} — ${published.total} colour variables across ${layers.length} collections`,
    height: 640,
  },
  {
    type: "image",
    src: SHOT("Run Detail"),
    alt: "A Fluuen run detail view: a timeline of executed steps, each with its status, duration and logged output",
    caption: "Run detail — execution timeline, step by step",
    tag: "New",
  },
];

/* ── Case study ─────────────────────────────────────────────────────────── */

export const fluuen: CaseStudy = {
  meta: {
    slug: "fluuen",
    title: "*Fluuen*",
    subtitle:
      "A three-layer token system, generated from Figma into a shipped AI product — and an honest account of where the two drifted apart.",
    year: "2026",
    role: "Product Designer · Design Systems",
    type: "Design system · B2B SaaS product",
    tools: "Figma · Tokens Studio · Next.js",
    accent: "violet",
  },
  tags: ["Design system", "Design tokens", "AI agents", "B2B SaaS"],
  links,
  stickyCta: {
    label: "Fluuen — a shipped AI automation product",
    cta: "Live demo →",
    href: demoHref,
  },
  /* Sits between the cover and section 00, so it lands on the capture that
     earns it rather than inside the first argument. */
  coverCta: {
    body: "This is a real, navigable product.",
    label: "Try it live →",
    href: demoHref,
  },
  cover: {
    src: SHOT("Dashboard"),
    alt: "The Fluuen dashboard: metric cards, a runs chart, agent status list and recent run history, on the dark River Styx surface",
    caption: "The shipped product, live on Vercel",
    tag: "New",
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
