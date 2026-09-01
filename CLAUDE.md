@AGENTS.md

# fad-portfolio — Project rules

Personal portfolio for Facundo Almirón, Senior Product Designer.
Positioning: designs the systems and interfaces for complex AI/SaaS products —
and can demonstrate that what he designs actually gets built.

## Stack

Next.js 16 (App Router, TypeScript) · React 19 · Tailwind v4 · Framer Motion · Vercel
Keep the dependency list minimal. Do not add a library without asking first.
Icons are hand-drawn inline SVG components — do NOT install an icon library.

## Hard rules

- **Tokens first.** Never hardcode colors, font sizes or spacing. Use the tokens
  defined in `src/app/globals.css` (`@theme` block).
- **All site-facing copy in English.** Code comments in English. Talk to me in
  Rioplatense Spanish.
- **Dark mode only.** It's a constraint, not a toggle. Never add light variants.
- Components small, typed, reusable. No `any`.
- Interactive components need `"use client"` at the top.
- **Never invent case study copy.** If narrative content is missing, leave a
  `{/* TODO: copy needed */}` marker and tell me. Fabricated portfolio copy is
  worse than an empty section.

## Token reference (source of truth is globals.css, this is a map)

Backgrounds bg-canvas #0A0A0B · bg-raised #111113 · bg-card #16161A · bg-card-hover #1C1C21
Borders border-border #222228 · border-border-strong #333340
Text text-fg #EDEDEF · text-fg-muted #8B8B95 · text-fg-faint #5C5C66
Accent violet #8B7BF4 · violet-dim #6B5DD3

Per-project accents live as tokens too — never as inline hex:
teal #5EEAD4 · blue #3C76F1 · green #34D399 · amber #FBBF24 · red #F87171
bone #E8E4DB — a warm off-white, not a hue. For a surface that reserves
colour for meaning rather than for brand.

Assigned today: violet (Fluuen) · blue (Design System) · bone (Countersign).
teal, green, amber and red are declared and free.

A case study never names its accent directly. It sets `data-accent="blue"` on its
root node; `globals.css` maps that to `--accent`, and descendants read it as
`text-(--accent)` or `border-(--accent)/40`. No `accent` prop, no hex.

Never name a color token after a font-size step (`xs`, `sm`, `base`, `lg`, `xl`…) —
every `--color-*` also generates a `text-*` utility that would shadow it.

## Type

font-serif → Instrument Serif · headings only (regular + italic)
font-sans → DM Sans · body
font-mono → IBM Plex Mono · labels, section numbers, tags. Always uppercase
with wide tracking (`tracking-[0.2em]`), size 10–12px.

## Architecture

- Case study blocks: `src/components/case-study/`
- Layout primitives (Navbar, Footer): `src/components/layout/`
  `SectionHeader` is local to `page.tsx`; `SectionDivider` (a different thing)
  lives in `case-study/`. `work/layout.tsx` still carries its own copy of the
  nav and footer rather than importing these.
- Case study content: `src/content/case-studies/[slug].ts` (typed data, not JSX)
- ONE generic page renders all case studies: `src/app/work/[slug]/page.tsx`
- **Adding a project = a content file + an entry in the `projects` array in
  `page.tsx`.** Never a new page component. The array duplicates `title`,
  `tags`, `type`, `desc`, `accent` and `thumb` for the home card; the content
  file alone will not put a project on the home page.
- Page files should stay under ~150 lines. If a page grows past that, extract.

## Projects (current, canonical list)

1. Fluuen — Figma + token repo + live demo + Storybook. Featured. Accent: violet.
   El repo del **producto** (`fma082/fluuen`) es **privado** — confirmado 2026-08-04.
   No lo linkees. Lo que sí es público es `fma082/fluuen-tokens`, la fuente del
   pipeline. Las referencias a archivos del producto en `_data/fluuen.ts` son
   procedencia, no links.
2. Countersign — repo + live demo. Accent: **bone**, not a hue. The product
   surface spends green, amber and red on safe / reversible / destructive, and
   a brand colour beside them would read as a fourth meaning. The reasoning is
   already in `types/accent.ts` — keep the two in agreement.
3. Design System — Figma + Behance. Accent: blue.

## Workflow

Validate in the browser before closing anything. Don't mark as done what wasn't
seen running. Flag architecture forks instead of assuming.
