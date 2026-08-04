import type { AccentToken } from "./accent";

/* ─── Meta ───────────────────────────────────────────────────────────────── */

export type CaseMeta = {
  slug: string;
  /* Wrap a fragment in *asterisks* to render it in the accent colour:
     "Dashboard *Design System*". generateMetadata strips the markers. */
  title: string;
  subtitle: string;
  year: string;
  role: string;
  /* The hero renders four labelled cells: role / type / year / tools. */
  type: string;
  tools: string;
  client?: string;
  accent: AccentToken;
};

export type CaseLinks = {
  figma?: string;
  github?: string;
  /* The repository a design system is generated from, when that is a different
     artefact from the product repo. Labelled distinctly for that reason. */
  tokens?: string;
  live?: string;
  storybook?: string;
  behance?: string;
};

/* Hero stats bar — four short value/label pairs under the meta row. */
export type CaseStat = { value: string; label: string };

export type CaseImage = {
  src: string;
  alt: string;
  caption?: string;
  tag?: string;
};

/* ─── Blocks ─────────────────────────────────────────────────────────────── */

/* Opens a numbered section. Every block after it belongs to that section
   until the next `section` block. */
export type SectionBlock = {
  type: "section";
  num: string;
  label: string;
  title?: string;
  body?: string[];
};

export type ProseBlock = { type: "prose"; body: string[] };

/* Accent left border — a choice that was made and why. */
export type DecisionBlock = { type: "decision"; title: string; body: string };

/* Subtle amber field — what the choice cost. */
export type TradeoffBlock = { type: "tradeoff"; title: string; body: string };

export type ImageBlock = { type: "image" } & CaseImage;

export type ImageGridBlock = {
  type: "imageGrid";
  images: [CaseImage, CaseImage];
};

export type MetricsBlock = {
  type: "metrics";
  items: { value: string; label: string; note?: string }[];
};

export type QuoteBlock = { type: "quote"; text: string; source?: string };

/* Full-bleed row of numbered cards. `icons` names a case-specific icon set;
   omit it and the cards render without icons. */
export type CardGridBlock = {
  type: "cardGrid";
  icons?: "atomic";
  items: { num: string; title: string; body: string }[];
};

/* Inline label/value chips — a compact inventory under a paragraph. */
export type ChipsBlock = {
  type: "chips";
  items: { label: string; value: string }[];
};

/* ─── Spec blocks ────────────────────────────────────────────────────────── */
/* These render extracted design-system data as tables instead of screenshots.
   Names arrive verbatim from the source file — typos included — because the
   published artefact is what a reader would download. Never normalise them. */

export type TokenTableBlock = {
  type: "tokenTable";
  title?: string;
  groups: {
    name: string;
    /* `value` is displayed as-is and used as the swatch colour, so it has to be
       a valid CSS colour: "#3C76F1", "rgba(0, 0, 0, 0.05)". */
    tokens: { name: string; value: string; note?: string }[];
  }[];
};

export type ComponentInventoryBlock = {
  type: "componentInventory";
  summary?: string;
  /* Rendered in array order — the content file owns the sort. */
  sets: {
    name: string;
    variants: number;
    properties: { name: string; options: string[] }[];
    instances?: number;
  }[];
};

/* The full variant matrix against the subset actually built. */
export type VariantMatrixBlock = {
  type: "variantMatrix";
  title: string;
  axes: { name: string; options: string[] }[];
  built: number;
  theoretical: number;
  note: string;
};

/* Generic label/value spec sheet — breakpoints, grids, type steps. */
export type SpecListBlock = {
  type: "specList";
  items: { label: string; value: string; note?: string }[];
};

/* One token resolved hop by hop, from the component layer down to the literal
   it ends on. Shows the layering as a path rather than as a claim. */
export type TokenChainBlock = {
  type: "tokenChain";
  title?: string;
  chains: {
    /* The CSS custom property the pipeline emits for the head of the chain. */
    cssVar: string;
    /* Where the product consumes it, when it does. */
    usedAt?: string;
    hops: { layer: string; path: string; value: string }[];
    resolvesTo: string;
    note?: string;
  }[];
};

/* A source excerpt with its origin and the decision it encodes. `code` is
   printed verbatim, so keep the original indentation and comments. */
export type CodePeekBlock = {
  type: "codePeek";
  file: string;
  /* Line range in the source, e.g. "181-194". */
  lines: string;
  title: string;
  code: string;
  decision?: string;
};

/* Figma ↔ code divergences. Both sides are shown; neither is the correction of
   the other until a row says so. */
export type DivergenceTableBlock = {
  type: "divergenceTable";
  summary?: string;
  rows: {
    item: string;
    code: string;
    codeAt?: string;
    figma: string;
    figmaAt?: string;
    /* Short kind label: "Mechanical sync", "Product decision", "Figma-ahead". */
    category: string;
    /* "Permanent" or "Debt", optionally qualified. */
    status: string;
    note?: string;
  }[];
};

/* Live Figma embed. Mounted only once it enters the viewport. */
export type FigmaEmbedBlock = {
  type: "figmaEmbed";
  url: string;
  caption?: string;
  height?: number;
};

export type Block =
  | SectionBlock
  | ProseBlock
  | DecisionBlock
  | TradeoffBlock
  | ImageBlock
  | ImageGridBlock
  | MetricsBlock
  | QuoteBlock
  | CardGridBlock
  | ChipsBlock
  | TokenTableBlock
  | ComponentInventoryBlock
  | VariantMatrixBlock
  | SpecListBlock
  | TokenChainBlock
  | CodePeekBlock
  | DivergenceTableBlock
  | FigmaEmbedBlock;

/* ─── Case study ─────────────────────────────────────────────────────────── */

export type CaseStudy = {
  meta: CaseMeta;
  tags: string[];
  links: CaseLinks;
  stats: CaseStat[];
  blocks: Block[];
  nextCase?: { href: string; title: string; cta: string };
  /* Overrides the document title and description. Without it they fall back to
     the hero title and subtitle. */
  seo?: { title: string; description: string };
};
