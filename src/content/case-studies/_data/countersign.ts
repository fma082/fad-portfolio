/**
 * Countersign — verified data behind the case study.
 *
 * Every number, tool name and path here was read out of one of the two briefs
 * in `docs/briefs/`, which were themselves produced by reading the Countersign
 * repo, its docs and its git history on 2026-08-01 (`main` @ `ed71a3e`).
 * Nothing here is inferred and nothing is rounded.
 *
 * Sources, in order of authority:
 *   1. `docs/briefs/countersign.md` — the repo read: routes, tools, statechart,
 *      seed roster, guided flow. Section B.3 of that file is a table of every
 *      published claim checked against the code; anything ✅ there is `certain`.
 *   2. `docs/briefs/countersign-decisions.md` — decisions, with each one marked
 *      [DECIDIDO] or [EMERGENTE], plus its section 6, which lists the numbers
 *      that circulated in two versions and says which one is right.
 *   3. `docs/briefs/countersign-case-study-prototype.html` — the approved
 *      visual reference. Narrative copy comes from there verbatim; no figure
 *      does.
 *
 * Two rules this file exists to enforce:
 *
 *   - **Section 6.2 of the decisions brief governs every contested number.**
 *     44 patterns is wrong (63 is right — 44 was one column of a table).
 *     11 below reorder point is the seed spec; 13 is the running system and the
 *     one to publish, fixed in commit 844bb83. 7 statechart states is the
 *     inherited research doc; Countersign has 8. "~20 reviews" is a rounding of
 *     R01–R14 — publish 14. Every one of those is recorded below with both
 *     values and the reason the published one won.
 *
 *   - **Nothing from `project-instructions-v2.md` is repeatable.** That document
 *     still describes the Figma kit that was for sale — price tiers, an
 *     early-bird, a three-week validation plan — all discarded since July 2026
 *     and marked "do not reopen". It also carries the wrong statechart count.
 *     If a figure appears here that traces only to that file, it is a leak.
 */

/* ── Types ──────────────────────────────────────────────────────────────── */

/** How well a datum is backed. `certain` = checked against the repo read. */
export type Confidence = "certain" | "reconstruction";

/** The governance tier an action falls into. Mirrors `ToolDecision`. */
export type Tier = "safe" | "reversible" | "gate" | "invalid";

export interface TierSpec {
  id: Tier;
  /** What kind of action lands here. */
  what: string;
  /** What the engine does with it. */
  behaviour: string;
  /** Whether the case study's three-column grid shows it. */
  published: boolean;
}

export interface ProjectLink {
  id: "demo" | "repo";
  label: string;
  href: string;
  /** Reachable without credentials. */
  public: boolean;
  /** Whether the case study links it. */
  linked: boolean;
  note?: string;
}

/** A figure that circulated in two versions, with the one that ships. */
export interface ContestedFigure {
  what: string;
  published: number;
  /** The value that is wrong, kept so a future session recognises the regress. */
  rejected: number;
  why: string;
}

export interface EvidenceItem {
  /** Review id in `countersign-review-log.md`, when the brief names one. */
  review: string | null;
  failure: string;
  fix: string;
  confidence: Confidence;
}

export interface Asset {
  file: string;
  /** What it shows, for the alt text that has to describe it. */
  shows: string;
}

/* ── Links ──────────────────────────────────────────────────────────────── */

const links: ProjectLink[] = [
  {
    id: "demo",
    label: "Live demo — the scenario",
    href: "https://countersign-ai.vercel.app/scenario",
    public: true,
    linked: true,
    note: "Deep-links straight into /scenario rather than the home. /scenario is the surface the whole case study argues about, and it is the link that gets shared. Note the brief's own warning (countersign.md §9): /scenario carries no fictional-data notice of its own, so every CTA that opens it is paired with a line of framing on this page.",
  },
  {
    id: "repo",
    label: "Repository — github.com/fma082/countersign",
    href: "https://github.com/fma082/countersign",
    public: true,
    linked: true,
    note: "Public. Unlike Fluuen, the product repo here is the artefact — the statechart, the two-channel tool contract and the review log all live in it.",
  },
];

/* ── The three tiers ────────────────────────────────────────────────────── */

/* `ToolDecision`, src/lib/engine/types.ts:77. Four members, three published:
   `invalid` is a rejection, not a level of friction, so putting it in a
   three-column scale about how hard something is to undo would misfile it. */
const tiers: TierSpec[] = [
  {
    id: "safe",
    what: "a read",
    behaviour: "runs on its own",
    published: true,
  },
  {
    id: "reversible",
    what: "a radius-1 write with the undo window still open",
    behaviour:
      "runs, then waits — undo lives on the card until the next write closes it",
    published: true,
  },
  {
    id: "gate",
    what: "a destructive write: radius N, or a window that closes on its own",
    behaviour: "waits for human approval before running",
    published: true,
  },
  {
    id: "invalid",
    what: "discarded for bad arguments",
    behaviour: "badged `invalid`, never `ok`",
    published: false,
  },
];

/* ── The finding ────────────────────────────────────────────────────────── */

/* The defect that became the thesis, 24–25 July 2026. Recorded in
   countersign-decisions.md §1.2 as [EMERGENTE], with the framing note that it
   must stay a discovery: it was found while testing, not designed and then
   validated. It recurred twice more — the status of an invented SKU, and a
   count of actives returning 1 instead of 27 — before it was named as a class
   of defect. */
const finding = {
  asked: "list discontinued products",
  reached: "discontinue_products",
  /* Active products in the seed roster: 30 total, 3 discontinued. */
  wouldHaveHit: 27,
  cause:
    "No read tool existed for `discontinued`, so the model resolved the verb to the nearest tool by name — and the nearest tool by name was a destructive write.",
  fix: "Added the missing read tool, so the verb resolves to a read.",
  confidence: "certain" as Confidence,
};

/* ── Seed roster ────────────────────────────────────────────────────────── */

/* countersign.md §B.3 — each of these was checked against the seed file, the
   `/scenario` header ("N of 30") and the README. */
const catalog = {
  products: 30,
  discontinued: 3,
  /* 30 − 3. The number the bug's proposal would have hit. */
  active: 27,
  belowReorderPoint: 13,
  belowCost: 3,
  expiredSales: 6,
  /* The table header R06 quotes verbatim. Which preset produced the 3 is not
     recorded, and two presets count 3 — below-cost and discontinued — so this
     is stored as the string that was observed rather than composed from the
     roster above. */
  filteredHeaderObserved: "3 of 30",
};

/* ── Contested figures ──────────────────────────────────────────────────── */

/* countersign-decisions.md §6.2. Kept in the data rather than in a comment so
   that a future session that "corrects" one of these has to delete a field
   whose `why` says not to. */
const contested: ContestedFigure[] = [
  {
    what: "Patterns in the master catalog",
    published: 63,
    rejected: 44,
    why: "44 is the count marked `catalog` in one column of the registry; there are also 11 `wedge` and 8 `built`. 63 is the entry count in both the master catalog and patterns-registry.html.",
  },
  {
    what: "Products below the reorder point",
    published: 13,
    rejected: 11,
    why: "11 is the seed spec; 13 is the running system. Corrected in commit 844bb83 — 'docs(seed): the below-reorder reference count is 13, not 11'.",
  },
  {
    what: "States in the copilot statechart",
    published: 8,
    rejected: 7,
    why: "7 is the inherited research statechart (Download/statechart-copilot-chat-panel.md). Countersign has 8; the extra one is `awaitingApproval`, the gate. Verified: `CopilotStatus` has 8 members.",
  },
  {
    what: "Design reviews",
    published: 14,
    rejected: 20,
    why: "'~20' was an outline estimate. The log holds R01–R14. Do not round up: if there are 14, there are 14.",
  },
  {
    what: "Copilot panel width, in px",
    published: 380,
    rejected: 379,
    why: "380 is the spec, 379 is the built component. Trivial on its own; it is in the brief as proof that nothing verifies against the spec, and the case study does not publish either number.",
  },
];

/* ── Evidence ───────────────────────────────────────────────────────────── */

/* Three failures observed against a real model, each with the surface change
   that closed it. All three are surface changes; none is a prompt change —
   that is the corollary the case study is built on. */
const evidence: EvidenceItem[] = [
  {
    review: "R02",
    failure:
      "Handed 13 rows of data, the model enumerated them in prose and mislabeled the criterion, naming products it was not asked about.",
    fix: "Split the channel: the model receives `{count, criterion, label}`, the render receives the rows. With nothing to enumerate, it can only write the preamble.",
    confidence: "certain",
  },
  {
    review: "R06 + R07",
    failure:
      "A filter left the table at '3 of 30' with no visible way back, and the model denied the view state it had itself produced — it could write the filter state but not read it.",
    fix: "One `FilterState`, written identically by the agent and the user, with the same clear control. The agent's tool surface is a subset of the user's.",
    confidence: "certain",
  },
  {
    review: null,
    failure:
      "Approve-all-or-nothing was a lie: the resolver was right, but the human held context the system did not — one row should not ship.",
    fix: "Partial approval, modelled as a variant of approve rather than a new state. The server re-intersects the exclusions against its own preview before running.",
    confidence: "certain",
  },
];

/* ── What was dropped ───────────────────────────────────────────────────── */

/* countersign-decisions.md §1.3. The three Trust builders share one shape —
   they ask the model to report on itself — and that is the reason they went.
   8.3 is listed separately on purpose: it fell out because there is no
   database. Nobody evaluated it, so presenting it as a scope decision would be
   a rationalisation. */
const dropped = {
  trustBuilders: [
    "6.1 Confidence indicators",
    "6.2 Explainability / Reasoning",
    "6.3 Caveats / Limitations",
  ],
  /* The one that survived, inverted: the server writes it, not the model. */
  transformed:
    "6.2 came back as the `interpreted from:` subtitle — explainability written by the server, comparing what the human asked against the criterion that ran. The model does not confess the reinterpretation; the system marks it.",
  notADecision:
    "8.3 Agent monitoring / Run history — dropped because there is no database. Nobody evaluated it.",
  whereItStops:
    "In open-ended research or writing, self-report becomes necessary again, and that is unsolved here.",
};

/* ── What is true ───────────────────────────────────────────────────────── */

const honesty = {
  /* countersign.md §9 and the decisions brief §6.3. */
  fictional: "Northbase and its 30-product catalog are entirely invented.",
  realModel: true,
  /* Three models have served this surface: llama3.2:3b locally, where most
     findings came from; llama-3.1-8b-instant on the deploy until Groq
     decommissioned the whole llama-3.x family; and openai/gpt-oss-20b since
     2026-08-18. That churn is the reason the claim below is the one to make —
     "the model does X" invites "which one?", and the answer keeps changing. */
  modelClaim:
    "The surface was designed to hold up under the weakest model it would be served with.",
  /* Verified 2026-08-18 by `_inbox/demo-capture/verify-guided.mjs` in the
     Countersign repo: 15/15 on a production build against Groq — both reads,
     update_price badged `ok` with Undo on the action, the gate stopping at
     `awaiting approval` with 6 tickable items, and no MODEL PAUSED card at any
     step. The last one is the check that matters: the flow "passes" with the
     degradation card, which is why a run has to fail on its presence. */
  currentModel: "openai/gpt-oss-20b",
  /* Recorded because it is the honest version of a claim that was overstated:
     the deploy is FASTER than local development, not a reproduction of it. */
  cadence: {
    throttleMs: 28,
    deployTokensPerSecond: 35,
    localTokensPerSecond: 18,
    note: "A deliberate 28ms/token throttle in the Groq adapter, so the cadence is legible. That is ~35 tok/s — faster than the ~18 tok/s of local Ollama. Do not claim it reproduces development cadence.",
  },
  /* countersign-decisions.md §2.2: code-first is the method; "no Figma" was
     not a decision — the mirror fell out of scope while the review cycle took
     the focus. The case study says code-first, which is true, and does not
     claim the missing mirror as a choice. */
  codeFirst:
    "Built in code with no Figma mirror. The loop was watch it run, spec the fix, review — roughly twenty times in a week.",
  reviews: 14,
  reviewRange: "R01–R14",
};

/* ── Statechart ─────────────────────────────────────────────────────────── */

const statechart = {
  states: 8,
  /* The one the inherited 7-state chart did not have. */
  gateState: "awaitingApproval",
  /* copilot-statechart.ts:199-214 — the gate is left only by a human signal;
     every model-originated signal hits `default: return state`. */
  exitRule:
    "The gate is left only by a signal whose origin is the human. The model has no signal that leaves it — the safety property is the shape of the reducer, not a rule someone has to remember to check.",
  humanCheckpoints: 1,
};

/* ── The guided flow ────────────────────────────────────────────────────── */

/* Four steps, fixed order, free input locked until they are done. The prompts
   and the order are scripted; the streaming and the tool calls are the real
   engine (guided-steps.ts:4). */
const guidedSteps = [
  { prompt: "Find products selling below cost", tier: "safe" as Tier },
  { prompt: "Show me what's causing it", tier: "safe" as Tier },
  { prompt: "Raise the price on the SD Card Case", tier: "reversible" as Tier },
  { prompt: "Clear all expired sale prices", tier: "gate" as Tier },
];

/* ── Assets ─────────────────────────────────────────────────────────────── */

/* Files in `public/images/projects/countersign/`. The recording is the `-retake`
   MP4, not the GIF beside it: same ten seconds at 1.0 MB instead of 2.6 MB, and
   it needs none of the `unoptimized` handling an animated GIF does. */
const assets: Record<string, Asset> = {
  guided: {
    file: "guided.png",
    shows:
      "The four guided steps stacked in the copilot panel, each tagged with its tier",
  },
  resolved: {
    file: "resolved.png",
    shows:
      "The same discontinued-products query resolving cleanly to three products",
  },
  priceUpdate: {
    file: "price-update-dark-retake.mp4",
    shows:
      "The reversible tier: the price write runs, the old price strikes through, Undo stays on the card",
  },
  gate: {
    file: "gate.png",
    shows: "The approval gate with resolved rows and per-item checkboxes",
  },
  readMargin: {
    file: "read-margin.png",
    shows:
      "A read the agent ran on its own, with a Margin column computed server-side",
  },
};

/* ── Export ─────────────────────────────────────────────────────────────── */

export const countersignData = {
  source: {
    repo: "fma082/countersign",
    readAt: "2026-08-01",
    commit: "ed71a3e",
    briefs: [
      "docs/briefs/countersign.md",
      "docs/briefs/countersign-decisions.md",
    ],
    prototype: "docs/briefs/countersign-case-study-prototype.html",
  },
  links,
  tiers,
  finding,
  catalog,
  contested,
  evidence,
  dropped,
  honesty,
  statechart,
  guidedSteps,
  assets,
  /* Where the project came from: a catalog of AI interface patterns, compiled
     March 2026, that was going to be sold as a Figma kit. */
  research: {
    patterns: 63,
    categories: 10,
    wedgePatterns: 11,
    /* The pivot, ~7 July 2026: components are commoditised, so showing the
       patterns run against a real model is worth more than selling them. */
    pivotedAt: "2026-07-07",
  },
  /* Things a future session might be tempted to assert. None is supported. */
  unsupported: [
    "THAT THE LIVE DEPLOY IS ALREADY ON THE WORKING MODEL. Fixed in the Countersign repo on 2026-08-18 — `groq.ts` now defaults to `openai/gpt-oss-20b`, and Vercel never set `GROQ_MODEL`, so the default is what the deploy uses — but the fix reaches countersign-ai.vercel.app only on the next deploy. Until then every turn there still falls through the retry→degrade path and renders the `MODEL PAUSED` card, and the page's copy ('Real: the agent runs against a real model', 'This runs against a real model') stays true of the project and false of the deploy. Do not soften the copy — ship the deploy.",
    "That the loading-state thresholds are tuned against real latency — they were never wired. What holds is the observation of bimodal TTFT (0.4–0.5s warm against several seconds cold), which invalidates a single threshold.",
    "That the statechart is a shared contract between code and Figma — true of the earlier ai-patterns project, not of Countersign, which has no verified mirror.",
    "That routing is non-deterministic, stated with a number — observed repeatedly, never counted. Qualitative only.",
    "That `next build` is clean at 5 routes — that is a 2026-07-23 note in the Countersign DEV_STATE and was not re-run.",
  ],
};
