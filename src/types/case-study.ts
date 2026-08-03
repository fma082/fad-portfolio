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
  live?: string;
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
