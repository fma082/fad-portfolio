# Fluuen — Token drift: contexto actualizado

**Fecha:** 2026-08-04 · **Estado:** verificado contra Figma en vivo (Desktop Bridge, solo lectura)
**Análisis completo:** `docs/briefs/fluuen-token-drift.md`
**Reemplaza:** `DESIGN-DECISIONS.md` § 6 ("La discrepancia de conteo: 897 vs 848")

---

## 1. Qué queda FALSADO

> ⚠️ **No citar más estas afirmaciones.** La sección 6 de `DESIGN-DECISIONS.md` era
> explícitamente una hipótesis ("la causa más probable", "no es prueba"). Se verificó y
> resultó incorrecta. El resto del documento no está afectado.

**❌ "El `tokens.json` contiene 49 tokens de color que ya no existen en Figma."**
Falso. La divergencia no es de una sola dirección. Hay **85** tokens en el CSS que no
existen en Figma y **36** en Figma que no están en el CSS. El 49 era la resta de dos
divergencias que se compensaban. Comparar totales lo ocultaba.

**❌ "Los tokens sobrantes son arrastre del repo: `river-styx/950`, `_deprecated/*`, `node-*` legacy, primitivas Inter/JetBrains."**
Falso, uno por uno, verificado sobre `tokens-source.json`:

| Sospechoso | Hits en el JSON | ¿Explica la deriva de color? |
|---|---|---|
| `river-styx/950` | **0** — hay 13 tokens river-styx, exactamente los mismos 13 que Figma | No |
| `_deprecated/*` | **0** | No |
| `node-*` legacy | **0** | No |
| Inter / JetBrains | **3** — `Primitives/Mode 1.typography.font-family`: `primary: "Inter"`, `code` y `mono`: `"JetBrains Mono"` | **No, pero por otro motivo:** son `$type: text`, no color. No pueden estar entre los 85 ni entre los 36 |

Los tres primeros no están en el JSON: el repo de tokens no arrastra ningún color borrado.

**El cuarto sí está, y es un hallazgo aparte que esta sección no invalida.** La
tipografía del repo sigue en Inter + JetBrains Mono mientras el producto y Figma corren
Geist — la cadena `Geist` aparece **0 veces** en `tokens-source.json`. Es la
**divergencia #7** de `DESIGN-DECISIONS.md` § 3.2, y **sigue abierta**, verificado el
2026-08-04 sobre la copia que bajó el último sync.

No llega a producción: `sync-tokens.mjs` solo emite tokens de color, y `--font-sans` /
`--font-mono` son hand-authored en `globals.css:952-953` apuntando a Geist. La
contaminación es real pero **latente** — sale a la superficie el día que tipografía entre
al sync. Descartarla como sospechoso de la deriva de color es correcto; darla por
inexistente, no.

**❌ "Las dos diferencias son exactamente 49, por lo tanto los 49 sobrantes son todos de color."**
La simetría no existe en los archivos de hoy. El JSON tiene **1108** tokens
(898 color + 204 number + 6 text) contra 1058 en Figma (848 + 204 + 6): ambos deltas dan
**50**, no 49. El 897 del CSS es 898 menos **una colisión de nombres**
(`error-alpha-30` y `error-alpha (30)` colapsan al mismo `--color-status-error-alpha-30`).

Esa colisión es lo que producía la coincidencia "49 = 49" que hacía sonar tan sólida la
hipótesis vieja. Era un artefacto de comparar el número post-colisión (897) contra el
total pre-colisión.

**❌ Hipótesis intermedia: "el grupo `status` de Semantic explica los 49."**
También descartada. `Semantic/🎨 colors/status` tiene 49 variables en Figma — la
coincidencia numérica era real y por eso valía testearla — pero están contadas de los dos
lados. Semantic da 126 en Figma y 126 en el JSON: cero deriva. La coincidencia era azar.

**✅ Lo único de § 6 que sobrevive intacto:** el conteo de Figma (848 = 129 Primitives +
126 Semantic + 593 Components) y que la causa está aguas arriba del CSS. Ambos
reconfirmados hoy.

**⚠️ Precisión sobre "la deriva es solo de color".** Lo verificado es que los *conteos*
de `number` (204) y `text` (6) coinciden exacto entre Figma y JSON. Eso no es lo mismo
que decir que coinciden los *valores*: los 6 tokens `text` incluyen las tres familias
tipográficas, y ahí el JSON dice Inter / JetBrains Mono donde Figma dice Geist. El
conteo no se movió porque no se agregó ni se borró ningún token — se editó el valor de
tres. **La deriva medida por este análisis es solo de color; la deriva del sistema, no.**

Es el mismo error de método que el documento denuncia, un nivel más abajo: comparar
totales oculta divergencias que se compensan, y comparar conteos oculta divergencias que
no cambian la cardinalidad. La pregunta correcta tampoco era "¿cuántos hay de cada
lado?" sino "¿son los mismos, con los mismos valores?".

---

## 2. El hallazgo verificado

**La causa real: `tokens.json` es un export viejo del mismo archivo de Figma.**
No hay tokens fantasma. `$metadata.tokenSetOrder` tiene exactamente tres sets, uno por
colección de Figma. Es el mismo sistema en dos momentos distintos.

```
897  custom properties --color-* en globals.css
848  variables COLOR en Figma
 85  en CSS y no en Figma
 36  en Figma y no en CSS   →  85 − 36 = 49
```

**La deriva está concentrada en `Components`:**

| Colección | Figma | JSON | Δ |
|---|---:|---:|---:|
| 🥥 Primitives | 129 | 129 | 0 |
| 🏷️ Semantic | 126 | 126 | 0 |
| Components | **593** | **643** | **+50** |

**Partición de los 85 — 54 / 24 / 7:**

- **54 renombres puros.** Mismo token, mismo leaf name, otro path. Notification→Deprecated (14),
  Badge/Status +nivel `Generic` (18), Input aplanado (17), Table `row-*`→`cell-*` (5).
- **24 renombres con criterio.** Existe destino pero hay que elegir: Button/Destructive
  se abrió en `Solid`/`Outline` (13), Badge/Numeric en `Soft`/`Solid` (3),
  SelectionControl `default`→`unchecked` (6), Card `selected`→`active` (1).
- **7 sin destino.** Todos SelectionControl: 6 estados de hover + 1 border-focus. El DS
  nuevo dejó de tokenizar hover y focus en checkbox/radio/toggle. **Es un gap del sistema,
  no de sync** — y el focus no es opcional por accesibilidad.

**El número para la case study es 78 / 7:** el 92% de la divergencia era el mismo diseño
con otro nombre. Nada se había roto conceptualmente; el sistema evolucionó y el código
quedó hablando la versión anterior del mismo idioma.

**AgentBuilder/Inspector: componente completo ausente (20 de los 36).**
El más relevante del lado Figma. No es un token suelto ni un renombre: es el panel lateral
del Agent Builder — la pantalla estrella del producto — diseñado entero (tabs, logs con
duración y timestamp, outputs tipados, estado de test) y nunca exportado. La palabra
`Inspector` aparece **0 veces** en el JSON. Los otros dos subgrupos de AgentBuilder
(`Topbar`, `NodePanel`) sí están, lo que fecha el diseño del Inspector como posterior al
último push del plugin.

**Impacto en código: 9 tokens stale referenciados**, todos en los grupos mecánicos
(`agent-status.tsx` y los 4 `wizard/step-*.tsx`). El remapeo es sustitución directa, sin
decisiones de diseño. El resto de los 85 solo vive en `case-study/tokens.css` y en el
build de Storybook, que son copias derivadas de `globals.css`.

**Lectura de sistema:** el pipeline garantizaba **CSS ↔ JSON** y nunca **JSON ↔ Figma**.
El generador hizo su trabajo perfectamente sobre datos viejos. La automatización cubría el
tramo fácil (transformar datos) y no el difícil (garantizar que fueran actuales) — el push
desde Tokens Studio es manual y no deja rastro fechado en ningún lado.

---

## 3. El recorrido de verificación

Cuatro hipótesis, tres falsadas. El recorrido importa tanto como el resultado:

**H1 — "El bloque manual de a11y suma al conteo."**
Falsada antes de este análisis. El 897 sale del bloque `GENERATED`, el manual vive afuera.

**H2 — "El repo arrastra tokens borrados en Figma."** *(la de § 6)*
Falsada por grep directo: los cuatro sospechosos nombrados dan 0 hits. Se apoyaba en un
precedente real (en junio el repo tenía primitivas de Inter cuando el producto ya usaba
Geist) y en la simetría 49=49, que resultó ser un artefacto de la colisión de nombres.

**H3 — "Los 49 son el grupo `status`."**
Predicción falsable: si Semantic da 126, era error de conteo; si da 76, había tokens
arrastrados. Dio 126 → descartada. Se testeó porque `status` tiene exactamente 49
variables. Coincidencia.

**H3b — "El 848 era del duplicado público, el original tiene 897."**
Falsada en un tiro: el original (`MOhVXH1k1Aa5tbQJM8QDRF`) da 848, idéntico al duplicado
fila por fila. Los dos archivos no divergen.

**H4 — "El JSON exporta sets que nunca fueron variables de Figma."**
Falsada: el JSON tiene exactamente los tres sets de las tres colecciones.

**Lo que finalmente funcionó: dejar de contar y empezar a comparar.** Extraer las 848
de Figma, las 897 del CSS, normalizar ambas con las funciones reales de
`sync-tokens.mjs` (parseadas del source, no reimplementadas, para evitar drift) y diffear
nombre por nombre. Las cuatro hipótesis anteriores trataban de explicar un número. El
diff mostró que el número era la resta de dos listas distintas, y ninguna explicación de
un solo lado podía ser correcta.

**La lección metodológica, para la case study:** un delta agregado puede ser la resta de
dos divergencias opuestas. Mientras el diagnóstico se hizo sobre totales, cada hipótesis
era plausible y ninguna verificable. La pregunta correcta no era "¿qué sobra?" sino
"¿qué hay de cada lado?".

---

## 4. Estado y próximos pasos

Nada aplicado. El repo de Fluuen y ambos archivos de Figma quedaron sin modificar.

1. Re-exportar desde Tokens Studio con `MOhVXH1k1Aa5tbQJM8QDRF` abierto
2. `npm run tokens:sync`
3. Aplicar los 9 remapeos (mecánicos, mapeo completo en el doc largo § 5.1)
4. Regenerar `case-study/tokens.css` y el build de Storybook
5. Decidir los 7 sin destino: agregarlos al DS en Figma o documentar la ausencia
6. Reconciliar las 3 primitivas tipográficas (Inter / JetBrains Mono → Geist). El paso 1
   probablemente lo arrastre solo; verificarlo explícitamente, porque el conteo no lo
   delata
7. Check en CI que compare Figma contra el JSON — el diff se hizo con ~40 líneas de Node.
   Que compare **nombres y valores**, no conteos
