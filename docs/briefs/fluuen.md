# Fluuen — Project Brief

> Documento derivado del código real del repo (branch `feature/storybook`) para
> alimentar una case study de portfolio. Todo lo que sigue sale de archivos
> verificados. Donde algo no se puede confirmar desde el código, está marcado
> explícitamente como **[No verificable en código]** o **[Discrepancia]**.

---

## 1. Qué es

Fluuen es una **plataforma B2B no-code de automatización con AI** presentada como
**demo navegable de portfolio**. La tesis, tomada de los metadatos y el copy del
producto (`app/layout.tsx:19`, landing), es *"AI Agents That Act, Not Just
Suggest"*: agentes que ejecutan acciones reales en herramientas conectadas con
transparencia total, en vez de solo sugerir.

Inferido del routing y los componentes, el producto tiene tres superficies:

- **Landing pública** (`/`) — hero, how-it-works, features, demo preview,
  templates, pricing, footer. Es marketing, no la app.
- **App autenticada** (grupo `(app)`) — dashboard con métricas, listado de
  agentes, historial de runs con timeline animado, integraciones, settings.
- **Agent Builder** (grupo `(canvas)`) — editor de flujos node-based full-screen
  sobre React Flow (`@xyflow/react`), la pantalla central del producto.

**No es un producto real con backend.** Toda la data sale de módulos seed
estáticos en `lib/seed/` y las "ejecuciones" se simulan en cliente con
`setTimeout`. No hay auth real, DB ni API — es un prototipo de alta fidelidad.

**[Nota]** El `README.md` es el default de `create-next-app` (no describe
Fluuen). La identidad del proyecto se infiere de `app/layout.tsx`, `CLAUDE.md`,
el routing y los componentes, no del README.

---

## 2. Stack real (desde `package.json`)

### Core
- **Next.js 16.2.6** (App Router, Turbopack default) — `CLAUDE.md` lo marca como
  versión con breaking changes; las APIs async (`await params`, `await
  searchParams`) se usan de verdad (ej. `app/(app)/settings/page.tsx`).
- **React 19.2.4 / React DOM 19.2.4**
- **TypeScript 5** (estricto; `CLAUDE.md` prohíbe `any`)
- **Tailwind CSS v4** (`@tailwindcss/postcss`) — configuración vía CSS, sin
  `tailwind.config`. `components.json` tiene `tailwind.config: ""`.
- **shadcn 4.7** sobre **radix-ui 1.4.3** — capa de primitivas en `components/ui/`

### Librerías de dominio / UX
- **`@xyflow/react` 12.10** (React Flow) — canvas del Agent Builder
- **`gsap` 3.15** — animación (usada en landing / hero)
- **`zustand` 5** con middleware `persist` — estado cliente (solo 2 stores, ver §3)
- **`cmdk` 1.1** — command palette (⌘K)
- **`lucide-react` 1.16** — íconos
- **`class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`** — utilidades de estilo
- **`@vercel/analytics`** — tracking (montado en `app/layout.tsx:46`)
- **Geist / Geist Mono** vía `next/font/google` (`app/layout.tsx`)

### Tooling / dev
- **Storybook 10.5** + `@storybook/nextjs-vite`, addons `a11y`, `docs`, `vitest`,
  `mcp`, `@chromatic-com/storybook`
- **Vitest 4** + **Playwright** (browser testing vía `@vitest/browser-playwright`)
- **ESLint 9** + `eslint-config-next` + `eslint-plugin-storybook`
- **Vite 8**

**[Observación]** Hay infra de testing instalada (vitest, playwright, coverage)
pero **no encontré archivos de test propios** (`*.test.*` / `*.spec.*`) fuera de
las `*.stories.tsx`. El addon-vitest corre las stories como tests.

---

## 3. Arquitectura

### Route groups (App Router)
El código separa tres layouts por grupo, cada uno con su chrome:

```
app/
├── layout.tsx            → root: fonts Geist, dark, TooltipProvider, Analytics, metadata/OG
├── page.tsx              → landing (compone 7 secciones de components/landing)
├── icon.tsx / apple-icon.tsx / opengraph-image.tsx  → assets generados por código
├── (app)/                → app autenticada
│   ├── layout.tsx        → <AppShell> (Sidebar + Topbar + CommandPalette) + DashboardTracker
│   └── dashboard, agents, agents/new, agents/[id], integrations, notifications, runs, runs/[id], settings
├── (auth)/               → signin / signup
│   └── layout.tsx        → panel de marca + form
└── (canvas)/             → builder full-screen
    └── layout.tsx        → contenedor h-screen sin sidebar (chrome propio del builder)
```

### Capas de código
- **`components/ui/`** — primitivas shadcn (button, dialog, select, tabs, popover,
  command, sheet, etc.). ~30 archivos.
- **`components/ds/`** — Fluuen DS construido sobre shadcn: `app-shell`, `sidebar`,
  `topbar`, `stat-card`, `empty-state`, `notifications-popover`, `user-footer`.
- **`components/<dominio>/`** — features por pantalla: `landing/`, `dashboard/`,
  `agents/` (+ `wizard/`), `builder/` (+ `fields/`), `runs/`, `integrations/`,
  `settings/`, `command-palette/`, `analytics/`.
- **`lib/seed/`** — 13 módulos de datos mock (la "base de datos" del demo).
- **`lib/stores/`** — Zustand: `ui-store` (sidebar mode + palette) y
  `notifications-store`. Ambos con `persist` y keys `fluuen:*`.
- **`lib/simulation/`, `lib/utils/`** — **vacíos salvo `.gitkeep`**.
- **`lib/builder/use-builder-history.ts`** — undo/redo del canvas.
- **`lib/command-palette/actions.ts`, `lib/hooks/`, `lib/analytics.ts`** — utilidades.

### Patrón de datos (verificado)
Las páginas son **Server Components** que importan seeds estáticos directo y se
los pasan a un client component que maneja interactividad/simulación. Ejemplos:
`app/(app)/agents/page.tsx` importa `AGENTS`; `runs/[id]/page.tsx` importa
`RUNS_HISTORY` + `getRunSteps` y renderiza `<RunDetailClient>`.

**[Discrepancia con `CLAUDE.md`]** El `CLAUDE.md` describe una arquitectura de
demo donde *todos* los stores son Zustand+persist con seed cargado al primer
mount, y una función central `lib/simulation/runAgent.ts`. En el código real:
- Solo existen **2 stores** (ui, notifications), no uno por dominio.
- **`lib/simulation/runAgent.ts` no existe** (la carpeta solo tiene `.gitkeep`).
- La simulación de runs vive **inline** en los componentes vía `setTimeout`
  (ver §6, snippet de `run-steps-timeline.tsx` y `builder-workspace.tsx`).
- La data no se hidrata en localStorage: se sirve desde módulos importados.

Esto no es necesariamente un defecto — es el estado real vs. la intención
documentada. **Vale confirmarlo con Facundo** (ver §Preguntas).

---

## 4. Sistema de diseño (Fluuen DS)

Este es el corazón del proyecto y donde vive la historia más fuerte para la case
study. Hay una **arquitectura de tokens de 3 capas** real y automatizada.

### Pipeline de tokens (verificado en `scripts/sync-tokens.mjs` + `TOKENS.md`)
```
Figma DS (Tokens Studio plugin, file MOhVXH1k1Aa5tbQJM8QDRF)
  ↓ push manual
github.com/fma082/fluuen-tokens  (tokens/tokens.json)
  ↓ npm run tokens:sync   (scripts/sync-tokens.mjs)
app/globals.css  → bloque @theme entre marcadores GENERATED
  ↓ Tailwind v4
clases utilitarias / var(--color-*) en componentes
```

El script (`sync-tokens.mjs`) hace 6 pasos: descarga el JSON de GitHub, **aplana**
la jerarquía de Figma a paths, **resuelve referencias/alias** entre tokens (hasta
10 niveles de profundidad), mapea cada path a un nombre CSS válido con
**deduplicación de segmentos redundantes**, agrupa y escribe el bloque. Al
reescribir, **preserva el CSS manual** y solo reemplaza entre los marcadores
`GENERATED` (`globals.css:3` a `:942`), y además borra duplicados manuales que
colisionen con lo generado (`removeManualDuplicates`).

### Las 3 capas (nombradas en `stories/foundations.mdx`)
**primitives → semantics → component tokens**
- **Primitivas** — rampas crudas: `RIVER`, `GRAPHITE`, `NEUTRAL`, `BLUE`, `GREEN`,
  `RED`, `YELLOW`, `ORANGE`, `PURPLE` (+ variantes `-alpha-*`).
- **Semánticas** — lo que los componentes deben usar: `SURFACE`, `TEXT`, `BORDER`,
  `BRAND`, `STATUS`.
- **Component tokens** — namespaces por componente: `CONTROL` (inputs, badges,
  toggles…), `ALERT`, `TOAST`, `ICON`. Ej. real: `StatusBadge` consume
  `--color-control-badge-status-run-success-bg` (`components/runs/status-badge.tsx:14`).

### Cobertura (números con su fuente exacta)
- **897 tokens `--color-*`** en el bloque generado de `globals.css` (conteo directo).
  Storybook cita 897; el Overview de Figma cita 848 — **[Discrepancia menor]** por
  el momento del sync/scope; el número de verdad hoy es **897**.
- **18 grupos** en el bloque generado: ALERT, BLUE, BORDER, BRAND, CONTROL,
  GRAPHITE, GREEN, ICON, NEUTRAL, ORANGE, PURPLE, RED, RIVER, STATUS, SURFACE,
  TEXT, TOAST, YELLOW.
- **36 tokens `--color-*` manuales** adicionales (bloque hand-authored abajo del
  generado): compat shadcn, node colors del builder, y overrides de a11y.
- **Solo color se sincroniza.** Tipografía, spacing, radius, shadow son
  **manuales** (declarado en `TOKENS.md` §Coverage y visible en `globals.css`:
  `--radius-*`, `--font-*`).
- **Dark-only** ("River Styx"): una sola colección "Mode 1", sin light mode
  (decisión documentada en `FLUUEN_DEV_STATE.md`).

### Detalle notable de arquitectura: tokens de a11y que sobreviven al sync
El bloque manual incluye tokens hand-authored **fuera** del bloque generado
precisamente para que un `tokens:sync` no los pise (ej. `--color-brand-solid`
para CTAs que pasan AA 4.5:1, mientras `brand-primary` queda como accent/glow).
Ver snippet §6.2.

### Componentes del DS (en código)
- **Primitivas shadcn** (`components/ui/`): badge, button, card, checkbox, command,
  dialog, dropdown-menu, global-toast, input, label, popover, scroll-area, select,
  separator, sheet, skeleton, switch, tabs, tooltip.
- **DS Fluuen** (`components/ds/`): app-shell, sidebar (+ sidebar-item), topbar,
  stat-card, empty-state, notifications-popover, user-footer.
- **Con story documentada** (19 `*.stories.tsx`): button, badge, checkbox, input,
  select, skeleton, switch, tabs, tooltip (ui) + sidebar, topbar, stat-card,
  empty-state, notifications-popover (ds) + agent-card, integration-card,
  run-step-card, runs-table, status-badge (producto).

### Repetición / patrones que se repiten
- **`status` como lenguaje único**: el mismo vocabulario de estados
  (success/running/failed/…) aparece en runs, nodes del builder y badges, siempre
  vía tokens `status-*` / `control-badge-status-*`. Es el patrón más reusado.
- **Config fields del builder** (`components/builder/fields/`): text, textarea-vars,
  select, toggle — set de campos reusable para el inspector.
- **Íconos por estado/tipo**: mapas `Record<type, cfg>` con var() de token
  (patrón en `status-badge.tsx`, node colors).
- **[Deuda de reuso conocida]** `integrations-page-client.tsx:3` marca que
  `<FilterPills>` + `<SearchBar>` deberían extraerse como componentes DS
  compartidos (aún inline).

---

## 5. Pantallas / rutas

| Ruta | Grupo | Qué hace | Estado |
|------|-------|----------|--------|
| `/` | root | Landing pública: hero + how-it-works + features + demo preview + templates + pricing + footer | Completa |
| `/signin` · `/signup` | auth | Form de auth (`AuthForm` con `mode`) + panel de marca | UI completa, sin auth real |
| `/dashboard` | app | Overview: métricas, runs chart, agent status, recent runs, top agents, integrations, quick actions. Boot skeleton vía `?boot=1` | Completa |
| `/agents` | app | Grid de agentes desde seed (`AGENTS`), header con activos/total, CTA New agent | Completa |
| `/agents/new` | app | Wizard 4 pasos (Configure → Trigger → Actions → Review) + success screen | Funciona en cliente; **`handleCreate` solo hace `console.log`**, no persiste |
| `/agents/[id]` | app | **Redirect** a `/agents/[id]/builder` | Stub intencional |
| `/agents/[id]/builder` | canvas | **Agent Builder**: canvas React Flow, catálogo de nodos, inspector, topbar, run simulado, undo/redo, share/publish dialogs | Pantalla estrella, completa |
| `/runs` | app | Tabla de historial (`RUNS_HISTORY`) + total del día | Completa |
| `/runs/[id]` | app | Run detail con timeline de steps **animado** (simulación por `setTimeout`) | Completa |
| `/integrations` | app | Grid de integraciones con dialogs connect/manage/reconnect | Completa |
| `/notifications` | app | **Solo empty state**: "Full notifications page coming in a future sprint" | **Stub explícito** |
| `/settings` | app | Tabs: profile, workspace, notifications, billing, api-keys, danger-zone (tab inicial vía `?tab=`) | Completa (UI) |

Metadata routes generadas por código: `app/icon.tsx`, `apple-icon.tsx`,
`opengraph-image.tsx` (favicon + OG image programáticos).

---

## 6. Snippets que muestran decisiones de sistema

### 6.1 — Aplanado Figma → CSS var con deduplicación de segmentos
`scripts/sync-tokens.mjs:181-196`

```js
// Colapsar segmentos redundantes consecutivos:
//   1. Idénticos: status.success.success → status-success
//   2. El siguiente empieza con prev+'-': success.success-light → success-light
const deduped = [];
for (const seg of cleanSegments) {
  if (deduped.length === 0) { deduped.push(seg); continue; }
  const prev = deduped[deduped.length - 1];
  if (seg === prev) continue;                        // drop exact duplicate
  if (seg.startsWith(prev + '-')) {
    deduped.push(seg.slice(prev.length + 1));        // strip redundant prefix
  } else {
    deduped.push(seg);
  }
}
```
**Decisión:** la jerarquía verbosa de Tokens Studio no se traslada literal al CSS;
el script decide activamente cómo se ve el nombre público del token
(`status.success.success` no se vuelve `--color-status-success-success`). El naming
del DS es un artefacto de build, no un copy-paste de Figma.

### 6.2 — Tokens de a11y hand-authored que sobreviven al sync
`app/globals.css:956-962`

```css
/* ===== A11y (AA) — additive, hand-authored (survives token sync) ===== */
/* Solid brand fill for CTAs/badges: text-primary on this clears 4.5:1
   (brand-primary #6366f1 fails). brand-primary stays as accent/glow/ring/dots. */
--color-brand-solid: #565ad6;
/* Lighter AI purple for small text on tinted surfaces (e.g. score chip).
   Own name to avoid shadowing the synced --color-status-ai-light (#d8b4fe). */
--color-ai-score-text: #b06bf8;
```
**Decisión:** convive un bloque **generado** (autoridad = Figma) con un bloque
**manual** (autoridad = requisitos de código, ej. contraste AA) fuera de los
marcadores GENERATED, por diseño, para que `tokens:sync` no lo pise. El sistema
admite que no todo puede ni debe vivir en Figma.

### 6.3 — Puente de un lib de terceros (React Flow) a la capa de tokens
`app/globals.css:1053-1066`

```css
.react-flow.dark {
  background:                                 var(--color-surface-background);
  /* mid-level vars beat -default without !important */
  --xy-background-color:                      var(--color-surface-background);
  --xy-background-pattern-dots-color:         color-mix(in oklch, var(--color-border-default) 55%, transparent);
  --xy-edge-stroke-default:                   var(--color-text-muted);
  --xy-edge-stroke-selected-default:          var(--color-brand-primary);
  --xy-selection-background-color-default:    color-mix(in oklch, var(--color-brand-primary) 8%, transparent);
  --xy-selection-border-default:              1px dotted var(--color-brand-primary);
}
```
**Decisión:** las CSS vars internas de React Flow (`--xy-*`) se re-mapean a tokens
Fluuen en vez de aceptar el theming propio del lib. El comentario documenta hasta
la sutileza de **especificidad** (`mid-level vars beat -default without
!important`). Un tercero no rompe el sistema de color: se lo absorbe.

---

## 7. Estado real

### Terminado (verificado en código)
- Landing completa (7 secciones + mobile variants).
- App shell (sidebar colapsable con modos pinned/auto, topbar, command palette ⌘K).
- Dashboard con boot skeleton.
- Agents grid + Agent Builder (React Flow, catálogo, inspector, undo/redo,
  run simulado, dialogs share/publish).
- Runs: tabla + detail con timeline animado.
- Integrations con dialogs connect/manage/reconnect.
- Settings con 6 tabs.
- Sistema de tokens auto-sync (897 color tokens) + Storybook 10 con 19 stories +
  Foundations MDX que parsea el bloque generado en build (no puede driftear).

### A medias / stubs explícitos
- **`/notifications`** → solo empty state, "coming in a future sprint".
- **Wizard New Agent** → UI completa pero `handleCreate` solo hace `console.log`;
  no crea un agente real ni persiste (`app/(app)/agents/new/page.tsx`). El botón
  "Open in builder" apunta a `/agents/agent-new/builder` (id hardcodeado).
- **Command palette** → 3 acciones de búsqueda etiquetadas "(coming soon)"
  (`lib/command-palette/actions.ts:80-99`).
- **Sidebar** → un item "Coming soon" (`components/ds/sidebar.tsx:73`).
- **Auth** → forms sin backend.

### TODOs / deuda marcada en código
- `stat-card.tsx:92` y `agent-status.tsx:33` — `TODO: replace with
  text-text-tertiary when added to DS` (token faltante, mismo TODO duplicado).
- `builder-config-panel.tsx:357` — `TODO Sprint 8: implement node duplication`.
- `integrations-page-client.tsx:3` — `TODO(debt): extract <FilterPills> +
  <SearchBar> as shared DS components`.
- Varios `eslint-disable-next-line react-hooks/*` puntuales (config-panel,
  run-detail-client, textarea-vars-field, dashboard-boot).

### [Discrepancia] Requisitos "Modo demo" del `CLAUDE.md` NO implementados
El `CLAUDE.md` lista UI obligatoria de demo que **no encontré en el código**:
- Banner "Demo mode" con botón Reset en todas las pantallas → **ausente**
  (solo hay un texto "demo mode simulates connection" en un dialog).
- Reset = `localStorage.clear()` → **no existe**.
- Onboarding tooltip (`fluuen:onboarded`) → **no existe**.
- Mobile fallback screen para la app (<1024px) → **no encontrado** (la landing sí
  tiene componentes mobile; el shell de app no).

Vale aclarar si estos quedaron fuera de scope a propósito o son pendientes.

### Contexto de branch / deploy (verificado en `FLUUEN_DEV_STATE.md` + git)
- Branch actual `feature/storybook`, **no mergeada a main**.
- Storybook deploya aparte en Vercel (`fluuen-storybook`, production branch =
  `feature/storybook`).
- Cambios sin commitear: `case-study/00-cover.html`, `03-system.html`;
  untracked: `FLUUEN_DEV_STATE.md`, `00-cover.png`, y este brief.

---

## 8. Rastros de Figma (qué se diseñó antes vs. qué se resolvió en código)

Fuente principal: `FLUUEN_DEV_STATE.md` (registro de trabajo, no código) + código.
File de Figma: **Fluuen Design System** (`MOhVXH1k1Aa5tbQJM8QDRF`), citado en
`stories/foundations.mdx:10` y en el dev-state.

### Diseñado en Figma primero (Figma-ahead)
Según el dev-state, se construyó en Figma una librería completa con estrategia de
**composición + properties (anti-explosión de variants)**, con estos component
sets bindeados a la capa `Control/*`:
- **Agent Builder**: `Node` (+ `Node/Indicator`, `Port`, `Output Chip`, `Field
  Row`, `Node/End`), `Connector/Edge`, **Inspector Panel** (capa nueva
  `Control/AgentBuilder/Inspector/*`, 20 tokens), **Topbar/Toolbar** (3 organisms:
  Topbar, Selection Action Bar, Zoom Control), **Node Catalog/Sidebar**.
- **Workflow Builder** — screen ensamblada 1440×900 (luego convertida a componente
  para instanciar en el Overview).
- **Chat / AI Interaction** — solo explorado en Figma (Message Bubble, Thinking
  Block, Action Block, Confirmation, Streaming, Sources, Error+Retry…). **No tiene
  contraparte en código** (semilla de un futuro proyecto de AI patterns).
- Páginas de presentación: **Overview** (para Figma Community) y **Cover**.

### Resuelto en código y reconciliado hacia Figma (code-ahead)
El dev-state marca dos componentes donde el **código iba adelante** y Figma se
alineó al producto:
- **Notification Item / Panel** — vivía en código
  (`components/ds/notifications-popover.tsx`) y la v1 de Figma se había desviado;
  se reconció **Figma → código** (Geist Mono, dot por tipo `TYPE_DOT_COLOR`).
- **Empty States** — alineado a `components/ds/empty-state.tsx` existente.

### Deuda de tokens / divergencia "clasificada, no reconciliada"
Decisión explícita (`FLUUEN_DEV_STATE.md` §Pendientes): **el código del producto no
se toca**; las divergencias Figma↔código quedan **documentadas como narrativa** del
case study ("Divergence, classified"), no como backlog. Divergencias registradas:
- Hex hardcodeado en `canvas.tsx:25-28,33` (mapa `NODE_TYPE_COLOR` duplicado del
  tokenizado en `canvas-node.tsx:10-13`).
- Sublabel con `--color-neutral-500` (sub-AA) en `canvas-node.tsx:202` y
  `builder-topbar.tsx:144`.
- Capa `Control/Notification/*` **deprecada** en Figma (0 uso; el código usa dialog
  + semánticos).

### Assets exportados (evidencia de qué se diseñó "para mostrar")
`case-study/export/` contiene PNGs @2x de secciones (00–06), capturas de app
(dashboard, agents, builder en varios estados, run-detail, wizard 1–5, landing-hero)
y **GIFs** (`wizard-flow.gif`, `builder-run.gif`). La case study está maquetada como
HTML en `case-study/*.html` (secciones 00-cover → 06-process). El único asset de app
en `public/` es `public/landing/builder-invoice-processing.jpg`.

---

## Preguntas para Facundo

Para poder explicarle este proyecto a alguien que nunca lo vio, necesitaría el
**porqué** detrás de estas decisiones — no el qué, que ya está en el código:

1. **Producto vs. Design System como entregable.** El `FLUUEN_DEV_STATE.md` dice
   que el entregable real es "el DS en Figma y su historia de shipping", y que el
   código del producto está *fuera de scope, no se mantiene*. ¿La case study es
   sobre **el DS** (con la app como prueba de que se puede consumir), o sobre **el
   producto Fluuen**? Esto cambia por completo qué se destaca.

2. **La arquitectura documentada no matchea el código.** El `CLAUDE.md` describe
   un demo con Zustand+persist por dominio, `runAgent.ts` central, banner "Demo
   mode", reset, onboarding y mobile fallback — y nada de eso está en el código
   (la data es seed estático, la simulación es `setTimeout` inline). ¿Es que el
   `CLAUDE.md` era el **plan** y el código evolucionó distinto, o son features que
   quedaron pendientes? Necesito saber cuál narrar como "así se construyó".

3. **La tesis "divergencia clasificada, no reconciliada".** Decidiste dejar las
   divergencias Figma↔código documentadas en vez de arreglarlas, y venderlo como
   parte de la historia. ¿Por qué es esa la decisión *correcta* de un diseñador de
   sistemas (y no simplemente deuda técnica sin cerrar)? Ese argumento es el filo
   de la sección 03 del case study y quiero poder defenderlo.

4. **Por qué un pipeline de tokens propio.** Escribiste un `sync-tokens.mjs` a mano
   (con dedup de segmentos, resolución de alias, bloque generado + manual) en vez de
   usar Style Dictionary / Tokens Studio → CSS directo. ¿Qué te empujó a controlar
   vos el naming y el aplanado? ¿Fue una decisión técnica o de branding del sistema?

5. **Alcance del demo y su audiencia.** Hay stubs deliberados (notifications, wizard
   que no persiste, "coming soon"). ¿Para quién es este demo (clientes Upwork,
   reclutadores de diseño, técnicos) y hasta dónde tiene que "funcionar de verdad"
   para esa audiencia? Define qué es "terminado" y qué es honestamente un decorado.
