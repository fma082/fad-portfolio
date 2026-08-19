import type { Block, CaseStudy, CaseLinks } from "@/types/case-study";
import { countersignData as c } from "./_data/countersign";

/* The narrative copy in this file is the approved prototype
   (`docs/briefs/countersign-case-study-prototype.html`) verbatim: same
   sections, same order, same sentences. Structure and order are settled — do
   not reopen them here.

   Every figure inside those sentences is interpolated from `_data/countersign`,
   which carries its source and, where a number circulated in two versions, the
   version that lost and why. Nothing below restates a number.

   Two rules from the data file's own comments hold here:
   - 14 design reviews, not "~20". 63 patterns, not 44. 13 below the reorder
     point, not 11. 8 statechart states, not 7. A future session that rounds any
     of those is the regress the data file is written to catch.
   - `/scenario` carries no fictional-data notice of its own, so every CTA that
     opens it is paired with a line that says Northbase is invented. */

/* ── Derivations ────────────────────────────────────────────────────────── */

const link = (id: (typeof c.links)[number]["id"]) =>
  c.links.find((l) => l.id === id && l.linked)!.href;

/* Two: `live` comes first and gets the solid treatment. Unlike Fluuen, the
   product repo here is public and is itself an artefact of the argument — the
   statechart and the review log live in it — so it is linked. */
const links: CaseLinks = {
  live: link("demo"),
  github: link("repo"),
};

const demoHref = link("demo");

const { catalog, statechart, honesty, finding, research } = c;

/* Small integers read as words in prose and as numerals in a stat cell. The
   copy says "three products"; spelling it here keeps the sentence identical to
   the prototype while the figure still comes from the roster rather than from
   a keystroke. Anything above ten stays a numeral, which is also the rule the
   copy already follows. */
const WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
] as const;
const spell = (n: number) => WORDS[n] ?? String(n);
const Spell = (n: number) => {
  const word = spell(n);
  return word[0].toUpperCase() + word.slice(1);
};

/* Three of the four `ToolDecision` members. `invalid` is a rejection, not a
   level of friction, so it is not on a scale about how hard something is to
   undo — the data file marks it `published: false`. */
const publishedTiers = c.tiers.filter((t) => t.published);

const SHOT = (key: keyof typeof c.assets) =>
  `/images/projects/countersign/${c.assets[key].file}`;

/* ── Cover ──────────────────────────────────────────────────────────────── */

const cover = {
  src: SHOT("guided"),
  alt: "The Countersign scenario: a product catalog table beside the copilot panel, with four guided steps stacked in the panel, each labelled with its governance tier",
  caption:
    "Four guided steps — the first two run alone, the third undoes, the fourth waits for you.",
};

/* ── 00 · Overview ──────────────────────────────────────────────────────── */

const overview: Block[] = [
  {
    type: "section",
    num: "00",
    label: "Overview",
    title: "A research catalog that turned into a product",
    body: [
      `Countersign started as a catalog — ${research.patterns} AI interface patterns, mapped to sell as a Figma kit. Testing the patterns against a real model turned it into something else: a working admin panel where an agent proposes actions and a human approves the irreversible ones.`,
      /* Prose renders literally — no markdown parser, and that is settled. The
         prototype sets this whole paragraph in bold; here it is the thesis by
         position, closing the section on its own. */
      "Reads run alone. Reversible writes run, then wait. Destructive writes wait first. Friction before or friction after, never both.",
    ],
  },
];

/* ── 01 · The finding ───────────────────────────────────────────────────── */

const theFinding: Block[] = [
  {
    type: "section",
    num: "01",
    label: "The finding",
    title: "The bug that became the thesis",
    body: [
      `Testing the agent, I ran a harmless read: "${finding.asked}". There was no read tool for "discontinued" — so the model reached for the nearest tool by name. And the nearest tool by name was a destructive write.`,
    ],
  },
  {
    type: "bugFlow",
    asked: { label: "The read asked for", value: finding.asked },
    reached: { label: "Nearest tool by name", value: finding.reached },
    punchline: {
      body: `A query that meant to list ${spell(catalog.discontinued)} products became a proposal to discontinue all ${catalog.active} active ones. The gate caught it — but a read should never surface a destructive proposal in the first place. I traced why, and closed it.`,
      emphasis: `discontinue all ${catalog.active} active ones`,
    },
  },
  {
    type: "prose",
    body: [
      "The fix wasn't a warning in the prompt. It was adding the read tool that was missing — so the verb resolves to a read, not a write. Same model, different surface:",
    ],
  },
  {
    type: "image",
    src: SHOT("resolved"),
    alt: "The same discontinued-products query, resolved: the copilot returns a card listing three discontinued products instead of proposing a destructive write",
    caption: `Today the same query resolves cleanly to the ${spell(catalog.discontinued)} discontinued products. The surface changed — the model didn't.`,
  },
  {
    type: "prose",
    body: [
      "That's when the thesis landed: the tool surface — not the prompt — bounds what the model can get wrong. You don't fix this by telling the model to behave. You change the surface it reaches into.",
    ],
  },
  {
    type: "decision",
    title: "The corollary",
    body: "Every fix in Countersign is additive to the surface, never a correction to the prompt. A missing read verb becomes a read tool. A destructive verb gets a gate. The model doesn't get smarter — its reach gets shaped.",
  },
];

/* ── 02 · The system ────────────────────────────────────────────────────── */

const theSystem: Block[] = [
  {
    type: "section",
    num: "02",
    label: "The system",
    title: "Friction scales with how hard it is to undo",
    body: [
      `${Spell(publishedTiers.length)} tiers — not three buckets picked by intuition, but a continuous variable discretized: how far the change reaches, and whether the undo window closes on its own.`,
    ],
  },
  {
    type: "tierGrid",
    /* Tone names the meaning, never the colour: the component maps safe /
       reversible / destructive onto the green, amber and red tokens. */
    tiers: [
      {
        tone: "safe",
        label: "safe · a read",
        body: "Query and filter execute on their own — the table reacts live, nothing waits.",
        emphasis: "nothing waits.",
      },
      {
        tone: "reversible",
        label: "reversible · radius 1",
        body: "A radius-1 change runs immediately, then waits: undo lives on the action until the next write.",
        emphasis: "undo lives on the action",
      },
      {
        tone: "destructive",
        label: "gate · destructive",
        body: "The engine stops at the gate. Nothing irreversible runs until you approve — all, some, or none.",
        emphasis: "Nothing irreversible runs until you approve",
      },
    ],
  },
  {
    type: "video",
    src: SHOT("priceUpdate"),
    alt: "A recording of the reversible tier: the agent raises the price on the SD Card Case, the write runs immediately, the old price strikes through in the table, and an Undo control stays on the action card",
    caption:
      "The reversible tier — the write runs, the old price strikes through, and Undo stays until the next write closes the window.",
  },
  {
    type: "image",
    src: SHOT("gate"),
    alt: "The approval gate: a card listing the resolved rows the destructive write would touch, each with its own checkbox, above Approve and Reject controls",
    caption:
      "The gate — resolved rows with per-item checkboxes. Approve all, a subset, or reject.",
  },
  {
    type: "prose",
    body: [
      "The invariant underneath: the server resolves, the client reflects. Counts, previews, resolved targets — all computed server-side. The human approves exactly what the server will execute, never a guess from the browser.",
    ],
  },
];

/* ── 03 · Evidence ──────────────────────────────────────────────────────── */

const evidence: Block[] = [
  {
    type: "section",
    num: "03",
    label: "Evidence",
    title: "Real failures, surface fixes",
    body: [
      "Every one came from watching the agent fail against a real model — then changing the surface, never the prompt.",
    ],
  },
  {
    type: "image",
    src: SHOT("readMargin"),
    alt: "The catalog table after a read the agent ran on its own, with a Margin column revealed beside the price and stock columns",
    caption:
      "A read the agent ran on its own — and a margin column computed server-side, never handed to the model.",
  },
  {
    type: "evidenceTable",
    rows: [
      {
        failure: `Handed ${catalog.belowReorderPoint} rows of data, the model enumerated them in prose and mislabeled the criterion — naming products it wasn't asked about.`,
        failureEmphasis:
          "enumerated them in prose and mislabeled the criterion",
        fix: "Split the channel. The model gets the count and the criterion, never the rows. With nothing to enumerate, it can only write the preamble. The rows render server-side, beside it.",
        fixEmphasis: "the count and the criterion, never the rows.",
      },
      {
        failure: `A filter left the table at "${catalog.filteredHeaderObserved}" with no visible way back — and the model denied the view state it had produced.`,
        failureEmphasis: "no visible way back",
        fix: "The agent uses the user's own filters, not a private channel. The tool surface is a subset of the user's — so the human can always see and undo what the agent did.",
        fixEmphasis: "the user's own filters",
      },
      {
        failure:
          "Approve-all-or-nothing was a lie. The resolver was right, but the human held context the system didn't — one row shouldn't ship.",
        failureEmphasis: "the human held context the system didn't",
        fix: "Partial approval. Untick by human judgment; the server re-intersects the exclusions against its own preview before running. A first-class outcome, not an error correction.",
        fixEmphasis: "Partial approval.",
      },
    ],
  },
  {
    type: "cta",
    body: "See the agent hit the gate yourself.",
    label: "Open the scenario →",
    href: demoHref,
  },
];

/* ── 04 · What I didn't build ───────────────────────────────────────────── */

const notBuilt: Block[] = [
  {
    type: "section",
    num: "04",
    label: "What I didn't build",
    title: "Where the principle stops",
    body: [
      `The research marked "trust builders" as the core wedge — confidence scores, reasoning chains, self-reported caveats. I dropped all ${spell(c.dropped.trustBuilders.length)}, because they share one shape: they ask the model to report on itself.`,
      "Countersign solves trust the other way: the server renders the true value beside the prose, and the model's self-report becomes unnecessary. When the model confused an entire product, it didn't matter — the real data was right there.",
    ],
  },
  {
    type: "tradeoff",
    title: "Where it stops",
    body: "This works for a bounded admin panel. In open-ended research or writing, self-report becomes necessary again — and I didn't solve that. Naming where a principle ends is what makes it sound reasoned instead of dogmatic.",
  },
];

/* ── 05 · What's true ───────────────────────────────────────────────────── */

const whatsTrue: Block[] = [
  {
    type: "section",
    num: "05",
    label: "What's true",
    title: "An honest account",
    body: [
      /* One paragraph, four labels, no bold — Prose renders literally and that
         is settled. The labels carry the structure by position, the same way
         Done / Partial / Debt do in Fluuen's 05. */
      "Real: the agent runs against a real model; the failures are reproducible with tool names and counts. Code-first: built in code, no Figma mirror — the loop was watch it run, spec the fix, review. Fictional: Northbase and its catalog are entirely invented. My role: specs, decisions and review are mine; execution delegated to Claude Code, and the review log is the paper trail.",
    ],
  },
];

/* ── 06 · Live ──────────────────────────────────────────────────────────── */

const live: Block[] = [
  {
    type: "section",
    num: "06",
    label: "Live",
    title: "See it running",
    body: [
      "The demo runs on a real model over simulated data — sandbox, no login. Four guided steps, then free input.",
    ],
  },
  /* Prose and a CTA, no capture. The section closes an argument the page has
     already illustrated four times; a fifth screenshot of the same product
     would be the page repeating itself at the moment it should be handing over
     to the real thing. */
  {
    type: "cta",
    body: "Northbase is fictional. The governance isn't.",
    label: "Open the demo →",
    href: demoHref,
  },
];

/* ── Case study ─────────────────────────────────────────────────────────── */

export const countersign: CaseStudy = {
  meta: {
    slug: "countersign",
    title: "*Countersign*",
    subtitle:
      "Reads run alone. Writes wait for you. An AI agent operating a real admin panel — where the tool surface, not the prompt, decides what the model can get wrong.",
    year: "2026",
    role: "Product Designer · AI Interfaces",
    type: "Portfolio product · agent governance",
    tools: "Next.js · Groq · code-first",
    /* Warm off-white rather than a hue, so that green, amber and red can mean
       safe, reversible and destructive on this page without competing with a
       brand colour. It is the product's own palette. */
    accent: "bone",
  },
  tags: ["AI agents", "Human-in-the-loop", "Design systems", "B2B SaaS"],
  links,
  stickyCta: {
    label: "Countersign — an AI agent with a human checkpoint",
    cta: "Live demo →",
    href: demoHref,
  },
  coverCta: {
    body: "This runs against a real model. Try it.",
    label: "Try it live →",
    href: demoHref,
  },
  cover,
  stats: [
    { value: String(publishedTiers.length), label: "Governance tiers" },
    { value: String(statechart.states), label: "Agent states" },
    /* R01–R14, counted rather than rounded. The outline said "~20". */
    { value: String(honesty.reviews), label: "Design reviews" },
    {
      value: String(statechart.humanCheckpoints),
      label: "Human checkpoint",
    },
  ],
  blocks: [
    ...overview,
    ...theFinding,
    ...theSystem,
    ...evidence,
    ...notBuilt,
    ...whatsTrue,
    ...live,
  ],
  seo: {
    title: "Countersign — governance for an AI agent that writes",
    description: `An AI agent operating an admin panel under ${publishedTiers.length} governance tiers, with a human checkpoint before anything irreversible — and the bug that made the tool surface, not the prompt, the thing to design.`,
  },
};
