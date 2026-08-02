# DEV_STATE

Estado vivo del proyecto. Claude Code: leé esto al empezar cada sesión.
Actualizalo al cerrar una fase o después de una decisión de arquitectura.

Última actualización: 2026-08-02

---

## Fase actual

**Fase 2 — Refactor a case studies data-driven**

La Fase 1 (home + DeftBoard + tokens) está cerrada y en producción.

---

## Decisiones cerradas — NO reabrir sin preguntar

- **Tailwind v4 con `@theme` en `globals.css`.** No hay `tailwind.config.ts`.
- **Nombres de token semánticos**: `canvas` / `raised` / `card`, `fg` / `fg-muted` /
  `fg-faint`. No volver a `bg-primary` / `text-secondary` del brief viejo.
  El fondo primario se llamó `base` hasta el 2026-08-01. Se renombró a `canvas`
  porque en Tailwind v4 **todo `--color-*` genera también una utility `text-*`**:
  `--color-base` emitía `.text-base{color:#0A0A0B}`, que pisaba el `text-base`
  nativo de font-size. Los 14 párrafos que usan `text-base` se veían bien solo
  porque `.text-fg-muted` ordena después alfabéticamente y ganaba el cascade —
  sin clase de color al lado habría sido texto negro sobre fondo negro.
  **Regla general: no nombrar un token de color igual que un valor de la escala
  de tipografía** (`xs`, `sm`, `base`, `lg`, `xl`, `2xl`…). Los demás tokens
  están chequeados y libres de colisión.
- **Dark mode only.** No es un toggle pendiente, es la decisión.
- **Íconos SVG inline dibujados a mano.** No instalar lucide ni ninguna librería de íconos.
- **Sin dependencias más allá de next / react / framer-motion.** Preguntar antes de agregar.
- **Contenido de case study como data tipada** (`src/content/case-studies/[slug].ts`),
  no como JSX por página. Una sola página genérica los renderiza.
- **Accent por proyecto = `data-accent` + cascada.** El case study pone
  `data-accent="blue"` en su nodo raíz; `globals.css` mapea eso a `--accent` y
  todo descendiente lo consume con `text-(--accent)`, `border-(--accent)/40`, etc.
  Sin prop `accent`, sin hex, sin `hexToRgb`.
  Ojo: **Tailwind v4 poda los tokens de `@theme` que no ve usados.** Las reglas
  `[data-accent="…"]` en `globals.css` son las que mantienen vivos los 6 accents
  en el build — no las borres pensando que son redundantes.
- **Case studies data-driven** (2026-08-02). El contenido es data tipada en
  `src/content/case-studies/[slug].ts`; `src/app/work/[slug]/page.tsx` los
  renderiza a todos. La union `Block` está en `src/types/case-study.ts` y
  `BlockRenderer` tiene un `default: const exhaustive: never = block`, así que
  agregar un miembro sin manejarlo **no compila** (verificado).
  - La lista de bloques es **plana**: un bloque `section` abre una sección y todo
    lo que sigue le pertenece hasta el próximo `section`. `CaseBody` agrupa.
  - El ritmo vertical **no vive en la data**: `CaseBody.spacing()` decide los
    márgenes por tipo de bloque (media consecutiva junta, chips pegados al
    párrafo, el resto un paso completo). No metas márgenes en el content file.
  - Los `*asteriscos*` en `meta.title` marcan el fragmento que va en accent.
    `generateMetadata` los saca para el `<title>`.
  - **La ruta estática de un caso migrado hay que borrarla.** Next le da
    prioridad a la estática sobre `[slug]`, así que `work/deftboard/page.tsx`
    habría ganado silenciosamente. Los stubs siguen vivos por esa misma razón.

---

## Backlog de la fase, en orden

- [x] Agregar los accent tokens faltantes a `@theme`: `teal`, `blue`, `green`,
      `amber`, `red`, `card-hover`. Eliminar los 6 hex hardcodeados.
- [x] Crear `src/types/case-study.ts` con el tipo `CaseStudy` y la union `Block`.
- [x] Bloques de la fase: `section`, `prose`, `decision`, `tradeoff`, `image`,
      `imageGrid`, `metrics`, `quote`, `cardGrid`, `chips`.
      Pendientes para más adelante: `FigmaEmbed`, `LiveDemo`, `CodePeek`, `DemoFrame`.
- [x] `BlockRenderer` con switch exhaustivo.
- [x] Página genérica `src/app/work/[slug]/page.tsx` + `generateStaticParams`.
- [x] Migrar DeftBoard al sistema nuevo (sin cambiar el resultado visual).
- [ ] Extraer Navbar / Footer de `page.tsx` a `src/components/layout/`.
- [ ] Case study: Fluuen.
- [ ] Case study: Countersign.
- [ ] Actualizar las cards de la home a los 3 proyectos reales.

---

## Anti-patterns observados — corregir si aparecen

- **Archivos de página monolíticos.** `work/deftboard/page.tsx` (515) ya no
  existe: es data + una página genérica de 58 líneas. Queda `src/app/page.tsx`
  (499 líneas) con Navbar/Footer/Hero adentro. Objetivo: ninguna página arriba
  de ~150 líneas.
- ~~**Accents como string hex pasados por prop**~~ — resuelto con `data-accent`
  (ver decisiones cerradas). Si reaparece un `accent` como prop, es un regreso.
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

**Falta también**: DeftBoard no tiene URL de Figma ni de Behance en ningún lado
del repo, así que su `links: {}` está vacío y `CaseLinks` no renderiza nada.
Pasame las URLs y aparece la fila de links en el hero.

---

## Deploy

`main` → producción en Vercel.
Cualquier otra branch → preview deploy con URL propia.
Trabajar en branches: te deja ver el resultado deployado antes de tocar producción.
