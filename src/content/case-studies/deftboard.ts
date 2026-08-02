import type { CaseStudy } from "@/types/case-study";

const IMG = (name: string) =>
  `/images/projects/deftboard/${encodeURIComponent(name)}`;

export const deftboard: CaseStudy = {
  meta: {
    slug: "deftboard",
    title:
      "DeftBoard: a complete *Design System* built from first principles",
    subtitle:
      "A comprehensive Figma Design System following Atomic Design methodology — from color primitives and typography scales to fully-documented components with all states, and production-ready screen templates.",
    year: "2022",
    role: "Design System Designer",
    type: "Personal project",
    tools: "Figma",
    accent: "blue",
  },

  seo: {
    title: "DeftBoard Design System — Facundo Almirón",
    description:
      "A complete Figma Design System built from first principles using Atomic Design methodology.",
  },

  tags: ["Design System", "UI Kit", "Figma", "Atomic Design"],

  // TODO: links needed — no Figma or Behance URL on record for this project
  links: {},

  stats: [
    { value: "2,443+", label: "Behance likes" },
    { value: "10+", label: "Component families" },
    { value: "100+", label: "Variants documented" },
    { value: "4", label: "Screen templates" },
  ],

  blocks: [
    /* ── 01 The brief ──────────────────────────────────────────────────── */
    {
      type: "section",
      num: "01",
      label: "The brief",
      title: "Learning by building — a Design System from scratch",
      body: [
        "DeftBoard started as a personal initiative to understand design systems from the inside. Not by inheriting an existing one, but by building from the ground up — starting from color primitives and type decisions, ending with production-ready templates. The goal: develop both a working artifact and a reusable way of thinking about systems.",
        "The structure follows Brad Frost's Atomic Design methodology, which provides a clear mental model for organizing design decisions. Atoms are the smallest indivisible elements — a color, a type style, a spacing value. Molecules combine atoms into functional units. Organisms assemble molecules into complex UI sections. This hierarchy makes the system legible, extensible, and traceable from token to template.",
      ],
    },
    {
      type: "cardGrid",
      icons: "atomic",
      items: [
        {
          num: "01",
          title: "Atoms",
          body: "Colors, typography, spacing, border radii, and icon library. The raw vocabulary every other decision inherits from.",
        },
        {
          num: "02",
          title: "Molecules",
          body: "Buttons, form inputs, badges, and tooltips — each with full variant and state coverage. The smallest reusable units with designed behavior.",
        },
        {
          num: "03",
          title: "Organisms",
          body: "Navigation bars, data tables, and form sections. Complex components built from molecules with documented layout and interaction patterns.",
        },
      ],
    },

    /* ── 02 Foundations ────────────────────────────────────────────────── */
    {
      type: "section",
      num: "02",
      label: "Foundations",
      title: "Every system starts with decisions about color, type, and space",
      body: [
        "Before documenting a single component, the foundation requires explicit decisions. A color system needs primitive values that semantic tokens can reference. A type scale needs a ratio and base size that all text styles derive from. Getting these foundation layers right — and naming them consistently — is what makes the rest of the system coherent rather than coincidentally consistent.",
      ],
    },
    {
      type: "image",
      src: IMG("02 - Colors Styles.png"),
      alt: "Color system — primitive and semantic tokens",
      caption: "Color system",
      tag: "Atom",
    },
    {
      type: "image",
      src: IMG("03 - Typography Desktop.png"),
      alt: "Typography scale for desktop",
      caption: "Typography scale",
      tag: "Atom",
    },
    {
      type: "imageGrid",
      images: [
        {
          src: IMG("04 - Spacing & screen grid.png"),
          alt: "Spacing system and screen grid",
          caption: "Spacing & grid",
          tag: "Atom",
        },
        {
          src: IMG("05 - Icons.png"),
          alt: "Icon library",
          caption: "Icon library",
          tag: "Atom",
        },
      ],
    },

    /* ── 03 Components ─────────────────────────────────────────────────── */
    {
      type: "section",
      num: "03",
      label: "Components",
      title: "Every state. Every variant. Documented.",
      body: [
        "Component documentation means more than showing the default state. It means capturing error states, empty states, disabled states, and loading states — thinking about what happens at the extremes of content length and what the screen reader encounters. Each component family was built with that completeness as the bar.",
      ],
    },
    {
      type: "chips",
      items: [
        { label: "Buttons", value: "8 sizes × 5 states" },
        { label: "Text Inputs", value: "5 variants × 3 states" },
        { label: "Badges", value: "12+ variants" },
        { label: "Navigation", value: "3 components" },
        { label: "Tables", value: "5 configurations" },
        { label: "Graphics", value: "4 chart types" },
      ],
    },
    {
      type: "image",
      src: IMG("06 - Buttons.png"),
      alt: "Button component — all sizes and states",
      caption: "Button variants",
      tag: "Molecule",
    },
    {
      type: "image",
      src: IMG("07 - Text Input.png"),
      alt: "Text input component — variants and states",
      caption: "Text inputs",
      tag: "Molecule",
    },
    {
      type: "imageGrid",
      images: [
        {
          src: IMG("08 - Badges.png"),
          alt: "Badge components",
          caption: "Badges",
          tag: "Molecule",
        },
        {
          src: IMG("09 - Navigation.png"),
          alt: "Navigation components",
          caption: "Navigation",
          tag: "Organism",
        },
      ],
    },
    {
      type: "imageGrid",
      images: [
        {
          src: IMG("10 - Tables.png"),
          alt: "Table component variants",
          caption: "Tables",
          tag: "Organism",
        },
        {
          src: IMG("12 - Graphics.png"),
          alt: "Chart and graphic components",
          caption: "Graphics",
          tag: "Organism",
        },
      ],
    },

    /* ── 04 Figma craft ────────────────────────────────────────────────── */
    {
      type: "section",
      num: "04",
      label: "Figma craft",
      title:
        "Built for real use — variants, properties, and scalable structures",
      body: [
        "Figma's component architecture can mirror good code practices: controlled props, hidden complexity, composable structures. Each component was built with variant groups that expose only the controls a designer needs — keeping the frame count manageable while preserving full design flexibility underneath.",
      ],
    },
    {
      type: "image",
      src: IMG("13 - Variants_02.png"),
      alt: "Figma component variants structure",
      caption: "Component variant architecture",
      tag: "System",
    },
    {
      type: "image",
      src: IMG("14 Variantes_02.png"),
      alt: "Figma component properties panel",
      caption: "Property architecture",
      tag: "System",
    },

    /* ── 05 The system in use ──────────────────────────────────────────── */
    {
      type: "section",
      num: "05",
      label: "The system in use",
      title: "From atoms to screens",
      body: [
        "The final test of any design system is whether it accelerates real design work. These screen templates use the full component library — from atomic text styles to organism-level navigation and data tables — demonstrating that a well-built system enables design at a different pace than composing from scratch every time.",
      ],
    },
    {
      type: "image",
      src: IMG("15 - Screen.png"),
      alt: "Screen templates built with the design system",
      caption: "Screen templates",
      tag: "Templates",
    },

    /* ── 06 Impact ─────────────────────────────────────────────────────── */
    {
      type: "section",
      num: "06",
      label: "Impact",
      title: "Community validation",
    },
    {
      type: "metrics",
      items: [
        { value: "2,443+", label: "Behance likes · Community appreciation" },
      ],
    },
    {
      type: "prose",
      body: [
        "Publishing DeftBoard on Behance was an experiment in making the work visible. The response revealed that systematic documentation resonates with designers who have experienced poorly-organized systems — or who are trying to build their first one. Over time, the project became a reference point for Atomic Design implementation in Figma.",
        "These lessons carried directly into bLoyal. When I joined that project, I arrived with a clear methodology for token architecture, established documentation standards, and a tested approach to Design QA. The difference between inheriting a chaotic component library and knowing how to build one deliberately — that was built through DeftBoard.",
      ],
    },
  ],

  nextCase: {
    href: "/work/bloyal",
    title: "Want to see how I work in production?",
    cta: "View bLoyal case →",
  },
};
