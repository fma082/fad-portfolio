# Design System — copy narrativo rescatado de `deftboard.ts`

Archivo de origen: `src/content/case-studies/deftboard.ts`, borrado el 2026-08-03
al cerrar el fork `deftboard` / `design-system`. Son el mismo proyecto: el mismo
archivo de Figma, documentado con capturas en vez de con data extraída.

Esto es **todo el copy escrito a mano** de aquella versión, con la sección de la
que salía cada fragmento. Nada está editado ni reescrito.

Ojo con los números: los stats de esa versión estaban mal por un orden de
magnitud (ver el bloque *Stats* más abajo) y el año figuraba como 2022 cuando el
archivo de Figma es de 2021. El copy narrativo sigue siendo válido; las cifras no.

---

## Meta

**Title** (los asteriscos marcaban el fragmento en accent)

> DeftBoard: a complete \*Design System\* built from first principles

**Subtitle**

> A comprehensive Figma Design System following Atomic Design methodology — from
> color primitives and typography scales to fully-documented components with all
> states, and production-ready screen templates.

**SEO title**

> DeftBoard Design System — Facundo Almirón

**SEO description**

> A complete Figma Design System built from first principles using Atomic Design
> methodology.

**Meta fields**: year 2022 · role Design System Designer · type Personal project ·
tools Figma · accent blue
**Tags**: Design System · UI Kit · Figma · Atomic Design

---

## Stats (obsoletos — dejados como registro)

| Valor mostrado | Label | Valor real medido |
| --- | --- | --- |
| 2,443+ | Behance likes | sin verificar |
| 10+ | Component families | 49 component sets |
| 100+ | Variants documented | 817 variants |
| 4 | Screen templates | 7 screens |

---

## 01 — The brief

**Title**

> Learning by building — a Design System from scratch

**Body**

> DeftBoard started as a personal initiative to understand design systems from
> the inside. Not by inheriting an existing one, but by building from the ground
> up — starting from color primitives and type decisions, ending with
> production-ready templates. The goal: develop both a working artifact and a
> reusable way of thinking about systems.

> The structure follows Brad Frost's Atomic Design methodology, which provides a
> clear mental model for organizing design decisions. Atoms are the smallest
> indivisible elements — a color, a type style, a spacing value. Molecules
> combine atoms into functional units. Organisms assemble molecules into complex
> UI sections. This hierarchy makes the system legible, extensible, and traceable
> from token to template.

**Card grid** (íconos atómicos)

- **Atoms** — Colors, typography, spacing, border radii, and icon library. The
  raw vocabulary every other decision inherits from.
- **Molecules** — Buttons, form inputs, badges, and tooltips — each with full
  variant and state coverage. The smallest reusable units with designed behavior.
- **Organisms** — Navigation bars, data tables, and form sections. Complex
  components built from molecules with documented layout and interaction
  patterns.

---

## 02 — Foundations

**Title**

> Every system starts with decisions about color, type, and space

**Body**

> Before documenting a single component, the foundation requires explicit
> decisions. A color system needs primitive values that semantic tokens can
> reference. A type scale needs a ratio and base size that all text styles derive
> from. Getting these foundation layers right — and naming them consistently — is
> what makes the rest of the system coherent rather than coincidentally
> consistent.

---

## 03 — Components

**Title**

> Every state. Every variant. Documented.

**Body**

> Component documentation means more than showing the default state. It means
> capturing error states, empty states, disabled states, and loading states —
> thinking about what happens at the extremes of content length and what the
> screen reader encounters. Each component family was built with that
> completeness as the bar.

**Chips** (cifras sin verificar contra el archivo)

Buttons · 8 sizes × 5 states — Text Inputs · 5 variants × 3 states —
Badges · 12+ variants — Navigation · 3 components — Tables · 5 configurations —
Graphics · 4 chart types

---

## 04 — Figma craft

**Title**

> Built for real use — variants, properties, and scalable structures

**Body**

> Figma's component architecture can mirror good code practices: controlled
> props, hidden complexity, composable structures. Each component was built with
> variant groups that expose only the controls a designer needs — keeping the
> frame count manageable while preserving full design flexibility underneath.

---

## 05 — The system in use

**Title**

> From atoms to screens

**Body**

> The final test of any design system is whether it accelerates real design work.
> These screen templates use the full component library — from atomic text styles
> to organism-level navigation and data tables — demonstrating that a well-built
> system enables design at a different pace than composing from scratch every
> time.

---

## 06 — Impact

**Title**

> Community validation

**Metric label**

> 2,443+ · Behance likes · Community appreciation

**Body**

> Publishing DeftBoard on Behance was an experiment in making the work visible.
> The response revealed that systematic documentation resonates with designers
> who have experienced poorly-organized systems — or who are trying to build
> their first one. Over time, the project became a reference point for Atomic
> Design implementation in Figma.

### El párrafo que conecta con bLoyal

Este es el que no había que perder: es el único lugar del repo donde el proyecto
personal se enlaza con el trabajo en producción.

> These lessons carried directly into bLoyal. When I joined that project, I
> arrived with a clear methodology for token architecture, established
> documentation standards, and a tested approach to Design QA. The difference
> between inheriting a chaotic component library and knowing how to build one
> deliberately — that was built through DeftBoard.

---

## Next case (pie de página)

- **href**: `/work/bloyal`
- **title**: Want to see how I work in production?
- **cta**: View bLoyal case →

Nota: `/work/bloyal` es hoy un stub "Coming soon". El caso nuevo
(`design-system.ts`) no define `nextCase`.

---

## Captions de las imágenes borradas

Las capturas ya no están en el repo, pero los rótulos eran texto escrito a mano:

| Imagen | Caption | Tag |
| --- | --- | --- |
| 02 - Colors Styles | Color system | Atom |
| 03 - Typography Desktop | Typography scale | Atom |
| 04 - Spacing & screen grid | Spacing & grid | Atom |
| 05 - Icons | Icon library | Atom |
| 06 - Buttons | Button variants | Molecule |
| 07 - Text Input | Text inputs | Molecule |
| 08 - Badges | Badges | Molecule |
| 09 - Navigation | Navigation | Organism |
| 10 - Tables | Tables | Organism |
| 12 - Graphics | Graphics | Organism |
| 13 - Variants_02 | Component variant architecture | System |
| 14 Variantes_02 | Property architecture | System |
| 15 - Screen | Screen templates | Templates |
