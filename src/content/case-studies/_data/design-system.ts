/**
 * Dashboard Design System — raw data extracted from the Figma file.
 *
 * Source: https://www.figma.com/design/UJ1ig2NfZGNmugmjG6om3v/Dashboard---Design-System---Public-
 * Extracted: 2026-08-03, read-only, through the Figma plugin API (Desktop Bridge).
 *
 * The file predates Figma Variables (2021), so every token is a *shared style*:
 * paint styles for color, text styles for type, effect styles for elevation and
 * grid styles for layout. There is no variable collection to read.
 *
 * Everything here was READ from the document. Nothing is inferred or normalised —
 * duplicated names, typos ("Succes", "seconday") and inconsistent separators are
 * preserved verbatim so the rendered tables match what is actually in Figma.
 */

/* ── Types ──────────────────────────────────────────────────────────────── */

export type Breakpoint = "desktop" | "mobile" | "common";
export type FontWeightName = "Regular" | "Medium" | "Bold";

export type PageKind = "content" | "divider" | "sectionLabel";

export interface FigmaPage {
  id: string;
  name: string;
  kind: PageKind;
  /** Top-level nodes on the page. */
  childCount: number;
}

export interface ColorStop {
  /** Style name exactly as written in Figma. */
  name: string;
  /** Step within the ramp, e.g. "100", "500 (Base)", "White". */
  step: string;
  hex: string;
  /** Fill opacity. 1 unless the style itself is a translucent overlay. */
  opacity: number;
  note?: string;
}

export interface ColorRamp {
  name: string;
  stops: ColorStop[];
}

export interface TextStyle {
  name: string;
  breakpoint: Breakpoint;
  /** Heading, Subtitle, Body, Button, Caption, Overline. */
  group: string;
  /** H1…H6, Body 1…4, Subtitle 1…3, Large Button… */
  step: string;
  weightName: FontWeightName;
  family: string;
  /** The font style actually bound, which is not always `weightName`. */
  boundStyle: FontWeightName;
  size: number;
  lineHeight: number;
  letterSpacing: number;
  uppercase: boolean;
}

/** The rem/px annotation the Typography page prints next to each sample. */
export interface DocumentedStep {
  breakpoint: Breakpoint;
  group: string;
  step: string;
  sizeRem: string;
  sizePx: number;
  lineHeightRem: string | null;
  lineHeightPx: number | null;
  matchesBoundStyle: boolean;
  note: string | null;
}

export interface ShadowStyle {
  name: string;
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  /** Ready-to-read CSS value. */
  css: string;
}

export interface GridStyle {
  name: string;
  columns: number;
  gutter: number;
  margin: number;
  alignment: string;
}

export interface Breakpoint_ {
  label: string;
  /** Threshold as the file writes it, e.g. "≥768px". */
  query: string;
  /** Frame width used to illustrate it. */
  frameWidth: number;
}

export interface ResponsiveGrid {
  label: string;
  /** Range as the file writes it. */
  range: string;
  columns: number;
  marginsAndGutters: number;
}

export interface ComponentProperty {
  name: string;
  type: "VARIANT" | "BOOLEAN" | "INSTANCE_SWAP" | "TEXT";
  options: string[];
}

export interface ComponentSet {
  name: string;
  id: string;
  /** Page it lives on, or null when the set is orphaned. */
  page: string | null;
  variants: number;
  properties: ComponentProperty[];
  /** Instances of this set anywhere in the file. */
  instances: number;
  /** Instances of this set inside the final screen frames. */
  instancesInScreens: number;
  /**
   * Figma reports a variant conflict on this set (duplicate or incomplete
   * combinations). Properties were then read off the variant names.
   */
  hasVariantConflict: boolean;
}

export interface ScreenFrame {
  name: string;
  width: number;
  height: number;
}

export interface IconSection {
  name: string;
  count: number;
}

export interface DesignSystemData {
  source: {
    fileKey: string;
    fileName: string;
    url: string;
    extractedAt: string;
    /** Predates Figma Variables — tokens are shared styles, not variables. */
    usesVariables: boolean;
  };
  pages: FigmaPage[];
  fontFamily: { name: string; weights: { name: FontWeightName; value: number }[] };
  colorRamps: ColorRamp[];
  textStyles: TextStyle[];
  documentedScale: DocumentedStep[];
  shadows: ShadowStyle[];
  gridStyles: GridStyle[];
  breakpoints: Breakpoint_[];
  responsiveGrids: ResponsiveGrid[];
  componentSets: ComponentSet[];
  /** Sets with no parent on the canvas that instances still point at. */
  orphanedComponentSets: ComponentSet[];
  screens: ScreenFrame[];
  icons: { total: number; sections: IconSection[] };
  counts: {
    pagesTotal: number;
    pagesWithContent: number;
    paintStyles: number;
    textStyles: number;
    effectStyles: number;
    gridStyles: number;
    stylesTotal: number;
    componentSets: number;
    variants: number;
    orphanedComponentSets: number;
    orphanedVariants: number;
    standaloneComponents: number;
    icons: number;
  };
  notes: string[];
}

/* ── Pages ──────────────────────────────────────────────────────────────── */

const pages: FigmaPage[] = [
  { id: "273:0", name: "Cover", kind: "content", childCount: 1 },
  { id: "274:0", name: "--", kind: "divider", childCount: 0 },
  { id: "274:1", name: "📟 Screen", kind: "content", childCount: 7 },
  { id: "438:0", name: "-------------------------------------------------------------------", kind: "divider", childCount: 0 },
  { id: "274:2", name: "🔴 Atoms", kind: "sectionLabel", childCount: 0 },
  { id: "62:8", name: "Colors + Styles", kind: "content", childCount: 2 },
  { id: "0:1", name: "Typography", kind: "content", childCount: 2 },
  { id: "274:3", name: "⚛️Molecules", kind: "sectionLabel", childCount: 0 },
  { id: "65:36", name: "Spacing + Grids", kind: "content", childCount: 1 },
  { id: "65:46", name: "Icons", kind: "content", childCount: 7 },
  { id: "438:1", name: "-------------------------------------------------------------------", kind: "divider", childCount: 0 },
  { id: "65:1909", name: "Buttons", kind: "content", childCount: 3 },
  { id: "274:5", name: "Input Forms", kind: "content", childCount: 5 },
  { id: "199:65", name: "Badges", kind: "content", childCount: 1 },
  { id: "373:0", name: "Tooltips", kind: "content", childCount: 2 },
  { id: "256:229", name: "Avatars", kind: "content", childCount: 3 },
  { id: "415:2494", name: "Alerts", kind: "content", childCount: 1 },
  { id: "426:0", name: "Cards", kind: "content", childCount: 2 },
  { id: "324:0", name: "Navigation", kind: "content", childCount: 1 },
  { id: "483:3637", name: "Breadcrumbs", kind: "content", childCount: 1 },
  { id: "569:4244", name: "Tables", kind: "content", childCount: 3 },
  { id: "766:8415", name: "Graphics", kind: "content", childCount: 4 },
  { id: "1340:9469", name: "-----------------------------------------", kind: "divider", childCount: 0 },
  { id: "1340:9470", name: "🟡 Organism", kind: "sectionLabel", childCount: 0 },
  { id: "1340:9471", name: "Form", kind: "content", childCount: 5 },
  { id: "1430:10153", name: "Navbar", kind: "content", childCount: 1 },
  { id: "1457:11180", name: "--------------------------------------------", kind: "divider", childCount: 0 },
];

/* ── Color ──────────────────────────────────────────────────────────────── */

const colorRamps: ColorRamp[] = [
  {
    name: "Primary",
    stops: [
      { name: "Primary/100", step: "100", hex: "#ECF1FE", opacity: 1 },
      { name: "Primary/200", step: "200", hex: "#D8E4FC", opacity: 1 },
      { name: "Primary/300", step: "300", hex: "#C5D6FB", opacity: 1 },
      { name: "Primary/400", step: "400", hex: "#6391F4", opacity: 1 },
      { name: "Primary/500 (Base)", step: "500 (Base)", hex: "#3C76F1", opacity: 1 },
      { name: "Primary/600", step: "600", hex: "#366AD9", opacity: 1 },
      { name: "Primary/700", step: "700", hex: "#305EC1", opacity: 1 },
      { name: "Primary/800", step: "800", hex: "#2A53A9", opacity: 1 },
      { name: "Primary/900", step: "900", hex: "#244791", opacity: 1 },
    ],
  },
  {
    name: "Secondary",
    stops: [
      { name: "Secondary/100", step: "100", hex: "#CED3DD", opacity: 1 },
      { name: "Secondary/200", step: "200", hex: "#9BA6BC", opacity: 1 },
      { name: "Secondary/300", step: "300", hex: "#394E75", opacity: 1 },
      { name: "Secondary/400", step: "400", hex: "#213864", opacity: 1 },
      { name: "Secondary/500 (Base)", step: "500 (Base)", hex: "#082253", opacity: 1 },
      { name: "Secondary/600", step: "600", hex: "#071F4B", opacity: 1 },
      { name: "Secondary/700", step: "700", hex: "#061B42", opacity: 1 },
      { name: "Secondary/800", step: "800", hex: "#06183A", opacity: 1 },
      { name: "Secondary/900", step: "900", hex: "#04112A", opacity: 1 },
    ],
  },
  {
    name: "Tertiary",
    stops: [
      { name: "Tertiary/100", step: "100", hex: "#E7FAFA", opacity: 1 },
      { name: "Tertiary/200", step: "200", hex: "#CFF5F4", opacity: 1 },
      { name: "Tertiary/300", step: "300", hex: "#58DDD9", opacity: 1 },
      { name: "Tertiary/400", step: "400", hex: "#40D9D4", opacity: 1 },
      { name: "Tertiary/500 (Base)", step: "500 (Base)", hex: "#10CFC9", opacity: 1 },
      { name: "Tertiary/600", step: "600", hex: "#0EBAB5", opacity: 1 },
      { name: "Tertiary/700", step: "700", hex: "#0DA6A1", opacity: 1 },
      { name: "Tertiary/800", step: "800", hex: "#0B918D", opacity: 1 },
      { name: "Tertiary/900", step: "900", hex: "#0A7C79", opacity: 1 },
    ],
  },
  {
    name: "Alert / Success",
    stops: [
      { name: "Alert/Succes/100", step: "100", hex: "#66DDB3", opacity: 1 },
      { name: "Alert/Succes/500 (Base)", step: "500 (Base)", hex: "#00C781", opacity: 1 },
      { name: "Alert/Succes/600", step: "600", hex: "#00B374", opacity: 1 },
    ],
  },
  {
    name: "Alert / Warning",
    stops: [
      { name: "Alert / Warning / 100 ", step: "100", hex: "#FFD688", opacity: 1 },
      { name: "Alert / Warning / 500 (Base)", step: "500 (Base)", hex: "#FFBB38", opacity: 1 },
      { name: "Alert / Warning / 600 ", step: "600", hex: "#E6A832", opacity: 1 },
    ],
  },
  {
    name: "Alert / Danger",
    stops: [
      { name: "Alert / Danger/ 100 ", step: "100", hex: "#FF8C8C", opacity: 1 },
      { name: "Alert / Danger/ 500 (Base)", step: "500 (Base)", hex: "#FF4040", opacity: 1 },
      { name: "Alert / Danger/ 700 ", step: "700", hex: "#CC3333", opacity: 1 },
    ],
  },
  {
    name: "Background",
    stops: [
      { name: "Background/Primary-Bg", step: "Primary-Bg", hex: "#F5F8FA", opacity: 1 },
      { name: "Background / Secondary-Bg", step: "Secondary-Bg", hex: "#EDF1F8", opacity: 1 },
      { name: "Background / Tertiary", step: "Tertiary", hex: "#F7F8FA", opacity: 1 },
    ],
  },
  {
    name: "Grey",
    stops: [
      { name: "Grey / Grey-100", step: "100", hex: "#FAFAFA", opacity: 1 },
      { name: "Grey / Grey-200", step: "200", hex: "#E1E1E1", opacity: 1 },
      { name: "Grey / Grey-300", step: "300", hex: "#C8C8C8", opacity: 1 },
      { name: "Grey / Grey-400", step: "400", hex: "#AFAFAF", opacity: 1 },
      { name: "Grey / Grey-500", step: "500", hex: "#969696", opacity: 1 },
      { name: "Grey / Grey-600", step: "600", hex: "#4B4B4B", opacity: 1 },
      { name: "Grey / Grey-700", step: "700", hex: "#323232", opacity: 1 },
      { name: "Grey / Grey-800", step: "800", hex: "#191919", opacity: 1 },
      { name: "Grey / Grey-900", step: "900", hex: "#000000", opacity: 1 },
    ],
  },
  {
    name: "Opacity",
    stops: [
      { name: "Opacity / Opacity-05", step: "05", hex: "#000000", opacity: 0.05 },
      { name: "Opacity / Opacity-10", step: "10", hex: "#000000", opacity: 0.1 },
      { name: "Opacity / Opacity-20", step: "20", hex: "#000000", opacity: 0.05, note: "Stored at 0.05, same as Opacity-05, despite the name." },
      { name: "Opacity / Opacity-40", step: "40", hex: "#000000", opacity: 0.4 },
      { name: "Opacity / Opacity-80", step: "80", hex: "#000000", opacity: 0.8 },
    ],
  },
  {
    name: "Black And White",
    stops: [
      { name: "Black And White/Black", step: "Black", hex: "#000000", opacity: 1 },
      { name: "Black And White / White", step: "White", hex: "#FFFFFF", opacity: 1 },
    ],
  },
];

/* ── Typography ─────────────────────────────────────────────────────────── */

const t = (
  name: string,
  breakpoint: Breakpoint,
  group: string,
  step: string,
  weightName: FontWeightName,
  size: number,
  lineHeight: number,
  boundStyle: FontWeightName = weightName,
  letterSpacing = 0,
  uppercase = false,
): TextStyle => ({
  name, breakpoint, group, step, weightName,
  family: "Inter", boundStyle, size, lineHeight, letterSpacing, uppercase,
});

const textStyles: TextStyle[] = [
  /* Desktop — Heading (18) */
  t("Desktop/Heading/H1/Bold", "desktop", "Heading", "H1", "Bold", 48, 20),
  t("Desktop/Heading/H1/Medium", "desktop", "Heading", "H1", "Medium", 48, 20),
  t("Desktop/Heading/H1/Regular", "desktop", "Heading", "H1", "Regular", 48, 20),
  t("Desktop/Heading/H2/Bold", "desktop", "Heading", "H2", "Bold", 39, 20),
  t("Desktop/Heading/H2/Medium", "desktop", "Heading", "H2", "Medium", 39, 20),
  t("Desktop/Heading/H2/Regular", "desktop", "Heading", "H2", "Regular", 39, 20),
  t("Desktop/Heading/H3/Bold", "desktop", "Heading", "H3", "Bold", 31, 20),
  t("Desktop/Heading/H3/Medium", "desktop", "Heading", "H3", "Medium", 31, 20),
  t("Desktop/Heading/H3/Regular", "desktop", "Heading", "H3", "Regular", 31, 20),
  t("Desktop/Heading/H4/Bold", "desktop", "Heading", "H4", "Bold", 24, 20),
  t("Desktop/Heading/H4/Medium", "desktop", "Heading", "H4", "Medium", 24, 20),
  t("Desktop/Heading/H4/Regular", "desktop", "Heading", "H4", "Regular", 24, 20),
  t("Desktop/Heading/H5/Bold", "desktop", "Heading", "H5", "Bold", 20, 20),
  t("Desktop/Heading/H5/Medium", "desktop", "Heading", "H5", "Medium", 20, 20),
  t("Desktop/Heading/H5/Regular", "desktop", "Heading", "H5", "Regular", 20, 20),
  t("Desktop/Heading/H6/Bold", "desktop", "Heading", "H6", "Bold", 16, 20),
  t("Desktop/Heading/H6/Medium", "desktop", "Heading", "H6", "Medium", 16, 20),
  t("Desktop/Heading/H6/Regular", "desktop", "Heading", "H6", "Regular", 16, 20),

  /* Desktop — Subtitle (6). Subtitle1 changes size with weight: 26 vs 24. */
  t("Desktop/Subtitle/Subtitle1/Bold", "desktop", "Subtitle", "Subtitle 1", "Bold", 26, 36),
  t("Desktop/Subtitle/Subtitle1/Medium", "desktop", "Subtitle", "Subtitle 1", "Medium", 24, 36),
  t("Desktop/Subtitle/Subtitle 2/Bold", "desktop", "Subtitle", "Subtitle 2", "Bold", 24, 32),
  t("Desktop/Subtitle/Subtitle 2/Medium", "desktop", "Subtitle", "Subtitle 2", "Medium", 24, 32),
  t("Desktop/Subtitle/Subtitle 3/Bold", "desktop", "Subtitle", "Subtitle 3", "Bold", 20, 28),
  t("Desktop/Subtitle/Subtitle 3/Medium", "desktop", "Subtitle", "Subtitle 3", "Medium", 20, 28),

  /* Desktop — Body (12). "Body 2/Regular" is bound to Inter Medium. */
  t("Desktop/Body/Body 1/Bold", "desktop", "Body", "Body 1", "Bold", 20, 28),
  t("Desktop/Body/Body 1/Medium", "desktop", "Body", "Body 1", "Medium", 20, 28),
  t("Desktop/Body/Body 1/Regular", "desktop", "Body", "Body 1", "Regular", 20, 28),
  t("Desktop/Body/Body 2/Bold", "desktop", "Body", "Body 2", "Bold", 16, 28),
  t("Desktop/Body/Body 2/Medium", "desktop", "Body", "Body 2", "Medium", 16, 28),
  t("Desktop/Body/Body 2/Regular", "desktop", "Body", "Body 2", "Regular", 16, 28, "Medium"),
  t("Desktop/Body/Body 3/Bold", "desktop", "Body", "Body 3", "Bold", 14, 22),
  t("Desktop/Body/Body 3/Medium", "desktop", "Body", "Body 3", "Medium", 14, 22),
  t("Desktop/Body/Body 3/Regular", "desktop", "Body", "Body 3", "Regular", 14, 18),
  t("Desktop/Body/Body 4/Bold", "desktop", "Body", "Body 4", "Bold", 12, 20),
  t("Desktop/Body/Body 4/Medium", "desktop", "Body", "Body 4", "Medium", 12, 20),
  t("Desktop/Body/Body 4/Regular", "desktop", "Body", "Body 4", "Regular", 12, 20),

  /* Mobile — Heading (12) */
  t("Mobile/Heading/H1/Bold", "mobile", "Heading", "H1", "Bold", 31, 20),
  t("Mobile / Heading / H1 / Medium", "mobile", "Heading", "H1", "Medium", 31, 20),
  t("Mobile / Heading / H1 / Regular", "mobile", "Heading", "H1", "Regular", 31, 20),
  t("Mobile / Heading / H2 / Bold", "mobile", "Heading", "H2", "Bold", 24, 20),
  t("Mobile / Heading / H2 / Medium", "mobile", "Heading", "H2", "Medium", 24, 20),
  t("Mobile / Heading / H2 / Regular", "mobile", "Heading", "H2", "Regular", 24, 20),
  t("Mobile / Heading / H3 / Bold", "mobile", "Heading", "H3", "Bold", 20, 20),
  t("Mobile / Heading / H3 / Medium", "mobile", "Heading", "H3", "Medium", 20, 20),
  t("Mobile / Heading / H3 / Regular", "mobile", "Heading", "H3", "Regular", 20, 20),
  t("Mobile / Heading / H4 / Bold", "mobile", "Heading", "H4", "Bold", 16, 20),
  t("Mobile / Heading / H4 / Medium", "mobile", "Heading", "H4", "Medium", 16, 20),
  t("Mobile / Heading / H4 / Regular", "mobile", "Heading", "H4", "Regular", 16, 20),

  /* Mobile — Subtitle (4) */
  t("Mobile/Subtitle/Subtitle 1/Bold", "mobile", "Subtitle", "Subtitle 1", "Bold", 20, 28),
  t("Mobile/Subtitle/Subtitle 1/Medium", "mobile", "Subtitle", "Subtitle 1", "Medium", 20, 28),
  t("Mobile / Subtitle / Subtitle 2 / Bold", "mobile", "Subtitle", "Subtitle 2", "Bold", 16, 24),
  t("Mobile / Subtitle / Subtitle 2 / Medium", "mobile", "Subtitle", "Subtitle 2", "Medium", 16, 24),

  /* Mobile — Body (9) */
  t("Mobile / Body / Body 1 / Bold", "mobile", "Body", "Body 1", "Bold", 16, 28),
  t("Mobile/Body/Body 1/Medium", "mobile", "Body", "Body 1", "Medium", 16, 28),
  t("Mobile / Body / Body 1 / Regular", "mobile", "Body", "Body 1", "Regular", 16, 28),
  t("Mobile / Body / Body 2 / Bold", "mobile", "Body", "Body 2", "Bold", 14, 18),
  t("Mobile / Body / Body 2 / Medium", "mobile", "Body", "Body 2", "Medium", 14, 18),
  t("Mobile / Body / Body 2 / Regular", "mobile", "Body", "Body 2", "Regular", 14, 18),
  t("Mobile / Body / Body 3 / Bold", "mobile", "Body", "Body 3", "Bold", 12, 20),
  t("Mobile / Body / Body 3 / Medium", "mobile", "Body", "Body 3", "Medium", 12, 16),
  t("Mobile / Body / Body 3 / Regular", "mobile", "Body", "Body 3", "Regular", 12, 20),

  /* Common (12) */
  t("Common Styles / Button / Large Button / Bold", "common", "Button", "Large Button", "Bold", 16, 22),
  t("Common Styles / Button / Large Button / Medium", "common", "Button", "Large Button", "Medium", 16, 20),
  t("Common Styles / Button / Large Button / Regular", "common", "Button", "Large Button", "Regular", 16, 20),
  t("Common Styles / Button / Small Button / Bold", "common", "Button", "Small Button", "Bold", 14, 20),
  t("Common Styles / Button / Small Button / Medium", "common", "Button", "Small Button", "Medium", 14, 20),
  t("Common Styles / Button / Small Button / Regular", "common", "Button", "Small Button", "Regular", 14, 20),
  t("Common Styles / Caption / Bold", "common", "Caption", "Caption", "Bold", 12, 20),
  t("Common Styles / Caption / Medium", "common", "Caption", "Caption", "Medium", 12, 20),
  t("Common Styles / Caption / Regular", "common", "Caption", "Caption", "Regular", 12, 20),
  t("Common Styles / Overline / Bold", "common", "Overline", "Overline", "Bold", 18, 20, "Bold", 0.4, true),
  t("Common Styles / Overline / Medium", "common", "Overline", "Overline", "Medium", 18, 20, "Medium", 0.4, true),
  t("Common Styles / Overline / Regular", "common", "Overline", "Overline", "Regular", 18, 20, "Regular", 0.4, true),
];

/**
 * The rem/px annotations printed on the Typography page, next to each sample.
 * `matchesBoundStyle` compares them against the shared style actually bound.
 */
const documentedScale: DocumentedStep[] = [
  { breakpoint: "desktop", group: "Heading", step: "H1", sizeRem: "3 rem", sizePx: 48, lineHeightRem: "3.5 rem", lineHeightPx: 56, matchesBoundStyle: false, note: "Bound style has lineHeight 20, not 56." },
  { breakpoint: "desktop", group: "Heading", step: "H2", sizeRem: "2.4 rem", sizePx: 39, lineHeightRem: "3 rem", lineHeightPx: 48, matchesBoundStyle: false, note: "Bound style has lineHeight 20, not 48." },
  { breakpoint: "desktop", group: "Heading", step: "H3", sizeRem: "1.9 rem", sizePx: 31, lineHeightRem: "2.5 rem", lineHeightPx: 40, matchesBoundStyle: false, note: "Bound style has lineHeight 20, not 40." },
  { breakpoint: "desktop", group: "Heading", step: "H4", sizeRem: "1.5 rem", sizePx: 24, lineHeightRem: "2 rem", lineHeightPx: 32, matchesBoundStyle: false, note: "Bound style has lineHeight 20, not 32." },
  { breakpoint: "desktop", group: "Heading", step: "H5", sizeRem: "1.25 rem", sizePx: 20, lineHeightRem: "1.75 rem", lineHeightPx: 28, matchesBoundStyle: false, note: "Bound style has lineHeight 20, not 28." },
  { breakpoint: "desktop", group: "Heading", step: "H6", sizeRem: "1 rem", sizePx: 16, lineHeightRem: "1.75 rem", lineHeightPx: 28, matchesBoundStyle: false, note: "Bound style has lineHeight 20, not 28." },

  { breakpoint: "desktop", group: "Subtitle", step: "Subtitle 1", sizeRem: "1.65 rem", sizePx: 26, lineHeightRem: "2.25 rem", lineHeightPx: 36, matchesBoundStyle: true, note: "Bold only; the Medium style is 24, annotated separately as 1.5 rem." },
  { breakpoint: "desktop", group: "Subtitle", step: "Subtitle 2", sizeRem: "1.5 rem", sizePx: 24, lineHeightRem: "2 rem", lineHeightPx: 32, matchesBoundStyle: true, note: null },
  { breakpoint: "desktop", group: "Subtitle", step: "Subtitle 3", sizeRem: "1.25 rem", sizePx: 20, lineHeightRem: "1.75 rem", lineHeightPx: 28, matchesBoundStyle: true, note: null },

  { breakpoint: "desktop", group: "Body", step: "Body 1", sizeRem: "0.8 rem", sizePx: 12, lineHeightRem: "1.25 rem", lineHeightPx: 20, matchesBoundStyle: false, note: "Annotation duplicated from Body 4; the bound style is 20/28." },
  { breakpoint: "desktop", group: "Body", step: "Body 2", sizeRem: "1 rem", sizePx: 16, lineHeightRem: "1.75 rem", lineHeightPx: 28, matchesBoundStyle: true, note: null },
  { breakpoint: "desktop", group: "Body", step: "Body 3", sizeRem: "0.85 rem", sizePx: 14, lineHeightRem: "1.375 rem", lineHeightPx: 22, matchesBoundStyle: true, note: "Body 3/Regular is the exception: lineHeight 18." },
  { breakpoint: "desktop", group: "Body", step: "Body 4", sizeRem: "0.8 rem", sizePx: 12, lineHeightRem: "1.25 rem", lineHeightPx: 20, matchesBoundStyle: true, note: null },

  { breakpoint: "mobile", group: "Heading", step: "H1", sizeRem: "1.9 rem", sizePx: 31, lineHeightRem: "2.5 rem", lineHeightPx: 40, matchesBoundStyle: false, note: "Bound style has lineHeight 20, not 40." },
  { breakpoint: "mobile", group: "Heading", step: "H2", sizeRem: "1.5 rem", sizePx: 24, lineHeightRem: "2 rem", lineHeightPx: 32, matchesBoundStyle: false, note: "Bound style has lineHeight 20, not 32." },
  { breakpoint: "mobile", group: "Heading", step: "H3", sizeRem: "1.25 rem", sizePx: 20, lineHeightRem: "1.75 rem", lineHeightPx: 28, matchesBoundStyle: false, note: "Bound style has lineHeight 20, not 28." },
  { breakpoint: "mobile", group: "Heading", step: "H4", sizeRem: "1 rem", sizePx: 16, lineHeightRem: "1.75 rem", lineHeightPx: 28, matchesBoundStyle: false, note: "Bound style has lineHeight 20, not 28." },

  { breakpoint: "mobile", group: "Subtitle", step: "Subtitle 1", sizeRem: "1.25 rem", sizePx: 20, lineHeightRem: "1.75 rem", lineHeightPx: 28, matchesBoundStyle: true, note: null },
  { breakpoint: "mobile", group: "Subtitle", step: "Subtitle 2", sizeRem: "1 rem", sizePx: 16, lineHeightRem: "1.5 rem", lineHeightPx: 24, matchesBoundStyle: true, note: null },

  { breakpoint: "mobile", group: "Body", step: "Body 1", sizeRem: "1 rem", sizePx: 16, lineHeightRem: "1.75 rem", lineHeightPx: 28, matchesBoundStyle: true, note: null },
  { breakpoint: "mobile", group: "Body", step: "Body 2", sizeRem: "0.85 rem", sizePx: 14, lineHeightRem: "1.375 rem", lineHeightPx: 22, matchesBoundStyle: false, note: "Bound styles have lineHeight 18, not 22." },
  { breakpoint: "mobile", group: "Body", step: "Body 3", sizeRem: "0.8 rem", sizePx: 12, lineHeightRem: "1.25 rem", lineHeightPx: 20, matchesBoundStyle: true, note: "Medium is the exception: lineHeight 16." },

  { breakpoint: "common", group: "Overline", step: "Overline", sizeRem: "0.75 rem", sizePx: 18, lineHeightRem: "1.25 rem", lineHeightPx: 20, matchesBoundStyle: true, note: "The rem annotation (0.75 rem = 12px) contradicts its own px value of 18." },
  { breakpoint: "common", group: "Caption", step: "Caption", sizeRem: "0.75 rem", sizePx: 12, lineHeightRem: "1.25 rem", lineHeightPx: 20, matchesBoundStyle: true, note: null },
  { breakpoint: "common", group: "Button", step: "Large Button", sizeRem: "1 rem", sizePx: 16, lineHeightRem: "1.5 rem", lineHeightPx: 24, matchesBoundStyle: false, note: "Bound Bold style has lineHeight 22, Medium and Regular have 20." },
  { breakpoint: "common", group: "Button", step: "Small Button", sizeRem: "0.875 rem", sizePx: 14, lineHeightRem: null, lineHeightPx: null, matchesBoundStyle: true, note: "No line-height annotated; the bound styles are 20." },
];

/* ── Elevation and layout ───────────────────────────────────────────────── */

const shadows: ShadowStyle[] = [
  { name: "Soft_", color: "rgba(108, 107, 107, 0.23)", offsetX: -4, offsetY: 4, blur: 6, spread: -4, css: "-4px 4px 6px -4px rgba(108, 107, 107, 0.23)" },
  { name: "Medium", color: "rgba(108, 107, 107, 0.20)", offsetX: -6, offsetY: 6, blur: 8, spread: -2, css: "-6px 6px 8px -2px rgba(108, 107, 107, 0.2)" },
  { name: "Strong Shadow", color: "rgba(0, 0, 0, 0.15)", offsetX: 0, offsetY: 8, blur: 28, spread: -6, css: "0 8px 28px -6px rgba(0, 0, 0, 0.15)" },
  { name: "Line-bottom", color: "rgba(17, 17, 17, 0.08)", offsetX: 0, offsetY: 1, blur: 0, spread: 0, css: "0 1px 0 0 rgba(17, 17, 17, 0.08)" },
];

const gridStyles: GridStyle[] = [
  { name: "Small", columns: 4, gutter: 16, margin: 16, alignment: "STRETCH" },
  { name: "Small Tablet (600px - 719px)", columns: 8, gutter: 16, margin: 16, alignment: "STRETCH" },
  { name: "Large Tablet (720 - 839)", columns: 8, gutter: 24, margin: 24, alignment: "STRETCH" },
  { name: "Xl", columns: 12, gutter: 32, margin: 32, alignment: "STRETCH" },
  { name: "Left Navigation", columns: 12, gutter: 32, margin: 0, alignment: "MAX" },
];

/**
 * The file documents responsive breakpoints and column grids in place of a
 * numeric spacing scale — there is no 4/8/16 token ramp anywhere in it.
 */
const breakpoints: Breakpoint_[] = [
  { label: "X-Small", query: "<576px", frameWidth: 480 },
  { label: "Small", query: "≥576px", frameWidth: 576 },
  { label: "Medium", query: "≥768px", frameWidth: 768 },
  { label: "Large", query: "≥992px", frameWidth: 992 },
  { label: "Extra Large", query: "≥1200px", frameWidth: 1200 },
  { label: "Extra extra large", query: "≥1400px", frameWidth: 1440 },
];

const responsiveGrids: ResponsiveGrid[] = [
  { label: "Phone", range: "0px - 599px", columns: 4, marginsAndGutters: 16 },
  { label: "Small Tablet", range: "600px - 719px (Small Tablet)", columns: 8, marginsAndGutters: 16 },
  { label: "Large Tablet", range: "720px - 839 (large tablet)", columns: 8, marginsAndGutters: 24 },
  { label: "Desktop", range: "720px - 1920 +", columns: 12, marginsAndGutters: 32 },
];

/* ── Components ─────────────────────────────────────────────────────────── */

const v = (name: string, options: string[]): ComponentProperty => ({ name, type: "VARIANT", options });

const componentSets: ComponentSet[] = [
  /* Buttons */
  { name: "Default-button", id: "515:0", page: "Buttons", variants: 135, instances: 94, instancesInScreens: 22, hasVariantConflict: false,
    properties: [v("Type", ["primary", "secondary"]), v("Property 2", ["filled", "outline"]), v("Size", ["large", "medium", "small"]), v("State", ["active", "default", "disabled", "focus", "hover"]), v("Icon", ["icon-left", "icon-right", "no-icon"])] },
  { name: "Rounded-button", id: "521:38", page: "Buttons", variants: 135, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["primary", "secondary"]), v("Property 2", ["filled", "outline"]), v("Size", ["large", "medium", "small"]), v("State", ["active", "default", "disabled", "focus", "hover"]), v("Icon", ["icon-left", "icon-right", "no-icon"])] },
  { name: "soft-button", id: "555:4058", page: "Buttons", variants: 54, instances: 40, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["danger", "information", "primary", "secondary", "succes", "warning"]), v("Size", ["large", "medium", "small"]), v("State", ["default", "disabled", "hover"])] },
  { name: "Only-icon-default", id: "522:0", page: "Buttons", variants: 45, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["primary", "secondary", "seconday"]), v("Class", ["filled", "outline"]), v("Size", ["large", "medium", "small"]), v("State", ["active", "default", "disabled", "focus", "hover"])] },
  { name: "only Icon rounded", id: "528:51", page: "Buttons", variants: 45, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["primary", "secondary", "seconday"]), v("Class", ["filled", "outline"]), v("Size", ["large", "medium", "small"]), v("State", ["active", "default", "disabled", "focus", "hover"])] },
  { name: "Deault-button", id: "534:1052", page: "Buttons", variants: 20, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["primary", "secondary"]), v("Size", ["medium", "large"]), v("State", ["default", "focus", "hover", "active", "disabled"])] },
  { name: "Rounded-status-button", id: "539:3658", page: "Buttons", variants: 20, instances: 1, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["primary", "secondary"]), v("Size", ["medium", "large"]), v("State", ["default", "focus", "hover", "active", "disabled"])] },
  { name: "Status-number", id: "541:21", page: "Buttons", variants: 20, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["primary", "secondary"]), v("Size", ["medium", "large"]), v("State", ["default", "focus", "hover", "active", "disabled"])] },
  { name: "Status-number", id: "544:4037", page: "Buttons", variants: 20, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["primary", "secondary"]), v("Size", ["medium", "large"]), v("State", ["default", "focus", "hover", "active", "disabled"])] },
  { name: "loading-buttons", id: "565:4242", page: "Buttons", variants: 9, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["outline", "primary", "secondary"]), v("Size", ["large", "medium", "small"])] },
  { name: "Drop-down-button", id: "561:4247", page: "Buttons", variants: 5, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Drop-down", ["off", "on"]), v("State", ["default", "active", "hover"]), v("Icons", ["true", "false"])] },

  /* Input Forms */
  { name: "Input", id: "1348:9867", page: "Input Forms", variants: 15, instances: 18, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["Default", "Icon-left", "Icon right", "Double Icon", "Drop down"]), v("State", ["Default", "Focus", "Deactivated"])] },
  { name: "Feedback Form", id: "286:3333", page: "Input Forms", variants: 9, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Size", ["Small", "Medium", "Large"]), v("State", ["Error", "Succes", "Warning"])] },
  { name: "Radio", id: "306:0", page: "Input Forms", variants: 8, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("State", ["Selected", "Unselected", "Unselected-Disabled", "Selected-Disabled"]), v("Label", ["true", "False"])] },
  { name: "Checkbox", id: "309:151", page: "Input Forms", variants: 8, instances: 59, instancesInScreens: 22, hasVariantConflict: true,
    properties: [v("State", ["Unselected", "Unselected Disabled", "Selected Disabled", "Selected"]), v("Label", ["True", "False"])] },
  { name: "Text Area", id: "298:3247", page: "Input Forms", variants: 6, instances: 1, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("State", ["Default", "Hover", "Focus", "Error", "Succes", "Disabled"])] },
  { name: "Toggle Standar", id: "300:6708", page: "Input Forms", variants: 6, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Size", ["Medium", "Large"]), v("State", ["Off", "Disabled", "On"])] },
  { name: "Mobile Toggle", id: "300:6787", page: "Input Forms", variants: 3, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("State", ["On", "Disabled", "off"])] },
  { name: "Slider Control", id: "318:149", page: "Input Forms", variants: 3, instances: 0, instancesInScreens: 0, hasVariantConflict: true,
    properties: [v("State", ["Focus", "Default"])] },
  { name: "Slider Control Range", id: "318:265", page: "Input Forms", variants: 3, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("state", ["Default", "Focus", "Disabled"])] },
  { name: "Radio Button", id: "1408:9993", page: "Input Forms", variants: 2, instances: 4, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Checked", ["On", "Off"])] },
  { name: "Divider", id: "1067:9971", page: "Input Forms", variants: 2, instances: 59, instancesInScreens: 11, hasVariantConflict: false,
    properties: [v("Size", ["1px", "2px"])] },

  /* Badges */
  { name: "Soft Pills Badges", id: "248:1673", page: "Badges", variants: 18, instances: 105, instancesInScreens: 73, hasVariantConflict: false,
    properties: [v("Type", ["Soft Pill"]), v("Color", ["Primary", "Secondary", "Tertiary", "Succes", "Warning", "Danger", "Information", "Light", "Dark"]), v("Size", ["sm", "md"])] },
  { name: "Solid Pills Badges", id: "248:1587", page: "Badges", variants: 18, instances: 0, instancesInScreens: 0, hasVariantConflict: true,
    properties: [v("Type", ["Solid Pill"]), v("Color", ["Tertiary", "Succes", "Warning", "Danger", "Information", "Dark", "Light", "Secondary", "Primary"]), v("Size", ["md", "sm"])] },
  { name: "Soft Badges", id: "247:1675", page: "Badges", variants: 18, instances: 19, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["Soft"]), v("Color", ["Primary", "Secondary", "Tertiary", "Succes", "Warning", "Danger", "Information", "Light", "Dark"]), v("Size", ["sm", "md"])] },
  { name: "Solid Badges", id: "244:20", page: "Badges", variants: 18, instances: 0, instancesInScreens: 0, hasVariantConflict: true,
    properties: [v("Type", ["Solid"]), v("Color", ["Tertiary", "Succes", "Warning", "Danger", "Information", "Dark", "Light", "Secondary", "Primary"]), v("Size", ["md", "sm"])] },
  { name: "Soft Counter Pills", id: "256:178", page: "Badges", variants: 12, instances: 0, instancesInScreens: 0, hasVariantConflict: true,
    properties: [v("Type", ["Soft"]), v("Size", ["sm", "md"])] },
  { name: "Soft Counter", id: "256:115", page: "Badges", variants: 12, instances: 0, instancesInScreens: 0, hasVariantConflict: true,
    properties: [v("Type", ["Soft"]), v("Size", ["sm", "md"])] },
  { name: "Counter Pills", id: "256:84", page: "Badges", variants: 12, instances: 0, instancesInScreens: 0, hasVariantConflict: true,
    properties: [v("Type", ["solid"]), v("Size", ["sm", "md"])] },
  { name: "Solid Counter", id: "256:33", page: "Badges", variants: 12, instances: 0, instancesInScreens: 0, hasVariantConflict: true,
    properties: [v("Type", ["solid"]), v("Size", ["sm", "md"])] },
  { name: "Icon Badge Solid", id: "1003:9737", page: "Badges", variants: 9, instances: 31, instancesInScreens: 20, hasVariantConflict: false,
    properties: [v("Type", ["Succes", "Warning", "Error"]), v("Size", ["16px", "12px", "14px"])] },
  { name: "Icon Badge", id: "954:7051", page: "Badges", variants: 6, instances: 15, instancesInScreens: 15, hasVariantConflict: false,
    properties: [v("Type", ["Danger", "Succes"]), v("Size", ["12px", "14px", "16PX"])] },

  /* Tooltips */
  { name: "Tooltip / Light / Default ", id: "398:3810", page: "Tooltips", variants: 4, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Direction", ["Bottom", "Top", "Left", "Right"])] },
  { name: "Tooltip / Dark / Default ", id: "398:3928", page: "Tooltips", variants: 4, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Direction", ["Bottom", "Top", "Left", "Right"])] },
  { name: "Tooltip / Dark / Analytics", id: "401:0", page: "Tooltips", variants: 4, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Direction", ["Right", "Left", "Bottom", "Top"])] },
  { name: "Tooltip / Light / Analytics", id: "395:12", page: "Tooltips", variants: 4, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Direction", ["Left", "Bottom", "Top", "Right"])] },

  /* Avatars */
  { name: "Avatars", id: "587:0", page: "Avatars", variants: 32, instances: 33, instancesInScreens: 15, hasVariantConflict: false,
    properties: [v("Type", ["initial", "photo"]), v("Shape", ["circle", "square"]), v("Size", ["16px", "20px", "24px", "28px", "32px", "40px", "48px", "64px"])] },
  { name: "Status Avatar", id: "263:3081", page: "Avatars", variants: 8, instances: 34, instancesInScreens: 27, hasVariantConflict: false,
    properties: [v("Type", ["Circle"]), v("Size", ["20px", "16px", "24px", "28px", "32px", "40px", "48px", "64px"])] },

  /* Alerts */
  { name: "Alert", id: "423:152", page: "Alerts", variants: 8, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["Soft", "Default"]), v("Status", ["Warning", "Succes", "Danger", "Information"])] },

  /* Cards */
  { name: "Conversations chat", id: "1306:9899", page: "Cards", variants: 2, instances: 10, instancesInScreens: 10, hasVariantConflict: false,
    properties: [v("Check Message", ["Off", "On"])] },
  { name: "Component 2", id: "1323:9423", page: "Cards", variants: 2, instances: 8, instancesInScreens: 8, hasVariantConflict: false,
    properties: [v("Chat Message", ["Received", "Sending"])] },

  /* Navigation */
  { name: "Sidebar", id: "1288:11113", page: "Navigation", variants: 16, instances: 5, instancesInScreens: 5, hasVariantConflict: false,
    properties: [v("contracted", ["True", "False"]), v("Home", ["False", "True"]), v("Products", ["False", "True"]), v("Orders", ["False", "True"]), v("Payments", ["False", "True"]), v("Customers", ["False", "True"]), v("Messages", ["False", "True"]), v("Analytics", ["False", "True"]), v("Schedule", ["False", "True"])] },
  { name: "Button Navigation", id: "1284:9816", page: "Navigation", variants: 2, instances: 119, instancesInScreens: 45, hasVariantConflict: false,
    properties: [v("Active", ["False", "True"])] },
  { name: "Button Navigation Contracted", id: "1435:11460", page: "Navigation", variants: 2, instances: 72, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("State", ["On", "Off"])] },
  { name: "Drop down Navigation", id: "1288:10666", page: "Navigation", variants: 2, instances: 13, instancesInScreens: 5, hasVariantConflict: false,
    properties: [v("Drop down", ["on", "off"])] },
  { name: "Setting", id: "369:43", page: "Navigation", variants: 2, instances: 0, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("State", ["Default", "Hover"])] },

  /* Tables */
  { name: "Component", id: "612:5008", page: "Tables", variants: 7, instances: 1, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Status", ["true", "false"]), v("Type", ["true", "false"]), v("email", ["true", "false"])] },

  /* Icons */
  { name: "Component 1", id: "798:6975", page: "Icons", variants: 8, instances: 13, instancesInScreens: 12, hasVariantConflict: false,
    properties: [v("Type", ["Cash Icon", "Order Icon", "Sales Icon", "Ticket Icon"]), v("Shape", ["Circle", "Square"])] },

  /* Navbar */
  { name: "Top-Bar", id: "1432:10982", page: "Navbar", variants: 2, instances: 7, instancesInScreens: 7, hasVariantConflict: false,
    properties: [v("Menu Fold", ["On", "Off"])] },
];

/**
 * Component sets that are still referenced by live instances but no longer sit
 * on any page — earlier generations replaced by the sets above.
 */
const orphanedComponentSets: ComponentSet[] = [
  { name: "Photo Avatar", id: "262:1105", page: null, variants: 16, instances: 56, instancesInScreens: 28, hasVariantConflict: false,
    properties: [v("Type", ["Circle", "Square"]), v("Size", ["16px", "20px", "24px", "28px", "32px", "40px", "48px", "64px"])] },
  { name: "Initials Avatar", id: "261:20", page: null, variants: 16, instances: 12, instancesInScreens: 2, hasVariantConflict: false,
    properties: [v("Type", ["Circle", "Square"]), v("Size", ["16px", "20px", "24px", "28px", "32px", "40px", "48px", "64px"])] },
  { name: "Default Filled Icon Right", id: "194:3", page: null, variants: 15, instances: 5, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["Primary-Icon-Right"]), v("Size", ["sm", "Md", "Lg"]), v("State", ["Default", "Active", "Disabled", "Hover", "Focus"])] },
  { name: "Primary Button  Default  Filled", id: "148:29", page: null, variants: 15, instances: 2, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["Primary"]), v("Size", ["sm", "md", "lg"]), v("State", ["Default", "Disabled", "Active", "Hover", "Focus"])] },
  { name: "Secondary Button Default  Filled", id: "155:289", page: null, variants: 15, instances: 1, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["Secondary"]), v("Size", ["sm", "Md", "Lg"]), v("State", ["Default", "Disabled", "Active", "Hover", "Focus"])] },
  { name: "Default Outline Icon Button", id: "207:647", page: null, variants: 15, instances: 1, instancesInScreens: 0, hasVariantConflict: false,
    properties: [v("Type", ["Outline"]), v("Size", ["sm", "md", "lg"]), v("State", ["Default", "Disabled", "Active", "Hover", "Focus"])] },
  { name: "Icon Card", id: "750:6873", page: null, variants: 6, instances: 13, instancesInScreens: 12, hasVariantConflict: false,
    properties: [v("Type", ["Ticket Icon", "Cash Icon", "Sales Icon", "Order Icon"]), v("Shape", ["Square", "Circular"])] },
];

/* ── Screens and icons ──────────────────────────────────────────────────── */

const screens: ScreenFrame[] = [
  { name: "Dashboard", width: 1440, height: 1337 },
  { name: "Order", width: 1440, height: 1337 },
  { name: "Schedule", width: 1440, height: 1337 },
  { name: "Message", width: 1440, height: 1337 },
  { name: "List Order Table/Off", width: 1109, height: 1112 },
  { name: "Frame 144", width: 1224, height: 1452 },
  { name: "Dashboard", width: 1507, height: 1356 },
];

const iconSections: IconSection[] = [
  { name: "Outline Icons", count: 281 },
  { name: "Solid Icon", count: 231 },
  { name: "Brand ICons", count: 33 },
  { name: "Card  Icons", count: 8 },
  { name: "Integration Icons", count: 5 },
];

/* ── Export ─────────────────────────────────────────────────────────────── */

const paintStyleCount = colorRamps.reduce((n, r) => n + r.stops.length, 0);
const variantCount = componentSets.reduce((n, s) => n + s.variants, 0);
const orphanVariantCount = orphanedComponentSets.reduce((n, s) => n + s.variants, 0);
const iconCount = iconSections.reduce((n, s) => n + s.count, 0);

export const designSystemData: DesignSystemData = {
  source: {
    fileKey: "UJ1ig2NfZGNmugmjG6om3v",
    fileName: "Dashboard - Design System (Public)",
    url: "https://www.figma.com/design/UJ1ig2NfZGNmugmjG6om3v/Dashboard---Design-System---Public-",
    extractedAt: "2026-08-03",
    usesVariables: false,
  },
  pages,
  fontFamily: {
    name: "Inter",
    weights: [
      { name: "Regular", value: 400 },
      { name: "Medium", value: 500 },
      { name: "Bold", value: 700 },
    ],
  },
  colorRamps,
  textStyles,
  documentedScale,
  shadows,
  gridStyles,
  breakpoints,
  responsiveGrids,
  componentSets,
  orphanedComponentSets,
  screens,
  icons: { total: iconCount, sections: iconSections },
  counts: {
    pagesTotal: pages.length,
    pagesWithContent: pages.filter((p) => p.kind === "content").length,
    paintStyles: paintStyleCount,
    textStyles: textStyles.length,
    effectStyles: shadows.length,
    gridStyles: gridStyles.length,
    stylesTotal: paintStyleCount + textStyles.length + shadows.length + gridStyles.length,
    componentSets: componentSets.length,
    variants: variantCount,
    orphanedComponentSets: orphanedComponentSets.length,
    orphanedVariants: orphanVariantCount,
    standaloneComponents: 560,
    icons: iconCount,
  },
  notes: [
    "Built in 2021, before Figma Variables. Every token is a shared style: 55 paint, 73 text, 4 effect, 5 grid.",
    "There is no numeric spacing scale in the file. Layout is documented as 6 breakpoints plus 4 responsive column grids.",
    "The Typography page binds two color styles that are not local to the file — grey/black #1B2326 and grey/default #828282 — so they come from a library, not from the ramps above.",
    "Two pages are named 'Status-number' twice under Buttons; the duplicate is preserved as it appears.",
    "560 standalone components exist outside component sets; 558 of them are the icon library.",
  ],
};
