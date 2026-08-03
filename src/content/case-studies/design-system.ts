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

/* The Figma file holds seven screen frames, but two are duplicate Dashboards
   and one is an untitled scratch frame. These are the four distinct screens. */
const SCREENS = [
  { file: "Dashboard.png", name: "Dashboard" },
  { file: "Order.jpg", name: "Order" },
  { file: "Schedule.png", name: "Schedule" },
  { file: "Message.png", name: "Message" },
] as const;

/* Headings read better spelled out; the count still drives it. */
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven"];
const spell = (n: number) => WORDS[n] ?? String(n);

const screenImage = ({ file, name }: (typeof SCREENS)[number]) => ({
  src: IMG(file),
  alt: `${name} screen built from the design system components`,
  caption: name,
  tag: "Screen",
});

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
    { value: String(SCREENS.length), label: "Screens" },
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
        "The type scale below is the one the file prints next to each specimen — the intended scale. What is actually bound diverges from it in half the steps: 46 of the 73 text styles carry a line-height of exactly 20px, from 12px body copy up to 48px headings.",
      ],
    },
    typeList,

    /* ── 02 Five years in circulation ──────────────────────────────────── */
    {
      type: "section",
      num: "02",
      label: "Five years in circulation",
    },
    {
      type: "metrics",
      items: [
        { value: "51,638", label: "Views" },
        { value: "2,449", label: "Appreciations" },
        { value: "3,131", label: "Saves" },
        { value: "1.6k", label: "Figma Community uses" },
      ],
    },
    {
      type: "prose",
      body: [
        "Published August 2021. Since then: 51,638 views, 2,449 appreciations, 3,131 saves on Behance — and 1.6k uses on Figma Community.",
        "The saves matter more than the likes. An appreciation means someone thought it looked good. A save means they took it into their own account to work with. Three thousand people did that.",
        "I built this to learn Figma. It became infrastructure for strangers.",
      ],
    },

    /* ── 03 What I'd do differently ────────────────────────────────────── */
    {
      type: "section",
      num: "03",
      label: "What I'd do differently",
    },
    {
      type: "prose",
      body: [
        "The flaws I see now aren't the aesthetic ones. They're the ones that only surface when someone actually uses the file.",
      ],
    },
    /* Three findings as titled fields. The amber register carries the section:
       these are costs that only became visible once the file had users. */
    {
      type: "tradeoff",
      title: "Typography documents two numbers and explains neither",
      body: "Each step shows something like “24px 32px”. In June 2024, three years after publishing, someone asked me what the second number meant. It's line height — but nothing in the file says so. Worse: 46 of the 73 text styles carry a bound line height of 20px, from 12px captions to 48px headings. The sheet documents one thing; the styles apply another.",
    },
    {
      type: "tradeoff",
      title: "Forty-two instances point to components that no longer exist",
      body: "Anyone who duplicates it sees screens assembled from parts they can't find.",
    },
    {
      type: "tradeoff",
      title: "The icons are two libraries wearing one name",
      body: "The 558 icons span five sets, and the two main ones don't line up. Outline uses an fi: prefix, solid doesn't. Normalize the names and only 81 appear in both sets — 200 are outline-only, 150 solid-only. You can't swap between styles for most of the icons, because the pair was never built.",
    },
    {
      type: "prose",
      body: [
        "None of these are visible while building. All of them break the moment someone else picks it up. That's the part a system can only teach you when it has users — which is why this file taught me more than the ones nobody downloaded.",
      ],
    },

    /* ── 04 Components ─────────────────────────────────────────────────── */
    {
      type: "section",
      num: "04",
      label: "Components",
      title: "Forty-nine sets, eight hundred and seventeen variants",
      body: [
        "None of the 49 sets uses a boolean or an instance-swap property, because neither existed in 2021. Everything that reads as a toggle is a variant axis with True/False options, and every optional element is another row in the matrix. Reading the inventory with that in mind is what makes the variant counts legible.",
      ],
    },
    inventory,

    /* ── 05 Modeling the Sidebar ───────────────────────────────────────── */
    {
      type: "section",
      num: "05",
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

    /* ── 06 Inside the library ─────────────────────────────────────────── */
    {
      type: "section",
      num: "06",
      label: "Inside the library",
      title: "Three sets that show the rules being applied",
    },
    {
      type: "cardGrid",
      items: [
        {
          num: "01",
          title: "Default-button",
          body: "135 variants of a possible 180: type × filled/outline × three sizes × five states × three icon positions. Every combination exists except secondary outline, whose 45 are absent. The five states cover the full interaction set — default, hover, focus, active, disabled.",
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

    /* ── 07 The system in use ──────────────────────────────────────────── */
    {
      type: "section",
      num: "07",
      label: "The system in use",
      title: `${titleCase(spell(SCREENS.length))} screens assembled from the library`,
    },
    {
      type: "imageGrid",
      images: [screenImage(SCREENS[0]), screenImage(SCREENS[1])],
    },
    {
      type: "imageGrid",
      images: [screenImage(SCREENS[2]), screenImage(SCREENS[3])],
    },

    /* ── 08 The archive ────────────────────────────────────────────────── */
    {
      type: "section",
      num: "08",
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
