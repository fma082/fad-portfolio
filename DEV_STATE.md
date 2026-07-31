# DEV_STATE

Estado vivo del proyecto. Claude Code: leé esto al empezar cada sesión.
Actualizalo al cerrar una fase o después de una decisión de arquitectura.

Última actualización: 2026-07-31

---

## Fase actual

**Fase 2 — Refactor a case studies data-driven**

La Fase 1 (home + DeftBoard + tokens) está cerrada y en producción.

---

## Decisiones cerradas — NO reabrir sin preguntar

- **Tailwind v4 con `@theme` en `globals.css`.** No hay `tailwind.config.ts`.
- **Nombres de token semánticos**: `base` / `raised` / `card`, `fg` / `fg-muted` /
  `fg-faint`. No volver a `bg-primary` / `text-secondary` del brief viejo.
- **Dark mode only.** No es un toggle pendiente, es la decisión.
- **Íconos SVG inline dibujados a mano.** No instalar lucide ni ninguna librería de íconos.
- **Sin dependencias más allá de next / react / framer-motion.** Preguntar antes de agregar.
- **Contenido de case study como data tipada** (`src/content/case-studies/[slug].ts`),
  no como JSX por página. Una sola página genérica los renderiza.

---

## Backlog de la fase, en orden

- [ ] Agregar los accent tokens faltantes a `@theme`: `teal`, `blue`, `green`,
      `amber`, `red`, `card-hover`. Eliminar los 6 hex hardcodeados.
- [ ] Crear `src/types/case-study.ts` con el tipo `CaseStudy` y la union `Block`.
- [ ] Bloques nuevos: `FigmaEmbed`, `LiveDemo`, `CodePeek`, `Metrics`,
      `DecisionBox`, `TradeoffBox`, `DemoFrame`.
- [ ] `BlockRenderer` con switch exhaustivo.
- [ ] Página genérica `src/app/work/[slug]/page.tsx` + `generateStaticParams`.
- [ ] Migrar DeftBoard al sistema nuevo (sin cambiar el resultado visual).
- [ ] Extraer Navbar / Footer de `page.tsx` a `src/components/layout/`.
- [ ] Case study: Fluuen.
- [ ] Case study: Countersign.
- [ ] Actualizar las cards de la home a los 3 proyectos reales.

---

## Anti-patterns observados — corregir si aparecen

- **Archivos de página monolíticos.** `page.tsx` (508 líneas) y
  `work/deftboard/page.tsx` (515) tienen componentes definidos adentro que
  deberían vivir en `src/components/`. Objetivo: ninguna página arriba de ~150 líneas.
- **Accents como string hex pasados por prop** (`ACCENT = "#3C76F1"` + `hexToRgb`).
  Funciona, pero el camino limpio es una CSS custom property por case study
  (`style={{ "--accent": ... }}`) apuntando a un token, no a un hex literal.
- **Rutas legacy**: `/work/next-agent`, `/work/bloyal`, `/work/ai-patterns` son
  stubs "Coming soon" de proyectos que no van más. Preguntar antes de borrarlas.

---

## Contenido pendiente (bloquea las case studies)

Claude Code no puede inventar esto. Si falta, dejar `{/* TODO: copy needed */}`.

| Proyecto      | Brief escrito | Figma | Repo | Demo |
| ------------- | ------------- | ----- | ---- | ---- |
| Fluuen        | ❌            | ✅    | ✅   | ✅   |
| Countersign   | ❌            | —     | ✅   | ✅   |
| Design System | ❌            | ✅    | —    | —    |

Los briefs van en `docs/briefs/[proyecto].md`.

---

## Deploy

`main` → producción en Vercel.
Cualquier otra branch → preview deploy con URL propia.
Trabajar en branches: te deja ver el resultado deployado antes de tocar producción.
