# Fluuen — Token drift: Figma ↔ JSON ↔ CSS

> Análisis de divergencia entre el design system en Figma y los tokens generados
> en código. Insumo para la sección 03 (System) de la case study.
>
> Fecha del análisis: 2026-08-04
> Archivo Figma (fuente del pipeline): `MOhVXH1k1Aa5tbQJM8QDRF` — "Fluuen Design System"
> Último sync registrado en `globals.css`: 2026-08-03T21:49:02.828Z

---

## El hallazgo

El pipeline de tokens tiene tres eslabones:

```
Figma (variables)  →  Tokens Studio  →  tokens.json (GitHub)  →  sync-tokens.mjs  →  globals.css
```

El script `sync-tokens.mjs` garantiza que **CSS refleje exactamente el JSON**. No hay
nada que garantice que **el JSON refleje Figma**. El JSON se actualiza solo cuando
alguien aprieta "push" en el plugin de Tokens Studio, y ese paso es manual.

Resultado: el CSS estaba perfectamente sincronizado con un JSON que era una foto vieja
del archivo de Figma. La divergencia no es un bug del generador — el generador hizo su
trabajo. Es un eslabón del pipeline que nunca tuvo verificación.

**La divergencia es el hallazgo, no un pendiente.** Un design system con generación
automatizada puede estar 100% consistente internamente y aun así estar desincronizado
de su fuente de verdad, porque la automatización cubre el tramo fácil (transformar
datos) y no el difícil (garantizar que los datos sean actuales).

---

## 1. Tabla resumen

| Métrica | Valor |
|---|---:|
| Variables COLOR en Figma | **848** |
| Custom properties `--color-*` en `globals.css` | **897** |
| Presentes en CSS y ausentes en Figma | **85** |
| Presentes en Figma y ausentes en CSS | **36** |
| Delta neto (85 − 36) | **49** |

El delta de 49 que aparecía al comparar totales era la resta de dos divergencias que se
compensaban parcialmente. Comparar totales lo ocultaba; solo el diff nombre por nombre
lo expuso.

### Conteo por colección

| Colección | Modos | Figma COLOR | JSON color tokens | Δ |
|---|---|---:|---:|---:|
| 🥥 Primitives | Mode 1 | 129 | 129 | 0 |
| 🏷️ Semantic | Mode 1 | 126 | 126 | 0 |
| Components | Mode 1 | 593 | 643 | **+50** |
| **Total** | | **848** | **898** | +50 |

Toda la deriva está en `Components`. Primitives y Semantic coinciden exacto.

El JSON tiene 898 tokens de color pero el CSS emite 897: una colisión de nombres colapsa
dos tokens en uno.

```
🎨 colors.status.error.error-alpha-30   ┐
                                        ├→ --color-status-error-alpha-30
🎨 colors.status.error.error-alpha (30) ┘
```

El segundo (`error-alpha (30)`, con paréntesis) ya no existe en Figma — evidencia extra
de que el JSON es un export viejo.

### Hipótesis descartada

Se testeó que Tokens Studio estuviera exportando sets propios que nunca fueron variables
de Figma. **Falso.** `tokens-source.json` tiene exactamente tres sets, uno por colección:

```json
"$metadata": { "tokenSetOrder": [
  "🥥 Primitives/Mode 1",
  "🏷️ Semantic/Mode 1",
  "Components/Mode 1"
]}
```

No hay tokens que vivan solo en el plugin. Es el mismo archivo, en dos momentos distintos.

### Método

El diff se hizo aplicando las funciones `sanitizeSegment` y `tokenPathToCssVar`
extraídas del propio `scripts/sync-tokens.mjs` (no reimplementadas) a los 848 nombres
leídos de Figma vía Desktop Bridge. Verificaciones de sanidad:

- 848 variables de Figma → 848 nombres CSS distintos
- 0 variables descartadas por el transform (ningún `null`)
- 0 colisiones del lado Figma
- 0 duplicados en las 897 del CSS

---

## 2. Los 85 en CSS y no en Figma

Agrupados por causa. Los conteos suman 85.

| # | Causa | Tokens |
|---|---|---:|
| A | Notification → movido a `⚠️ Deprecated` | 14 |
| B | Badge/Status → se agregó el nivel `Generic` | 18 |
| C | Button/Destructive → se agregó el nivel `Outline`/`Solid` | 13 |
| D | Input → se aplanó (estaba agrupado por estado) | 18 |
| E | SelectionControl → cambió el modelo de estados | 13 |
| F | Table → `row-*` renombrado a `cell-*` | 5 |
| G | Badge/Numeric → se agregó el nivel `Soft`/`Solid` | 3 |
| H | Card → `border-selected` renombrado | 1 |
| | **Total** | **85** |

### A. Notification → Deprecated (14)

El grupo entero se movió a `🎨 colors/⚠️ Deprecated/Notification/` en Figma. Los leaf
names son idénticos; solo cambió el grupo padre. `Deprecated` aparece 0 veces en el JSON.

```
--color-control-notification-action-link          --color-control-notification-item-bg-hover
--color-control-notification-badge-bg             --color-control-notification-item-body
--color-control-notification-badge-text           --color-control-notification-item-time
--color-control-notification-bell-bg-active       --color-control-notification-item-title-read
--color-control-notification-bell-bg-hover        --color-control-notification-item-title-unread
--color-control-notification-bell-icon-active     --color-control-notification-panel-bg
--color-control-notification-bell-icon-default    --color-control-notification-panel-border
```

Estos 14 tienen contraparte 1:1 exacta en los 36 del otro lado.

### B. Badge/Status sin el nivel `Generic` (18)

Figma hoy tiene tres familias de status badge — `Agent`, `Generic`, `Run` — donde antes
había una sola sin calificar. La familia vieja corresponde a `Generic`.

```
--color-control-badge-status-active-bg     --color-control-badge-status-paused-bg
--color-control-badge-status-active-dot    --color-control-badge-status-paused-dot
--color-control-badge-status-active-label  --color-control-badge-status-paused-label
--color-control-badge-status-draft-bg      --color-control-badge-status-running-bg
--color-control-badge-status-draft-dot     --color-control-badge-status-running-dot
--color-control-badge-status-draft-label   --color-control-badge-status-running-label
--color-control-badge-status-error-bg      --color-control-badge-status-selected-bg
--color-control-badge-status-error-dot     --color-control-badge-status-selected-dot
--color-control-badge-status-error-label   --color-control-badge-status-selected-label
```

### C. Button/Destructive sin variante (13)

El botón destructivo se abrió en dos variantes visuales. Los 13 leaf names viejos
coinciden exacto con `Solid` (13/13); `Outline` tiene 12 (le falta `border-focus`).

```
--color-control-button-destructive-bg-active       --color-control-button-destructive-icon-default
--color-control-button-destructive-bg-default      --color-control-button-destructive-icon-disabled
--color-control-button-destructive-bg-disabled     --color-control-button-destructive-icon-hover
--color-control-button-destructive-bg-hover        --color-control-button-destructive-label-default
--color-control-button-destructive-border-default  --color-control-button-destructive-label-disabled
--color-control-button-destructive-border-disabled --color-control-button-destructive-label-hover
--color-control-button-destructive-border-focus
```

### D. Input reagrupado por estado (18)

El CSS viejo agrupa `Input/<Estado>/<prop>-<estado>`, repitiendo el estado dos veces.
Figma hoy lo tiene plano: `Input/<prop>-<estado>`. Es una simplificación del DS.

```
--color-control-input-default-bg-default          --color-control-input-disabled-text-disabled
--color-control-input-default-border-default      --color-control-input-error-bg-error
--color-control-input-default-helper-default      --color-control-input-error-border-error
--color-control-input-default-icon-default        --color-control-input-error-helper-error
--color-control-input-default-placeholder-default --color-control-input-error-icon-helper-error
--color-control-input-default-text-default        --color-control-input-error-text-error
--color-control-input-disabled-bg-disabled        --color-control-input-focus-border-focus
--color-control-input-disabled-border-disabled    --color-control-input-focus-ring-focus
--color-control-input-disabled-icon-disabled
--color-control-input-disabled-placeholder-disabled
```

### E. SelectionControl con modelo de estados viejo (13)

El caso más profundo: no es un renombre, es un cambio de modelo. El DS viejo pensaba
checkbox/radio/toggle en términos de interacción (`default` / `hover`); el nuevo los
piensa en términos de estado semántico (`checked` / `unchecked` / `disabled`). Los
estados de hover directamente no existen más como token.

```
--color-control-selectioncontrol-checkbox-bg-checked-hover  --color-control-selectioncontrol-radio-bg-default
--color-control-selectioncontrol-checkbox-bg-default        --color-control-selectioncontrol-radio-bg-hover
--color-control-selectioncontrol-checkbox-bg-hover          --color-control-selectioncontrol-radio-border-default
--color-control-selectioncontrol-checkbox-border-default    --color-control-selectioncontrol-radio-border-hover
--color-control-selectioncontrol-checkbox-border-focus      --color-control-selectioncontrol-toggle-thumb-default
--color-control-selectioncontrol-checkbox-border-hover      --color-control-selectioncontrol-toggle-track-default
                                                            --color-control-selectioncontrol-toggle-track-hover
```

### F. Table `row-*` → `cell-*` (5)

```
--color-control-table-row-bg-default  --color-control-table-row-text
--color-control-table-row-bg-hover    --color-control-table-row-text-muted
--color-control-table-row-bg-selected
```

### G. Badge/Numeric sin variante (3)

```
--color-control-badge-numeric-bg-brand
--color-control-badge-numeric-bg-error
--color-control-badge-numeric-text
```

### H. Card, renombrado suelto (1)

```
--color-control-card-border-selected
```

---

## 3. Los 36 en Figma y no en CSS

| # | Grupo | Tokens |
|---|---|---:|
| I | AgentBuilder/Inspector — componente completo ausente | 20 |
| J | Notification bajo Deprecated — contraparte de (A) | 14 |
| K | Sueltos | 2 |
| | **Total** | **36** |

### I. AgentBuilder / Inspector: componente entero que el CSS no conoce (20)

El caso más relevante para la case study. No es un token suelto ni un renombre: es un
**componente completo diseñado en Figma que nunca llegó al código**. La palabra
`Inspector` aparece **0 veces** en `tokens-source.json`.

El Inspector es el panel lateral del Agent Builder — la pantalla estrella del producto.
Se diseñó completo (tabs, logs con duración y timestamp, outputs tipados, estado de test)
y sus 20 tokens quedaron del lado de Figma.

```
--color-control-agentbuilder-inspector-bg              --color-control-agentbuilder-inspector-output-type
--color-control-agentbuilder-inspector-border          --color-control-agentbuilder-inspector-output-var
--color-control-agentbuilder-inspector-footer-border   --color-control-agentbuilder-inspector-row-bg
--color-control-agentbuilder-inspector-header-id       --color-control-agentbuilder-inspector-section-label
--color-control-agentbuilder-inspector-header-label    --color-control-agentbuilder-inspector-tab-active
--color-control-agentbuilder-inspector-icon            --color-control-agentbuilder-inspector-tab-inactive
--color-control-agentbuilder-inspector-icon-bg-hover   --color-control-agentbuilder-inspector-tab-underline
--color-control-agentbuilder-inspector-icon-hover      --color-control-agentbuilder-inspector-test-border
--color-control-agentbuilder-inspector-log-duration    --color-control-agentbuilder-inspector-test-text
--color-control-agentbuilder-inspector-log-time        --color-control-agentbuilder-inspector-test-text-hover
```

Los otros dos subgrupos de AgentBuilder (`Topbar`, `NodePanel`) **sí** están en el CSS.
Solo faltó Inspector, lo que fecha el diseño del Inspector como posterior al último push
del plugin.

### J. Notification bajo Deprecated (14)

Contraparte exacta de (A). Mismos leaf names, distinto grupo padre.

```
--color-deprecated-notification-action-link       --color-deprecated-notification-item-bg-hover
--color-deprecated-notification-badge-bg          --color-deprecated-notification-item-body
--color-deprecated-notification-badge-text        --color-deprecated-notification-item-time
--color-deprecated-notification-bell-bg-active    --color-deprecated-notification-item-title-read
--color-deprecated-notification-bell-bg-hover     --color-deprecated-notification-item-title-unread
--color-deprecated-notification-bell-icon-active  --color-deprecated-notification-panel-bg
--color-deprecated-notification-bell-icon-default --color-deprecated-notification-panel-border
```

### K. Sueltos (2)

```
--color-control-edge-success   (nuevo estado de edge en el canvas del builder)
--color-text-on-brand          (semántico: texto sobre superficie de marca)
```

`--color-text-on-brand` es el más sensible de los dos: es un token semántico de
accesibilidad (contraste sobre brand) que el código no tiene disponible.

---

## 4. Tokens stale referenciados en código fuente

De los 85, hay **9 distintos** referenciados en componentes reales. El resto solo aparece
en `case-study/tokens.css` y en el build de Storybook (`storybook-static/`), que son
copias derivadas de `globals.css`, no uso real.

Estos 9 son los que rompen si se resincroniza sin remapear:

| Token stale | Archivo | Líneas |
|---|---|---|
| `--color-control-badge-status-active-dot` | `components/dashboard/agent-status.tsx` | 6 |
| `--color-control-badge-status-paused-dot` | `components/dashboard/agent-status.tsx` | 7 |
| `--color-control-badge-status-draft-dot` | `components/dashboard/agent-status.tsx` | 8 |
| `--color-control-badge-status-error-dot` | `components/dashboard/agent-status.tsx` | 9 |
| `--color-control-input-default-bg-default` | `components/agents/wizard/step-actions.tsx` | 55, 103 |
| | `components/agents/wizard/step-configure.tsx` | 57, 74, 99, 151 |
| | `components/agents/wizard/step-review.tsx` | 101, 195 |
| | `components/agents/wizard/step-trigger.tsx` | 52, 94 |
| `--color-control-input-default-border-default` | `components/agents/wizard/step-configure.tsx` | 58, 75 |
| `--color-control-input-default-text-default` | `components/agents/wizard/step-configure.tsx` | 59 |
| `--color-control-input-default-placeholder-default` | `components/agents/wizard/step-configure.tsx` | 76 |
| `--color-control-input-focus-border-focus` | `components/agents/wizard/step-configure.tsx` | 55, 72 |
| | `components/agents/wizard/step-trigger.tsx` | 113 |

En `agent-status.tsx` el uso es vía clase Tailwind (`bg-control-badge-status-active-dot`),
no `var()`. Los otros 5 son `var(--…)` en `style` o en arbitrary values de Tailwind.

Los 9 caen en los grupos B y D, que son los dos grupos **mecánicos**: el remapeo de estos
9 es sustitución directa, sin decisiones de diseño.

---

## 5. Mapeo propuesto

Clasificación de los 85 según qué tan resoluble es el destino:

| Tipo | Tokens |
|---|---:|
| **Mecánico** — destino 1:1 inequívoco, sustitución textual | 54 |
| **Con criterio** — existe destino pero hay que elegir | 24 |
| **Sin destino** — la estructura ya no existe | 7 |
| **Total** | **85** |

### 5.1 Mecánicos (54)

Sustitución directa. Se pueden aplicar con un find & replace verificado.

**Notification → Deprecated (14)** — patrón:
```
--color-control-notification-*  →  --color-deprecated-notification-*
```

**Badge/Status → Generic (18)** — patrón:
```
--color-control-badge-status-<estado>-<prop>
  → --color-control-badge-status-generic-<estado>-<prop>
```
Aplica a: `active`, `draft`, `error`, `paused`, `running`, `selected` × `bg`, `dot`, `label`.

**Input aplanado (17 de 18)** — se elimina el segmento de estado redundante:
```
--color-control-input-default-bg-default          → --color-control-input-bg-default
--color-control-input-default-border-default      → --color-control-input-border-default
--color-control-input-default-helper-default      → --color-control-input-helper-default
--color-control-input-default-icon-default        → --color-control-input-icon-default
--color-control-input-default-placeholder-default → --color-control-input-placeholder-default
--color-control-input-default-text-default        → --color-control-input-text-default
--color-control-input-disabled-bg-disabled        → --color-control-input-bg-disabled
--color-control-input-disabled-border-disabled    → --color-control-input-border-disabled
--color-control-input-disabled-icon-disabled      → --color-control-input-icon-disabled
--color-control-input-disabled-placeholder-disabled → --color-control-input-placeholder-disabled
--color-control-input-disabled-text-disabled      → --color-control-input-text-disabled
--color-control-input-error-bg-error              → --color-control-input-bg-error
--color-control-input-error-border-error          → --color-control-input-border-error
--color-control-input-error-helper-error          → --color-control-input-helper-error
--color-control-input-error-text-error            → --color-control-input-text-error
--color-control-input-focus-border-focus          → --color-control-input-border-focus
--color-control-input-focus-ring-focus            → --color-control-input-ring-focus
```

**Table row → cell (5)**:
```
--color-control-table-row-bg-default  → --color-control-table-cell-bg-default
--color-control-table-row-bg-hover    → --color-control-table-cell-bg-hover
--color-control-table-row-bg-selected → --color-control-table-cell-bg-selected
--color-control-table-row-text        → --color-control-table-cell-text
--color-control-table-row-text-muted  → --color-control-table-cell-text-muted
```

### 5.2 Con criterio (24)

Hay destino, pero elegirlo es una decisión de diseño, no de sintaxis.

**Button/Destructive → elegir variante (13).** Los 13 leaf names viejos coinciden exacto
con `Solid`, así que `Solid` es el default defendible. Pero cada uso en código tiene que
verificarse: un botón destructivo con borde y fondo transparente necesita `Outline`.
```
--color-control-button-destructive-<prop>
  → --color-control-button-destructive-solid-<prop>     (default propuesto)
  → --color-control-button-destructive-outline-<prop>   (si el uso es outline)
```
Nota: `Outline` no tiene `border-focus`. Si un uso outline necesita focus, es un gap del
DS que hay que resolver en Figma, no en código.

**Input: el nombre malformado (1).**
```
--color-control-input-error-icon-helper-error  →  --color-control-input-icon-error
```
El nombre viejo mezcla `icon` y `helper` en un solo token. Hay que confirmar en Figma si
era el ícono del campo o el ícono del texto de ayuda antes de mapearlo.

**SelectionControl: `default` → `unchecked` (6).** El mapeo semántico es razonable pero
es una interpretación: el DS nuevo no dice que `default` era `unchecked`, lo inferimos.
```
--color-control-selectioncontrol-checkbox-bg-default     → …checkbox-bg-unchecked
--color-control-selectioncontrol-checkbox-border-default → …checkbox-border-unchecked
--color-control-selectioncontrol-radio-bg-default        → …radio-bg-unchecked
--color-control-selectioncontrol-radio-border-default    → …radio-border-unchecked
--color-control-selectioncontrol-toggle-thumb-default    → …toggle-thumb-unchecked
--color-control-selectioncontrol-toggle-track-default    → …toggle-track-unchecked
```

**Badge/Numeric → elegir variante (3).** `Soft` distingue `text-brand` / `text-error`;
`Solid` tiene un único `text`. El viejo `text` sin sufijo sugiere `Solid`, pero los
`bg-*` no lo aclaran.
```
--color-control-badge-numeric-bg-brand → …numeric-soft-bg-brand │ …numeric-solid-bg-brand
--color-control-badge-numeric-bg-error → …numeric-soft-bg-error │ …numeric-solid-bg-error
--color-control-badge-numeric-text     → …numeric-solid-text    (probable)
```

**Card: `selected` → `active` (1).**
```
--color-control-card-border-selected  →  --color-control-card-border-active
```
Hay que confirmar que sean el mismo token conceptual. "Selected" y "active" pueden ser
dos estados distintos que convivían, y en ese caso esto no es un renombre sino una
pérdida.

### 5.3 Sin destino (7)

No hay token equivalente en Figma. No es un renombre: la estructura desapareció.

```
--color-control-selectioncontrol-checkbox-bg-hover
--color-control-selectioncontrol-checkbox-bg-checked-hover
--color-control-selectioncontrol-checkbox-border-hover
--color-control-selectioncontrol-checkbox-border-focus
--color-control-selectioncontrol-radio-bg-hover
--color-control-selectioncontrol-radio-border-hover
--color-control-selectioncontrol-toggle-track-hover
```

Seis son estados de hover; uno es un border de focus. El DS nuevo de SelectionControl
no tokeniza hover ni focus para checkbox/radio/toggle.

**Esto es un gap real del DS, no un problema de sync.** Si los componentes necesitan
hover y focus visibles — y para accesibilidad, focus es obligatorio — hay que agregar
esos tokens en Figma y volver a sincronizar. Resolverlo en código con valores hardcodeados
sería exactamente lo que el DS existe para evitar.

---

## 6. Orden de aplicación propuesto

1. Re-exportar desde Tokens Studio con el archivo `MOhVXH1k1Aa5tbQJM8QDRF` abierto
2. `npm run tokens:sync`
3. Aplicar los 9 remapeos en código fuente (todos caen en 5.1, mecánicos)
4. Revisar `case-study/tokens.css` — es una copia derivada, hay que regenerarla
5. Rebuild de Storybook (`storybook-static/` tiene los nombres viejos compilados)
6. Decidir los 7 sin destino: agregarlos al DS en Figma o documentar la ausencia

Los grupos 5.2 (con criterio) no bloquean: ninguno de esos 24 está referenciado en código
fuente hoy. Se resuelven cuando se construyan los componentes que los necesiten.

---

## 7. Recomendación de proceso

El fix puntual no evita la recurrencia. Lo que falta es verificación del eslabón
Figma→JSON:

- **Un check en CI** que compare el conteo y los nombres de variables de Figma contra
  `tokens-source.json` y falle si divergen. El diff de este documento se generó con
  ~40 líneas de Node; automatizarlo es barato.
- **Fecha de export en el JSON.** Hoy `globals.css` registra `Last sync` (cuándo corrió
  el script) pero nada registra cuándo se pusheó desde Tokens Studio. Son dos momentos
  distintos y solo uno está trazado.
- **Regla de nombres.** Varios de los 85 son consecuencia de reestructurar jerarquías en
  Figma (agregar un nivel `Generic`, `Solid`, `Outline`). Cada nivel nuevo rompe todos
  los nombres de ese subárbol. Vale la pena decidir la profundidad de la jerarquía antes
  de escalar el DS, o aceptar que reestructurar implica un remapeo.

---

## Anexo — cómo se reprodujo

```js
// Lado Figma: vía Desktop Bridge (figma-console MCP), solo lectura
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const colorVars = vars.filter(v => v.resolvedType === 'COLOR');

// Lado CSS: bloque GENERATED de app/globals.css
// awk '/=== GENERATED BY/,/=== END GENERATED/' app/globals.css
//   | grep -oE '^\s*--color-[a-z0-9-]+'

// Normalización: se extraen sanitizeSegment y tokenPathToCssVar del propio
// scripts/sync-tokens.mjs por parseo del source, para evitar drift entre
// la implementación real y una reimplementación.
```

Ningún archivo de Fluuen ni de Figma fue modificado durante el análisis.
