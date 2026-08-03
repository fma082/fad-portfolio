import type { Block, CaseStudy } from "@/types/case-study";
import { designSystemData as ds } from "./_data/design-system";

const IMG = (name: string) =>
  `/images/projects/design-system/${encodeURIComponent(name)}`;

/* Every table below is derived from `_data/design-system.ts`, which was read
   out of the Figma file. Nothing here restates a number by hand. */

const rgba = (hex: string, opacity: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${opacity})`;
};

const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const sidebar = ds.componentSets.find((set) => set.name === "Sidebar");
const sidebarAxes = sidebar?.properties ?? [];
/* The full cartesian product of the nine axes, against what exists. */
const sidebarTheoretical = sidebarAxes.reduce(
  (total, axis) => total * axis.options.length,
  1,
);

const colorTable: Block = {
  type: "tokenTable",
  title: `${ds.counts.paintStyles} paint styles across ${ds.colorRamps.length} ramps`,
  groups: ds.colorRamps.map((ramp) => ({
    name: ramp.name,
    tokens: ramp.stops.map((stop) => ({
      name: stop.name,
      value: stop.opacity === 1 ? stop.hex : rgba(stop.hex, stop.opacity),
      note: stop.note,
    })),
  })),
};

const breakpointList: Block = {
  type: "specList",
  items: ds.breakpoints.map((point) => ({
    label: point.label,
    value: point.query,
    note: `Documented on a ${point.frameWidth}px frame`,
  })),
};

const gridList: Block = {
  type: "specList",
  items: ds.responsiveGrids.map((grid) => ({
    label: `${grid.label} · ${grid.range}`,
    value: `${grid.columns} columns`,
    note: `${grid.marginsAndGutters}px margins & gutters`,
  })),
};

const typeList: Block = {
  type: "specList",
  items: ds.documentedScale.map((step) => ({
    label: `${titleCase(step.breakpoint)} · ${step.group} · ${step.step}`,
    value: step.lineHeightPx
      ? `${step.sizePx} / ${step.lineHeightPx} px`
      : `${step.sizePx} px`,
    note: step.lineHeightRem
      ? `${step.sizeRem} · ${step.lineHeightRem} line-height`
      : step.sizeRem,
  })),
};

const inventory: Block = {
  type: "componentInventory",
  summary: `${ds.counts.componentSets} component sets · ${ds.counts.variants} variants · every property a variant axis`,
  /* Sorted by variant count, largest first. The block itself does no sorting —
     the content file owns the order, so a different case study can group by
     page instead without touching the component. */
  sets: [...ds.componentSets]
    .sort((a, b) => b.variants - a.variants)
    .map((set) => ({
      name: set.name,
      variants: set.variants,
      properties: set.properties.map(({ name, options }) => ({
        name,
        options,
      })),
      instances: set.instances,
    })),
};

export const designSystem: CaseStudy = {
  meta: {
    slug: "design-system",
    title: "Dashboard *Design System*",
    subtitle:
      "A Figma library for dashboard products: 49 component sets, 817 variants and 558 icons, published to the Figma Community and used 1,600 times.",
    year: "2021",
    role: "Design System Designer",
    type: "Personal project",
    tools: "Figma",
    accent: "blue",
  },

  seo: {
    title: "Dashboard Design System — Facundo Almirón",
    description:
      "A 2021 Figma design system for dashboard products — 49 component sets, 817 variants, 137 styles — published to the Figma Community.",
  },

  tags: ["Design System", "UI Kit", "Figma", "Atomic Design"],

  links: {
    figma: ds.source.url,
    /* TODO: links needed — no Behance URL for this project anywhere in the repo. */
  },

  stats: [
    { value: String(ds.counts.componentSets), label: "Component sets" },
    { value: String(ds.counts.variants), label: "Variants" },
    { value: String(ds.counts.icons), label: "Icons" },
    { value: String(ds.counts.stylesTotal), label: "Styles" },
    { value: String(ds.screens.length), label: "Screens" },
  ],

  blocks: [
    /* ── 00 Overview ───────────────────────────────────────────────────── */
    {
      type: "section",
      num: "00",
      label: "Overview",
      title: "A dashboard system built before the tools caught up",
      body: [
        "This system was built in 2021 — before Figma Variables, and before boolean and instance-swap component properties existed. Every token in it is a shared style, and every component property is a variant axis. That constraint is the context for everything below: choices that look verbose today were the only way to express them at the time.",
        "It was published to the Figma Community, where it has been used 1,600 times, and posted to Behance, where it collected 2,443 likes. The uses matter more than the likes: each one is a person who copied the file into their own account to work in it.",
      ],
    },
    {
      type: "metrics",
      items: [
        {
          value: "1.6k",
          label: "Figma Community uses",
          note: "Copies taken into someone else's account",
        },
        { value: "2,443", label: "Behance likes" },
      ],
    },

    /* ── 01 Foundations ────────────────────────────────────────────────── */
    {
      type: "section",
      num: "01",
      label: "Foundations",
      title: "Tokens, before tokens had a name in Figma",
      body: [
        `The file carries ${ds.counts.stylesTotal} shared styles: ${ds.counts.paintStyles} paint, ${ds.counts.textStyles} text, ${ds.counts.effectStyles} effect and ${ds.counts.gridStyles} grid. Names are reproduced exactly as they ship — spacing, capitalisation and typos included — because that is what a reader downloading the file will see in their own style panel.`,
      ],
    },
    colorTable,
    {
      type: "prose",
      body: [
        "There is no numeric spacing scale in this file. Layout is documented the way the system actually expresses it: six breakpoints and four responsive column grids.",
      ],
    },
    breakpointList,
    gridList,
    {
      type: "prose",
      body: [
        "The type scale below is the one the file prints next to each specimen. The bound text styles carry a uniform 20px line-height, which is an artefact of how Figma handled line-height in 2021 rather than a design decision — the annotated values are the intended scale.",
      ],
    },
    typeList,

    /* ── 02 Components ─────────────────────────────────────────────────── */
    {
      type: "section",
      num: "02",
      label: "Components",
      title: "Forty-nine sets, eight hundred and seventeen variants",
      body: [
        "None of the 49 sets uses a boolean or an instance-swap property, because neither existed in 2021. Everything that reads as a toggle is a variant axis with True/False options, and every optional element is another row in the matrix. Reading the inventory with that in mind is what makes the variant counts legible.",
      ],
    },
    inventory,

    /* ── 03 Modeling the Sidebar ───────────────────────────────────────── */
    {
      type: "section",
      num: "03",
      label: "Modeling the Sidebar",
      title: "Nine properties, five hundred and twelve combinations, sixteen built",
    },
    {
      type: "variantMatrix",
      title: "Sidebar — variant model",
      axes: sidebarAxes,
      built: sidebar?.variants ?? 0,
      theoretical: sidebarTheoretical,
      note: `Nine variant properties: one collapse state plus one True/False axis per menu item. The complete cartesian product is ${sidebarTheoretical} combinations. ${sidebar?.variants ?? 0} exist — the collapse state times the eight items, one active at a time.`,
    },
    /* TODO: copy needed — decision block on the modelling choice.
       Why 16 and not 512: the reasoning behind treating the eight item axes as
       a radio group rather than independent booleans. */
    /* TODO: copy needed — tradeoff block. What the sparse set costs: Figma
       cannot express "exactly one active" as a constraint, so the missing
       combinations are invisible to a consumer until they look for them. */
    {
      type: "prose",
      body: [
        "The Sidebar does not draw its own rows. It composes Button Navigation — a two-variant set with a single Active axis, and the most-instanced component in the file at 119 uses. The atomic hierarchy declared in the page list is load-bearing, not just naming.",
      ],
    },

    /* ── 04 Craft in the matrix ────────────────────────────────────────── */
    {
      type: "section",
      num: "04",
      label: "Craft in the matrix",
      title: "Three sets that show the rules being applied",
    },
    {
      type: "cardGrid",
      items: [
        {
          num: "01",
          title: "Default-button",
          body: "135 variants: type × filled/outline × three sizes × five states × three icon positions. The matrix is complete, with no gaps, and the five states cover the full interaction set — default, hover, focus, active, disabled.",
        },
        {
          num: "02",
          title: "Soft Pills Badges",
          body: "The most consumed set in the file: 105 instances, 73 of them inside the final screens. Its nine colour options map one to one onto the paint ramps — Primary, Secondary, Tertiary, Succes, Warning, Danger, Information, Light, Dark.",
        },
        {
          num: "03",
          title: "Avatars",
          body: "32 variants from type × shape × eight sizes. It replaced two earlier sets, Photo Avatar and Initials Avatar, by folding the distinction into a Type axis instead of leaving it as two separate components.",
        },
      ],
    },
    {
      type: "tradeoff",
      title: "The Avatars migration was never finished",
      body: "Photo Avatar and Initials Avatar were consolidated into one 32-variant set, but neither original was removed from the file — both still sit outside the page tree with 68 live instances pointing at them. The consolidation is real; the cleanup stopped halfway.",
    },

    /* ── 05 The system in use ──────────────────────────────────────────── */
    {
      type: "section",
      num: "05",
      label: "The system in use",
      title: "Seven screens assembled from the library",
    },
    {
      type: "image",
      src: IMG("15 - Screen.png"),
      alt: "Dashboard screens assembled from the design system components",
      caption: "Screen templates built from the library",
      tag: "Screens",
    },
    /* TODO: assets needed — the seven screen frames are not in public/images/.
       Only this composite sheet exists. Frames in Figma: Dashboard, Order,
       Schedule, Message, List Order Table/Off, Frame 144, Dashboard (1507). */

    /* ── 06 The archive ────────────────────────────────────────────────── */
    {
      type: "section",
      num: "06",
      label: "The archive",
      title: "The file, as it is published",
    },
    {
      type: "figmaEmbed",
      url: ds.source.url,
      caption: `${ds.source.fileName} — ${ds.counts.pagesTotal} pages, published to the Figma Community`,
      height: 640,
    },
  ],
};
