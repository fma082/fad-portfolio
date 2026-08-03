# DEV_STATE

Estado vivo del proyecto. Claude Code: leé esto al empezar cada sesión.
Actualizalo al cerrar una fase o después de una decisión de arquitectura.

Última actualización: 2026-08-03

---

## Fase actual

**Fase 2 — Refactor a case studies data-driven**

La Fase 1 (home + primer case study + tokens) está cerrada y en producción.

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
    prioridad a la estática sobre `[slug]`, así que la página estática del caso
    migrado habría ganado silenciosamente. Los stubs siguen vivos por esa razón.
  - Al revés: sacar un caso del array de `index.ts` **alcanza** para que su ruta
    desaparezca, porque el slug sale de `generateStaticParams`. Así se retiró
    `/work/deftboard` — no había ruta estática que borrar.
- **Datos de Figma como data extraída, no como capturas** (2026-08-03).
  `src/content/case-studies/_data/design-system.ts` tiene el volcado tipado del
  archivo de Figma (10 rampas, 73 text styles, 49 component sets, 817 variants,
  558 íconos). El content file **deriva** las tablas de ahí — ningún número se
  reescribe a mano. Si el archivo de Figma cambia, se regenera `_data/` y las
  tablas siguen.
  - **Los nombres de token van verbatim**, typos incluidos (`Succes`,
    `Alert / Danger/ 100 ` con espacios). El archivo está publicado con 1.6k
    usos: la tabla tiene que coincidir con lo que la gente se descarga.
    `TokenTable` por eso **no trunca** nombres, los deja envolver.
  - **El orden del inventario vive en el content file, no en el componente.**
    `ComponentInventory` renderiza `sets` en el orden del array. `design-system.ts`
    lo ordena por cantidad de variants descendente. Así otro caso puede agrupar
    por página sin tocar el componente.
  - `FigmaEmbed` es el único bloque `"use client"`: monta el iframe recién
    cuando entra al viewport (IntersectionObserver, `rootMargin: 200px`).
    El placeholder reserva la misma altura para que no salte el layout.
  - **Cuidado con `first:` cuando el contenedor tiene header.** En
    `ComponentInventory` la fila de headers es el primer hijo, así que
    `first:border-t-0` no matcheaba la fila 0 y daba línea doble. Se resuelve
    por índice, no por pseudo-clase.
  - `CaseHero` pasó de `md:grid-cols-4` a `md:grid-cols-[repeat(auto-fit,…)]`
    en la barra de stats, para que 4 o 5 stats entren igual en una fila.

---

## Backlog de la fase, en orden

- [x] Agregar los accent tokens faltantes a `@theme`: `teal`, `blue`, `green`,
      `amber`, `red`, `card-hover`. Eliminar los 6 hex hardcodeados.
- [x] Crear `src/types/case-study.ts` con el tipo `CaseStudy` y la union `Block`.
- [x] Bloques de la fase: `section`, `prose`, `decision`, `tradeoff`, `image`,
      `imageGrid`, `metrics`, `quote`, `cardGrid`, `chips`.
- [x] Bloques de spec (2026-08-03): `tokenTable`, `componentInventory`,
      `variantMatrix`, `specList`, `figmaEmbed`.
      Pendientes para más adelante: `LiveDemo`, `CodePeek`, `DemoFrame`.
- [x] `BlockRenderer` con switch exhaustivo.
- [x] Página genérica `src/app/work/[slug]/page.tsx` + `generateStaticParams`.
- [x] Extraer los datos reales del Figma del Design System a `_data/`.
- [x] Case study: Design System (`/work/design-system`).
- [x] Cerrar el solapamiento `deftboard` / `design-system` (2026-08-03).
- [x] Extraer Navbar / Footer de `page.tsx` a `src/components/layout/` (2026-08-03).
- [x] Actualizar las cards de la home a los 3 proyectos reales (2026-08-03).
- [ ] Case study: Fluuen.
- [ ] Case study: Countersign.

---

## Anti-patterns observados — corregir si aparecen

- **Archivos de página monolíticos.** `src/app/page.tsx` **creció**: 510 → 464 al
  sacar Navbar y Footer, y 464 → 529 al agregarle a `ProjectCard` los tres
  estados de link. Sacar dos componentes chicos no compensa meter lógica nueva.
  Lo que queda adentro son las cinco secciones de la home (Hero, WhatIDo,
  ProofOfWork, About, Contact) más `ProjectCard` y su data. **`ProjectCard` es el
  próximo a extraer** — ya no es markup, tiene ramas.
- ~~**Accents como string hex pasados por prop**~~ — resuelto con `data-accent`
  (ver decisiones cerradas). Si reaparece un `accent` como prop, es un regreso.
- ~~**Rutas legacy**~~ — los tres stubs (`next-agent`, `bloyal`, `ai-patterns`)
  se borraron el 2026-08-03. `src/app/work/` tiene solo `[slug]` y `layout.tsx`.
  Si aparece una ruta estática nueva bajo `work/`, es un regreso: le gana a
  `[slug]` silenciosamente.

---

## Contenido pendiente (bloquea las case studies)

Claude Code no puede inventar esto. Si falta, dejar `{/* TODO: copy needed */}`.

| Proyecto      | Brief escrito | Figma | Repo | Demo |
| ------------- | ------------- | ----- | ---- | ---- |
| Fluuen        | ❌            | ✅    | ✅   | ✅   |
| Countersign   | ❌            | —     | ✅   | ✅   |
| Design System | ❌            | ✅    | —    | —    |

Los briefs van en `docs/briefs/[proyecto].md`.

### Fork cerrado: `deftboard` → `design-system` (2026-08-03)

Eran **el mismo proyecto**: el mismo archivo de Figma, documentado con capturas
en un caso y con data extraída en el otro. Quedó `design-system`.

Lo que se hizo: se borró `deftboard.ts` y salió del index; la card de la home
pasó a apuntar a `/work/design-system` con el año corregido a 2021; se
renombró `public/images/projects/deftboard/` → `design-system/` y se borraron
las 14 capturas de documentación (~3,1 MB). Sobrevive `15 - Screen.png`.

**El copy narrativo escrito a mano está en `docs/briefs/design-system-copy.md`**,
con la sección de la que salía cada fragmento — incluido el párrafo que conecta
el proyecto con bLoyal, que era el único enlace entre el trabajo personal y el
de producción en todo el repo. No quedó solo en el historial de git.

### Encuadre de la case study (2026-08-03)

**No es una case study de craft de sistemas.** El archivo es de 2021, hecho
mientras aprendía Figma, con Atomic Design como único método conocido. El eje
narrativo es que se usó: cinco años en circulación, 3.131 guardados, 1.6k usos.
Si volvés a escribir copy para este caso, ese es el marco — no "mirá qué bien
construido está".

`docs/briefs/design-system-gaps.md` tiene el análisis técnico completo detrás de
la sección "What I'd do differently", clasificado en tres categorías:
limitaciones de Figma en 2021 (no son errores), decisiones que hoy se harían
distinto, y deuda sin terminar. Cada hallazgo con su ubicación exacta. También
lista al final las ocho cosas que **no** se pudieron determinar — no las afirmes
sin verificar.

**Orden de secciones** (00→08): Overview · Foundations · Five years in
circulation · What I'd do differently · Components · Modeling the Sidebar ·
Inside the library · The system in use · The archive. Uso y retrospectiva van
**antes** del inventario técnico: es lo que sostiene el encuadre nuevo.
La 06 se llamaba "Craft in the matrix" y se renombró: decía "craft" justo donde
la case study argumenta que no se trata de eso.

### Cards de la home (2026-08-03)

Tres proyectos: **Fluuen** (destacada, violet) · **Countersign** (teal) ·
**Dashboard Design System** (blue). `next-agent` era Fluuen con el nombre viejo,
no un proyecto aparte. `bloyal` salió del portfolio (era trabajo con NDA) y
`ai-patterns` no va como case study propia: ese research se absorbe como
sección 01 de Countersign.

**El destino de cada card es una union discriminada**, no un slug suelto:

```ts
type ProjectLink =
  | { kind: "case"; slug: string }        // → /work/[slug]
  | { kind: "external"; href; label }     // artefacto en vivo
  | { kind: "none"; label }               // <article>, no clickeable
```

Por qué no hay stubs "Coming soon": `generateStaticParams` deriva las rutas de
`caseStudySlugs`, así que un slug sin content file es **404 duro**, no un
placeholder. Y crear una ruta estática para taparlo es el anti-pattern de arriba.
La card sin link pierde el `hover:-translate-y-0.5` y el CTA va en `text-fg-faint`
— sin afordancia de click no hay frustración.

Fluuen linkea al **Storybook**, no al demo: los tokens salen parseados del build
de producción, así que la documentación no puede driftear. Esa es la tesis del
proyecto; el producto es secundario a ella.
Countersign va **sin link a propósito**: el demo comparte estado entre visitantes
y `/scenario` no avisa que los datos son ficticios. Alguien que cae ahí sin
contexto puede encontrarlo ya destruido por otro. Desde una case study se
encuadra con una línea de copy; desde la home, no.

### Pendiente en `/work/design-system`

- **Las 4 pantallas ya están** en `public/images/projects/design-system/`.
  El sheet compuesto `15 - Screen.png` se borró.
- **Copy narrativo de `Modeling the Sidebar`** (hoy sección 05): faltan el
  `decision` y el `tradeoff`. Están marcados con `TODO: copy needed`.
- **Los tres hallazgos de la sección 03 son `tradeoff`, no `prose`.** El campo
  ámbar es el registro correcto para "esto me costó" y el título evita que los
  tres párrafos se lean como un bloque continuo. Ojo: en dos de los tres, el
  título repite la primera oración del body — está así a propósito hasta que
  Facundo decida si recorta.
- **`Prose` no parsea markdown.** No le metas backticks ni asteriscos al copy:
  renderizan literales. Si algún día hace falta inline code, es un bloque nuevo,
  no un parser.

Las capturas viejas se recuperan con
`git show HEAD~1:"public/images/projects/deftboard/06 - Buttons.png" > out.png`
si alguna vez hacen falta.

---

## Deploy

`main` → producción en Vercel.
Cualquier otra branch → preview deploy con URL propia.
Trabajar en branches: te deja ver el resultado deployado antes de tocar producción.
