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

/* One token resolved across the layers, as a diagram rather than a listing.
   Names are the readable form — "status.success", not the Figma path it was
   flattened from. One chain per block: four boxes read as an argument, four
   chains read as a data dump. */
export type TokenChainBlock = {
  type: "tokenChain";
  title?: string;
  /* Left to right. The last step carries `value` and renders a swatch. */
  steps: {
    /* COMPONENT / SEMANTIC / PRIMITIVE / VALUE — printed as the box label. */
    layer: string;
    name: string;
    detail?: string;
  }[];
  caption?: string;
};

/* The Agent Builder node under each of its states, with the chain that
   produced its border. Client-side. Every colour arrives resolved — the block
   never names a token, it prints the one it was handed. */
export type NodeDemoBlock = {
  type: "nodeDemo";
  title?: string;
  intro?: string;
  states: {
    id: string;
    label: string;
    token: string;
    /* Null when the variant binds a semantic token with no component token
       above it. Rendered as an explicit gap, not hidden. */
    semantic: string | null;
    primitive: string;
    hex: string;
    note?: string;
  }[];
  /* What the node is painted with, apart from its border. */
  structure: {
    canvas: string;
    bg: string;
    label: string;
    sublabel: string;
    divider: string;
    bodyText: string;
    accent: string;
    portBg: string;
    portBorder: string;
  };
  caption?: string;
};

/* Inline call to action — one line and a link, placed where the page has just
   earned it. Quiet by construction: no filled button, no box. */
export type CtaBlock = {
  type: "cta";
  body: string;
  label: string;
  href: string;
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
    /* Colour for the swatch beside the value, when the value is a colour. */
    codeSwatch?: string;
    figma: string;
    figmaAt?: string;
    figmaSwatch?: string;
    /* One word for how the row is classified: debt, affordance, by design. */
    pill: string;
  }[];
};

/* A single outbound link, with the line of context that earns it. Prose does
   not parse markdown, so an inline link is a block rather than a syntax — same
   rule as inline code: a new block, never a parser. */
export type LinkOutBlock = {
  type: "linkOut";
  href: string;
  label: string;
  body?: string;
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
  | NodeDemoBlock
  | CtaBlock
  | CodePeekBlock
  | DivergenceTableBlock
  | LinkOutBlock
  | FigmaEmbedBlock;

/* ─── Case study ─────────────────────────────────────────────────────────── */

export type CaseStudy = {
  meta: CaseMeta;
  tags: string[];
  links: CaseLinks;
  stats: CaseStat[];
  /* Full-width capture between the hero and section 00 — the anchor that shows
     the thing exists before the first argument about it. It sits outside
     `blocks` because CaseBody drops anything preceding the first section. */
  cover?: CaseImage;
  /* Call to action between the cover and the first section. Outside `blocks`
     for the same reason `cover` is: CaseBody drops anything before section 00. */
  coverCta?: { body: string; label: string; href: string };
  /* Fixed bar at the bottom of the viewport for the whole scroll. Outside
     `blocks` because it is page chrome, not a step in the argument. */
  stickyCta?: { label: string; cta: string; href: string };
  blocks: Block[];
  nextCase?: { href: string; title: string; cta: string };
  /* Overrides the document title and description. Without it they fall back to
     the hero title and subtitle. */
  seo?: { title: string; description: string };
};
