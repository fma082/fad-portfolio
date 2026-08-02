# PROJECT-BRIEF — Countersign

> Documento de insumo para una case study de portfolio.
> Todo lo que sigue sale de leer el código, los docs y el historial de git.
> Donde no pude verificar algo, lo digo explícitamente en vez de suponerlo.
>
> Fecha de análisis: 2026-08-01 · `main` @ `ed71a3e` · working tree limpio · 45 commits (2026-07-21 → 2026-07-31)

---

## Nota previa sobre la carpeta de investigación

**No está donde el pedido decía, pero existe.** Registro exacto de lo que encontré:

| Qué | Dónde | Estado |
| --- | --- | --- |
| `~/Developer/ai-pattern` | — | **No existe en disco** |
| `~/Developer/AI-Interface-Patterns` | — | **No existe en disco** |
| Sesiones de Claude de ambos proyectos | `~/.claude/projects/-Users-fma082-Developer-ai-pattern/`<br>`~/.claude/projects/-Users-fma082-Developer-AI-Interface-Patterns/` | Existen (6 transcripts `.jsonl`, ~30 MB) — **prueba de que las carpetas vivieron ahí** |
| Artefactos del catálogo | `~/Desktop/Facu/AI Agent Figma/AI interfaces Patterns/Artefactos/` | 3 archivos + `files.zip`, todos del 2026-03-26 |
| Registry + specs heredadas | `~/Desktop/Facu/AI Interface/` | `Agenetic ux/patterns-registry.html` (2026-07-17) y `Download/` (5 docs, 2026-07-06) |

Los repos de investigación fueron **borrados o movidos fuera de `~/Developer`**; lo que sobrevive son los artefactos exportados en Desktop. Analicé esos. **No pude leer el historial de git de la investigación** — si existía, se fue con la carpeta. Si querés que reconstruya la cronología fina, los `.jsonl` de sesión la tienen y son legibles.

---

## 1. Qué es Countersign

Un **agente de AI operando un panel de admin ficticio (Northbase) contra un modelo real**, con un checkpoint humano antes de toda operación irreversible.

La tesis está escrita literalmente en el README y repetida en `guided-steps.ts:63`:

> Reads run alone. Reversible writes run, then wait. Destructive writes wait first.
> **Friction before or friction after, never both.**

El README es explícito sobre qué **no** es: *"Countersign is a portfolio piece, not a UI kit or a pattern library."*

### El invariante que gobierna todo

`CLAUDE.md` lo pone como primera sección, y el código lo respeta de punta a punta:

> **The server resolves, the client reflects.**

Conteos, previews, labels, targets resueltos y márgenes se computan **server-side** y viajan como `StreamFrame`. El cliente los renderiza verbatim: nunca re-deriva un conteo, nunca re-parsea un label, nunca reinterpreta un tool call. El humano aprueba **lo que el servidor va a ejecutar** — la lista de productos resuelta y el efecto exacto — nunca una adivinanza del browser.

Esto no es retórica: `cost` no sale del servidor (`publicProducts()` lo strippea), y por eso el filtro `negative_margin` (`effectivePrice < cost`) es **estructuralmente imposible** de resolver en el cliente. El invariante está sostenido por una imposibilidad física, no por disciplina.

### Cómo se materializa (los tres tiers)

`ToolDecision` en `src/lib/engine/types.ts:77`:

| Tier | Qué es | Comportamiento |
| --- | --- | --- |
| `safe` | un read | corre solo |
| `reversible` | write de radio 1, ventana abierta | corre, después espera (undo en la tarjeta hasta el próximo write) |
| `gate` | write destructivo (radio N, o ventana que se cierra sola) | **espera aprobación humana antes de correr** |
| `invalid` | descartado por argumentos malos | badge `invalid`, nunca `ok` |

---

## 2. La investigación previa

Tres artefactos, en dos generaciones.

### 2.1 Master Catalog — `ai-interface-patterns-master-catalog.md` (38.5 KB, 2026-03-26)

El documento de referencia. Firmado *"Compiled by Facundo Almiron · Last updated: March 2026"*.

**Formato:** Markdown lineal. Cada patrón lleva cuatro campos fijos: **what it is** · **when to use it** · **real-world examples** · **design considerations**.

**Organización:** las categorías siguen el recorrido del usuario a través de una interacción con AI — *entender qué puede hacer → dar input → tunear comportamiento → esperar → recibir resultado → construir confianza → actuar → gestionar trabajo en curso*.

**Volumen verificado: 63 patrones en 10 categorías**, más 5 notas cross-cutting (keyboard shortcuts, dark mode, responsive, accesibilidad, i18n).

| # | Categoría | Patrones |
| --- | --- | --- |
| 1 | Wayfinders | 7 |
| 2 | Inputs | 7 |
| 3 | Tuners | 6 |
| 4 | **Processing states** — *"THE critical differentiator"* | 6 |
| 5 | Output patterns | 7 |
| 6 | Trust builders | 6 |
| 7 | Response actions | 7 |
| 8 | Orchestration patterns | 7 |
| 9 | Identifiers | 4 |
| 10 | Error & edge case patterns | 6 |

**Fuentes declaradas** (línea 12): Shape of AI (Emily Campbell), Carbon for AI (IBM), Vercel AI Elements, Google PAIR, Apple HIG for ML, Microsoft HAX, más análisis directo de Claude, ChatGPT, V0, Cursor, Perplexity, Copilot, Midjourney, Notion AI y Linear.

### 2.2 Registry en código — `ai-interface-patterns-catalog.jsx` (42 KB, 2026-03-26)

Reorganización del mismo material en **estructura de datos ejecutable**. `const CATEGORIES` (línea 68): **8 categorías × 23 patrones**, cada uno con:

```js
{ id, name, desc, states: [...], refs: [...], status: "done" | "new" }
```

**Acá es donde están mapeados los estados.** Cada patrón lleva su propia secuencia. Ejemplos textuales:

- `copilot-chat` → `["Empty", "Idle + history", "User typing", "Thinking", "Streaming", "Complete", "Error"]` — **7 estados**
- `action-confirmation` → `["Action proposed", "Details expanded", "User approved", "User rejected", "Action executing", "Action complete", "Action reverted"]`
- `tool-call-display` → `["Tool queued", "Tool executing", "Tool result (success)", "Tool result (error)", "Multiple tools chained", "Tool result collapsed"]`
- `error-recovery` → `["Timeout", "Rate limited", "Context too large", "Content filtered", "Model unavailable", "Hallucination flagged", "Retry offered"]`

`STATUS_LABELS = { done: "Built", new: "Planned" }` (línea 327). Al 2026-03: **3 built, 20 planned**.

### 2.3 Demos interactivos — `ai-patterns-complete.jsx` (64 KB, 2026-03-26)

**12 demos** de patrones, con sistema de tokens propio (`const T`, dark, acento índigo `#6366f1`) y micro-componentes compartidos (`Chip`, `Badge`, `StatusDot`, `TypingDots`, `StreamingText`, `StepIndicator`, `Skeleton`, `Message`, `PatternCard`).

El más relevante es **`P_AgentStates` — "PROCESSING — Full Agent State Machine"** (línea 458). Es literalmente el mapa de estados que menciona el pedido:

```js
idle → thinking → tool-use → streaming → artifact → complete → error → stopped
```

**8 estados**, cada uno con su render propio en el demo.

### 2.4 El puente — `patterns-registry.html` (18.6 KB, 2026-07-17)

**Este es el artefacto clave del brief**, y es cuatro días anterior al primer commit de Countersign (2026-07-21).

Toma los **63 patrones / 10 categorías** del Master Catalog y les agrega un tercer estado de scope: `built` | `wedge` | `catalog`. Su propio subtítulo dice: *"Registro de patrones · 10 categorías · fuente única de scope"*, y el intro declara la intención:

> *"Lo que ya está construido son los 3 patrones base; la capa de gobernanza (esperar aprobación, permisos, confianza) es el diferenciador del case study y el foco del demo contra Ollama."*

**Conteo verificado: 63 patrones — 8 `built`, 11 `wedge`, 44 `catalog`.**

Ya usa el sistema monocromo warm-neutral + light/dark con toggle — el mismo que termina en `globals.css` de Countersign. La investigación y el producto comparten paleta antes de compartir código.

---

## 3. La línea entre ambos ⟵ *el punto central*

La investigación no fue un ejercicio paralelo: `patterns-registry.html` **eligió el recorte** antes de que existiera el repo, y Countersign construyó ese recorte. Los 11 patrones marcados `wedge` son el brief de producto.

### 3.1 Los 11 `wedge` — qué se implementó

| Código | Patrón | En Countersign | Dónde |
| --- | --- | --- | --- |
| 8.5 | **Human-in-the-loop checkpoints** | ✅ **Núcleo del producto** | `gate-card.tsx`, estado `awaitingApproval` |
| 4.2 | Tool use / Agentic actions | ✅ tarjeta discreta por tool, con badge y disclosure de args crudos | `tool-card.tsx`, `ToolEvent` |
| 7.6 | Execute / Act | ✅ los tres writes reales, con preview server-side antes de ejecutar | `governFieldWrite`, `governDestructive` |
| 8.1 | Action plan / Plan preview | ✅ `GatePreview.items` — filas resueltas por nombre antes de correr | `types.ts:410` |
| 8.4 | Permissions / Autonomy | ✅ **como taxonomía, no como control de usuario** — los tiers son la política; no hay UI para cambiarlos | `ToolDecision` |
| 6.3 | Caveats / Limitations | ✅ y con un giro propio: `FieldState` distingue `not-applicable` de `missing` | `types.ts:347` |
| 10.4 | Hallucination handling | ✅ resuelto por arquitectura: el modelo recibe conteo + criterio, no filas, así que no tiene qué enumerar mal | `RenderPayload` / `ToolOutcome` |
| 6.2 | Explainability / Reasoning | 🟡 parcial — la tarjeta muestra los argumentos crudos que mandó el modelo, pero no hay cadena de razonamiento expandible | `tool-card.tsx` |
| 8.3 | Agent monitoring / Run history | 🟡 parcial — el transcript **es** el log de la sesión, pero no persiste ni se filtra; sin DB | `use-copilot.ts` |
| 6.1 | Confidence indicators | ❌ **no existe** — cero ocurrencias de "confidence" en `src/` | — |
| 8.7 | Delegation patterns | ❌ no existe | — |

### 3.2 Los 8 `built` — qué sobrevivió al port

| Código | Patrón | En Countersign |
| --- | --- | --- |
| 4.1 | Thinking / Reasoning | ✅ `ThinkingDots` + estado `thinking`, con keyframe `cs-typing` en `globals.css:164` |
| 4.3 | Streaming / Token-by-token | ✅ frames `token` + caret parpadeante (`panel.tsx:67`) |
| 2.1 | Open chat | ✅ `Composer` — se destraba después del flujo guiado |
| 1.2 | Suggestions / Prompt starters | ✅ **reinterpretado**: no son chips libres, son 4 pasos guiados en orden fijo |
| 10.1 | Generation error | ✅ y **subdividido en tres**: `ResponseError`, `ResponsePaused`, `ResponseRateLimit` |
| 10.5 | Stopped by user | ✅ señal `cancel`, con el parcial preservado (contrato explícito en `copilot-statechart.ts:190`) |
| 4.4 | Skeleton / Placeholder | ❌ **no se portó** — cero ocurrencias de "skeleton"/"shimmer" en `src/` |
| 4.5 | Progress indicators | ❌ no hay `StepIndicator`; los tool cards son discretos, sin "paso 2 de 5" |

### 3.3 Lo que está en Countersign y **NO** estaba en la investigación

Esta es la parte con más valor de case study: son las decisiones que solo aparecen cuando construís contra un modelo real.

**1. `awaitingApproval` como estado de la máquina.**
El statechart de la investigación (`Download/statechart-copilot-chat-panel.md`, en español, 2026-07-06) tenía **7 estados**. El de Countersign tiene **8**. La diferencia es exactamente el gate. El registry ya listaba `action-confirmation` como *patrón*, pero nadie lo había convertido en un *estado de la máquina de la conversación* — vivía como flujo de UI aparte. En Countersign es un estado con una regla de salida: solo señales de origen `user` lo abandonan.

**2. La clasificación de señales por origen (`SIGNAL_ORIGIN`).**
El doc de investigación ya distinguía *usuario / motor / automática* en prosa. Countersign lo convierte en un `Record` tipado (`copilot-statechart.ts:57`) y lo usa para hacer **enforceable** la regla "solo un humano sale del gate", en vez de aspiracional. El comentario del código lo dice con esas palabras.

**3. Aprobación parcial.**
Los estados de `action-confirmation` en la investigación son binarios: approved / rejected. Countersign tiene **tres salidas** — aprobar todo, aprobar un subconjunto (destildando por criterio humano), o rechazar. `approvePartial(excludedIds)` es una señal de primera clase, y el servidor re-intersecta las exclusiones contra su propio preview antes de correr.

**4. `invalid` como resultado de primera clase.**
La investigación tenía "Tool result (error)". Countersign separa **error** de **descartado por argumentos inválidos**, y lo escribe como regla moral en `CLAUDE.md`: *"A tool call discarded for bad arguments shows an `invalid` badge, never `ok`."* La tarjeta muestra los argumentos **crudos**, no una versión limpia — el registro es de la llamada que se hizo.

**5. La taxonomía de tres tiers (safe / reversible / gate).**
No existe en ninguna de las 10 categorías. La investigación tiene "permissions" y "checkpoints" como patrones sueltos; Countersign los unifica en un **criterio** (radio del cambio × si la ventana de undo se cierra sola) documentado en `docs/pattern-4-approval-checkpoint.md`.

**6. La ventana de undo con semántica de cierre.**
El undo vive en la tarjeta de la acción y **se cierra con el próximo write** — no un toast, no un countdown. La investigación menciona "Undo capability" como design consideration de 7.6, sin semántica de ventana.

**7. `FilterState` como criterio, no como lista.**
Probablemente la decisión de sistema más original del repo, y **no tiene ancestro en la investigación**. El estado del filtro viaja como predicado (`{kind:"preset", preset:"expired_sale"}`), no como los SKUs resueltos. El comentario de 30 líneas en `types.ts:125-154` explica las tres consecuencias: una lista congelada se pone stale, no se puede re-resolver, y **no se puede describir** ("una lista de trece SKUs no sabe que significa 'por debajo de su punto de reorden'"). Un criterio sobrevive a las tres, y por eso el filtro del humano puede **suspenderse durante el gate y volver después** en vez de destruirse.

**8. El canal doble modelo/render (`ToolOutcome`).**
`modelPayload` va al mensaje `role:"tool"`; `renderPayload` va al cliente. El modelo **nunca ve las filas**. La razón está escrita en `types.ts:242`: un modelo al que le pasás 13 filas las enumera en prosa y etiqueta mal el criterio; si le pasás el conteo y el criterio, solo puede escribir el preámbulo. La investigación tiene "Cards / Structured results" (5.4) como patrón de *output*, nunca como **partición del canal**.

**9. `model_paused` — el sistema garantiza, no el modelo.**
Cuando el modelo no está disponible, el servidor corre el tool conocido del paso guiado igual (`GuidedStep.fallback`) y emite una nota **escrita por el servidor**, nunca texto fabricado del modelo. El flujo guiado llega al gate con o sin modelo. La investigación tiene 10.6 "Offline / Degraded" — pero marcado `catalog`, es decir fuera de scope.

**10. Confirmación de undo stale.**
Si el valor cambió desde el write original, el undo pregunta antes de restaurar, mostrando esperado vs. actual (`StaleUndo`, `panel.tsx:180`). No está en ningún patrón del catálogo.

### 3.4 Lo que quedó afuera de las 10 categorías

Sin implementar, todo consistente con marcarlo `catalog`: multimodal / attachments (2.4), voice (2.3), tuners completos (cat. 3 — hay label de modelo, no selector), citations (5.6), feedback thumbs (6.4), regenerate (7.2), branch/fork (7.3), share (7.4), save/bookmark (7.5), workflow builder (8.2), session management (8.6), y toda la categoría 9 (Identifiers — Countersign no usa sparkles ni avatar de AI; es deliberado, el sistema es monocromo y sin color de marca).

---

## 4. Stack real (desde `package.json`)

### Core — 6 dependencias de runtime

| Paquete | Versión | Rol |
| --- | --- | --- |
| `next` | `^16.0.0` | App Router, Turbopack |
| `react` / `react-dom` | `^19.0.0` | — |
| `lucide-react` | `^0.469.0` | iconos |
| `clsx` | `^2.1.1` | utilidad de clases |
| `tailwind-merge` | `^2.6.0` | idem (juntos son `src/lib/cn.ts`, 7 líneas) |

### Dev

`tailwindcss` `^4.0.0` + `@tailwindcss/postcss` · `typescript` `^5.7.0` · `@types/{node,react,react-dom}`

### Lo que confirma el recorte

- **Sin SDK de proveedor.** El adapter habla con Ollama y Groq con `fetch` + `ReadableStream` a mano.
- **Sin librería de estado.** El statechart es un reducer puro de 238 líneas, sin dependencias.
- **Sin librería de test.** `npm test` = `node --test` nativo.
- **Sin Radix, sin shadcn instalado** — ver §A.1.
- **Fuente:** Inter 400/500 vía `next/font/google`.
- **Total: 8.221 líneas** de `.ts`/`.tsx`/`.css` en `src/`.

**Scripts:** `dev` · `build` · `start` · `lint` *(roto, ver §A.2)* · `typecheck` · `test` · `clean`.

---

## 5. Arquitectura

### Tres capas, un invariante

```
provider  ──RawFrame──▶  governance (server)  ──StreamFrame──▶  client
```

| Capa | Archivos | Regla |
| --- | --- | --- |
| **Adapter** | `engine/ollama.ts` (172) · `engine/groq.ts` (322) · `engine/provider.ts` (26) | Los únicos módulos que hablan con un proveedor. Emiten `RawFrame`. No saben qué es un gate. Agregar proveedor = adapter hermano + una línea en el selector. |
| **Governance** | `api/copilot/route.ts` (646) · `engine/tools.ts` (974) · `engine/tool-args.ts` (373) | Clasifica cada tool call, computa previews, labels con conteos reales y efectos. Nunca ejecuta destructivo sin aprobación. |
| **Client** | `components/**` | Refleja `StreamFrame` verbatim. Nunca reinterpreta, nunca recuenta, nunca ve `cost` ni `margin` salvo que un tool los revele. |

### Estructura de carpetas

```
src/
├── app/
│   ├── layout.tsx              anti-flash de tema, pre-paint
│   ├── globals.css             ← el sistema de diseño completo (185 líneas)
│   ├── page.tsx                /
│   ├── scenario/page.tsx       /scenario — Server Component, strippea cost
│   ├── tokens/page.tsx         /tokens
│   └── api/copilot/route.ts    la capa de gobernanza
├── components/
│   ├── copilot/                panel, composer, gate-card, tool-card,
│   │                           product-list, product-detail, guided,
│   │                           status-badge, response-loading, use-copilot
│   ├── scenario/scenario-shell.tsx   el shell que orquesta tabla + copilot
│   ├── home/                   app-shot, pattern-demo
│   ├── product-table.tsx · filter-bar.tsx · nav-rail.tsx · theme-toggle.tsx
└── lib/
    ├── copilot-statechart.ts   ← reducer puro, sin React, sin I/O
    ├── engine/                 types · tools · tool-args · filter · filter-spec
    │                           gate-store · rate-limit · resilient · provider
    │                           intent-subtitle (+ su test)
    ├── scenario/               catalog · seed-products · guided-steps
    └── home/pattern-scripts.ts
```

### La separación que sostiene todo

`copilot-statechart.ts` **no tiene efectos**. Decide *qué es verdad*; todo efecto (llamar al motor, abrir un stream, correr un timer) vive en `useCopilot`. Eso es lo que hace que el statechart sea testeable, portable a Figma como variantes de componente, y verificable contra su propio doc.

### Densidad de comentarios

Poco común y vale mencionarlo en la case study: **el código está escrito como argumento**. `types.ts` tiene 444 líneas de las cuales una fracción alta son comentarios que explican *qué falló antes* y *por qué la forma actual lo hace imposible*. Ejemplos: por qué `margin` no es un campo comparable (sería un oráculo binario sobre `cost`), por qué hay dos tools de filtro en vez de uno con argumento unión (modo de falla de un modelo chico), por qué `userIntent` viajó del canal del modelo al canal de render.

---

## 6. Sistema de diseño

**Nació en código, sin Figma.** No hay `components.json`, no hay tokens exportados, no hay librería de componentes. El sistema **es** `src/app/globals.css` (185 líneas) más `docs/tokens-spec.md` como prosa.

### Arquitectura: dos capas

**Capa 1 — Primitivas** (`globals.css:21-42`). Constantes crudas, invariantes entre modos.

- Escala neutral cálida, 10 pasos: `--n0` `#ffffff` → `--n975` `#0c0c0b`
- Estado, 6 valores desaturados: `--red-600/400`, `--green-600/400`, `--amber-600/400`
- No-color: `--radius: 8px`, `--ease: cubic-bezier(0.2, 0.8, 0.2, 1)`

**Capa 2 — Semántica** (`globals.css:45-85`). **14 tokens**, declarados dos veces: bajo `:root` (light) y bajo `.dark`. Solo aliasean primitivas — nunca un hex.

`surface/{page,panel,sub,input}` · `text/{primary,secondary,tertiary,on-action}` · `interactive/primary` · `border/{default,strong}` · `text/{error,success,warning}`

### El mecanismo: `@theme inline`

La decisión técnica que hace todo lo demás posible (`globals.css:101`). Tailwind v4 genera utilidades que **conservan la referencia `var()`** en vez de resolverla en build. Togglear `.dark` en `<html>` re-apunta cada variable semántica y **todas las utilidades se actualizan en su lugar** — sin recompilar, sin recargar.

Los nombres viven en dos registros a propósito: las variables CSS mantienen los **nombres de spec** (`--surface-panel`, `--text-primary`) para que se lean claro en DevTools; `@theme inline` los mapea a **nombres ergonómicos** de utilidad (`bg-panel`, `text-ink`).

### Las reglas, y qué tan bien se cumplen

| Regla (`tokens-spec.md`) | Estado |
| --- | --- |
| Monocromo, **sin color de marca** | ✅ cumplida |
| Color de estado racionado a error/success/warning | ✅ cumplida — hasta el punto del status del motor, que queda neutral |
| **El color nunca es la única señal** — siempre con ícono y texto | ✅ cumplida (badge `invalid`, celda de margen bajo costo, filas warn del gate) |
| Nunca hardcodear color | ✅ cumplida — no encontré hex literales en componentes |
| Nunca hardcodear **radius** | 🟡 **parcialmente violada** — ver §A.3 |

### Light es el modo héroe

Declarado en el spec y en el código. El default es light; dark es la inversión. `layout.tsx` corre un script inline **antes del primer paint** para evitar el flash, leyendo `?theme=` → `localStorage` → preferencia del SO.

### Componentes

**No hay librería.** Hay 16 componentes de aplicación, todos de un solo uso, sin capa `ui/` intermedia. Los que llevan decisión de sistema:

| Componente | Decisión |
| --- | --- |
| `gate-card.tsx` | *"el elemento visualmente más fuerte de toda la UI"* — `border-2 border-action`, checkbox por target, tres salidas |
| `tool-card.tsx` | badge de resultado con `invalid` de primera clase |
| `status-badge.tsx` | refleja el estado del statechart, neutral por diseño |
| `response-loading.tsx` | **4 variantes**: dots, error, paused, rate-limit |
| `product-list` / `product-detail` | generative UI con **vocabulario cerrado** — un `component` desconocido renderiza **nada**, nunca un fallback adivinado |
| `filter-bar.tsx` | los dos controles del humano son **el mismo par** de tools que tiene el agente |

### `/tokens` como documentación viva

Renderiza 16 primitivas y 13 de los 14 tokens semánticos con preview, nombre de spec, utilidad y ambos primitivos. **Falta `text/on-action`**, y no muestra las primitivas no-color (`--radius`, `--ease`).

---

## 7. Pantallas / rutas

| Ruta | Render | Qué hace |
| --- | --- | --- |
| `/` | estático | Hero con la tesis en dos líneas · app-shot congelado en el gate (desktop + variante mobile) · franja de 3 claims (uno por tier) · **índice de 4 patrones** · footer que declara que Northbase es ficticio |
| `/scenario` | `force-dynamic` | **El demo.** Server Component que corre `resetCatalog()` y strippea `cost` vía `publicProducts()`. Layout de 3 columnas (`56px / 1fr / 380px`): nav rail, tabla + filter bar, panel del copilot. Bajo `lg` el copilot pasa a drawer con FAB. |
| `/tokens` | estático | Showcase del sistema de tokens con toggle light/dark |
| `/api/copilot` | `runtime: "nodejs"`, dinámico | El endpoint de gobernanza |

Deep-link de tema con `?theme=light` / `?theme=dark` (persiste en `localStorage`).

### El flujo guiado de `/scenario`

Cuatro pasos apilados, en orden fijo, con el input libre trabado hasta terminar (`"Complete the steps above to unlock free input."`):

1. *"Find products selling below cost"* — **read**, revela la columna Margin
2. *"Show me what's causing it"* — **read**, filtra a sales vencidas
3. *"Raise the price on the SD Card Case"* — **reversible**, corre y después espera
4. *"Clear all expired sale prices"* — **destructive**, para en el gate

Lo guiado es **el orden y los prompts, nunca las respuestas** (`guided-steps.ts:4`). El streaming y los tool calls son del motor real. Al cerrar, se imprime la tesis completa y se destraba el input libre.

---

## 8. Tres snippets — decisiones de sistema

### 8.1 — El gate solo se abandona por señal humana

**`src/lib/copilot-statechart.ts:199-214`**

```ts
case "awaitingApproval": {
  // CONTRACT: the gate is left ONLY by a human signal. The model cannot
  // reopen it (awaitApproval) nor skip it (done/delta/toolCall) — those are
  // ignored. The engine is already stopped; there is nothing to cancel.
  switch (signal.kind) {
    case "approve":
    case "approvePartial":
      // Partial approval is a variant of approve, not a new state: the human
      // clears the gate and the server executes what survived.
      return { ...state, status: "thinking", partial: "" };
    case "reject":
      return { ...state, status: "complete", draft: "" };
    default:
      return state;
  }
}
```

**Por qué es decisión de sistema:** el `default: return state` es la garantía completa. No hay guardia, ni flag, ni chequeo de permisos — el modelo simplemente *no tiene ninguna señal que lo saque de ahí*. La propiedad de seguridad es una consecuencia de la forma del reducer, no una regla que alguien tiene que acordarse de chequear. Y aprobación parcial se modela como **variante de aprobar**, no como estado nuevo: el conjunto de estados no crece con las opciones del humano.

### 8.2 — Dos canales que nunca se mezclan

**`src/lib/engine/types.ts:242-284`**

```ts
/**
 * What a tool hands back, split into two channels that never mix.
 *
 *   modelPayload  — serialized into the `role:"tool"` message. The model sees
 *                   ONLY this.
 *   renderPayload — streamed to the client. The model never sees it.
 *
 * Same principle as `toPublic` dropping `cost`: a consumer cannot misuse what it
 * never receives. A model handed 13 product rows enumerates them in prose and
 * mislabels the criterion; handed a count and the criterion the server actually
 * ran, it can only write the preamble. The rows still reach the human — they
 * just travel on the channel that renders them.
 */
export interface ToolOutcome<T = unknown> {
  modelPayload: unknown;
  renderPayload?: RenderPayload<T>;
}
```

**Por qué es decisión de sistema:** la alucinación se trata como **problema de ruteo de datos**, no de prompting. En vez de pedirle al modelo que no invente filas, no se le dan filas. `RenderPayload.count` es *el mismo número* que recibió el modelo, y se renderiza como header — así que si alguna vez difiere de `data.length`, el componente lo dice **en pantalla**, donde una respuesta en prosa citando un número nunca podría exponer el otro.

### 8.3 — El swap de tema, en tiempo de ejecución

**`src/app/globals.css:101-127`**

```css
/*
 * @theme inline: map the semantic layer to Tailwind utilities. `inline` keeps
 * the var() reference in the generated utility instead of resolving it at
 * build time — that is what lets .dark flip everything at runtime.
 */
@theme inline {
  --color-page:  var(--surface-page);
  --color-panel: var(--surface-panel);
  --color-ink:   var(--text-primary);
  --color-ink-2: var(--text-secondary);
  --color-action: var(--interactive-primary);
  --color-line:  var(--border-default);
  /* … */
}
```

**Por qué es decisión de sistema:** una palabra (`inline`) es la diferencia entre un tema que requiere recompilar y uno que invierte en vivo. Y sostiene la separación de nombres: las variables CSS conservan los nombres de spec (legibles en DevTools, mapeables a variables de Figma) mientras las utilidades usan nombres ergonómicos. **Un sistema de diseño con dos vocabularios y un solo origen.**

---

## 9. Estado real

### Terminado y verificado por mí

- ✅ `npm run typecheck` — **limpio**
- ✅ `npm test` — **15 tests, 15 pass** (3 suites, `intent-subtitle`)
- ✅ Working tree limpio, 45 commits
- ✅ Los tres tiers, end to end, con gobernanza server-side
- ✅ Gate con tres salidas (aprobar todo / subconjunto / rechazar)
- ✅ Ventana de undo + confirmación de undo stale
- ✅ Statechart de 8 estados, puro, con doc pareado
- ✅ Sistema de tokens completo con swap en runtime
- ✅ Dos adapters de proveedor (Ollama local / Groq deploy) tras un selector
- ✅ Rate limit por IP, reintentos (`resilient.ts`), tres razones de error distintas
- ✅ Flujo guiado de 4 pasos con fallback server-side si el modelo está caído
- ✅ Generative UI (`product_list`, `product_detail`) con vocabulario cerrado
- ✅ `FilterState` como criterio, que sobrevive al gate
- ✅ **Guardia anti-drift en el seed:** `assertPlanted()` corre en import y **rompe el build** si los rosters dejan de describir el catálogo

### A medias

- 🟡 **`WedgeDemo` construido pero no montado.** `src/components/home/pattern-demo.tsx` (191 líneas) + `pattern-scripts.ts` (86) existen, funcionan, y **ningún archivo los importa**. Corren el `useCopilot` real con transporte scripteado. Están esperando una sección de cards en el landing. *(No es código muerto por descuido — es una pieza terminada sin superficie donde vivir.)*
- 🟡 **El índice del landing no lleva a ningún lado.** Los 4 patrones de `CATALOG` (`page.tsx:21`) son texto: sin link, sin demo, sin expandir. El patrón 04 tiene el demo hecho (arriba) pero desconectado.
- 🟡 **Explainability parcial** — se ven los args crudos, no una cadena de razonamiento.
- 🟡 **`DEV_STATE.md` desactualizado.** Última entrada 2026-07-24; hay **21 commits posteriores** (toda la línea de `FilterState` como criterio, `product_detail`, validación de args en el borde, la séptima conflictividad sembrada). El trabajo más reciente y arquitectónicamente más interesante **no está en el log**.

### TODOs

**No hay ninguno.** Grep de `TODO|FIXME|HACK|XXX|WIP|not implemented|coming soon` sobre `src/`, `docs/`, `README.md` y `CLAUDE.md`: **cero coincidencias** (los hits fueron todos `placeholder` de inputs). Es inusual y vale decirlo.

### Límites declarados por el propio autor (`DEV_STATE.md:198`)

- Rate limit en memoria = **por instancia serverless**, no global. Deliberado y documentado, no arreglado.
- **Sin DB.** El estado de sesión vive en memoria; Reset vuelve al seed. Sin aislamiento por sesión.
- Walkthrough pre-grabado diferido.

---

## A. Docs que describen features inexistentes

### A.1 — `README.md`: shadcn/ui y Radix ⚠️ **la más visible**

El README dice, en la sección Stack:

> **shadcn/ui** conventions (radix base, lucide icons)

**No hay Radix.** `package.json` no lo lista, `node_modules` no lo tiene, `src/` no lo importa. No hay `components.json`, no hay `src/components/ui/`. Lo único cierto de esa línea es `lucide-react`.

Los componentes están escritos a mano de cero. *"Conventions"* podría defenderse como "seguí el espíritu", pero **"radix base"** afirma una dependencia que no existe. Para un lector técnico que abra `package.json` es lo primero que no cierra.

**Sugerencia:** `shadcn/ui conventions (hand-rolled, lucide icons)` — o borrar la línea. El README ya dice *"Beyond the above: zero extra dependencies"*, que es lo genuinamente impresionante y **contradice la línea anterior**.

### A.2 — `package.json`: el script `lint` está roto

`"lint": "next lint"` — **`next lint` fue removido en Next.js 16**, que es la versión que usa el proyecto. Además no hay ninguna config de ESLint en el repo. El script no puede correr.

### A.3 — `tokens-spec.md`: la regla de radius no se cumple del todo

> *"Nothing in a component may hardcode a color, spacing, or radius."*

El color sí se cumple. El radius **no**: `rounded-token` se usa 16 veces, pero conviven **13 × `rounded-[6px]`**, **3 × `rounded-[10px]`**, 4 × `rounded-md`, 4 × `rounded-lg`, 1 × `rounded-xl` y 26 × `rounded-full`. `--radius` es un valor único (`8px`) sin escala, así que cualquier otro radio no tiene token adonde ir. **No es que se violó la regla; es que el sistema tiene un token donde necesitaba una escala.** Vale como hallazgo honesto de case study.

### A.4 — `CLAUDE.md` quedó atrás del README

`CLAUDE.md` (2026-07-23) dice:

> `src/lib/engine/ollama.ts` — **adapter frame**. […] Provider-agnostic by design: changing providers must touch nothing but this file.

Pero ya existen `groq.ts` y `provider.ts`. El README describe correctamente los tres. `CLAUDE.md` describe una arquitectura de un proveedor que fue superada el mismo día. También lista 4 comandos y omite `npm test`, que existe y pasa.

### A.5 — Docs presentes pero no indexados

`docs/pattern-4-approval-checkpoint.md` (el doc del criterio de tiers, el más conceptual del repo) **no está linkeado desde el README**, que sí lista los otros tres. `docs/toggle-web-visible-ambiguity.png` tampoco. No es una feature inexistente — es lo inverso: trabajo real invisible desde la puerta de entrada.

### A.6 — Discrepancia interna de la investigación

`ai-interface-patterns-master-catalog.md:10` dice *"Patterns are grouped into **8 categories**"*. El documento tiene **10**. `patterns-registry.html` dice correctamente 10. Probablemente la línea nunca se actualizó cuando se agregaron Identifiers y Error & edge cases.

---

## B. Números publicados en más de un lugar

**El repo está inusualmente bien defendido en esto**, y no por disciplina sino por diseño. Vale la pena que la case study lo cuente.

### B.1 — El mecanismo anti-drift

`seed-products.ts` **no escribe ningún conteo**. Autora rosters de SKUs; los conteos se derivan (`SEED_COUNTS`); y `assertPlanted()` re-corre cada predicado contra `PRODUCTS` **en import**, tirando el build si un roster dejó de describir el catálogo. El comentario dice: *"A number that has to be maintained in two places is a number that will be wrong in one of them."*

Ese mecanismo nació de un bug real: commit `844bb83` — *"docs(seed): the below-reorder reference count is 13, not 11"*.

El mismo principio en la UI: `describeFilter` es **una** función; el chip del filtro, el readout "N of 30" y la línea `Current view:` que lee el modelo imprimen **el mismo string**. Y en `scenario-shell.tsx:237` el conteo mostrado es `filter.count` (lo que reportó el resolver) y **no** `filterSkus.length` (lo que mediría el cliente), con el comentario explicando que hoy son el mismo número pero uno es un hecho reportado y el otro una medición.

### B.2 — Discrepancia encontrada: "la única venta activa" ⚠️

`README.md`, paso 4 del guided:

> The affected rows are spotlighted; **the one active, valid sale** (`NB-LT-2004`) is left out.

**Ya no es una.** El roster `activeSale` tiene **dos** SKUs:

- `NB-LT-2004` — vence 2026-08-31, el control con fecha
- `NB-AU-1003` — **sin fecha de fin**, agregado el 2026-07-29 en el commit `c8154a6` (*"a sale price with no end date — the seventh planted conflict"*)

El código está al día: `planClear()` describe explícitamente *"including one with no end date on record, which this sweep cannot evaluate at all."* El README (última edición 2026-07-23) es **6 días anterior** al commit que agregó el segundo caso.

Es una discrepancia chica pero **exactamente del tipo que un entrevistador chequea**, porque el README nombra un SKU específico y es fácil de verificar contra la tabla.

### B.3 — Números verificados que sí cierran

| Número | Dónde aparece | Verificado |
| --- | --- | --- |
| 30 productos | header del seed · `/scenario` "N of 30" · README | ✅ 30 filas |
| 6 sales vencidas | roster + `planClear()` + título del gate | ✅ derivado, no escrito |
| 3 vendiendo bajo costo | roster `belowCost` | ✅ |
| 13 bajo punto de reorden | roster `belowReorder` | ✅ (corregido en `844bb83`) |
| 3 discontinuados | roster | ✅ |
| **8 estados** | `page.tsx:22` "Copilot Chat Panel — 8 states" | ✅ `CopilotStatus` tiene 8 |
| **4 variants** | `page.tsx:23` "AI Response Loading States" | ✅ `response-loading.tsx` exporta 4 |
| **5 states** | `page.tsx:24` "Suggested Prompts & Smart Input" | ⚠️ **sin origen único en código.** 4 pasos guiados + input libre = 5 es la lectura plausible, pero nada lo enumera. Es el único número del landing que no puedo trazar a una estructura. |

### B.4 — Notas de DEV_STATE que ya no verifiqué

`DEV_STATE.md:211` dice *"next build clean (5 routes)"*. No corrí `next build` (evita tocar el `.next` existente); `tsc --noEmit` sí está limpio. Es el conteo de la iteración del 2026-07-23 y suena consistente con `/`, `/scenario`, `/tokens`, `/api/copilot` + `_not-found`, pero no lo confirmé.

---

## C. ¿La interfaz avisa que los datos son simulados?

**Parcialmente — y el hueco está justo donde más importa.**

### Dónde sí lo dice

| Lugar | Texto | Alcance |
| --- | --- | --- |
| `/` footer (`page.tsx:116`) | *"A portfolio piece. Northbase and its catalog are entirely fictional."* | ✅ explícito |
| `/` bajo el app-shot (`page.tsx:72`) | *"Frozen at the approval gate. The live version runs a real local model."* | ✅ aclara que la imagen es estática |
| `<meta description>` (`layout.tsx:15`) | *"…operating a fictional admin panel against a real local model…"* | 🟡 solo en el `<head>` |
| `WedgeDemo` (`pattern-demo.tsx:113`) | *"Scripted replay of a recorded session — no live model."* | 🟡 **componente no montado** — nadie lo ve |
| System prompt (`route.ts:72`) | *"…Northbase, a fictional product-admin panel."* | ❌ el modelo lo sabe; el visitante no lo ve |

### Dónde **no** lo dice

**`/scenario` — el demo — no tiene ninguna leyenda de datos ficticios.** Grepeé `fiction|simulat|synthetic|sample data|demo data` sobre `src/app/scenario` y `src/components/scenario`: los únicos hits son comentarios de código (`nav-rail.tsx:10` *"Fictional nav rail"*, invisible para el usuario).

Lo que un visitante ve en `/scenario`:

- Breadcrumb `Northbase / Products` — se lee como producto real
- Una tabla de 30 productos con SKUs, precios, stock y proveedores creíbles
- Footer del composer: `Ollama · llama3.2:3b` + `Reset scenario`
- Empty state del copilot: *"Reads run on their own…"* — explica el comportamiento, **no la ficción**

El único indicio de que es un demo es **"Reset scenario"**, y es indirecto.

**Riesgo concreto:** `/scenario` es deep-linkeable y es el link que se comparte. Alguien que entre directo (link en un mensaje, en un CV, en un tweet) ve un panel de admin funcional operando sobre lo que parecen datos reales, **con un agente ejecutando writes destructivos sobre ellos**. La aclaración vive en la ruta que esa persona nunca visitó.

**Arreglo más barato:** una línea en el footer del composer, junto a `Ollama · llama3.2:3b` — donde ya hay una tira de metadata y donde ya se estableció el registro visual. O al lado del breadcrumb `Northbase / Products`, que es exactamente el elemento que produce la ilusión.

Vale notar que **`CLAUDE.md` sí trata esto como invariante** (*"Northbase is fictional. 100% fictional. No real brand, customer, dataset, or structure — not in code, comments, or commit messages"*) y el código lo cumple. El hueco no es de datos: es de **disclosure al visitante en la superficie que se comparte**.

---

## Preguntas para Facundo

Cinco cosas que necesitaría de vos para contarle este proyecto a alguien que no lo vio nunca. Ninguna es sobre el qué — eso lo leí.

**1. ¿Por qué 11 patrones se volvieron uno?**
`patterns-registry.html` marcó 11 patrones como "wedge" el 17 de julio. Cuatro días después arrancaste a construir, y de esos 11 terminaste haciendo *uno* en profundidad (8.5, human-in-the-loop) con 6 más como soporte, y dos que ni tocaste. **¿Ese recorte fue decisión previa o descubrimiento?** ¿En qué momento te diste cuenta de que "confidence indicators" y "delegation" eran ruido, y qué te lo mostró? La respuesta convierte al registry de *inventario* en *herramienta de decisión*, que es una historia mucho mejor.

**2. ¿Por qué un modelo chico y local, en vez de uno bueno?**
`llama3.2:3b` es una elección deliberada — hay comentarios enteros escritos alrededor de sus modos de falla (mandó `threshold: "50"` contra un schema `number`; elegir entre `"<"` y `"less than"` es un volado). Parece que **elegiste el modelo malo a propósito porque la tesis es que el sistema debe garantizar, no el modelo**. ¿Es eso, o empezó como restricción de costo/privacidad y la tesis vino después? Lo pregunto porque cambia completamente el argumento: en un caso el proyecto es una demostración, en el otro es una racionalización elegante.

**3. ¿Qué te costó el invariante "el servidor resuelve, el cliente refleja"?**
Está sostenido en todos lados — canal doble, `cost` que nunca sale, criterio en vez de lista, columnas derivadas en vez de acumuladas. Pero los comentarios cuentan que **cada uno de esos se descubrió rompiéndose primero**: la columna Margin que sobrevivió a su criterio, el subtítulo que citaba la pregunta del turno anterior, el modelo narrando `userIntent` como si fuera la definición. **¿Cuál de esos fue el que te convenció de que era un invariante y no una preferencia?** Un case study necesita ese momento; el código tiene el resultado pero no la escena.

**4. ¿Por qué la aprobación parcial?**
Es lo más original del proyecto y **no está en la investigación** — el catálogo tiene approved/rejected y nada más. Alguien lo inventó en el medio. El comentario en `gate-card.tsx` dice que destildar es *"NOT because the resolver was wrong, but because the human holds context the system doesn't."* **¿De dónde salió esa idea?** ¿La viste fallar en un producto real, la pediste vos como usuario del demo, o apareció mirando la lista del gate y notando que aprobar-todo-o-nada era falso? Es la respuesta que separa "diseñé un patrón" de "encontré un patrón".

**5. ¿Para quién es esto, y qué querés que hagan al final?**
El README dice "portfolio piece". Pero está construido con densidad de producto: guardias anti-drift que rompen el build, tres modos de error distintos, rate limiting, degradación digna cuando el modelo cae. **¿A quién estás convenciendo?** ¿Un equipo de diseño de sistemas AI, un hiring manager de producto, un lead de ingeniería? El recorte de la case study cambia mucho: si es diseño, el héroe es el criterio de tiers y el sistema de tokens; si es ingeniería, es el canal doble y el statechart puro; si es producto, es la aprobación parcial. Hoy el repo argumenta las tres cosas con la misma intensidad, y una case study no puede.

---

<sub>Generado leyendo `main` @ `ed71a3e` + los artefactos de investigación en `~/Desktop/Facu/`. Todo número o cita es verificable en el archivo y línea indicados. Donde no pude verificar, está marcado.</sub>
