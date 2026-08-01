# Fluuen — Design Decisions

**Propósito:** documento de respaldo para la case study. Registra *por qué* se tomó cada decisión y, sobre todo, **si fue una decisión o una consecuencia**. Está escrito para sobrevivir una repregunta de entrevista, no para adornar un portfolio.

**Fecha:** 2026-07-31
**Fuentes:** historial de sesiones del proyecto (feb–jul 2026), `FLUUEN_DEV_STATE.md`, logs de `npm run tokens:sync`, conteos verificados en Figma (`MOhVXH1k1Aa5tbQJM8QDRF`).

---

## Cómo leer este documento

| Marca | Significado |
|---|---|
| **[DECIDIDO]** | Hubo un momento identificable donde se evaluó y se eligió. Existe rastro. |
| **[EMERGENTE]** | Pasó por inercia, limitación técnica o desplazamiento de foco. Resultó conveniente después. Contarlo como decisión sería racionalización hacia atrás. |
| **[MIXTO]** | El *qué* fue decidido; el *por qué* que se cuenta hoy se construyó después. |
| **[NO VERIFICADO]** | No hay rastro suficiente. No lo lleves a la case study sin chequearlo vos. |

**Regla de uso:** todo lo marcado `[EMERGENTE]` sigue siendo material válido de portfolio — pero se cuenta como "esto emergió y lo reconocí", no como "esto lo planifiqué". La segunda versión se cae; la primera suena a alguien que sabe leer su propio proceso.

---

## 1. El Design System como entregable, no el producto

### 1.1 El DS terminó siendo el entregable — **[EMERGENTE]**

**Contexto.** El orden real de los hechos no coincide con el orden que sugiere la narrativa actual.

El Design System arrancó primero (feb–abr 2026, todavía bajo el nombre "Next Agent") como trabajo de sistema: primitivas, escala River Styx, migración tipográfica a Geist, tokens de componentes por capas. El producto entró después, en mayo, y entró explícitamente **como demo de portfolio para Upwork**: sandbox sin login, estado fake en localStorage, 5–7 pantallas navegables, roadmap de 4 semanas. El objetivo declarado en ese momento era tener un link para mandar en propuestas.

O sea: el producto **no** nació como campo de pruebas del sistema. Nació como el entregable.

**Elección.** El reframe ocurrió alrededor del 2026-06-29, armando el post de LinkedIn. Ahí aparecieron dos cosas al mismo tiempo:

1. Vos mismo dijiste que el DS en Figma **quedó incompleto** — "llegué hasta una etapa donde ya podía pasar a código".
2. Al no poder reclamar "design system completo" ni "identidad de marca" como entregables, la tesis del post se reorganizó alrededor de lo único que sí era defendible al 100%: **el sistema sobrevivió a producción**. El producto pasó a ser la prueba del sistema, no el logro en sí.

**Por qué.** Criterio real: era la única versión de la historia donde todos los claims eran verificables. "Diseñé un DS completo" era falso. "Hay un producto en vivo corriendo sobre el sistema" es incontestable — está funcionando, se puede abrir. La reformulación se eligió por **defendibilidad**, no por estrategia narrativa previa.

Lo que hace que el reframe sea legítimo y no un invento: el umbral "Figma maduró hasta el punto de ser generable en código, y de ahí el sistema vive en el repo" **sí es** el workflow que estabas ejecutando. La lectura llegó después que el hecho, pero describe el hecho correctamente.

**Tradeoff.** Perdiste la posibilidad de contar el arco "plan → ejecución" con el DS como entregable planificado desde el día uno, porque no fue así. Y en la case study hay un riesgo concreto: si presentás el DS como el objetivo original, alguien que pregunte "¿y por qué el CLAUDE.md de mayo describe un demo de producto con banner de demo mode, reset y onboarding?" te encuentra la costura. La versión honesta es más fuerte y no tiene ese flanco.

> **Cómo contarlo:** "Empecé el sistema, después construí un producto para probarlo. En el camino entendí que el producto era el test, no el entregable." Eso es exacto y suena a criterio.

---

### 1.2 El código está congelado — **[MIXTO]**

**Contexto.** El repo del producto no se toca desde ~junio 2026. Hay divergencias conocidas entre Figma y código que siguen abiertas (ver sección 3). La pregunta es si eso es una decisión o abandono.

**Elección.** Hay rastro de una decisión **a nivel sesión**, repetida y explícita: en las iteraciones de componentización de julio vos cortaste el scope a mano — *"No quiero modificar nada del repositorio de Github"* — y a partir de ahí cada prompt a CC llevó el constraint `⚠️ SCOPE: SOLO Figma. NO tocar repo. NO tokens:sync`. Cuando apareció el code-align sweep, se sacó del prompt y se registró como pendiente en `FLUUEN_DEV_STATE.md` en vez de ejecutarlo.

**Por qué.** El criterio que sí está registrado es **separación de concerns y disciplina de scope**: son dos repos, dos tipos de trabajo, y mezclarlos en una sesión implicaba cerrar dos cosas a medias. Sumado a esto: de las 6 divergencias abiertas, solo una (el contraste del sublabel) tenía impacto real en usuarios; el resto era cosmético o requería decisión de producto. Abrir una sesión de repo por eso no rendía.

**Lo que NO hay rastro de.** No existe en el historial una decisión del tipo *"el código queda congelado a propósito porque el artefacto es el sistema"*. Esa es una lectura retrospectiva. Lo que hay es una serie de decisiones de scope, cada una razonable, que **acumuladas** produjeron un freeze — y el freeze después resultó coherente con la tesis.

**Tradeoff.** Congelar tiene un costo que la case study debería nombrar: el fix de accesibilidad del sublabel (`#6b7280` → `#868e9e`) sigue sin aplicar en producción. Un producto en vivo con un problema de contraste conocido y documentado, dentro de una case study que presume de rigor de sistema, es exactamente el detalle que un revisor senior busca. **Recomendación: aplicá ese fix único antes de publicar, o mencionalo como deuda abierta.** Las dos opciones son defendibles; la que no lo es, es que esté ahí y no lo digas.

> **Cómo contarlo:** "El código quedó congelado en el estado en que se publicó. La sincronización pendiente está clasificada y priorizada, no olvidada." Verdadero. No digas "congelado a propósito como decisión de arquitectura" — eso no pasó.

---

## 2. La discrepancia entre el CLAUDE.md y el código

### 2.1 Veredicto: **documento desactualizado** — **[EMERGENTE]**

**Respuesta directa a tu pregunta: ni descartadas ni postergadas. El documento nunca fue reconciliado con lo que se construyó.**

**Contexto.** El `CLAUDE.md` se escribió entre el 2026-05-12 y el 2026-05-28, **antes de que existiera una línea de código del producto**. Es una spec de arranque, derivada del roadmap de 4 semanas. Su función era orientar a Claude Code al inicio, no describir el estado del sistema. Nunca se actualizó contra el resultado.

**Los ítems en cuestión y su origen:**

| Ítem en CLAUDE.md | Origen | Estado real |
|---|---|---|
| Zustand con `persist` + un store por dominio (`agents`, `runs`, `integrations`, `settings`), keys `fluuen:*` | Spec de mayo | Zustand **sí** está en el stack. La estructura por dominio con `persist` — **[NO VERIFICADO]** |
| `lib/simulation/runAgent.ts` centralizado (queued → 800ms → running → logs cada 1–2s → completed en 10–15s) | Spec de mayo | No existe según tu análisis de código. Sin registro de descarte |
| Banner "Demo mode" + botón Reset en todas las pantallas | Spec de mayo | No existe. Sin registro de descarte |
| Reset = `localStorage.clear()` + reload | Spec de mayo | No existe |
| Onboarding tooltip (cookie `fluuen:onboarded`) | Spec de mayo | No existe. Sin registro de descarte |
| Mobile fallback screen (<1024px) | Spec de mayo, semana 3 del roadmap | No existe |
| OG image + meta tags + favicon | Spec de mayo | **Sí existe** — se implementó en junio vía `next/og` con carga server-side de fuentes |

**Por qué pasó.** El patrón es reconocible y no requiere inventar una razón: los tres ítems que faltan (mobile fallback, onboarding, banner de demo) estaban agendados en **semana 3 y 4** de un roadmap de 4 semanas. El proyecto corrió 12 sprints, no 4. Lo que se movió fue la cola de la lista — que es siempre lo que se cae. `runAgent.ts` centralizado es una decisión de arquitectura interna que probablemente se resolvió distinto durante la implementación, sin que quedara registrada. **[NO VERIFICADO]** en cuanto a si fue una decisión de CC o tuya.

**Tradeoff.** El costo de esto no es haber cortado features — es que **el documento que se declara "fuente de verdad viva" describe cosas que no existen**. Esto rompe la afirmación más fuerte de tu proceso ("`FLUUEN_DEV_STATE.md` como documento de verdad viva", "CC se negó a registrar algo como hecho antes de que existiera"). Si un entrevistador te pide ver el CLAUDE.md, encuentra ficción de mayo.

**Acción concreta antes de publicar:**
1. **No menciones ninguno de estos ítems en la case study.** Ninguno.
2. Reconciliá el `CLAUDE.md` — o marcá el bloque como `## Spec inicial (mayo 2026) — histórico, no refleja el estado actual`. Cinco minutos, y convierte un flanco en evidencia de higiene documental.

---

## 3. Divergencia clasificada, no reconciliada

### 3.1 Respuesta sin rodeos: **sí, la lista existe — pero es más chica de lo que la tesis sugiere.**

Existe como artefacto real. Se generó durante las iteraciones de componentización del Agent Builder (2026-07-02 al 07-04), se registró en `FLUUEN_DEV_STATE.md` como pendiente `"code-align sweep (repo, aparte)"`, y tiene 6 entradas con sus valores hex concretos y su clasificación en 3 categorías. No es una racionalización: cuando apareció la divergencia #6, se categorizó *en el momento*, no después.

**Pero el alcance real es este, y conviene que lo sepas antes de que te lo pregunten:**

- La lista cubre **el Agent Builder**, no el sistema entero. Nació de comparar `canvas-node.tsx` y el catálogo de nodos contra `Control/Node/*` y `Control/AgentBuilder/*`.
- **No es** un sweep sistemático Figma↔código de todas las pantallas. Ese barrido nunca se corrió.
- Al 2026-07-04, las 6 seguían **sin ejecutar**. **[NO VERIFICADO]** si algo se aplicó después.

Eso significa que la tesis "divergencia clasificada, no reconciliada" es **verdadera pero acotada**. La formulación honesta y todavía fuerte es: *"cuando aparecieron divergencias, se clasificaron en vez de absorberse — acá está el método aplicado al Agent Builder"*. La formulación que no sobrevive una repregunta es *"todas las divergencias del sistema están clasificadas"*.

### 3.2 La tabla

**Certeza alta (registrada con valores exactos en el momento):** entradas 1–6.
**Reconstrucción (documentada en sesiones, no en la lista formal):** entradas 7–8.

| # | Divergencia | Dónde vive cada versión | Por qué se dejó así | ¿Permanente o deuda? | Confianza |
|---|---|---|---|---|---|
| 1 | **Sublabel del nodo:** `#6b7280` vs `#868e9e` | Código: `canvas-node.tsx` · Figma: `Control/Node/*` (AA-correcto) | Sync mecánico — el token gana. Se difirió solo por scope de sesión (no tocar repo) | **Deuda — prioridad alta.** Es contraste, afecta usuarios reales | Certeza |
| 2 | **Divider:** `#1a1a24` vs `#1e1e26` | Código vs token | Sync mecánico, cosmético | Deuda baja | Certeza |
| 3 | **Card background:** `#0f0f17` vs `#111116` | Código vs token | Sync mecánico, cosmético. Chequear que no se funda con los paneles al aplicar | Deuda baja | Certeza |
| 4 | **Border selected:** `#6366f1` vs `#818cf8` | Código vs token | Registrada como sync, **pero anotada como "decidir por ojo, NO auto"** — es affordance, no color plano | Deuda — **y está mal clasificada** (ver 3.3) | Certeza |
| 5 | **Jerarquía de CTA: Run vs Publish** | Código: una jerarquía · Figma: otra | **Decisión de producto.** Alguien tiene que elegir cuál es la acción primaria. Se marcó explícitamente como "no alinear en automático" | Abierta — requiere criterio, no sync | Certeza |
| 6 | **Íconos del catálogo de nodos:** grises vs coloreados por tipo | Código: grises · Figma: color por tipo (`Node/{type}/accent`) | **Figma-ahead.** El diseño tomó la mejor decisión — affordance + coherencia 1:1 con el nodo del canvas. No es drift, es adelanto | Deuda del código — el código alcanza al diseño | Certeza |
| 7 | **Tipografía en el repo de tokens:** Inter + JetBrains Mono vs Geist + Geist Mono | `fluuen-tokens/tokens/tokens.json` (primitivas viejas) · Producto y Figma: Geist | Se detectó el 2026-06-27 y se marcó para reconciliar por separado del cambio de frame en Figma | **[NO VERIFICADO]** si se cerró. Si sigue abierta, es la más grave: contamina el pipeline, no solo un componente | Reconstrucción |
| 8 | **Pantallas shippeadas que no existen en Figma** | Código: fuente de verdad de pantallas · Figma: solo tokens + librería de componentes | **Permanente y decidida** (2026-07-02). Redibujar pantallas shippeadas se identificó como anti-patrón: garantiza drift | **Permanente por diseño.** No es deuda | Certeza |

### 3.3 Dos cosas que te van a preguntar y conviene tener listas

**El #4 está mal archivado.** En el registro final quedó agrupado como "sync mecánico #1–4", pero la nota original decía *"affordance, decidir por ojo, NO auto"*. Es decir: por criterio pertenece a la categoría "decisión de producto" junto al #5, no a sync mecánico. **Es un error de clasificación real en tu propio artefacto.** Tenés dos opciones honestas: corregirlo antes de publicar, o —más interesante— contarlo. "La clasificación misma tuvo un error de archivado que detecté después" es la clase de detalle que **prueba** que el sistema existe, porque nadie inventa fallas en un artefacto ficticio.

**Los token gaps son un hallazgo aparte y valen más de lo que parecen.** Durante el mismo barrido aparecieron tres huecos del sistema, no del código:
- Faltaba `Control/Edge/success` — se usó `status/success` como stand-in, o sea un componente aliaseando directo a semántico, saltando la capa. Eso contradice la arquitectura de 3 capas que es el corazón de tu sistema.
- Faltaba `text/on-brand`.
- Tokens `node-*` legacy sin uso, pendientes de limpieza.

**[NO VERIFICADO]** si `Control/Edge/success` y `text/on-brand` se crearon. Chequealo: si están, es un buen micro-relato (encontré una violación de mi propia arquitectura y la cerré). Si no están, no lo menciones.

**Tradeoff general de esta sección.** La divergencia clasificada es tu mejor material y también tu mayor exposición. Lo que la sostiene no es la tesis — es que existen los hex exactos, las tres categorías, la marca de "no alinear en automático" en el #5, y la fecha. Llevá **la tabla** a la case study, no solo el concepto. Un concepto sin tabla es indistinguible de una excusa; una tabla con hex y fechas no se puede falsear.

---

## 4. Script propio (`sync-tokens.mjs`) en vez de Style Dictionary — **[DECIDIDO]**

**Contexto.** 2026-05-28. Los tokens ya vivían en `fluuen-tokens` vía Tokens Studio, pero el flujo a código era manual: bajar el JSON, copiar valores a mano a `globals.css`. El riesgo concreto era que CC inventara valores hex en vez de leer los reales. Había dos caminos y se pusieron sobre la mesa explícitamente, con pros y contras, antes de escribir una línea.

**Elección.** Script custom de ~150 líneas, cero dependencias. Style Dictionary quedó descartado en ese momento, con la nota explícita de que migrar después sería *movimiento lateral, no rework*.

**Por qué.** Cuatro razones registradas, en orden de peso real:

1. **El JSON de Tokens Studio tenía quirks que Style Dictionary no come out-of-the-box.** Las colecciones vienen con emoji en el nombre (`🥥 Primitives/Mode 1`, `🏷️ Semantic/Mode 1`) y traen los scopes de Figma. Con Style Dictionary había que escribir transformers custom igual — o sea, se pagaba la curva de aprendizaje *más* el código propio.
2. **El output requerido era uno solo: CSS variables** para Tailwind v4. Nada de SCSS, iOS, Android. Toda la extensibilidad de Style Dictionary era capacidad ociosa.
3. **Setup más rápido** (~60 min vs 90+).
4. **Aprendizaje.** Entender cómo se parsea, se aplana y se resuelve un árbol de alias es conocimiento que aplica a cualquier pipeline, incluido Style Dictionary si algún día hace falta.

**Los cuatro trabajos que el script hace** (y que corresponden a lo que preguntaste):

| Trabajo | Qué resuelve |
|---|---|
| **Fetch** | Baja el `tokens.json` fresco desde `raw.githubusercontent.com`. Sin paso manual = sin copia stale |
| **Aplanado** | `{"🥥 Primitives/Mode 1": {colors: {graphite: {500: {$value}}}}}` → `graphite-500`. Es lo que Style Dictionary no hacía sin transformer custom por el emoji y la estructura de modos |
| **Resolución de alias** | `{colors.graphite.500}` → `#1e2127`. Resuelve la cadena Primitive → Semantic → Component completa antes de escribir |
| **Dedup de segmentos en el naming** | `status.success.success` → `--color-status-success`, no `--color-status-success-success`. Idem `error`, `warning`, `info`, `trigger`, `ai` y todas sus variantes (`success-light`, `error-surface`). **Esto no fue parte del diseño original — se agregó después, cuando el naming duplicado ya estaba en el CSS.** |
| **Convivencia manual/generado** | Reemplaza solo el bloque `GENERATED` dentro de `@theme` y preserva la configuración manual (`:root`, `body`, `code`) |

**Lo que costó.** Acá está la parte honesta, y no es trivial:

- **El dedup de segmentos fue reparación, no diseño.** El script v1 escupía `--color-status-success-success`. Hubo que volver, modificar `tokenPathToCssVar`, y **además limpiar a mano el bloque manual de `globals.css`** borrando todos los `--color-fg-*` y `--color-success-NNN` / `warning` / `error` / `info` que ya estaban cubiertos por Figma con otro naming. Eso es una sesión entera de deuda que el camino estándar probablemente no habría generado.
- **Se conservaron tokens manuales que nunca llegaron a Figma:** `--color-bg-primary/secondary/tertiary`, `--color-surface-primary/secondary/tertiary`, todos los `--color-node-*`, `--font-sans`, `--font-mono`. Esa convivencia es la que hoy te complica reconciliar los conteos (sección 6).
- **Costo de naming heredado en todo el código de producto:** `text-text-primary`, `bg-status-success`. Feo, pero alineado 1:1 con Figma — se aceptó a conciencia.
- **No hay soporte de light mode ni de otros formatos.** Si alguna vez hacen falta, se codean a mano.
- **No hay comunidad ni docs detrás.** El único que puede debuggear el pipeline sos vos.
- **El script no valida ni reporta.** Solo cuenta y escribe. Por eso una discrepancia de 49 tokens pudo vivir meses sin que nadie la viera (sección 6). Un pipeline estándar tampoco te la habría marcado necesariamente, pero un pipeline con paso de reporte sí.

> **Cómo contarlo:** el argumento fuerte no es "escribí mi propio pipeline". Es **"evalué el estándar de la industria, elegí no usarlo por razones concretas del formato de origen, y sé exactamente qué me costó esa elección"**. Lo segundo es lo que suena senior. La lista de costos de arriba es el activo, no el pasivo.

---

## 5. Qué cuenta como "terminado"

### 5.1 El estado real, en tres columnas

**Terminado y defendible sin asteriscos:**
- El sistema de tokens y su pipeline (Figma → Tokens Studio → repo → `tokens:sync` → `globals.css`)
- Las pantallas del producto: Dashboard, Agents, Agent Builder, Run Detail, Integrations, Settings, Landing (12 sprints)
- El Agent Builder como librería de componentes en Figma (Node, Edges, Inspector, Topbar, Node Catalog, screen ensamblada)
- Accesibilidad: Lighthouse 100 (subió desde 94)
- Analytics: `@vercel/analytics` con `lib/analytics.ts` tipado, unión cerrada de 11 eventos
- El Storybook, que parsea tokens del build de producción — documentación verificablemente sin drift
- Deploy en Vercel, en vivo

**Intencionalmente parcial (elegido, no faltante):**
- **Sin backend.** Todo el estado es fake, en el browser. Fue decisión explícita: sandbox sin login para que un cliente esté adentro del producto en <3 segundos
- **Sin integraciones reales.** Gmail / Slack / Sheets son simulados con datos seed curados
- **Sin usuarios de producción.** Es un producto de portfolio, y todo el copy debe reflejarlo
- **Las pantallas shippeadas no existen en Figma.** Decisión, no omisión (divergencia #8)

**Faltante, sin decisión registrada:**
- Mobile / responsive por debajo de 1024px (estaba en la spec, quedó afuera)
- Onboarding
- Cualquier señalización in-app de que esto es una demo

### 5.2 Cómo lo comunica la interfaz hoy — **[EMERGENTE]**

**Respuesta honesta: casi no lo comunica.**

La spec original de mayo tenía la solución diseñada: banner "Demo mode" con Reset en todas las pantallas, onboarding tooltip, mobile fallback. Ninguna de las tres se construyó (sección 2). El único mecanismo de encuadre que sí quedó es **la landing**, que sí explica qué es el producto antes de entrar.

Eso deja un hueco concreto: **alguien que llega directo a `/dashboard` desde un link de Behance o de una propuesta de Upwork no tiene forma de saber que los datos son simulados**. Y lo va a descubrir del peor modo posible — conectando una integración que no conecta, o corriendo un agente cuyo resultado es fijo. Ese momento no se lee como "demo bien encuadrada", se lee como "producto roto".

Es también el riesgo más caro que tenés en toda esta lista, porque impacta en el primer minuto de la persona que estás tratando de convertir.

**Tradeoff de arreglarlo.** El banner permanente que decía la spec choca con el registro de "competencia callada" — es ruidoso y le grita al visitante que esto no es real. Por eso probablemente no se construyó (**[NO VERIFICADO]**: no hay registro de una decisión de sacarlo; lo más probable es que simplemente no llegó).

**La versión mínima que resuelve el 90% sin romper el registro:** un chip discreto y persistente en la topbar — `Demo · sample data` — con tooltip al hover explicando que el estado vive en el browser. Sin banner de ancho completo, sin botón de Reset si no querés implementar el reset. Es una tarde de trabajo y convierte el mayor riesgo de percepción en una señal de criterio.

> **Cómo contarlo en la case study, sea que lo construyas o no:** "El demo corre sobre datos simulados. La decisión de acceso fue sandbox sin login: cero fricción hasta el producto." Eso es verdad y está bien encuadrado. Lo que **no** podés hacer es dejar que el visitante lo descubra solo.

---

## 6. La discrepancia de conteo: 897 vs 848

### 6.1 Respuesta directa: **tu hipótesis probablemente sea incorrecta, y encontré una pista mucho más fuerte.**

**Lo que es certeza:**

| Medición | Valor | Fecha | Fuente |
|---|---|---|---|
| Color variables en Figma | **848** (Primitives 129 + Semantic 126 + Components 593) | 2026-07-04 | Conteo verificado por CC en el archivo, explícitamente auditado antes de publicar |
| Variables totales en Figma | **1058** (COLOR 848 + FLOAT 204 + STRING 6) | 2026-07-04 | Ídem |
| Tokens totales encontrados en `tokens.json` | **1107** | ~2026-05-30 | Output de `npm run tokens:sync` |
| Color tokens válidos escritos | **897** | ~2026-05-30 | Output de `npm run tokens:sync` |

### 6.2 El hallazgo

```
1107 (JSON, total)  −  1058 (Figma, total)  =  49
 897 (JSON, color)  −   848 (Figma, color)  =  49
```

**Las dos diferencias son exactamente 49.** Si el delta total y el delta de color son idénticos, entonces **los 49 sobrantes son todos tokens de color, y la diferencia está aguas arriba del CSS**: el `tokens.json` del repo contiene 49 tokens de color que ya no existen como variables en Figma.

Eso **descarta tu hipótesis del bloque manual de a11y**, porque:
- El bloque manual vive **fuera** del bloque `GENERATED`. El `897` sale del propio log del sync, que cuenta solo lo que escribe en el bloque generado.
- El sync reporta explícitamente `"Sin duplicados entre bloque generado y manual"`, y hubo una limpieza dedicada que borró del bloque manual todo lo que Figma ya proveía (`--color-fg-*`, `--color-success-NNN`, etc.).

**La causa más probable:** el `tokens.json` está desfasado respecto a Figma. Tenés al menos un caso documentado de exactamente eso — el 2026-06-27 se detectó que el repo de tokens **todavía tenía primitivas de Inter y JetBrains Mono** cuando el producto ya corría Geist. Si el repo arrastra tipografía vieja, es esperable que arrastre color viejo: la escala `river-styx/950` que eliminaste, los `_deprecated/*`, los `node-*` legacy sin uso. Tokens borrados en Figma que nunca se limpiaron del lado del repo.

**Advertencia de rigor:** las dos mediciones están separadas por 5 semanas. La coincidencia exacta del 49 en ambos deltas es fuerte pero **no es prueba** — puede haber compensaciones entre tokens agregados y borrados en ese lapso. Es la hipótesis más probable, no un hecho verificado.

### 6.3 Cómo cerrarlo en 3 comandos

```bash
# 1 — ¿el 897 es solo el bloque generado, o todo el archivo?
sed -n '/GENERATED/,/END GENERATED/p' app/globals.css | grep -c '\-\-color-'
grep -c '\-\-color-' app/globals.css
# Si el primero da 897 → el bloque manual NO explica nada, la causa es upstream.
# Si el segundo da 897 → el manual sí suma, y hay que recontar el generado.

# 2 — ¿el JSON sigue trayendo de más? (re-correr el sync da el número de hoy)
npm run tokens:sync

# 3 — ¿qué hay en el JSON que no está en Figma?
#    Buscar en tokens.json: river-styx/950, _deprecated, node-*, primitivas Inter/JetBrains
```

### 6.4 Qué hacer con esto en la case study — **[DECISIÓN PENDIENTE]**

**Tradeoff.** Ya te pasó una vez: el `417` del brief de junio estuvo a punto de salir público mientras la página de Figma decía `848`. Se detectó y se mató a tiempo. **Esta es la misma clase de problema, sin resolver:** dos artefactos tuyos (Storybook y la página de Figma) publicando dos números distintos del mismo sistema.

Tres salidas, en orden de preferencia:

1. **Cerrar el gap antes de publicar** (los 3 comandos de arriba). Limpiar el repo de tokens y re-correr el sync. Es lo correcto y no debería llevar más de una sesión.
2. **Publicar un solo número, con su definición.** "848 color tokens en Figma (129 primitivas / 126 semánticos / 593 de componente)" — verificado, fechado, reproducible. No menciones el 897 en ningún lado.
3. **Contar la discrepancia como hallazgo.** "El código emitía 49 variables de color más que las que existían en Figma; el `tokens.json` arrastraba tokens borrados." Es la opción más interesante *si la cerrás* — y la peor si la dejás abierta.

**Lo que no podés hacer es publicar los dos números.** Eso es exactamente el error que ya cazaste una vez.

---

## Resumen ejecutivo — qué llevar a la case study

**Llevá, sin reservas:**
- La tabla de 6 divergencias con hex, categorías y fechas (sección 3.2)
- La decisión Style Dictionary vs script propio, **con los costos** (sección 4)
- Figma como fuente de verdad de tokens post-ship, y pantallas viviendo solo en código como decisión permanente
- El modelo del nodo: composición sobre matriz
- Run-states como vocabulario compartido entre canvas, edges y chat
- El bug del scrim (`alpha=1` fuerza `fill opacity`) como patrón documentado

**Llevá con la marca correcta:**
- "El DS es el entregable" → contalo como reconocimiento, no como plan original
- "El código está congelado" → contalo como estado con deuda clasificada, no como decisión de arquitectura
- El error de archivado del #4 → contalo; prueba que el artefacto es real

**No lleves:**
- Nada del `CLAUDE.md` de mayo que no exista en el código
- "Design system completo"
- Dos números de tokens distintos
- Cualquier claim de uso o de usuarios

**Cerrá antes de publicar (por orden de impacto):**
1. Señal de "demo · sample data" en el producto — es tu mayor riesgo de percepción
2. El fix de contraste del sublabel, o mencionarlo como deuda abierta
3. Reconciliar el conteo de tokens
4. Marcar el `CLAUDE.md` como spec histórica

---

*Documento de trabajo. Todo lo marcado `[NO VERIFICADO]` requiere que lo chequees vos antes de que salga en cualquier pieza pública.*
