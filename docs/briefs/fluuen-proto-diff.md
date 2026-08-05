# Fluuen — prototipo vs implementación

Comparación de `docs/briefs/fluuen-case-study-prototype.html` contra
`src/content/case-studies/fluuen.ts` (commit `b005097`).

**Fecha:** 2026-08-05 · **Método:** parseo del HTML del prototipo (se
extrajeron los 4 JPEG en base64 que lo inflaban a 232 KB) contra el HTML
renderizado por el dev server.

> **Aviso general.** El prototipo es notablemente más corto. No es una
> diferencia de detalle, es de densidad: donde la implementación tiene
> `specList` + `decision` + `tradeoff`, el prototipo tiene dos párrafos.

---

## Hero

| Qué | Implementación | Prototipo | ¿Coincide? |
|---|---|---|---|
| Botones | Live demo (sólido) · Figma file · Storybook | idem, mismo orden | ✅ |
| Stats | 848 · 3 · 121 · 6 | idem | ✅ |
| Subtitle | "…a record of what the generator could not guarantee." | "…an honest account of where the two drifted apart." | ❌ |
| Tools | Figma · Tokens Studio · Next.js · Tailwind v4 · Storybook | Figma · Tokens Studio · Next.js | ❌ |

## Cover y CTA #1

| Qué | Implementación | Prototipo | ¿Coincide? |
|---|---|---|---|
| Posición imagen | Entre hero y 00 | idem | ✅ |
| Caption | "Dashboard — the system in production" · tag `Product` | "The shipped product, live on Vercel" · tag `NEW` violeta sólido | ❌ |
| Posición CTA | **Dentro** de la 00, después de la prosa | **Entre** la cover y la 00 | ❌ |
| Estilo CTA | Link inline subrayado dentro de un párrafo | **Caja**: fondo violeta 6%, borde violeta 20%, radio 12px, texto a la izquierda + **botón violeta sólido** a la derecha | ❌ |

## 00 · Overview

| Qué | Implementación | Prototipo | ¿Coincide? |
|---|---|---|---|
| Título | "A design system, and a product built to find out whether it held" | "A system first, then a product to test it" | ❌ |
| Cuerpo | 3 párrafos | 2 párrafos; el segundo es un remate corto: *"It mostly did. This is the account of the 121 places where it didn't."* | ❌ |

## 01 · Where truth lives

| Qué | Implementación | Prototipo | ¿Coincide? |
|---|---|---|---|
| Título | "Every artefact declares what it is the source of" | "Each artefact has one source of truth" | ❌ |
| Estructura | H2 + 2 párrafos + chain + caption + prose + **`decision` "Shipped screens live only in code"** + TODO | H2 + **1 párrafo** + chain + 1 párrafo | ❌ |
| Chain — capas | 4 cajas horizontales | idem, apila en mobile | ✅ |
| Chain — detalle component | `success-text` | `success-bg` | ⚠️ |
| Bloque `decision` | Existe | No existe; va dentro del párrafo | ❌ |

> ⚠️ **Conflicto de dato.** El prototipo muestra
> `success-bg → status.success → green.500 → #3fb950`. Pero `success-bg`
> resuelve a `green.alpha.20` = `#3fb95033`, no a `#3fb950`. La cadena del
> prototipo es internamente inconsistente. La implementación usa `success-text`
> porque sí resuelve a `#3fb950`. Por la regla "manda `_data`" quedó así.
> **Requiere decisión.**

## 02 · The pipeline — *diferencia más grande*

| Qué | Implementación | Prototipo | ¿Coincide? |
|---|---|---|---|
| Título | "A generator, written rather than installed" | "I wrote the generator instead of using Style Dictionary" | ❌ |
| Estructura | H2 + 2 párrafos + **`specList` de 6 pasos** + **`linkOut` al Storybook** + **`decision`** + **`tradeoff`** | H2 + **3 párrafos y nada más** | ❌ |
| Storybook | Bloque `linkOut` con borde y párrafo propio | **Link inline dentro del párrafo 2** | ❌ |
| Costos | Bloque `tradeoff` ámbar | Párrafo 3, arranca *"What it cost:"* | ❌ |
| Imagen + CTA al final | Workflow Builder → CTA → sección 03 | idem | ✅ |

El prototipo **no tiene** `specList` de pasos, ni caja de decisión, ni caja de
tradeoff. Son tres bloques que ahí son prosa.

## 03 · The drift — *diferencia más grande*

| Qué | Implementación | Prototipo | ¿Coincide? |
|---|---|---|---|
| Estructura | H2 + 2 párrafos + **`metrics` de 4 números** + 2 prose + `specList` 54/24/7 + prose + `decision` Inspector + 2 prose + **`specList` de fechas** + `tradeoff` + TODO | H2 + **1 párrafo** + partición 54/24/7 + **1 párrafo** | ❌ |
| 897 / 848 / 85 / 36 | Bloque `metrics`, 4 números grandes | **Dentro del párrafo**, en línea | ❌ |
| Partición 54/24/7 | `specList` (filas label/valor) | **3 tarjetas en grid**, número chico en violeta mono + descripción | ❌ |
| Inspector | Bloque `decision` + 2 párrafos | **Una frase** dentro del párrafo final | ❌ |
| `lastTokenPush: null` | `specList` de 2 filas | **No aparece** | ❌ |
| Cierre | `tradeoff` + TODO | No existe | ❌ |

La 03 del prototipo son **tres** elementos. La implementación tiene **doce**.

## 04 · Classified

| Qué | Implementación | Prototipo | ¿Coincide? |
|---|---|---|---|
| **Orden** | Tabla → **nodo** | **Nodo → tabla** | ❌ |
| Intro | 2 párrafos | 1 párrafo | ❌ |
| Selector de estado | Radios `sr-only` con label | `<button>` | ❌ |
| Etiqueta del bloque | `legend` "Node states" | `LIVE COMPONENT · agent builder node` con punto vivo | ❌ |
| Contenido del nodo | "Send Slack message / a3 / Action · Slack / channel #alerts / chip `ts`" | "Send Email / #a1 / Gmail · send / to sales@acme.io" | ❌ |
| Selected | Borde + glow `0 0 0 3px` | **Solo borde**, sin glow | ❌ |
| Cadena | 4 cajas horizontales con flechas | **4 filas** `label → valor`: `border token` / `↳ semantic` / `↳ primitive` / `value` + swatch | ❌ |
| Nombre del token | `Control/Node/Structure/border-default` | `node.border-default` (forma corta) | ❌ |
| Error — slot component | `—` en gris tenue | **`border.error`** en el slot component y **`(semantic)`** en el slot semantic | ❌ |
| Nota del error | `text-fg-muted` | `--fg-faint` (un paso más tenue) + mono | ⚠️ casi |
| Tabla — filas | 3 (sublabel, border-selected, shipped screens) | idem | ✅ |
| Tabla — celdas | Valor + ubicación de archivo + párrafo de nota | **Swatch + valor**; sin ubicaciones, sin notas | ❌ |
| Tabla — valores fila 2 | `#6366f1 (--color-brand-primary)` / `#818cf8 (--color-border-focus)` | `brand.500` / `brand.400` con swatch | ❌ |
| Tabla — pills | `Product decision` + `Debt · high priority` | **Una sola**: `debt` / `affordance` / `by design` | ❌ |
| `tradeoff` "One of these is filed wrong" | Existe | **No existe** | ❌ |

## 05 · What's true

| Qué | Implementación | Prototipo | ¿Coincide? |
|---|---|---|---|
| Estructura | H2 + intro + **imagen Agents** + `specList` de 6 done + prose + `specList` de 4 debt + párrafo de encuadre | H2 + **1 párrafo** con `Done:` / `Partial by design:` / `Open debt:` en negrita inline + párrafo de encuadre + **imagen Agents** | ❌ |
| Posición imagen | **Al principio**, tras el intro | **Al final**, tras el párrafo de encuadre | ❌ |
| Párrafo de encuadre | Textual | idem | ✅ |

## 06 · Live

| Qué | Implementación | Prototipo | ¿Coincide? |
|---|---|---|---|
| **Orden** | Prosa → **imagen Run Detail** → **figmaEmbed** | **figmaEmbed** → **imagen Run Detail** | ❌ |
| Prosa | 2 párrafos | **Ninguno** | ❌ |
| Embed | `FigmaEmbed` con caption abajo | Barra de header propia: `FIGMA — LIVE FILE` + `OPEN IN FIGMA ↗` | ❌ |

## Barra sticky

| Qué | Implementación | Prototipo | ¿Coincide? |
|---|---|---|---|
| Visibilidad | Aparece pasados **600px** de scroll | **Siempre visible**, desde el pixel cero | ❌ |
| Cerrable | Sí, con ✕ | **No** | ❌ |
| CTA | Link violeta sin fondo | **Botón violeta sólido**, texto `canvas` | ❌ |
| Compensación de layout | Ninguna | `body { padding-bottom: 56px }` | ❌ |
| Mobile | Label + link | Label **oculto**, botón centrado | ❌ |
| Alto / fondo | `py-3` + `bg-raised/95` | `56px` + `rgba(17,17,19,.92)` + blur 12 | ⚠️ casi |

---

## Resumen — lo que decide todo

1. **Densidad.** El prototipo convierte en prosa casi todo lo que está en
   bloques estructurados. Las secciones 02 y 03 son las más afectadas: de 6 y
   12 elementos a 3 y 3.
2. **Orden invertido en dos secciones.** La 04 (nodo antes que tabla) y la 06
   (embed antes que imagen).
3. **Los CTAs son botones, no links.** Los tres: el inline en caja violeta, y
   el sticky sólido, siempre visible y sin cerrar.

**Extra:** los dos `TODO: copy needed` desaparecen — el prototipo tiene texto
para ambos lugares.

**Orden sugerido de ajuste:** (1) y (2) primero, estructura y orden. Después
los CTAs. Al final el reemplazo de texto, que es mucho volumen pero mecánico.

**Pendiente de decisión:** el conflicto `success-bg` vs `success-text` de la 01.
