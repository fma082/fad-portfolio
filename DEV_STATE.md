# DEV_STATE

Estado vivo del proyecto. Claude Code: leé esto al empezar cada sesión.
Actualizalo al cerrar una fase o después de una decisión de arquitectura.

Última actualización: 2026-08-06

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
- **Un artefacto publica el número de su fuente declarada, no el del derivado**
  (2026-08-04). Fluuen tiene dos conteos de tokens del mismo sistema: **848**
  variables COLOR en Figma y **897** custom properties en el `globals.css`
  generado. El Overview publica **848 solo**; el 897 aparece **una vez**, en la
  sección 03, al lado del drift, donde la distancia entre los dos *es* el
  hallazgo. La razón no es de rigor sino de tesis: la case study argumenta que
  cada artefacto declara dónde vive su verdad, y para tokens declaró Figma.
  Publicar el número del derivado se contradice en el propio titular — y el 897
  incluye 85 nombres que Figma ya no tiene.
  `_data/fluuen.ts` lo codifica como `tokens.published` / `tokens.alternate`,
  con la regla en el comentario de cada campo. Si alguna sesión futura "corrige"
  el Overview al número reproducible por grep, eso es el regreso.
- **La case study de Fluuen converge al prototipo aprobado** (2026-08-05).
  `docs/briefs/fluuen-case-study-prototype.html` es la referencia visual; el
  diff completo quedó en `docs/briefs/fluuen-proto-diff.md`. Lo que cambió al
  converger, y por qué importa como regla general:
  - **Prosa sobre bloques.** Las secciones 02 y 03 pasaron de 6 y 12 elementos
    a 3 cada una. `specList` de pasos del pipeline, `decision` y `tradeoff` de
    la 02, `metrics` de 4 números, `decision` del Inspector y `specList` de
    fechas de la 03: todo eso volvió a ser párrafo. Un bloque estructurado que
    dice lo mismo que el párrafo de al lado es peso, no rigor.
  - **Orden.** 04 = nodo → tabla. 06 = embed → imagen. Estaban invertidos.
  - **La imagen de la 05 va al final**, después del párrafo de encuadre, no
    después del intro.
  - `Prose` **no parsea markdown** y eso no se reabrió: el prototipo pone
    Done/Partial/Debt en negrita inline y acá van en texto plano, sostenidos
    por la posición. Si alguna vez hace falta negrita inline es un bloque
    nuevo, no un parser.
- **El token de la 01 es Generic/Active, no Agent/success** (2026-08-05).
  El badge que renderiza el producto dice `label: 'Active'`
  (`components/agents/agent-card.tsx:12`), así que la familia que corresponde es
  **Generic**, cuyo estado se llama `Active`. La familia **Agent** llama
  `success` al estado equivalente. Las dos resuelven al mismo literal, así que
  elegir por hex habría dado una cadena cuyo nombre de estado contradice la
  etiqueta en pantalla.
  Cadena real: `Control/Badge/Status/Generic/Active/Label` → **`icon.success`**
  → `green.500` → `#3fb950`.
  **Dos correcciones sobre lo que circulaba:** no es `success-bg` —el `bg` del
  mismo estado es alpha 20% (`#3fb95033`), así que una cadena encabezada "bg"
  que termina en `#3fb950` no resuelve—; y el semántico **no es
  `status.success`** sino `icon.success`, un token de texto ruteado por el
  namespace de íconos. Guardado en `tokens.openingChain` con su nota.
- **El componente interactivo de la case study es el NODO, no el badge**
  (2026-08-05). `StatusBadgeDemo` se borró y lo reemplazó `NodeDemo`: las tres
  variantes del component set `Node` del Agent Builder, leídas de Figma vía MCP
  (`2494:2865` → `:2814` / `:2831` / `:2848`), guardadas en `tokens.nodeStates`
  y `tokens.nodeStructure`.
  **El set tiene exactamente tres variantes: Default, Selected, Error.** No hay
  hover, running ni disabled. El átomo `Node / Indicator` sí tiene siete kinds
  (incluidos Running y Failed), pero ese es el puntito del header, no el estado
  del nodo. Si alguien pide "el estado hover del nodo", no existe.
  **Error no tiene token de capa de componente**: bindea `border/error`
  (semántico) directo. Es la segunda instancia registrada del mismo patrón que
  `Control/Edge/success`. La nota va en **gris neutro**, no en ámbar: es una
  observación sobre la forma del sistema, no una advertencia. Un campo ámbar
  editorializa un dato que se lee mejor plano.
  `Control/Node/Structure/border-hover` existe en el repo de tokens, resuelve a
  `border.strong` (#2a2a3a) y **no lo usa ninguna variante ni ningún componente**
  — el inverso del caso Error: acá sobra el token y falta el estado.
- **El accent se reserva para el título y los CTAs de demo** (2026-08-06). En el
  hero de Fluuen había cinco cosas violetas compitiendo. Quedaron dos: el título
  y el botón sólido `LIVE DEMO`. Lo que bajó a neutro:
  - Los cuatro números de la barra de stats van `text-fg`. El tamaño y la mono ya
    los hacen lo más fuerte de la fila; el color no agregaba jerarquía, la
    diluía.
  - **Los botones que NO son CTA de demo son grises**: `border-border-strong`
    + `text-fg` (`SECONDARY_BUTTON`). Los usan los del hero y `LinkOut`. El borde
    queda bajo 3:1 contra el canvas a propósito: la etiqueta es `text-fg` a
    fuerza completa y es ella la que porta la afordancia.
  - **Un botón que SÍ es CTA de demo se queda en accent**: `ACCENT_OUTLINE_BUTTON`
    —borde y texto accent a fuerza completa, fondo transparente— outline y no
    relleno, para quedar abajo del sólido del hero en el orden de pedidos de la
    página. Lo usa `section.action`. Medido: 5,88:1 texto y borde contra canvas.
  - El sólido violeta sigue siendo `text-canvas` (ver la entrada de contraste).

  **Las tres variantes viven en `CaseLinks.tsx`** (`BUTTON_BASE` + `PRIMARY` /
  `SECONDARY_BUTTON` / `ACCENT_OUTLINE_BUTTON`) y se importan desde ahí. Si
  aparece un botón nuevo con su propio padding, es un regreso: el tamaño es
  `BUTTON_BASE` y no se re-declara.
- **Los CTAs del builder van al deep-link, no al home del demo** (2026-08-06).
  Vercel analytics mostró que los lectores caían en el home y no llegaban al
  builder, que es la superficie más persuasiva. Los dos CTAs que están al lado de
  evidencia del builder —el de la 02 bajo la captura, el de la 06 bajo el GIF—
  abren `/agents/agent-01/builder` directo. El CTA de la cover y la barra sticky
  siguen al home: ahí el argumento todavía es "esto existe", no "entrá acá".
  El deep-link vive en `_data/links` con id `builder`. **Los cuatro CTAs derivan
  el href de `_data`** — ninguna URL escrita en el content file.
- **El bloque `cta` puede no tener `body`** (2026-08-06). El de la 06 va detrás
  del GIF, que ya hizo el argumento; una oración que lo repita es relleno.
  `body` es opcional y el panel renderiza solo con el botón.
- **Los bloques full-width cortan en la misma vertical que las imágenes**
  (2026-08-06). El panel del `cta` tenía `max-w-3xl` y quedaba corto contra la
  captura de arriba, que se lee como error y no como medida de lectura. La prosa
  conserva su ancho; los paneles no. Verificado midiendo: todos los frames de la
  página (imágenes, GIF, CTAs, nodeDemo, embed) arrancan en 126 y terminan en
  1310 a 1440px de viewport. El `<img>` mide 1px adentro porque su frame tiene
  borde — eso es correcto, no un desalineo.
- **La tabla de divergencias es UNA grilla con filas `subgrid`** (2026-08-06).
  Antes cada fila declaraba sus propios tracks, así que la columna `auto` del
  pill se medía **por fila**: tres anchos de pill distintos movían las dos
  columnas de valores a un x distinto en cada fila. Con `grid-cols-subgrid` +
  `col-span-4` las tres comparten track list y las columnas caen a plomo.
  Dos detalles que van con eso:
  - **El canal del swatch se reserva siempre**, ocupado o no. Con el swatch
    inline, una fila sin swatch arrancaba 22px a la izquierda de las que sí
    tenían, y la ubicación de archivo arrancaba 22px a la izquierda de su propio
    valor. Tres bordes izquierdos distintos en una tabla que existe para comparar
    dos columnas.
  - **Los pills van `justify-self-start`**, no `end`. El track mide exactamente
    lo que el pill más ancho, así que alinearlos por la izquierda los pone a
    todos en una vertical y la tabla igual termina en su borde derecho.
- **Una case study con Figma cierra con el archivo, titulado "The file, as
  it's published"** (2026-08-06). Patrón **compartido** entre Fluuen y Design
  System: la última sección es el embed, y el header dice qué está mirando el
  lector —el artefacto publicado— en vez de nombrar la herramienta que lo
  hospeda. El título viejo era `FIGMA — LIVE FILE`. El link de la derecha sigue
  siendo `OPEN IN FIGMA ↗`.
  El título vive en `FigmaEmbed`, **no** es un prop del bloque: es la regla, no
  una decisión por caso. Si un caso futuro necesita otro header, ahí recién se
  vuelve prop.
- **Un GIF animado se sirve `unoptimized`, y hay que verificarlo en el browser**
  (2026-08-06). El optimizador de `next/image` re-encodea a un frame quieto, así
  que un GIF pasado por `/_next/image` queda **congelado en el frame 1** y se lee
  como una captura mal puesta, no como un bug. `ImageFrame` detecta la extensión
  (`ANIMATED = /\.gif$/i`) y le pasa `unoptimized`, que es el mecanismo
  documentado: mismo `<img>`, mismo width/height, pero el archivo crudo de `src`.
  No hace falta un `<img>` pelado ni desactivar la regla de eslint.
  `imageSize()` ahora también lee el header GIF (**little-endian**, a diferencia
  de PNG y JPEG) — sin eso el frame caía al fallback 16:9 y el reserve de altura
  quedaba mal.
  **Cómo se verifica que anima** (no alcanza con mirar el `<img>` en el HTML):
  1. el `src` servido apunta al `.gif` crudo, sin `/_next/image`;
  2. los bytes servidos son idénticos al archivo y conservan sus GCEs y el
     `NETSCAPE2.0` del loop;
  3. tres capturas en tiempo real, recortadas al elemento, dan tres frames
     distintos. Los pasos 1 y 2 los pasa igual un GIF de un solo frame; el 3 es
     el que decide.
- **Los hex de un componente interactivo salen de `_data`, o no van**
  (2026-08-04). `StatusBadgeDemo` es el único bloque cliente de una case study y
  pinta con colores reales: los 5 estados del Agent badge resueltos desde
  `tokens-source.json` (`Control.Badge.Status.Agent.<estado>-<prop>`), guardados
  en `tokens.badgeStates`. Ningún color se escribe en el componente.
  **Ojo con el hex de green.500: es `#3fb950`, no `#639922`.** Ese segundo valor
  circuló en un prompt y no existe en ningún lado del sistema. La forma de la
  cadena (`status.success → green.500`) sí era correcta.
  Tres de los cinco estados se salen de la forma que comparten los otros dos:
  `paused` cae en `yellow.300` en vez de un paso 500, `error` resuelve por
  `text.error-light` en vez de `status.error` y usa alpha 10% donde el resto usa
  20%, y `draft` no tiene semántico de status —usa surface/border/text neutros—
  porque un borrador no tiene condición que reportar. Cada desvío está anotado en
  su propio estado, no emparejado.
- **Un `tokenChain` = UNA cadena, no cuatro** (2026-08-04). La primera versión
  renderizaba 4 cadenas con paths crudos de Figma (`Components/Mode 1.🎨
  colors.Control.…`) y era ilegible. Ahora es un diagrama de 4 cajas
  —COMPONENT → SEMANTIC → PRIMITIVE → VALUE— con nombres en la forma legible que
  emite el CSS, no el path del que se aplanaron. Cuatro cajas se leen como
  argumento; cuatro cadenas se leen como volcado de datos.
  En mobile la fila se apila y la flecha rota 90°.
- **`cover` va fuera de `blocks`** (2026-08-04). `CaseBody` agrupa por sección y
  **descarta todo bloque anterior al primer `section`** — una imagen "antes de la
  00" dentro de `blocks` no renderiza nunca, en silencio. Por eso `CaseStudy`
  tiene un campo `cover` opcional que dibuja `page.tsx` entre el hero y el body.
  Si hace falta otro bloque pre-sección, ese es el patrón.
- **Botón sólido = relleno accent + texto `canvas`** (2026-08-04). `CaseLinks`
  le da jerarquía a los CTAs: el primero presente en `ORDER` va sólido, el resto
  outline. Medido contra los **seis** accents, no solo violet, porque el
  componente es compartido:

  | | borde sobre canvas | `canvas` sobre relleno | `#FFF` sobre relleno |
  |---|---|---|---|
  | peor caso | 4.76:1 (blue) | 4.76:1 (blue) | 4.16:1 (blue) |
  | mínimo AA | 3:1 ✅ | 4.5:1 ✅ | 4.5:1 ❌ |

  **El texto blanco falla en los seis.** Es la elección instintiva y es la
  incorrecta: los accents son claros sobre un canvas casi negro, así que el
  contraste lo da el texto oscuro. Si aparece un botón sólido nuevo, `text-canvas`,
  no `text-fg` (2.88:1 sobre violet) ni blanco.
  El borde accent a fuerza completa pasa 3:1 con margen — no hace falta aclararlo
  ni engrosarlo. Ojo: bajarlo a `/40` o `/50` reduce el contraste y lo puede tirar
  abajo del mínimo.
- **Un link inline es un bloque, no un parser** (2026-08-04). `Prose` no parsea
  markdown y esa decisión no se reabre. Cuando la 02 de Fluuen necesitó linkear
  el repo de tokens en contexto, salió `linkOut` — href + label + una línea de
  body. Misma regla que ya estaba escrita para inline code.
- **Los `codePeek` se topean en 6 líneas** (2026-08-04). Un snippet que necesita
  más para entenderse es un argumento, y un argumento va en prosa. Los tres de
  Fluuen quedaron en 6/5/5 y son **extractos** de su rango: `lines` es más ancho
  que el código mostrado, a propósito. La primera versión citaba funciones
  enteras y el párrafo de abajo decía lo mismo mejor.
  Ojo: `scripts/sync-tokens.mjs` tiene los comentarios **en español**. Los
  snippets los muestran traducidos, marcado por snippet con
  `commentsTranslated`. **No es un error de transcripción** — el repo de Fluuen
  es de solo lectura y no se tocó.
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
- [x] Case study: Fluuen (`/work/fluuen`) — 2026-08-04. Quedan dos
      `TODO: copy needed` (ver abajo).
- [x] Bloques de sistema (2026-08-04): `tokenChain`, `codePeek`,
      `divergenceTable`. `CodePeek` estaba en la lista de pendientes de arriba.
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
| Fluuen        | ✅            | ✅    | 🔒   | ✅   |
| Countersign   | ❌            | —     | ✅   | ✅   |
| Design System | ❌            | ✅    | —    | —    |

Los briefs van en `docs/briefs/[proyecto].md`.

🔒 **El repo del producto de Fluuen (`fma082/fluuen`) es privado** — confirmado
2026-08-04, la API de GitHub devuelve 404 sin credenciales. La case study no lo
linkea. Lo que sí es público y sí se linkea es `fma082/fluuen-tokens`, la fuente
del pipeline. Por eso `CaseLinks` tiene una key `tokens` aparte de `github`: el
botón decía "Repository" apuntando al repo de tokens, y eso se lee como el repo
del producto en una case study que declara que ese repo es privado.

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

~~Fluuen linkea al **Storybook**~~ — desde el 2026-08-04 la card apunta a
`/work/fluuen` (`{ kind: "case", slug: "fluuen" }`). El link pelado al Storybook
era el mejor destino mientras no hubiera case study; ahora la case study linkea
los artefactos y además los encuadra, que es lo que el link solo no podía hacer.

**El hero de Fluuen lleva tres CTAs, no cuatro**: Live demo (sólido) · Figma
file · Storybook. El repo de tokens salió del hero — es el menos accionable para
un visitante y un cuarto botón diluye los otros tres. Vive en la sección 02 como
`linkOut`, al lado del pipeline del que es la fuente.
Countersign va **sin link a propósito**: el demo comparte estado entre visitantes
y `/scenario` no avisa que los datos son ficticios. Alguien que cae ahí sin
contexto puede encontrarlo ya destruido por otro. Desde una case study se
encuadra con una línea de copy; desde la home, no.

### Capa de conversión en `/work/fluuen` (2026-08-05)

Decisiones cerradas sobre los CTAs, ya aplicadas:

- Los inline son **caja tintada** (fondo accent 6%, borde accent 20%, radio 12)
  con **botón sólido**, no links subrayados. Interrumpen la columna de lectura a
  propósito, justo después de la evidencia que los gana.
- El sticky **no es cerrable**. Es el CTA principal y un CTA que el lector puede
  borrar deja de convertir apenas molesta un poco.
- El sticky **sí espera el scroll** (~600px): antes de eso el botón "Live demo"
  del hero está en pantalla y una segunda copia del mismo link es ruido.
- El botón sólido lleva `text-canvas`. Blanco falla 4.5:1 contra los seis
  accents (ver la entrada de contraste más arriba).
- La compensación de layout vive en `globals.css` como
  `body:has([data-sticky-cta]) { padding-bottom: 3.5rem }` — una página sin
  barra no paga nada.


Tres CTAs al demo, todos derivando el href de `links` en `_data`:

- `cta` inline después de la 00 — "This is a real, navigable product."
- `cta` inline después del Workflow Builder — "Build an agent yourself in the demo."
- `stickyCta`, barra fija abajo — "Fluuen — a shipped AI automation product"

El bloque `cta` **no es un botón**: va dentro de la columna de lectura, justo
después de la evidencia que lo gana, para que se lea como la oración siguiente y
no como una publicidad interrumpiendo una.

`stickyCta` vive en `CaseStudy`, **fuera de `blocks`** — es chrome de página, no
un paso del argumento. Mismo patrón que `cover`. Aparece recién pasados 600px de
scroll (antes está el botón del hero en pantalla y una segunda copia es ruido) y
**se puede cerrar**: una barra que no se cierra es lo único que la gente recuerda
de una página.

### Capturas de producto en `/work/fluuen` (2026-08-04, revisado 2026-08-06)

| Archivo | Dónde | Por qué ahí |
|---|---|---|
| `Dashboard.png` | `cover`, entre hero y 00 | Ancla: prueba que existe antes del primer argumento |
| `Workflow Builder.png` | cierre de la 02 | Rompe el muro de texto antes de la sección más densa |
| `Agents.png` | 05 · What's true | Los estados de fallo están diseñados, no omitidos |
| `builder-run.gif` | 06 · Live, antes del embed | El builder corriendo: 45 frames, 246 KB, 1100×663 |

`Integrations.png` y `Run Detail.png` **están en la carpeta y sin colocar** — no
las borres. `Run Detail.png` estaba en la 06 y salió el 2026-08-06: con el GIF
corriendo arriba, un timeline quieto de una corrida terminada es la misma
ejecución contada dos veces. Si vuelve, va a otra sección, no debajo del GIF.

**La 06 son cuatro elementos** (revisado 2026-08-06): título + CTA, GIF,
subtítulo, embed. Ese orden es el argumento —primero el producto corriendo,
después el archivo del que salió— y el embed arranca en Cover.

- **Un solo CTA al builder por sección.** El `cta` de caja tintada que estaba
  debajo del GIF salió: el link al builder vive ahora en la línea del título.
  Dos CTAs al mismo destino en una sección se anulan.
- **`section.action`** (nuevo, 2026-08-06): un botón opcional en la línea del
  título, empujado al borde del contenido — cae en la misma vertical que el
  borde derecho de los frames de abajo, y centrado contra el `h2`.
  Nació como link mono de 10px en accent y **no funcionó**: contra un título
  serif de 36px no tenía peso y se perdía en el canvas. Ahora es
  `ACCENT_OUTLINE_BUTTON` al tamaño de los secundarios del hero (38px de alto,
  mono 12px) — ×3,9 de área contra la versión link. Outline y no relleno para no
  competir con el título ni con el sólido del hero.
  Por esto `SectionIntro` ya **no** es `max-w-3xl` en su raíz: la fila del
  título es ancho completo y el `max-w-3xl` pasó al `h2` y al cuerpo.
- **`subhead`** (nuevo, 2026-08-06): un `h3` serif un escalón abajo del título
  de sección (30px contra 36px), para una sección que presenta dos artefactos y
  necesita nombrar el segundo. No abre sección ni lleva número: un bloque
  `section` habría abierto un grupo nuevo en `CaseBody`.
  `CaseBody.spacing()` le da `mt-6` a lo que sigue a un `subhead` — un título
  pertenece a lo que viene abajo, no a lo que quedó arriba.

Las dimensiones salen del header del PNG vía `imageSize()` en build time; no hay
ratio escrito en ningún content file. Los nombres con espacio van por
`encodeURIComponent`, igual que en `design-system.ts`.

### Pendiente en `/work/fluuen`

Dos `TODO: copy needed`, los dos de argumento, no de dato:

- **01 · Where truth lives** — por qué el borde "las pantallas viven solo en
  código" es decisión de sistema y no excusa por no haberlas dibujado. El hecho
  y la fecha están en `_data` (divergencia 8).
- **03 · What the pipeline didn't guarantee** — el cierre de la sección. Todo lo
  de arriba es el hallazgo; falta de qué es evidencia. Facundo lo escribe.

**El stat "49 component sets" del brief original no existe para Fluuen** — 49 es
`componentSets.length` del Design System, se arrastró de esa case study. No hay
conteo verificado de component sets de Fluuen en ningún lado. La barra quedó
`848 color tokens · 3 layers · 121 divergences · 6 pipeline steps`, todo derivado
de `_data`. Si aparece un conteo real, ese es el lugar donde entra.

**Nada del `CLAUDE.md` de mayo de Fluuen entró** — ni Zustand por dominio, ni
`runAgent.ts`, ni banner de demo mode, ni reset, ni onboarding, ni mobile
fallback. Ese documento se escribió antes de que existiera el producto y nunca
se reconcilió. La columna de deuda abierta de la sección 05 son las cuatro cosas
verificadas, no la lista de features que no se construyeron.

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
