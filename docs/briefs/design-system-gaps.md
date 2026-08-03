# Design System (2021) — análisis técnico para "What I'd do differently"

Material crudo. No es copy. Todo sale de `src/content/case-studies/_data/design-system.ts`
más cuatro consultas de verificación al archivo de Figma vía plugin API el 2026-08-03,
hechas para resolver cosas que el volcado no alcanzaba a explicar (nombres de variant,
duplicados, emparejamiento de íconos).

**El archivo no se toca.** Es un artefacto fechado con 3.131 copias guardadas y 1.6k
usos en Figma Community. Acá no hay fixes propuestos, hay diagnóstico.

Contexto de uso: publicado el 19/08/2021 en Behance — 51.638 visualizaciones,
2.449 valoraciones, 3.131 guardados, 59 comentarios. Cinco años en circulación.

---

## A. Limitaciones de la herramienta en 2021

Nada de esta sección es un error de diseño. Son cosas que Figma no podía expresar
todavía y que hoy tienen una primitiva propia.

> **Sobre las fechas**: las doy de memoria y pueden estar corridas por un release.
> Verificalas antes de publicarlas. El orden relativo sí lo tengo firme:
> Variants (2020) → Component properties (2022) → Variables y modes (2023).

### A1. No existían las Variables — los tokens son estilos planos

**Qué es.** Los 55 paint styles son estilos de color sueltos. No hay capa semántica:
`Primary/500 (Base)` es a la vez el primitivo y el token de uso. No hay forma de decir
"el fondo de un botón primario apunta a Primary/500" — se aplica el estilo directo.

**Dónde.** Las 10 rampas completas. También los 5 grid styles y los 4 effect styles.

**Por qué importa.** Es la diferencia estructural más grande contra un sistema de hoy.
Sin variables no hay alias, no hay modes, y no hay forma de cambiar el tema sin tocar
cada estilo. Figma sacó Variables recién en junio de 2023 — dos años después.

**Consecuencia visible en el archivo**: la rampa `Opacity` (5 estilos de negro a 5/10/20/40/80%)
existe porque las sombras y overlays no tenían otra forma de parametrizarse.

### A2. No existían las boolean properties

**Qué es.** Todo lo que conceptualmente es un booleano está codificado como eje de
variant con opciones `True`/`False` (o `true`/`false`, o `On`/`Off` — ver B4).

**Dónde, concreto:**

| Set | Eje booleano disfrazado |
| --- | --- |
| `Sidebar` | 8 ejes: `Home`, `Products`, `Orders`, `Payments`, `Customers`, `Messages`, `Analytics`, `Schedule`, todos `True`/`False` |
| `Radio` | `Label` = `true` / `False` |
| `Checkbox` | `Label` = `True` / `False` |
| `Component` (Tables) | `Status`, `Type`, `email`, los tres `true`/`false` |
| `Drop-down-button` | `Icons` = `true` / `false` |
| `Button Navigation` | `Active` = `False` / `True` |
| `Top-Bar` | `Menu Fold` = `On` / `Off` |
| `Conversations chat` | `Check Message` = `Off` / `On` |

**Por qué importa.** Cada booleano duplica la cantidad de variants en vez de ser un
toggle. El `Sidebar` es el caso extremo: 9 ejes booleanos que multiplicarían a 512
combinaciones. Component properties (boolean, text, instance swap) salieron en Config
2022, aproximadamente junio de 2022.

**Por qué NO importa tanto como parece.** El Sidebar no cayó en la trampa — construyó
16 de 512. Ver "Lo que el archivo hace bien".

### A3. No existía el instance swap

**Qué es.** Los slots de contenido intercambiable están resueltos como enumeración.

**Dónde:**
- `Default-button` y `Rounded-button`: eje `Icon` con `icon-left` / `icon-right` / `no-icon`.
  Tres valores enumerados en vez de un slot que acepte cualquier ícono. Ese eje solo
  multiplica ×3 los 45 restantes de cada set.
- `Avatars`: eje `Type` con `initial` / `photo` — dos contenidos distintos como variant.
- `Component 1` (Icons): eje `Type` con `Cash Icon` / `Order Icon` / `Sales Icon` /
  `Ticket Icon`. Cuatro íconos fijos, no un slot.

**Por qué importa.** Con 558 íconos en el archivo, un botón con slot de instance swap
daría acceso a los 558. El eje enumerado da acceso a la posición, no al ícono: quien
consume el botón tiene que detachar o reemplazar el hijo a mano.

### A4. No existían los modes

**Qué es.** No hay light/dark, ni densidad, ni marca alternativa. Un solo tema.

**Dónde.** Los estilos `Background/Primary-Bg` `#F5F8FA`, `Background / Secondary-Bg`
`#EDF1F8` y `Background / Tertiary` `#F7F8FA` — tres grises muy claros, todos asumiendo
fondo claro. Los `Tooltip / Light / *` y `Tooltip / Dark / *` son cuatro sets separados
en vez de un mode.

**Por qué importa.** Los 8 sets de tooltip (4 sets × 4 direcciones = 16 variants) serían
2 sets con un mode. Es la duplicación más limpia de atribuir a la herramienta.

### A5. No había forma de tipar el contenido de texto

Las text properties llegaron junto con las boolean, en 2022. **No puedo determinar desde
los datos** cuántos variants existen solo por diferencias de texto — para eso habría que
comparar el contenido de los nodos de texto dentro de cada variant, que no extraje.

---

## B. Decisiones que hoy se harían distinto

Todo esto se podía haber hecho de otra forma **ya en 2021**. Ninguna depende de una
feature que no existía.

### B1. `Default-button` no tiene la matriz completa — y el hueco es sistemático

**Qué es.** 5 ejes: `Type`(2) × `Property 2`(2) × `Size`(3) × `State`(5) × `Icon`(3) = **180
combinaciones posibles. Están construidas 135.** Faltan 45.

**Cuáles faltan, exactamente**: las 45 ausentes son **todas** `Type=secondary` +
`Property 2=outline`. Los 3 tamaños × 5 estados × 3 posiciones de ícono de esa
combinación no existen. El resto de la matriz está completa.

**Dónde.** `Default-button` (515:0) y `Rounded-button` (521:38), los dos sets más grandes
del archivo, con el mismo hueco.

**Por qué importa.** "Botón secundario con borde" es una de las combinaciones más pedidas
de cualquier sistema. Quien descargue el archivo y la busque no la encuentra, y no hay
nada que le indique que la ausencia es deliberada o un olvido.

> ⚠️ Esto contradice lo que dice hoy la case study en la sección 04 ("The matrix is
> complete, with no gaps"). Ese texto es incorrecto — ver la nota al final.

### B2. El typo `seconday` creó un tercer tipo fantasma

**Qué es.** `Only-icon-default` (522:0) y `only Icon rounded` (528:51) tienen el eje
`Type` con **tres** opciones: `primary`, `secondary` y `seconday`.

**Por qué importa.** No es solo un typo cosmético: Figma trata `seconday` como un valor
válido y distinto, así que el dropdown del panel le ofrece tres tipos a quien consume el
componente. Además el eje `Class` (`filled`/`outline`) queda degenerado — 3 × 2 × 3 × 5 = 90
teóricas contra 45 construidas, porque cada "tipo" trae una sola clase. Es probable que
`seconday` sea en realidad la variante outline mal nombrada, pero **no lo puedo confirmar
desde los datos**: haría falta comparar los fills de los variants.

### B3. `Succes` — el typo con más superficie del archivo

**Qué es.** "Success" escrito sin la segunda `s`, en dos capas distintas del sistema.

**Dónde:**
- **Rampa de color**: `Alert/Succes/100`, `Alert/Succes/500 (Base)`, `Alert/Succes/600` —
  3 de los 55 paint styles.
- **Valores de variant**: aparece **9 veces** como opción. En el eje `Color` de los cuatro
  sets de badges (`Soft Pills Badges`, `Solid Pills Badges`, `Soft Badges`, `Solid Badges`,
  18 variants cada uno), en `Icon Badge` (`Succes`), en `Icon Badge Solid` (`Succes`), en
  el `State` de `Feedback Form` y en el de `Text Area`. Más `succes` en minúscula en el
  eje `Type` de `soft-button`.

**Por qué importa.** Es el error más visible del archivo porque está en la UI: quien abre
el dropdown de color de un badge lee "Succes". Con 3.131 copias, está replicado 3.131 veces.

### B4. Cinco vocabularios distintos para "tamaño"

**Qué es.** El mismo concepto nombrado de seis maneras según el set.

| Vocabulario | Dónde |
| --- | --- |
| `large` / `medium` / `small` | `Default-button`, `Rounded-button`, `soft-button`, `Only-icon-default`, `only Icon rounded`, `loading-buttons` |
| `Small` / `Medium` / `Large` | `Feedback Form`, `Toggle Standar` |
| `sm` / `md` | los 8 sets de badges |
| `sm` / `md` / `lg` | `Primary Button  Default  Filled`, `Default Outline Icon Button` (huérfanos) |
| `sm` / `Md` / `Lg` | `Default Filled Icon Right`, `Secondary Button Default  Filled` (huérfanos) |
| valores en px | `Avatars`, `Status Avatar`, `Icon Badge`, `Icon Badge Solid`, `Divider` |

**Por qué importa.** No se puede hacer una selección múltiple y cambiar el tamaño de
varios componentes distintos a la vez, porque el valor no coincide. Y el mismo diseñador
tiene que recordar cuál usa cuál.

**Extra**: `Icon Badge` tiene `16PX` en mayúsculas mientras `Icon Badge Solid` tiene `16px`.
Dos sets hermanos, el mismo tamaño, dos strings distintos.

### B5. Dos vocabularios para "estado", y una property en minúscula

**Qué es.** Los botones usan `default` / `hover` / `focus` / `active` / `disabled` en
minúscula. Los formularios usan `Default` / `Focus` / `Hover` / `Disabled` capitalizado.

**Dónde.** Minúscula: `Default-button`, `Rounded-button`, `soft-button`,
`Only-icon-default`, `only Icon rounded`, `Deault-button`, `Rounded-status-button`,
`Status-number` ×2, `Drop-down-button`. Capitalizado: `Input`, `Text Area`,
`Slider Control`, `Setting`, `Button Navigation Contracted`, y los 4 huérfanos de botón.

**Y el caso raro**: `Slider Control Range` (318:265) tiene la property llamada `state`
en minúscula, la única de las 24 que no está capitalizada.

### B6. `Property 2` — el eje sin nombre en los dos sets más grandes

**Qué es.** El eje que controla `filled` / `outline` se llama `Property 2` en
`Default-button` y `Rounded-button` — el nombre autogenerado de Figma, nunca renombrado.
Los mismos valores en `Only-icon-default` y `only Icon rounded` sí tienen nombre: `Class`.

**Por qué importa.** Son los dos sets de 135 variants, los más consumidos de la familia
de botones (94 instancias `Default-button`). Quien los usa ve un dropdown que dice
"Property 2" sin ninguna pista de qué controla.

### B7. Nombres genéricos que sobrevivieron

- `Component` (612:5008, página Tables, 7 variants, 1 instancia)
- `Component 1` (798:6975, página Icons, 8 variants, 13 instancias)
- `Component 2` (1323:9423, página Cards, 2 variants, 8 instancias)
- `Deault-button` (534:1052) — "Default" sin la `f`
- `Toggle Standar` (300:6708) — "Standard" sin la `d`
- `Status-number` — **dos sets distintos con el mismo nombre**, 541:21 y 544:4037,
  20 variants cada uno, ninguno con instancias

**Por qué importa.** `Component 1` tiene 13 instancias, 12 de ellas dentro de las pantallas
finales. Es un componente que se usa de verdad y se llama como el placeholder de Figma.

### B8. Dos librerías de íconos distintas, sin emparejar

**Qué es.** Los 558 íconos no son un set coherente. Son dos colecciones con convenciones
de nombre incompatibles:

- **Outline Icons** (281): nombres con prefijo `fi:` — `fi:alert-circle`, `fi:align-justify`,
  `fi:align-left`…
- **Solid Icon** (231): nombres sin prefijo — `academic-cap`, `adjustments`, `annotation`,
  `archive`, `arrow-circle-down`…
- Más `Brand ICons` (33), `Card  Icons` (8) e `Integration Icons` (5).

Normalizando (sacando prefijo, guiones y sufijos), **solo 81 nombres aparecen en ambos
sets**. Quedan 200 solo-outline y 150 solo-solid.

**Por qué importa.** No se puede alternar entre outline y solid para el mismo ícono en la
mayoría de los casos: el par no existe. Y el prefijo `fi:` delata el origen — no fueron
dibujados para este sistema, se importaron.

> El naming sugiere fuertemente Feather (`fi:`) y Heroicons (los solid), pero **eso es
> inferencia mía a partir de los nombres, no un dato del archivo**. Verificalo antes de
> afirmarlo.

### B9. Lo documentado no coincide con lo construido — 13 de 26 pasos

**Qué es.** La página Typography imprime valores rem/px al lado de cada muestra. En la
mitad de los casos el text style vinculado dice otra cosa.

**Los casos, concretos:**

| Paso | La página dice | El estilo tiene |
| --- | --- | --- |
| Desktop H1 | 3 rem / 56px LH | lineHeight 20 |
| Desktop H2 | 2.4 rem / 48px LH | lineHeight 20 |
| Desktop H3 | 1.9 rem / 40px LH | lineHeight 20 |
| Desktop H4 | 1.5 rem / 32px LH | lineHeight 20 |
| Desktop H5 | 1.25 rem / 28px LH | lineHeight 20 |
| Desktop H6 | 1 rem / 28px LH | lineHeight 20 |
| Mobile H1–H4 | 40 / 32 / 28 / 28px LH | lineHeight 20 los cuatro |
| Desktop Body 1 | 0.8 rem / 12px | el estilo es 20/28 — la anotación está copiada de Body 4 |
| Mobile Body 2 | 22px LH | 18 |
| Common Large Button | 24px LH | 22 en Bold, 20 en Medium y Regular |

**Un caso aparte**: el Overline está anotado como `0.75 rem` y `18 px` en la misma
etiqueta. 0.75 rem son 12px. La anotación se contradice a sí misma.

**Por qué importa.** Es la contradicción más difícil de defender del archivo, porque la
página de tipografía es documentación: su única función es decir qué hace el sistema.

### B10. 46 de 73 text styles tienen lineHeight exactamente 20

**Qué es.** El mismo valor de interlineado en tamaños de 12 a 48px. Los 18 headings
desktop, los 12 mobile, los 5 de Button, los 3 de Caption, los 3 de Overline, y 5 de Body.

**Por qué importa.** Un H1 de 48px con interlineado de 20px se superpone consigo mismo si
el texto envuelve a dos líneas. En las muestras de la página no se nota porque son de una
sola línea.

> **No puedo determinar la causa desde los datos.** La hipótesis de que sea un artefacto
> de cómo Figma manejaba line-height en 2021 es plausible pero no verificable con lo que
> extraje — el archivo solo dice que el valor es 20, no por qué. Si vas a afirmarlo en la
> case study, marcalo como hipótesis. (Hoy la case study lo afirma como hecho.)

### B11. Inconsistencias sueltas en las rampas de color

- **`Opacity-20` está guardado a 0.05**, idéntico a `Opacity-05`. El nombre miente.
- **`Alert / Danger` usa 100 / 500 / 700**, mientras `Alert/Succes` y `Alert / Warning`
  usan 100 / 500 / 600. Tres rampas hermanas, dos escalas distintas.
- **Separadores**: `Alert/Succes/100` sin espacios, `Alert / Warning / 100 ` con espacios
  y con espacio final, `Alert / Danger/ 100 ` con espacio de un lado solo. Las tres
  rampas de alerta, tres formatos.
- **`Background/Primary-Bg`** vs **`Background / Secondary-Bg`** vs
  **`Background / Tertiary`** — el tercero no lleva el sufijo `-Bg`.
- **`Black And White/Black`** vs **`Black And White / White`** — dos estilos, dos formatos.
- `Grey / Grey-900` es `#000000`, exactamente igual que `Black And White/Black`. Dos
  estilos distintos para el mismo color.

### B12. Los nombres de text style usan dos separadores en el mismo archivo

40 de 73 usan `Desktop/Heading/H1/Bold` sin espacios. 33 usan
`Mobile / Heading / H1 / Medium` con espacios. La división no es por breakpoint: dentro de
Mobile conviven `Mobile/Heading/H1/Bold` y `Mobile / Heading / H1 / Medium`.

### B13. Anomalías dentro de la escala tipográfica

- **`Desktop/Body/Body 2/Regular` está vinculado a Inter Medium (500)**. El nombre dice
  Regular. Es el único de los 73 donde el peso del nombre no coincide con el peso real.
- **`Desktop/Subtitle/Subtitle1/Bold` es 26px, `Subtitle1/Medium` es 24px.** El tamaño
  cambia con el peso, cosa que no pasa en ningún otro paso.
- **`Desktop/Body/Body 3/Regular` tiene lineHeight 18**, mientras Bold y Medium del mismo
  paso tienen 22.
- **`Mobile / Body / Body 3 / Medium` tiene lineHeight 16**, Bold y Regular tienen 20.

### B14. La jerarquía atómica del panel de páginas no se sostiene

`Spacing + Grids` e `Icons` están debajo de la etiqueta `⚛️Molecules`. Son átomos por
cualquier definición — y por la propia definición que usa el archivo en su página de
portada. `Cards`, `Navigation`, `Tables` y `Navbar` están arriba de la etiqueta
`🟡 Organism`, no debajo.

### B15. No hay escala de espaciado

El archivo documenta 6 breakpoints y 4 grillas responsive, pero no existe ninguna rampa
numérica de espaciado (4/8/12/16…) ni como estilo ni como documentación. La página se
llama `Spacing + Grids` y solo contiene grids.

---

## C. Deuda y trabajo sin terminar

### C1. Siete component sets huérfanos con 90 instancias vivas

**Qué es.** Siete sets que no están en ninguna página del archivo pero que instancias
existentes siguen referenciando. En Figma quedan en un limbo: no se pueden encontrar
navegando, pero siguen siendo el main component de algo.

| Set huérfano | Variants | Instancias | En pantallas finales |
| --- | --- | --- | --- |
| `Photo Avatar` | 16 | 56 | 28 |
| `Initials Avatar` | 16 | 12 | 2 |
| `Icon Card` | 6 | 13 | 12 |
| `Default Filled Icon Right` | 15 | 5 | 0 |
| `Primary Button  Default  Filled` | 15 | 2 | 0 |
| `Secondary Button Default  Filled` | 15 | 1 | 0 |
| `Default Outline Icon Button` | 15 | 1 | 0 |
| **Total** | **98** | **90** | **42** |

**Por qué importa.** El caso de Avatars es el más claro: `Avatars` (587:0, 32 variants,
`Type` × `Shape` × 8 tamaños) es exactamente la consolidación de `Photo Avatar` (16) +
`Initials Avatar` (16). La refactorización se hizo, el reemplazo no. **42 de las 339
instancias que hay en las pantallas finales apuntan a componentes que ya no existen en el
archivo.** Quien descargue el archivo ve pantallas armadas con componentes que no puede
encontrar.

Los cuatro sets de botón huérfanos (60 variants) son la generación anterior a
`Default-button` / `Rounded-button` — se ve en el naming, que todavía usa `sm`/`md`/`lg`
y estados capitalizados.

### C2. 26 de 49 sets nunca se usan — 441 de 817 variants

**Qué es.** Más de la mitad de los variants del archivo (54%) pertenecen a sets con cero
instancias en todo el documento.

**Los más grandes:** `Rounded-button` (135), `Only-icon-default` (45), `only Icon rounded`
(45), `Deault-button` (20), `Status-number` ×2 (20 c/u), `Solid Pills Badges` (18),
`Solid Badges` (18), los 4 sets de counter (12 c/u), los 4 de tooltip (4 c/u),
`Alert` (8), `Feedback Form` (9), `Radio` (8), `loading-buttons` (9),
`Toggle Standar` (6), `Drop-down-button` (5), `Mobile Toggle` (3), `Slider Control` (3),
`Slider Control Range` (3), `Setting` (2).

**Por qué importa — y por qué NO tanto.** En un sistema de producto esto sería grasa. En
una librería publicada para que otros la usen, no necesariamente: `Alert`, `Radio` y
`Tooltip` no aparecen en las 4 pantallas del archivo pero son componentes que alguien que
descarga el kit va a querer. La pregunta honesta no es "por qué está esto acá" sino
"por qué las pantallas usan tan poco de lo que hay".

### C3. Nombres de variant duplicados — 44 variants inalcanzables

**Qué es.** Siete sets tienen variants con nombres idénticos. Figma no puede distinguirlos:
quien selecciona esa combinación en el panel obtiene uno arbitrario, y los otros son
inalcanzables.

**El caso grave — los cuatro sets de counter:**

| Set | Variants | Nombres distintos |
| --- | --- | --- |
| `Soft Counter` (256:115) | 12 | **2** (`Type=Soft, Size=sm` ×6, `Type=Soft, Size=md` ×6) |
| `Soft Counter Pills` (256:178) | 12 | **2** |
| `Counter Pills` (256:84) | 12 | **2** |
| `Solid Counter` (256:33) | 12 | **2** |

Cada uno tiene 6 variaciones de color que **nunca se declararon como property**. Existen
visualmente pero no son direccionables. 40 de esos 48 variants son inalcanzables desde el
panel.

**Los otros tres:**
- `Solid Badges` (244:20): 18 variants, 17 nombres. `Type=Solid, Color=Danger, Size=md` ×2.
- `Solid Pills Badges` (248:1587): 18 variants, 17 nombres. `Type=Solid Pill, Color=Danger, Size=md` ×2.
- `Checkbox` (309:151): 8 variants, 7 nombres. `State=Selected Disabled, Label= False` ×2.

**Por qué importa.** Figma marca estos sets con error de conflicto de variants. Es visible
para cualquiera que abra el archivo, y es la razón por la que la extracción automática de
properties falla en esos sets.

### C4. Espacios sueltos en los nombres de variant

**Qué es.** Espacios de más adentro de los nombres, que Figma toma como parte del valor.

- `Slider Control` (318:149): los 3 variants son `"State= Focus"`, `"State= Focus"` y
  `" State= Default"`. Espacio antes del valor en los tres, y espacio inicial en el
  tercero. Dos de los tres tienen el nombre exactamente igual.
- `Checkbox`: `" State=Unselected, Label= True"`, `" State=Unselected Disabled, Label= False"`…
  espacio inicial y espacio después del `=` en todos.
- `Solid Badges`: `"Type=Solid, Size= sm, Color=Secondary"` — espacio antes del valor de Size.

**Por qué importa.** Es la causa mecánica de C3 en varios casos, y hace que los valores
del dropdown se lean con sangría irregular.

### C5. Tres páginas de componentes sin componentes

`Breadcrumbs` (1 hijo), `Graphics` (4 hijos) y `Form` (5 hijos) no contienen ningún
component set. `Form` además está debajo de la etiqueta `🟡 Organism`, o sea que está
declarada como la capa de organismos del sistema.

**No puedo determinar** qué son esos nodos sin abrirlos: pueden ser frames de
documentación, artwork suelto o componentes sin convertir a set. Lo que sí es un hecho es
que no hay nada instanciable ahí.

### C6. La página de pantallas tiene 7 frames y 4 pantallas

`Dashboard` aparece dos veces (1440×1337 y 1507×1356) y hay un `Frame 144` (1224×1452)
sin nombrar. Las pantallas distintas son 4: Dashboard, Order, Schedule, Message. Más
`List Order Table/Off` (1109×1112), que por el nombre parece un estado de tabla y no una
pantalla completa.

### C7. Dos estilos de color vienen de una librería externa

En la página Typography hay nodos vinculados a `grey/black` `#1B2326` y `grey/default`
`#828282`, que **no están entre los 55 paint styles locales**. Vienen de una librería
externa que no forma parte del archivo publicado.

**Por qué importa.** Quien duplique el archivo sin acceso a esa librería hereda dos
estilos rotos. Es la única dependencia externa del archivo y está en la página de
documentación tipográfica.

---

## Lo que el archivo hace bien

Con 3.131 guardados y 1.6k usos, algo funcionó. Esto es lo que aguanta el escrutinio.

### 1. El modelo del Sidebar es genuinamente económico

`Sidebar` (1288:11113) tiene 9 properties. La matriz completa serían **512** combinaciones.
Están construidas **16**.

**Verificado uno por uno**: los 16 variants son exactamente 8 expandidos (un ítem de menú
en `True`, el resto en `False`) y 8 contraídos (`contracted=True` más un ítem activo). Un
solo ítem activo a la vez, las dos formas del sidebar. No hay ninguna combinación
redundante ni ningún hueco dentro de ese modelo.

Es la decisión más fuerte del archivo: entendió que los 8 ejes booleanos representan un
radio group, no 8 toggles independientes, y construyó solo el subconjunto con sentido.
En 2021, sin boolean properties, no había forma más limpia de expresarlo.

### 2. La jerarquía atómica es funcional, no decorativa

`Button Navigation` (1284:9816) tiene **2 variants y 119 instancias** — el componente más
instanciado del archivo. El `Sidebar` no dibuja sus propias filas: las compone.

Eso es lo que separa un sistema de una lámina bonita. Las etiquetas `🔴 Atoms` /
`⚛️Molecules` / `🟡 Organism` del panel de páginas están mal aplicadas en algunos casos
(B14), pero la composición real sí ocurre.

### 3. Las rampas core son sistemáticas y completas

`Primary`, `Secondary` y `Tertiary`: 9 stops cada una, escala 100→900, con el paso base
marcado explícitamente como `500 (Base)`. `Grey` también 9 stops. 36 de los 55 paint
styles siguen la misma estructura sin excepciones.

La marca `(Base)` en el nombre es un detalle bueno: dice cuál es el color de marca sin
depender de que alguien sepa que 500 es la convención.

### 4. El eje `Color` de los badges mapea 1:1 contra las rampas

`Soft Pills Badges` (105 instancias, 73 en las pantallas finales — el set más consumido
del archivo) tiene 9 opciones de color: `Primary`, `Secondary`, `Tertiary`, `Succes`,
`Warning`, `Danger`, `Information`, `Light`, `Dark`. Las primeras seis son exactamente
las rampas de paint styles.

Trazabilidad token → componente, sin hex sueltos. Es lo que hace que el badge sea
reutilizable en un tema distinto aunque no haya variables.

### 5. Cinco estados de interacción, incluido focus

La familia de botones cubre `default` / `hover` / `focus` / `active` / `disabled`. Focus es
el que casi todos los sistemas omiten, y es el que importa para accesibilidad por teclado.
Están los cinco en `Default-button`, `Rounded-button`, `Only-icon-default`,
`only Icon rounded`, `Deault-button`, `Rounded-status-button` y los dos `Status-number`.

### 6. La rampa de tamaños de avatar es consistente en los cuatro sets

`16 / 20 / 24 / 28 / 32 / 40 / 48 / 64` px. Igual en `Avatars`, `Status Avatar`, y en los
dos huérfanos `Photo Avatar` e `Initials Avatar`. Ocho pasos, mismo orden conceptual,
sin excepciones. Es la única dimensión del archivo donde el vocabulario nunca se rompe.

### 7. Tipografía desktop y mobile como escalas separadas

36 text styles desktop, 25 mobile, 12 common. No es una escala escalada a ojo: son dos
escalas declaradas, con la parte compartida (Button, Caption, Overline) explícitamente
marcada como `Common Styles`.

En 2021, con un archivo publicado para dashboards, separar mobile no era obvio. Y los 73
estilos, más allá del separador inconsistente (B12), **todos** parsean a la misma forma de
4 niveles: breakpoint / grupo / paso / peso.

### 8. Las pantallas consumen la librería de verdad

**339 instancias** dentro de los frames de pantalla, provenientes de **18 sets distintos**.
No son mockups dibujados aparte y pegados al lado del sistema: están armadas con los
componentes. Es la prueba de que el sistema se probó contra su propio uso.

### 9. Los grids están documentados con valores reales y guardados como estilos

4 grillas responsive con columnas y márgenes concretos (4 col/16 · 8 col/16 · 8 col/24 ·
12 col/32), 6 breakpoints con sus queries, y **5 grid styles guardados** — incluido
`Left Navigation`, una grilla de 12 columnas con alineación `MAX` y section size 66,
pensada específicamente para el layout con sidebar de este producto.

Ese último es el detalle que más delata que el archivo se usó: nadie guarda un grid style
para un caso tan específico si no lo está aplicando.

### 10. Cuatro estilos de elevación, no cuarenta

`Soft_`, `Medium`, `Strong Shadow`, `Line-bottom`. Cuatro niveles, uno de ellos
(`Line-bottom`, `0 1px 0 0 rgba(17,17,17,0.08)`) que es un separador y no una sombra.
Restricción deliberada en la dimensión donde es más fácil descontrolarse.

---

## Limitaciones de este análisis

Cosas que **no** pude determinar y que no hay que afirmar sin verificar:

1. **Por qué faltan los 45 variants de `secondary + outline`** en `Default-button`. Sé
   exactamente cuáles faltan, no si fue decisión u olvido.
2. **Si `seconday` es la variante outline mal nombrada.** Haría falta comparar los fills
   de los variants de `Only-icon-default`.
3. **La causa del lineHeight 20 uniforme.** Ver B10.
4. **Qué contienen las páginas `Breadcrumbs`, `Graphics` y `Form`.** Solo sé que no hay
   component sets.
5. **Cuántos variants existen solo por diferencias de texto** (A5).
6. **La identidad de las librerías de íconos.** El naming sugiere Feather y Heroicons;
   es inferencia.
7. **Las fechas exactas de release de las features de Figma.** Orden relativo firme,
   fechas de memoria.
8. **Nada sobre los 59 comentarios de Behance.** No los leí. Si querés saber qué le
   sirvió a la gente, están ahí y son la fuente directa.

---

## ⚠️ Corrección pendiente en la case study

La sección 04 de `src/content/case-studies/design-system.ts` dice hoy, sobre
`Default-button`:

> "135 variants: type × filled/outline × three sizes × five states × three icon
> positions. **The matrix is complete, with no gaps**…"

**Es falso.** Son 135 de 180, y falta entera la combinación `secondary + outline`. Ese
texto lo escribí yo a partir de un cálculo que no hice — asumí que 135 era el producto de
los ejes sin multiplicarlos. Hay que corregirlo o sacarlo.

La misma sección afirma el lineHeight 20 como artefacto de Figma 2021 (B10), que es una
hipótesis, no un dato.
