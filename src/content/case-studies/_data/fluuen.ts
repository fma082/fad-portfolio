/**
 * Fluuen — verified data behind the case study.
 *
 * Every number, hex, path and line number here was READ from a source on
 * 2026-08-04, read-only. Nothing is inferred and nothing is rounded.
 *
 * Sources, in order of authority:
 *   1. The Figma file MOhVXH1k1Aa5tbQJM8QDRF, read live on 2026-08-04 through
 *      the Desktop Bridge, read-only — recorded in
 *      `docs/briefs/fluuen-token-drift.md`. Figma is the declared source of
 *      truth for tokens, so it is the authority here too.
 *   2. `~/Developer/fluuen` @ branch `feature/storybook` — the product repo.
 *   3. `~/Developer/fluuen/tokens-source.json` — the working copy of
 *      `fma082/fluuen-tokens@main:tokens/tokens.json`, written by the last
 *      `npm run tokens:sync` (2026-08-03T21:49:02Z).
 *   4. `docs/briefs/fluuen-decisions.md` — for anything that only exists as a
 *      session record (dates, intent, the classification itself).
 *
 * Where a claim comes from source 4 alone it is marked `confidence:
 * "reconstruction"`. Where the decisions doc left something `[NO VERIFICADO]`,
 * it was either checked and resolved (see `resolvedUnknowns`) or left out.
 *
 * Section 6 of `fluuen-decisions.md` ("La discrepancia de conteo: 897 vs 848")
 * is superseded by the drift analysis and must not be quoted. It offered a
 * hypothesis, said so, and the hypothesis was falsified.
 */

/* ── Types ──────────────────────────────────────────────────────────────── */

/** How well a datum is backed. `certain` = re-read from a file on 2026-08-04. */
export type Confidence = "certain" | "reconstruction";

export type TokenLayer = "primitives" | "semantic" | "components";

export interface LayerSpec {
  layer: TokenLayer;
  /** Collection name in the Tokens Studio JSON, verbatim, emoji included. */
  collection: string;
  /** What the layer is allowed to contain. */
  role: string;
  /** Top-level namespaces inside the collection, as they appear in the CSS. */
  namespaces: string[];
  /** Color tokens in the source JSON. */
  tokensInJson: number;
  /** Color tokens that reach `globals.css`. */
  tokensInCss: number;
  /** Color variables counted in Figma on 2026-07-04. */
  tokensInFigma: number;
}

export interface TokenCount {
  /** What was counted, and where. */
  scope: string;
  total: number;
  byLayer: Record<TokenLayer, number>;
  measuredAt: string;
  /** Command or file that reproduces the number. */
  reproducibleBy: string;
}

/** One hop of an alias chain, from component token down to the raw value. */
export interface AliasHop {
  layer: TokenLayer;
  /** Token path in the JSON, verbatim. */
  path: string;
  /** `$value` as written: a `{reference}` or a literal. */
  value: string;
}

export interface AliasChain {
  /** CSS variable the pipeline emits for the head of the chain. */
  cssVar: string;
  /** Where the product consumes it, when it does. */
  usedAt: string | null;
  hops: AliasHop[];
  /** Resolved literal written into `globals.css`. */
  resolvesTo: string;
  note?: string;
}

export type PipelineStepId =
  | "fetch"
  | "flatten"
  | "resolve"
  | "name"
  | "emit"
  | "merge";

export interface PipelineStep {
  id: PipelineStepId;
  /** Step marker as the script labels it, e.g. "PASO 1". */
  marker: string;
  title: string;
  /** The function that does it. */
  fn: string;
  lines: string;
  /** What it solves, in one sentence. */
  does: string;
  /** The judgement call inside it, or null when it is plumbing. */
  decision: string | null;
}

export interface CodeSnippet {
  id: string;
  file: string;
  /**
   * Line range in the source. `code` is an excerpt of it — the decision only,
   * never the scaffolding around it — so the range is wider than the excerpt.
   */
  lines: string;
  title: string;
  /**
   * Verbatim from the source, except where `commentsTranslated` says otherwise.
   * Capped at six lines: a decision that needs more than that to read is an
   * argument, and an argument belongs in prose.
   */
  code: string;
  /**
   * The source comments are in Spanish and are shown here in English. The repo
   * is read-only and was not edited — do not "fix" the translation back.
   */
  commentsTranslated: boolean;
  /** Why this is a system decision and not boilerplate. */
  decision: string;
}

export type DivergenceCategory =
  | "mechanical-sync"
  | "product-decision"
  | "figma-ahead"
  | "pipeline"
  | "by-design";

export type DivergenceStatus = "permanent" | "debt";

export interface DivergenceSide {
  /** Hex, token name, or a short description when the divergence is structural. */
  value: string;
  /** File and line, or Figma layer path. Null when it could not be located. */
  location: string | null;
}

export interface Divergence {
  /** Entry number in `fluuen-decisions.md` §3.2. Stable — do not renumber. */
  id: number;
  item: string;
  code: DivergenceSide;
  figma: DivergenceSide;
  category: DivergenceCategory;
  status: DivergenceStatus;
  /** `high` only where the decisions doc says users are affected. */
  priority: "high" | "low" | "none";
  confidence: Confidence;
  /** Why it was left as it is. */
  reason: string;
  /** Anything checked or corrected on 2026-08-04. */
  note?: string;
}

/* ── Status badge ───────────────────────────────────────────────────────── */

/** Icon key. Drawn inline — this repo installs no icon library. */
export type BadgeIcon = "check" | "loader" | "pause" | "x" | "file";

/**
 * One state of the Agent status badge, resolved through all three layers.
 * `semantic` and `primitive` are the chain behind the label colour; `bg` and
 * `border` are resolved the same way and are what the badge is painted with.
 */
export interface BadgeState {
  id: string;
  label: string;
  icon: BadgeIcon;
  semantic: string;
  primitive: string;
  /** Literal the label and icon resolve to. */
  hex: string;
  bg: string;
  border: string;
  /** Where the chain departs from the shape the other states share. */
  note?: string;
}

/**
 * The same base badge carries three state vocabularies, one per surface. Which
 * states exist is a product decision, not a styling one — an agent pauses, a
 * run cancels, and neither vocabulary contains the other's word.
 */
export interface BadgeVocabulary {
  name: string;
  surface: string;
  states: string[];
  /** Color tokens in the family. */
  tokens: number;
}

/* ── Agent Builder node ─────────────────────────────────────────────────── */

/**
 * One state of the `Node` component set in the Agent Builder library.
 *
 * Read from Figma on 2026-08-05 through the MCP, read-only:
 * component set `Node` (2494:2865), variants 2494:2814 / :2831 / :2848. The
 * set has exactly three variants — there is no hover, running or disabled
 * state. `Node / Indicator` carries seven kinds including Running and Failed,
 * but that is the header dot, not the node's own state.
 *
 * Chains were resolved against tokens-source.json and every resolved hex
 * matches what Figma returns for the variant, so for these tokens the export
 * is not stale.
 */
export interface NodeState {
  id: string;
  label: string;
  /** Border token bound by the variant, as Figma names it. */
  token: string;
  /**
   * Null when the variant binds a semantic token directly, with no
   * component-layer token between it and the ramp.
   */
  semantic: string | null;
  primitive: string;
  hex: string;
  note?: string;
}

/** Structure tokens shared by all three variants — what the node is painted with. */
export interface NodeStructure {
  bg: string;
  label: string;
  sublabel: string;
  divider: string;
  bodyText: string;
  accent: string;
  portBg: string;
  portBorder: string;
}

export interface ProjectLink {
  id: "figma" | "repo" | "tokensRepo" | "demo" | "storybook";
  label: string;
  href: string;
  /** Reachable without credentials, checked 2026-08-04. */
  public: boolean;
  /** Whether the case study links it. A private artefact never gets a link. */
  linked: boolean;
  note?: string;
}

/* ── Drift types (docs/briefs/fluuen-token-drift.md) ────────────────────── */

/** Which side of the pipeline a set of tokens is missing from. */
export type DriftSide = "css-only" | "figma-only";

/** How resolvable a stale name's destination is. */
export type MappingClass = "mechanical" | "judgement" | "no-destination";

export interface DriftGroup {
  /** Letter used in the drift analysis (A–K). Stable — do not renumber. */
  key: string;
  side: DriftSide;
  title: string;
  count: number;
  /** What changed in the design system to produce it. */
  cause: string;
  mapping: MappingClass;
  /** Rename pattern, when there is one. */
  pattern: string | null;
  note?: string;
}

export interface StaleTokenUse {
  token: string;
  /** Destination after the remap. */
  mapsTo: string;
  driftGroup: string;
  files: { path: string; lines: number[] }[];
  /** Tailwind class vs var() in a style attribute. */
  consumedAs: "tailwind-class" | "css-var";
}

export interface FluuenData {
  source: {
    repo: string;
    branch: string;
    mergedToMain: boolean;
    figmaFileKey: string;
    figmaFileName: string;
    tokensRepo: string;
    /** When the script last ran. Recorded in globals.css. */
    lastTokenSync: string;
    /**
     * When Tokens Studio last pushed to the token repo. Null because nothing
     * records it — the untraced link that produced the drift.
     */
    lastTokenPush: string | null;
    figmaVerifiedAt: string;
    extractedAt: string;
  };
  links: ProjectLink[];
  tokens: {
    /**
     * The number the Overview publishes, alone: the count in Figma, which is
     * where the system declares its truth for tokens.
     */
    published: TokenCount;
    /**
     * The count in the derived artefact. It appears only in section 03, next
     * to `drift`, where the gap between the two is the finding. Never in the
     * Overview, and never on its own.
     */
    alternate: TokenCount;
    drift: {
      /** Present in the CSS, absent from Figma. */
      cssOnly: number;
      /** Present in Figma, absent from the CSS. */
      figmaOnly: number;
      /** cssOnly − figmaOnly: what comparing totals used to show. */
      net: number;
      cause: string;
      /** The same drift outside $type color. See divergence 7. */
      beyondColor: string;
      /** Why the aggregate hid it for months. */
      whyItHid: string;
      /** The system reading, and the line the case study argues. */
      systemReading: string;
      groups: DriftGroup[];
      /** How the 85 stale names partition by how resolvable they are. */
      mapping: Record<MappingClass, number>;
      /** The headline split: renamed vs genuinely gone. */
      headline: string;
      staleInCode: StaleTokenUse[];
      falsifiedHypotheses: { hypothesis: string; test: string; result: string }[];
      methodLesson: string;
      status: "open" | "closed";
      verifiedAt: string;
    };
    /** Hand-authored `--color-*` outside the generated block. */
    manualTokens: { count: number; whatFor: string[]; livesAt: string };
    layers: LayerSpec[];
    aliasChains: AliasChain[];
    /** The Agent badge, resolved state by state. */
    badgeStates: BadgeState[];
    /** The Agent Builder node: three variants, three border tokens. */
    nodeStates: NodeState[];
    /** What the node is painted with, shared across all three variants. */
    nodeStructure: NodeStructure;
    /** The three state vocabularies the same base badge carries. */
    badgeVocabularies: BadgeVocabulary[];
    coverage: { synced: string[]; manual: string[] };
  };
  pipeline: {
    flow: string[];
    command: string;
    scriptPath: string;
    scriptLines: number;
    dependencies: number;
    steps: PipelineStep[];
    snippets: CodeSnippet[];
  };
  divergences: Divergence[];
  /** `[NO VERIFICADO]` items from the decisions doc, checked on 2026-08-04. */
  resolvedUnknowns: {
    question: string;
    answer: string;
    evidence: string;
    publishable: boolean;
  }[];
  notes: string[];
}

/* ── Links ──────────────────────────────────────────────────────────────── */

const links: ProjectLink[] = [
  {
    id: "figma",
    label: "Fluuen Design System — Figma",
    href: "https://www.figma.com/design/MOhVXH1k1Aa5tbQJM8QDRF",
    public: true,
    linked: true,
    note: "Cited at stories/foundations.mdx:10 and read live on 2026-08-04. Figma answers 403 to an unauthenticated HTTP request, which it does for public files too — so the public URL was not confirmed end to end. Open it in a logged-out browser before publishing.",
  },
  {
    id: "tokensRepo",
    label: "Token source — github.com/fma082/fluuen-tokens",
    href: "https://github.com/fma082/fluuen-tokens",
    public: true,
    linked: true,
    note: "Public, default branch `main`. This is the repo the pipeline fetches from, and the one artefact that shows the pipeline is real rather than described.",
  },
  {
    id: "demo",
    label: "Live demo — fluuen.vercel.app",
    href: "https://fluuen.vercel.app",
    public: true,
    linked: true,
  },
  {
    id: "storybook",
    label: "Storybook — fluuen-storybook.vercel.app",
    href: "https://fluuen-storybook.vercel.app/",
    public: true,
    linked: true,
    note: "Deploys from `feature/storybook`. Foundations parses the generated block at build time, so the docs cannot drift from the CSS. What it cannot catch is the CSS drifting from Figma — which is the finding in section 03.",
  },
  {
    id: "repo",
    label: "Product repo — github.com/fma082/fluuen",
    href: "https://github.com/fma082/fluuen",
    public: false,
    linked: false,
    note: "Private, confirmed 2026-08-04 (the GitHub API returns 404 unauthenticated). Kept here for provenance — every code location in this file points into it — but the case study does not link it.",
  },
];

/* ── Tokens ─────────────────────────────────────────────────────────────── */

/**
 * Two measurements of the same system, taken on the same day.
 *
 * `published` is Figma. The case study argues that the system declared where
 * the truth of each artefact lives, and for tokens it declared Figma —
 * publishing the derived artefact's count instead would contradict the thesis
 * in its own headline number. It would also publish 85 names Figma no longer
 * has.
 *
 * `alternate` is the CSS. It appears once, in section 03, beside `drift`,
 * where the distance between the two is the finding. It never appears in the
 * Overview and never stands on its own.
 */
const publishedCount: TokenCount = {
  scope: "COLOR variables in the Figma file MOhVXH1k1Aa5tbQJM8QDRF",
  total: 848,
  byLayer: { primitives: 129, semantic: 126, components: 593 },
  measuredAt: "2026-08-04",
  reproducibleBy:
    "figma.variables.getLocalVariablesAsync() filtered to resolvedType === 'COLOR', via the Desktop Bridge, read-only. First audited 2026-07-04 and re-read on 2026-08-04 with the same result.",
};

const alternateCount: TokenCount = {
  scope: "`--color-*` custom properties inside the GENERATED block of app/globals.css",
  total: 897,
  byLayer: { primitives: 129, semantic: 125, components: 643 },
  measuredAt: "2026-08-04",
  reproducibleBy:
    "sed -n '/=== GENERATED BY sync-tokens.mjs ===/,/=== END GENERATED ===/p' app/globals.css | grep -c '^\\s*--color-'",
};

const layers: LayerSpec[] = [
  {
    layer: "primitives",
    collection: "🥥 Primitives/Mode 1",
    role: "Raw ramps. No meaning attached — a primitive never names a use.",
    namespaces: [
      "river-styx",
      "graphite",
      "neutral",
      "blue",
      "green",
      "red",
      "yellow",
      "orange",
      "purple",
      "brand",
    ],
    tokensInJson: 129,
    tokensInCss: 129,
    tokensInFigma: 129,
  },
  {
    layer: "semantic",
    collection: "🏷️ Semantic/Mode 1",
    role: "What a component is allowed to reach for. Every value is an alias to a primitive.",
    namespaces: ["surface", "text", "border", "brand", "status", "icon"],
    tokensInJson: 126,
    tokensInCss: 125,
    tokensInFigma: 126,
  },
  {
    layer: "components",
    collection: "Components/Mode 1",
    role: "One namespace per component. Aliases the semantic layer, never a primitive.",
    namespaces: ["Control", "Alert", "Toast"],
    tokensInJson: 643,
    tokensInCss: 643,
    tokensInFigma: 593,
  },
];

/**
 * Five real chains, read from `tokens-source.json`. 642 of the 643 component
 * tokens resolve in exactly three hops; the one exception is the last entry.
 */
const aliasChains: AliasChain[] = [
  {
    cssVar: "--color-control-badge-status-run-success-bg",
    usedAt: "components/runs/status-badge.tsx:14",
    hops: [
      {
        layer: "components",
        path: "Components/Mode 1.🎨 colors.Control.Badge.Status.Run.success-bg",
        value: "{🎨 colors.status.success.success-surface-alpha}",
      },
      {
        layer: "semantic",
        path: "🏷️ Semantic/Mode 1.🎨 colors.status.success.success-surface-alpha",
        value: "{colors.green.alpha.20}",
      },
      {
        layer: "primitives",
        path: "🥥 Primitives/Mode 1.colors.green.alpha.20",
        value: "#3fb95033",
      },
    ],
    resolvesTo: "#3fb95033",
    note: "The badge never learns that success is green. It asks for a run-success background.",
  },
  {
    cssVar: "--color-control-node-trigger-accent",
    usedAt: null,
    hops: [
      {
        layer: "components",
        path: "Components/Mode 1.🎨 colors.Control.Node.Trigger.accent",
        value: "{🎨 colors.status.success.success}",
      },
      {
        layer: "semantic",
        path: "🏷️ Semantic/Mode 1.🎨 colors.status.success.success",
        value: "{colors.green.500}",
      },
      {
        layer: "primitives",
        path: "🥥 Primitives/Mode 1.colors.green.500",
        value: "#3fb950",
      },
    ],
    resolvesTo: "#3fb950",
    note: "The canvas node reads the semantic step directly (canvas-node.tsx:10) instead of this component token — the token exists in Figma ahead of its use in code.",
  },
  {
    cssVar: "--color-control-node-trigger-badge-bg",
    usedAt: null,
    hops: [
      {
        layer: "components",
        path: "Components/Mode 1.🎨 colors.Control.Node.Trigger.badge-bg",
        value: "{🎨 colors.status.success.success-surface-light}",
      },
      {
        layer: "semantic",
        path: "🏷️ Semantic/Mode 1.🎨 colors.status.success.success-surface-light",
        value: "{colors.green.100}",
      },
      {
        layer: "primitives",
        path: "🥥 Primitives/Mode 1.colors.green.100",
        value: "#c5eacb",
      },
    ],
    resolvesTo: "#c5eacb",
    note: "Same node, same status, a different surface weight — three semantic steps sit on one primitive ramp.",
  },
  {
    cssVar: "--color-control-edge-active",
    usedAt: null,
    hops: [
      {
        layer: "components",
        path: "Components/Mode 1.🎨 colors.Control.Edge.active",
        value: "{🎨 colors.brand.Primary}",
      },
      {
        layer: "semantic",
        path: "🏷️ Semantic/Mode 1.🎨 colors.brand.Primary",
        value: "{colors.brand.500}",
      },
      {
        layer: "primitives",
        path: "🥥 Primitives/Mode 1.colors.brand.500",
        value: "#6366f1",
      },
    ],
    resolvesTo: "#6366f1",
    note: "Capital P in `brand.Primary` is how the token is spelled in Figma. The naming step lowercases it on the way out.",
  },
  {
    cssVar: "--color-toast-bg",
    usedAt: null,
    hops: [
      {
        layer: "components",
        path: "Components/Mode 1.Toast.bg",
        value: "#111116",
      },
    ],
    resolvesTo: "#111116",
    note: "The one component token out of 643 that holds a literal instead of an alias. #111116 is river-styx.600 copied by hand — the layer boundary broken in a single place. Control/Toast.bg, the parallel token one namespace over, aliases surface.elevated correctly.",
  },
];

/* ── Status badge ───────────────────────────────────────────────────────── */

/**
 * Read from tokens-source.json on 2026-08-04, resolving
 * `Control.Badge.Status.Agent.<state>-<prop>` through both layers. Every hex
 * below is the literal the pipeline writes; none is typed by hand.
 */
const badgeStates: BadgeState[] = [
  {
    id: "success",
    label: "Success",
    icon: "check",
    semantic: "status.success",
    primitive: "green.500",
    hex: "#3fb950",
    bg: "#3fb95033",
    border: "#3fb9504d",
  },
  {
    id: "running",
    label: "Running",
    icon: "loader",
    semantic: "status.info",
    primitive: "blue.500",
    hex: "#3b82f6",
    bg: "#3b82f633",
    border: "#3b82f64d",
  },
  {
    id: "paused",
    label: "Paused",
    icon: "pause",
    semantic: "status.warning",
    primitive: "yellow.300",
    hex: "#e8c75c",
    bg: "#e8c75c33",
    border: "#e8c75c4d",
    note: "The only state whose primitive is not a 500 step. Warning sits on yellow.300 because the 500 is too dark to read as a label on its own surface.",
  },
  {
    id: "error",
    label: "Error",
    icon: "x",
    semantic: "text.error-light",
    primitive: "red.500",
    hex: "#f85149",
    bg: "#f851491a",
    border: "#f8514933",
    note: "Resolves through text.error-light rather than status.error, and its surface is a 10% alpha where the others use 20%. Both are departures from the shape the other four share.",
  },
  {
    id: "draft",
    label: "Draft",
    icon: "file",
    semantic: "text.muted",
    primitive: "river-styx.150",
    hex: "#868e9e",
    bg: "#1a1a244d",
    border: "#1e1e26",
    note: "The one state with no status semantic at all — a draft agent has no condition to report, so it borrows the neutral surface, border and text the rest of the interface uses.",
  },
];

const badgeVocabularies: BadgeVocabulary[] = [
  {
    name: "Agent",
    surface: "The agents grid and the agent header",
    states: ["success", "running", "paused", "error", "draft"],
    tokens: 20,
  },
  {
    name: "Run",
    surface: "Run history and run detail",
    states: ["success", "running", "failed", "cancelled"],
    tokens: 16,
  },
  {
    name: "Generic",
    surface: "Anywhere without its own vocabulary",
    states: ["active", "running", "error", "paused", "draft", "selected"],
    tokens: 18,
  },
];

/* ── Agent Builder node ─────────────────────────────────────────────────── */

const nodeStates: NodeState[] = [
  {
    id: "default",
    label: "Default",
    token: "Control/Node/Structure/border-default",
    semantic: "border.default",
    primitive: "river-styx.400",
    hex: "#1e1e26",
  },
  {
    id: "selected",
    label: "Selected",
    token: "Control/Node/Structure/border-selected",
    semantic: "border.focus",
    primitive: "brand.400",
    hex: "#818cf8",
    note: "The code reaches for brand.500 here instead — one step down the same ramp. That is divergence 4, and the step is the whole divergence.",
  },
  {
    id: "error",
    label: "Error",
    token: "border/error",
    semantic: null,
    primitive: "red.600",
    hex: "#e5261d",
    note: "Error binds the semantic token directly — no component-level token.",
  },
];

const nodeStructure: NodeStructure = {
  bg: "#111116",
  label: "#f3f4f6",
  sublabel: "#868e9e",
  divider: "#1e1e26",
  bodyText: "#e5e7eb",
  accent: "#3b82f6",
  portBg: "#0d0d12",
  portBorder: "#2a2a3a",
};

/* ── Drift (docs/briefs/fluuen-token-drift.md) ──────────────────────────── */

/**
 * The eleven groups the name-by-name diff produced. A–H are in the CSS and not
 * in Figma (85); I–K are in Figma and not in the CSS (36). The counts within
 * each side sum to the side's total.
 */
const driftGroups: DriftGroup[] = [
  {
    key: "A",
    side: "css-only",
    title: "Notification moved under ⚠️ Deprecated",
    count: 14,
    cause:
      "The whole group was moved to 🎨 colors/⚠️ Deprecated/Notification/ in Figma. Leaf names are identical; only the parent changed.",
    mapping: "mechanical",
    pattern: "--color-control-notification-* → --color-deprecated-notification-*",
    note: "Matches group J one-for-one. The same fourteen tokens counted on both sides of the diff, which is exactly how a rename looks when you compare lists instead of totals.",
  },
  {
    key: "B",
    side: "css-only",
    title: "Badge/Status gained a Generic level",
    count: 18,
    cause:
      "Figma now has three status-badge families — Agent, Generic, Run — where there used to be one unqualified. The old family is Generic.",
    mapping: "mechanical",
    pattern:
      "--color-control-badge-status-<state>-<prop> → --color-control-badge-status-generic-<state>-<prop>",
  },
  {
    key: "C",
    side: "css-only",
    title: "Button/Destructive split into Solid and Outline",
    count: 13,
    cause: "The destructive button opened into two visual variants.",
    mapping: "judgement",
    pattern:
      "--color-control-button-destructive-<prop> → …-solid-<prop> (13/13 exact) or …-outline-<prop>",
    note: "Solid is the defensible default, but each use has to be checked: a destructive button with a border and a transparent fill needs Outline. Outline has no border-focus — if an outline use needs focus, that is a gap to close in Figma, not in code.",
  },
  {
    key: "D",
    side: "css-only",
    title: "Input flattened",
    count: 18,
    cause:
      "The old names group by state and then repeat it in the property (Input/<state>/<prop>-<state>). Figma is flat now: Input/<prop>-<state>.",
    mapping: "mechanical",
    pattern: "--color-control-input-<state>-<prop>-<state> → --color-control-input-<prop>-<state>",
    note: "17 of the 18 are mechanical. The exception is --color-control-input-error-icon-helper-error, whose old name fuses `icon` and `helper` — Figma has to say which one it was before it can be mapped.",
  },
  {
    key: "E",
    side: "css-only",
    title: "SelectionControl changed its state model",
    count: 13,
    cause:
      "The deepest case, and not a rename. The old system thought about checkbox/radio/toggle in terms of interaction (default / hover); the new one thinks in semantic state (checked / unchecked / disabled). Hover stopped being a token.",
    mapping: "judgement",
    pattern: "…-<control>-<prop>-default → …-<control>-<prop>-unchecked (6 of the 13)",
    note: "Mapping default to unchecked is an interpretation, not something the new system states. The other 7 have nowhere to go — see `mapping['no-destination']`.",
  },
  {
    key: "F",
    side: "css-only",
    title: "Table row-* renamed to cell-*",
    count: 5,
    cause: "Straight rename of the level.",
    mapping: "mechanical",
    pattern: "--color-control-table-row-* → --color-control-table-cell-*",
  },
  {
    key: "G",
    side: "css-only",
    title: "Badge/Numeric gained Soft and Solid",
    count: 3,
    cause: "Same restructuring as the destructive button, one level deeper.",
    mapping: "judgement",
    pattern: "--color-control-badge-numeric-<prop> → …numeric-soft-<prop> | …numeric-solid-<prop>",
    note: "Soft distinguishes text-brand from text-error; Solid has a single text. The old unsuffixed `text` suggests Solid, but the bg-* names do not settle it.",
  },
  {
    key: "H",
    side: "css-only",
    title: "Card border-selected renamed",
    count: 1,
    cause: "selected → active.",
    mapping: "judgement",
    pattern: "--color-control-card-border-selected → --color-control-card-border-active",
    note: "Needs confirming that they are the same token conceptually. If selected and active coexisted as distinct states, this is a loss, not a rename.",
  },
  {
    key: "I",
    side: "figma-only",
    title: "AgentBuilder/Inspector — a whole component the code has never seen",
    count: 20,
    cause:
      "The Inspector is the side panel of the Agent Builder, the product's flagship screen. It was designed in full — tabs, logs with duration and timestamp, typed outputs, test state — and never exported. The word `Inspector` appears 0 times in tokens-source.json.",
    mapping: "no-destination",
    pattern: null,
    note: "The other two AgentBuilder subgroups, Topbar and NodePanel, are in the CSS. That dates the Inspector's design as later than the last push from the plugin, which is what makes this a timestamp rather than an omission.",
  },
  {
    key: "J",
    side: "figma-only",
    title: "Notification under Deprecated",
    count: 14,
    cause: "The other side of group A. Same leaf names, new parent.",
    mapping: "mechanical",
    pattern: "--color-deprecated-notification-*",
  },
  {
    key: "K",
    side: "figma-only",
    title: "Two loose tokens",
    count: 2,
    cause:
      "--color-control-edge-success, a new edge state on the builder canvas, and --color-text-on-brand, a semantic token for text on a brand surface.",
    mapping: "no-destination",
    pattern: null,
    note: "text-on-brand is the sensitive one: it is an accessibility token — contrast on brand — that exists in the system and is not available to the code. Both were opened as gaps during the July sweep and closed in Figma; neither reached the pipeline.",
  },
];

/**
 * The nine stale names that are actually referenced by product components. The
 * rest of the 85 appear only in `case-study/tokens.css` and the Storybook
 * build, which are derived copies of globals.css, not real use.
 */
const staleInCode: StaleTokenUse[] = [
  {
    token: "--color-control-badge-status-active-dot",
    mapsTo: "--color-control-badge-status-generic-active-dot",
    driftGroup: "B",
    files: [{ path: "components/dashboard/agent-status.tsx", lines: [6] }],
    consumedAs: "tailwind-class",
  },
  {
    token: "--color-control-badge-status-paused-dot",
    mapsTo: "--color-control-badge-status-generic-paused-dot",
    driftGroup: "B",
    files: [{ path: "components/dashboard/agent-status.tsx", lines: [7] }],
    consumedAs: "tailwind-class",
  },
  {
    token: "--color-control-badge-status-draft-dot",
    mapsTo: "--color-control-badge-status-generic-draft-dot",
    driftGroup: "B",
    files: [{ path: "components/dashboard/agent-status.tsx", lines: [8] }],
    consumedAs: "tailwind-class",
  },
  {
    token: "--color-control-badge-status-error-dot",
    mapsTo: "--color-control-badge-status-generic-error-dot",
    driftGroup: "B",
    files: [{ path: "components/dashboard/agent-status.tsx", lines: [9] }],
    consumedAs: "tailwind-class",
  },
  {
    token: "--color-control-input-default-bg-default",
    mapsTo: "--color-control-input-bg-default",
    driftGroup: "D",
    files: [
      { path: "components/agents/wizard/step-actions.tsx", lines: [55, 103] },
      { path: "components/agents/wizard/step-configure.tsx", lines: [57, 74, 99, 151] },
      { path: "components/agents/wizard/step-review.tsx", lines: [101, 195] },
      { path: "components/agents/wizard/step-trigger.tsx", lines: [52, 94] },
    ],
    consumedAs: "css-var",
  },
  {
    token: "--color-control-input-default-border-default",
    mapsTo: "--color-control-input-border-default",
    driftGroup: "D",
    files: [{ path: "components/agents/wizard/step-configure.tsx", lines: [58, 75] }],
    consumedAs: "css-var",
  },
  {
    token: "--color-control-input-default-text-default",
    mapsTo: "--color-control-input-text-default",
    driftGroup: "D",
    files: [{ path: "components/agents/wizard/step-configure.tsx", lines: [59] }],
    consumedAs: "css-var",
  },
  {
    token: "--color-control-input-default-placeholder-default",
    mapsTo: "--color-control-input-placeholder-default",
    driftGroup: "D",
    files: [{ path: "components/agents/wizard/step-configure.tsx", lines: [76] }],
    consumedAs: "css-var",
  },
  {
    token: "--color-control-input-focus-border-focus",
    mapsTo: "--color-control-input-border-focus",
    driftGroup: "D",
    files: [
      { path: "components/agents/wizard/step-configure.tsx", lines: [55, 72] },
      { path: "components/agents/wizard/step-trigger.tsx", lines: [113] },
    ],
    consumedAs: "css-var",
  },
];

/**
 * Four hypotheses, three falsified, before the diff. The route matters as much
 * as the answer: every one of them was an attempt to explain a single number.
 */
const falsifiedHypotheses = [
  {
    hypothesis: "The hand-authored a11y block inflates the count.",
    test: "Count --color-* inside the GENERATED markers separately from the whole file.",
    result:
      "Falsified. The generated block holds 897 on its own; the 36 manual tokens sit outside it. The cause is upstream of the CSS.",
  },
  {
    hypothesis:
      "The token repo carries names Figma deleted: river-styx/950, _deprecated/*, node-* legacy, Inter/JetBrains primitives.",
    test: "Grep tokens-source.json for each of the four.",
    result:
      "Falsified for the three color suspects: 0 hits each, and the river-styx ramp has the same 13 steps as Figma. It rested on a real precedent and on the 49 = 49 symmetry, which turned out to be an artefact of the name collision.",
  },
  {
    hypothesis: "The 49 are the `status` group of the semantic layer.",
    test:
      "Falsifiable prediction: if the semantic layer counts 126 it was a miscount; if it counts 76, tokens were being dragged along.",
    result:
      "Falsified. It counts 126 on both sides — zero drift. `status` does have exactly 49 variables in Figma, which is why it was worth testing, but the match was chance.",
  },
  {
    hypothesis: "848 came from the public duplicate; the original file has 897.",
    test: "Count the original, MOhVXH1k1Aa5tbQJM8QDRF.",
    result: "Falsified in one shot. The original gives 848, identical to the duplicate row by row.",
  },
  {
    hypothesis: "Tokens Studio exports sets that were never Figma variables.",
    test: "Read $metadata.tokenSetOrder.",
    result:
      "Falsified. Exactly three sets, one per Figma collection. No token lives only in the plugin — it is the same file at two moments.",
  },
];

/* ── Pipeline ───────────────────────────────────────────────────────────── */

const pipelineSteps: PipelineStep[] = [
  {
    id: "fetch",
    marker: "PASO 1",
    title: "Fetch",
    fn: "downloadTokens()",
    lines: "scripts/sync-tokens.mjs:65-80",
    does: "Pulls tokens.json from raw.githubusercontent.com and writes it to tokens-source.json.",
    decision:
      "No manual download step, so there is no stale copy to forget about. The local file is a cache of the fetch, not an input.",
  },
  {
    id: "flatten",
    marker: "PASO 2",
    title: "Flatten",
    fn: "flattenTokens()",
    lines: "scripts/sync-tokens.mjs:86-104",
    does: "Walks the nested Tokens Studio tree and returns a Map of dotted paths. A node is a token when it has both $value and $type.",
    decision:
      "Keys starting with `$` or `com.figma` are skipped, which drops Figma's own scope metadata before it can reach the CSS.",
  },
  {
    id: "resolve",
    marker: "PASO 3",
    title: "Resolve aliases",
    fn: "resolveReference()",
    lines: "scripts/sync-tokens.mjs:110-123",
    does: "Replaces every {reference} with the value it points at, recursively, up to ten levels deep.",
    decision:
      "The chain is collapsed before anything is written, so the CSS holds literals, not var() chains. The lookup matches on `endsWith` OR `includes` and takes the first hit — the loosest possible resolution, and the part of the script most exposed to a naming collision upstream.",
  },
  {
    id: "name",
    marker: "PASO 4",
    title: "Name",
    fn: "tokenPathToCssVar() + sanitizeSegment()",
    lines: "scripts/sync-tokens.mjs:39-59, 138-204",
    does: "Turns a token path into a CSS custom property: strips emoji, slashes and parentheses, lowercases, then collapses redundant consecutive segments.",
    decision:
      "The public name of a token is decided here, not in Figma. `status.success.success` becomes `--color-status-success`, and the whole `light`/`dark`/`theme` branch of the JSON is returned as null and never emitted.",
  },
  {
    id: "emit",
    marker: "PASO 5",
    title: "Emit",
    fn: "generateCss()",
    lines: "scripts/sync-tokens.mjs:210-254",
    does: "Filters to color-valued tokens, drops names already taken, groups by the first segment of the CSS name and writes an @theme block between the GENERATED markers.",
    decision:
      "Groups are derived from the emitted name, not from the source collection — which is why the generated block reads as 18 alphabetical groups (ALERT…YELLOW) rather than as three layers.",
  },
  {
    id: "merge",
    marker: "PASO 6",
    title: "Merge with the manual block",
    fn: "updateGlobalsCss() + removeManualDuplicates()",
    lines: "scripts/sync-tokens.mjs:260-338",
    does: "Replaces only the text between the two GENERATED markers, then deletes any hand-authored declaration below the block that the generated block already defines.",
    decision:
      "Two authorities coexist in one file on purpose: Figma owns the generated block, code owns everything after it. The generated block wins on conflict — a hand-authored token survives only by having a name Figma does not use.",
  },
];

const pipelineSnippets: CodeSnippet[] = [
  {
    id: "segment-dedup",
    file: "scripts/sync-tokens.mjs",
    lines: "182-190",
    title: "The token's public name is a build artefact",
    code: `//   1. status.success.success → status-success
//   2. success.success-light  → success-light
if (seg === prev) continue;                    // drop exact duplicate
if (seg.startsWith(prev + '-')) {
    deduped.push(seg.slice(prev.length + 1));  // strip redundant prefix
}`,
    commentsTranslated: true,
    decision:
      "Tokens Studio' verbose hierarchy does not survive into the CSS. Two rules decide what a token is publicly called — drop a segment identical to the one before it, strip a prefix the next segment repeats — and between them they mean the naming of the system is owned by the pipeline rather than copied from Figma. It also has a cost: this pass was written after the first sync had already shipped names like --color-status-success-success, so the fix came with a manual cleanup of the hand-authored block.",
  },
  {
    id: "alias-resolution",
    file: "scripts/sync-tokens.mjs",
    lines: "110-123",
    title: "Three layers collapse to a literal before anything is written",
    code: `for (const [key, token] of allTokens) {
    if (key.endsWith(refPath) || key.includes(refPath)) {
        return resolveReference(token.value, allTokens, depth + 1);
    }
}`,
    commentsTranslated: false,
    decision:
      "Component → semantic → primitive is enforced in Figma and flattened here, recursively and capped at ten levels, so a component never resolves through a var() chain at runtime. The trade is in the condition: the lookup is a substring scan that takes the first match, so the layering is guaranteed by the source rather than by the resolver. It has held because Figma will not allow two variables with the same name — but a rename upstream is the failure mode it cannot see.",
  },
  {
    id: "manual-coexistence",
    file: "scripts/sync-tokens.mjs",
    lines: "320-329",
    title: "When both blocks define a token, the generated one wins",
    code: `if (generatedVars.has(varName)) {
    removed.push(varName);
    return '';
}
return line;`,
    commentsTranslated: false,
    decision:
      "This runs over every declaration below the generated block, with generatedVars holding the names Figma just wrote. Anything Figma defines is deleted from the hand-authored block; anything it does not, survives untouched. That is what lets accessibility fixes live in code and survive a sync — --color-brand-solid #565ad6 exists because brand-primary #6366f1 fails 4.5:1 for text, and it keeps a name Figma does not use, so the sync has nothing to overwrite (app/globals.css:955-961).",
  },
];

/* ── Divergences (fluuen-decisions.md §3.2) ─────────────────────────────── */

/**
 * The eight entries, in the doc's order. Entries 1–6 were recorded with exact
 * values at the moment they were found (2026-07-02 → 07-04); 7 and 8 are
 * reconstructed from session records. Every code-side location below was
 * re-read on 2026-08-04 and is current.
 */
const divergences: Divergence[] = [
  {
    id: 1,
    item: "Node sub-label color",
    code: {
      value: "#6b7280 (--color-neutral-500)",
      location: "components/builder/canvas-node.tsx:202, components/builder/builder-topbar.tsx:144",
    },
    figma: {
      value: "#868e9e (text/muted → river-styx.150)",
      location: "Control/Node/*",
    },
    category: "mechanical-sync",
    status: "debt",
    priority: "high",
    confidence: "certain",
    reason:
      "Mechanical sync — the token wins. Deferred only because the session scope was Figma-only, not because the value was in question.",
    note: "Still present on 2026-08-04. The only entry in this table with a user-facing effect: it is a contrast failure on live text. #868e9e already exists in the CSS as --color-text-muted, so the fix is a one-token swap.",
  },
  {
    id: 2,
    item: "Divider",
    code: { value: "#1a1a24", location: null },
    figma: { value: "#1e1e26", location: null },
    category: "mechanical-sync",
    status: "debt",
    priority: "low",
    confidence: "certain",
    reason: "Mechanical sync, cosmetic.",
    note: "Both hexes are live tokens in globals.css today — #1a1a24 is --color-surface-raised (river-styx.500), #1e1e26 is --color-border-default (river-styx.400). The exact usage site was not located in the current code, so the code-side location is left null rather than guessed.",
  },
  {
    id: 3,
    item: "Card background",
    code: {
      value: "#0f0f17 (--color-surface-elevated)",
      location: "components/builder/canvas-node.tsx:63",
    },
    figma: { value: "#111116 (river-styx.600)", location: "Control/Node/*" },
    category: "mechanical-sync",
    status: "debt",
    priority: "low",
    confidence: "certain",
    reason:
      "Mechanical sync, cosmetic. Flagged at the time: check the node does not merge into the surrounding panels once applied.",
  },
  {
    id: 4,
    item: "Selected border",
    code: {
      value: "#6366f1 (--color-brand-primary)",
      location: "components/builder/canvas-node.tsx:53",
    },
    figma: { value: "#818cf8 (--color-border-focus)", location: "Control/Node/*" },
    category: "product-decision",
    status: "debt",
    priority: "low",
    confidence: "certain",
    reason:
      "Filed under mechanical sync in the original list, but the note attached to it read 'affordance, decide by eye, NOT auto'. By that criterion it belongs with #5, not with #1–3.",
    note: "Misfiled in the source artefact. The decisions doc (§3.3) recommends telling that rather than silently correcting it: a classification error nobody would invent is what proves the list was kept in real time. Category here reflects the corrected reading.",
  },
  {
    id: 5,
    item: "CTA hierarchy: Run vs Publish",
    code: { value: "One hierarchy", location: "components/builder/builder-topbar.tsx" },
    figma: { value: "The other", location: "Control/AgentBuilder/Topbar" },
    category: "product-decision",
    status: "debt",
    priority: "none",
    confidence: "certain",
    reason:
      "Someone has to decide which action is primary. Marked explicitly at the time as 'do not align automatically'. Open until that call is made — it needs judgement, not a sync.",
  },
  {
    id: 6,
    item: "Node catalog icons: grey vs colored by type",
    code: {
      value: "Grey — the row sets color: var(--color-text-secondary) and the icon inherits it",
      location:
        "components/builder/builder-node-catalog.tsx:236 (row), :240 (icon)",
    },
    figma: {
      value: "Accent per type",
      location: "Node/{type}/accent",
    },
    category: "figma-ahead",
    status: "debt",
    priority: "low",
    confidence: "certain",
    reason:
      "Figma is ahead, not drifting: coloring the icon by type gives affordance and matches the node on the canvas 1:1. The code has to catch up to the design.",
    note: "Confirmed on 2026-08-04. The per-type accent already exists in the file — NODE_CATALOG declares color per section (:41, :51, :62, :72) and uses it for the section dot (:187) and label (:216). Only the item icons ignore it.",
  },
  {
    id: 7,
    item: "Typography in the token repo: Inter + JetBrains Mono vs Geist",
    code: {
      value: "Geist / Geist Mono, hand-authored",
      location: "app/globals.css:952-953",
    },
    figma: { value: "Geist / Geist Mono", location: "Fluuen Design System" },
    category: "pipeline",
    status: "debt",
    priority: "low",
    confidence: "reconstruction",
    reason:
      "Inter and JetBrains Mono were Fluuen's original typefaces. The migration to Geist was made in Figma and tokens.json was never re-exported — so this is not contamination of unknown origin, it is the same stale export that produces the other 121 divergences, showing up one layer over. Spotted on 2026-06-27 and set aside to be reconciled separately from the Figma frame change.",
    note: "The 122nd divergence, and the one that proves the mechanism is general: the same untraced Figma → JSON link drifts $type text exactly as it drifts $type color. It hid longer than the other 121 for a specific reason — the color drift changes how many tokens exist, so a diff catches it, while replacing three font families changes only their values. Both counts stayed at 6, and every count-based check passed. Still open, verified on 2026-08-04 in tokens-source.json, the copy the last sync pulled: typography.font-family.primary is 'Inter', .code and .mono are 'JetBrains Mono', and the string 'Geist' does not appear anywhere in the file. It never reaches production because the script only emits color and --font-sans/--font-mono are hand-authored — latent, not active. The date stays reconstruction; the cause and the current state are certain. fluuen-token-drift-summary.md §1 briefly listed these at 0 hits in the JSON; corrected on 2026-08-04.",
  },
  {
    id: 8,
    item: "Shipped screens that do not exist in Figma",
    code: { value: "Source of truth for screens", location: "app/" },
    figma: {
      value: "Tokens and a component library only",
      location: "Fluuen Design System",
    },
    category: "by-design",
    status: "permanent",
    priority: "none",
    confidence: "certain",
    reason:
      "Decided on 2026-07-02. Redrawing shipped screens in Figma was identified as an anti-pattern: it guarantees drift. Not debt — the boundary is the decision.",
  },
];

/* ── [NO VERIFICADO] items, checked on 2026-08-04 ───────────────────────── */

const resolvedUnknowns: FluuenData["resolvedUnknowns"] = [
  {
    question:
      "Were the token gaps found during the Agent Builder sweep — Control/Edge/success and text/on-brand — ever created? (fluuen-decisions.md §3.3)",
    answer:
      "Yes, both — in Figma. They are two of the 36 tokens that exist in Figma and never reached the CSS (drift group K). They are absent from tokens-source.json and from globals.css because the plugin was never pushed after they were added, not because they were never made. The micro-story the decisions doc was hoping for is real, and it has a sharper ending than expected: the architecture violation was found and closed in the design file, and the closure never shipped. text/on-brand is the pointed one — an accessibility token for contrast on brand surfaces, closed in Figma, unavailable to the code.",
    evidence:
      "docs/briefs/fluuen-token-drift.md §3.K, from the live Figma read; absence confirmed in tokens-source.json",
    publishable: true,
  },
  {
    question: "Does the token repo still carry the deleted river-styx/950 step? (§6.2 hypothesis)",
    answer:
      "No. The ramp runs 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900 plus alpha.30 and alpha.70 — thirteen tokens, the same thirteen Figma has. There are no `_deprecated`, `legacy` or `node-*` keys either. The doc's hypothesis for the gap does not hold on any of its four suspects.",
    evidence: "tokens-source.json, 🥥 Primitives/Mode 1.colors.river-styx.*",
    publishable: true,
  },
  {
    question: "Does the hand-authored block explain the 897/848 gap? (§6.3, command 1)",
    answer:
      "No. The generated block alone holds 897 --color-* declarations; the whole file holds 933. The 36 hand-authored tokens sit outside the count entirely, so the cause is upstream of the CSS.",
    evidence: "app/globals.css — grep inside and outside the GENERATED markers",
    publishable: true,
  },
  {
    question:
      "Is the Inter / JetBrains Mono typography drift closed? (fluuen-decisions.md §3.2, entry 7)",
    answer:
      "No, still open — and its cause is now settled. Inter and JetBrains Mono were Fluuen's original typefaces; the migration to Geist was made in Figma and tokens.json was never re-exported. It is the same stale export behind the other 121 divergences, operating on $type text instead of $type color, so it needs no separate explanation and closes with the same re-export. tokens-source.json declares typography.font-family.primary as 'Inter' and both .code and .mono as 'JetBrains Mono'; 'Geist' appears 0 times, while the product and Figma both run Geist. It never reaches production because the script only emits color and --font-sans/--font-mono are hand-authored — latent, not active.",
    evidence: "tokens-source.json, 🥥 Primitives/Mode 1.typography.font-family; app/globals.css:952-953",
    publishable: true,
  },
];

/* ── Export ─────────────────────────────────────────────────────────────── */

/** Derived, so the totals cannot drift from the groups they summarise. */
const sumSide = (side: DriftSide): number =>
  driftGroups.filter((g) => g.side === side).reduce((n, g) => n + g.count, 0);

const cssOnly = sumSide("css-only");
const figmaOnly = sumSide("figma-only");

export const fluuenData: FluuenData = {
  source: {
    repo: "github.com/fma082/fluuen",
    branch: "feature/storybook",
    mergedToMain: false,
    figmaFileKey: "MOhVXH1k1Aa5tbQJM8QDRF",
    figmaFileName: "Fluuen Design System",
    tokensRepo: "github.com/fma082/fluuen-tokens",
    lastTokenSync: "2026-08-03T21:49:02Z",
    /** Last time the plugin pushed to the token repo. Nothing records it. */
    lastTokenPush: null,
    figmaVerifiedAt: "2026-08-04",
    extractedAt: "2026-08-04",
  },
  links,
  tokens: {
    published: publishedCount,
    alternate: alternateCount,
    drift: {
      cssOnly,
      figmaOnly,
      net: cssOnly - figmaOnly,
      cause:
        "tokens.json is an old export of the same Figma file. There are no phantom tokens: $metadata.tokenSetOrder holds exactly the three collections, and the color drift sits entirely in Components (643 against 593). Primitives and semantic match to the token. The 898 color tokens in the JSON become 897 in the CSS because `status.error.error-alpha-30` and `status.error.error-alpha (30)` sanitize to the same name — and the parenthesised one no longer exists in Figma either, which is one more piece of evidence that the export is old.",
      /**
       * The same stale export reaches beyond color — see divergence 7. Counted
       * separately because a value-only drift does not move any total.
       */
      beyondColor:
        "121 divergences are $type color and one is $type text: the three typography primitives still say Inter and JetBrains Mono, Fluuen's original typefaces, because the migration to Geist happened in Figma and the JSON was never re-exported. Same link, same cause, different type. It stayed hidden longer because the color drift adds and removes tokens — which a count exposes — while a font-family swap edits three values and leaves both sides at 6.",
      whyItHid:
        "49 was never a quantity of anything. It was 85 minus 36 — two opposite drifts partially cancelling. Every diagnosis made on totals was plausible and none was testable; the question was not 'what is left over?' but 'what is on each side?'.",
      systemReading:
        "The pipeline guaranteed CSS ↔ JSON and never JSON ↔ Figma. The generator did its job perfectly, on stale data. Automation covered the easy leg — transforming data — and not the hard one — guaranteeing the data is current. The push from Tokens Studio is manual and leaves no dated trace anywhere: globals.css records when the script ran, nothing records when the plugin last pushed.",
      groups: driftGroups,
      mapping: { mechanical: 54, judgement: 24, "no-destination": 7 },
      headline:
        "78 of the 85 had a destination and 7 did not. 92% of the divergence was the same design under another name — nothing had broken conceptually; the system evolved and the code kept speaking the previous version of the same language. The 7 are a real gap: six hover states and one focus border that the new SelectionControl no longer tokenises. Focus is not optional for accessibility, and solving it in code with hardcoded values would be precisely what the design system exists to prevent.",
      staleInCode,
      falsifiedHypotheses,
      methodLesson:
        "An aggregate delta can be the difference of two opposing divergences. What finally worked was to stop counting and start comparing: pull the 848 names from Figma, the 897 from the CSS, normalise both with the real sanitizeSegment and tokenPathToCssVar parsed out of sync-tokens.mjs rather than reimplemented, and diff name by name.",
      status: "open",
      verifiedAt: "2026-08-04",
    },
    manualTokens: {
      count: 36,
      whatFor: [
        "shadcn compatibility",
        "Agent Builder node colors",
        "accessibility overrides that must survive a sync (--color-brand-solid #565ad6, --color-ai-score-text #b06bf8)",
      ],
      livesAt: "app/globals.css:950 onward, a second @theme block below the generated one",
    },
    layers,
    aliasChains,
    badgeStates,
    nodeStates,
    nodeStructure,
    badgeVocabularies,
    coverage: {
      synced: ["color", "alpha variants", "references between tokens"],
      manual: ["typography", "spacing", "radius", "shadow"],
    },
  },
  pipeline: {
    flow: [
      "Figma — Fluuen Design System, edited through the Tokens Studio plugin",
      "Manual push from Tokens Studio",
      "github.com/fma082/fluuen-tokens — tokens/tokens.json",
      "npm run tokens:sync — scripts/sync-tokens.mjs",
      "app/globals.css — @theme, between the GENERATED markers (lines 3-942)",
      "Tailwind v4 — utility classes and var(--color-*) in components",
    ],
    command: "npm run tokens:sync",
    scriptPath: "scripts/sync-tokens.mjs",
    scriptLines: 385,
    dependencies: 0,
    steps: pipelineSteps,
    snippets: pipelineSnippets,
  },
  divergences,
  resolvedUnknowns,
  notes: [
    "The Node component set has exactly three variants — Default, Selected, Error — and each binds its border differently. Default and Selected go through a component token; Error binds the semantic border/error straight, with nothing at the component layer. It is the second recorded instance of the same shape as Control/Edge/success, which used status/success as a stand-in: not an isolated slip, a pattern.",
    "Control/Node/Structure/border-hover exists in the token repo, resolves to border.strong (#2a2a3a), and is bound by no variant and referenced by no component. The inverse of the Error case: there the state exists without a token, here the token exists without a state.",
    "The status badge is the most reused pattern in the system: one base component carrying three state vocabularies — Agent (20 tokens), Run (16), Generic (18). Which states exist per surface is a product decision, not a styling one. An agent pauses and a run cancels, and neither word appears in the other's family.",
    "Three of the five Agent states depart from the shape the other two share: paused resolves to yellow.300 rather than a 500 step, error goes through text.error-light instead of status.error and uses a 10% surface where the rest use 20%, and draft has no status semantic at all. Each departure is recorded on its own state rather than smoothed over.",
    "The Fluuen repo is read-only and was not edited for any of this. sync-tokens.mjs is written with Spanish comments and Spanish section headers; the snippets here show them in English, flagged per snippet by `commentsTranslated`. The translation is deliberate — the case study is in English and the source is not — so it is not a transcription error to correct.",
    "Each snippet is an excerpt of its line range, capped at six lines. The rule behind the cap: a decision a reader can see in six lines belongs in code, and one that needs more belongs in the paragraph under it. The first version of this file quoted whole functions and the prose underneath said the same thing better.",
    "One color scheme, one mode. The Tokens Studio file has a single 'Mode 1' per collection; the script returns null for anything under `light`, `dark` or `theme`, so a light mode could not be emitted even if it existed.",
    "The script has zero dependencies and never validates: it counts and writes. That is why the drift could sit in the pipeline for months without anything failing — nothing in the chain compares Figma to the JSON.",
    "The fix that prevents recurrence is not the remap. It is a CI check that diffs Figma's variable names against tokens-source.json and fails when they part, plus an export date in the JSON: globals.css records when the script ran, and nothing records when the plugin last pushed. The diff behind all of this was ~40 lines of Node.",
    "Restructuring a hierarchy in Figma renames every token below it — that is where groups B, C, D and G come from. Either the depth gets settled before the system scales, or restructuring is accepted as implying a remap.",
    "TOKENS.md describes the script as doing four things; the script itself is marked in six steps (PASO 1-6). The doc predates the naming pass and the manual-duplicate merge.",
    "The generated block is grouped by the first segment of the emitted CSS name — 18 alphabetical groups from ALERT to YELLOW — which does not line up with the three source collections. CONTROL alone is 615 of the 897.",
    "Control holds 27 namespaces in the JSON, led by Badge (118), Button (102), SelectionControl (52), Input (36), Node (34) and AgentBuilder (26). Toast exists twice — Control/Toast (10, correctly aliased) and a top-level Components/Toast (10, one of them a literal).",
    "The product repo is private as of 2026-08-04. The case study links Figma, fluuen-tokens, the demo and the Storybook; the repo stays out. Code locations in this file are provenance, not links.",
    "Anything from the May 2026 CLAUDE.md of the Fluuen repo — Zustand store per domain, lib/simulation/runAgent.ts, the Demo mode banner, reset, onboarding, the mobile fallback — is deliberately absent from this file. That document was written before the product existed and was never reconciled; none of it should reach the case study.",
  ],
};
