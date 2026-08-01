# DESIGN-DECISIONS.md — Countersign

Documento interno. Insumo para la case study, **no** la case study. Contiene
material que no debe publicarse tal cual (sección 6).

**Base de verificación:** `countersign-review-log.md` (R01–R14, congelado al 28 jul),
`countersign-case-study-outline.md`, `patterns-registry.html`,
`ai-interface-patterns-master-catalog.md`, `guia-investigacion-ai-design.md`,
`project-instructions-v2.md`, e historial de sesiones 26 abr – 31 jul 2026.
Donde no hay rastro, dice **[NO VERIFICADO]** y no se completa con inferencia.

**Marcas:**
- **[DECIDIDO]** — hay un momento identificable donde se evaluó y se eligió.
- **[EMERGENTE]** — pasó por inercia, límite técnico o desplazamiento de foco, y resultó conveniente después.
- **[MIXTO]** — el *qué* fue decidido; el *porqué* que se cuenta hoy se construyó después.
- **[NO VERIFICADO]** — no hay rastro suficiente. No se afirma.

---

## 1 · El arco research → producto

### 1.1 Qué buscaba la investigación — [MIXTO]

**Contexto.** El catálogo (63 patrones, 10 categorías) no nació para entender
agentes. Nació como inventario de mercado para un kit de Figma a la venta:
tiers de $149 / $249 / $449, early-bird a $99, freebie en Figma Community, y un
plan de validación de tres semanas con criterio GO/PIVOT. La pregunta real de
esa etapa era *"qué patrones puedo empaquetar y vender que Nocra y SnowUI no
tengan"*, no *"qué le pasa a un agente cuando recibe una query"*.

**Elección.** Mapear el ciclo de vida completo de una interacción con AI —
wayfinders, inputs, tuners, processing, output, trust, actions, orchestration,
identifiers, errors — en vez de solo los tres patrones vendibles.

**Por qué (el criterio real).** Cobertura comercial y diferenciación: los
competidores hacen pantallas bonitas sin documentación de estados. Un mapa
completo justificaba el precio y daba de dónde sacar packs verticales después.

**El porqué que se cuenta hoy** — "diseñaba estados de thinking/streaming/error
por intuición y quería entender qué pasa técnicamente para diseñar con
precisión, no con estética" — está escrito y es sincero. Pero está en
`guia-investigacion-ai-design.md`, de julio, es decir **cuando el modelo de venta
ya se estaba cayendo**. Es una reinterpretación honesta, no el motor original.

**Tradeoff.** Contarlo como investigación pura suena mejor y se rompe en la
primera repregunta ("¿qué método usaste? ¿cuántos productos analizaste?").
Contarlo como es —empecé mapeando un mercado para vender un kit, el mapa
sobrevivió al producto— es más corto y más creíble, y convierte el pivot en
criterio de producto en vez de en un tropiezo escondido.

---

### 1.2 El momento en que dejó de ser catálogo — [DECIDIDO] el producto, [EMERGENTE] la tesis

Hay tres momentos distintos y conviene no fundirlos.

**Momento 1 (≈7 jul) — catálogo → demo. [DECIDIDO].** "No quiero vender
componentes; quiero mostrar los patrones corriendo contra un modelo real." Ahí
se descartó todo el modelo comercial y el objetivo pasó a ser portfolio. Momento
identificable, con causa dicha en voz alta: los componentes están commoditizados.

**Momento 2 (24 jul) — demo → producto. [DECIDIDO].** El disparador fue una
crítica de diseño sobre lo construido: *"parece ChatGPT"*. De ahí salió el
reencuadre completo: agente vertical en vez de chat demo, split layout con la
tabla como protagonista y el copilot como panel fijo, tool events como cards de
sistema, y la migración del dominio de cuentas a productos con conflictos
plantados en el seed. Es el momento en que aparece Northbase, y después
Countersign.

**Momento 3 (24–25 jul) — la tesis. [EMERGENTE].** Probando el demo,
*"list discontinued products"* resolvió a `discontinue_products` —una escritura
destructiva— proponiendo discontinuar 27 productos activos, porque **no existía
la lectura equivalente**. De ahí salió la frase que hoy es la columna vertebral:
*la superficie de la herramienta acota lo que el modelo puede hacer mal*. Y salió
otras dos veces más (status de un SKU inventado, conteo de activos devolviendo 1
en vez de 27) antes de nombrarse como clase de defecto.

**Elección.** Adoptar el hallazgo como tesis del proyecto y reordenar el resto
alrededor.

**Tradeoff.** La tentación es contarlo como hipótesis puesta a prueba. No lo fue:
fue un bug encontrado testeando, que se repitió hasta que se le vio la forma.
Contado como descubrimiento es *más* fuerte, porque no se puede fabricar — un
bug reproducible con nombre de tool y conteo exacto es la clase de detalle que
demuestra que construiste el sistema. La outline ya lo tiene bien encuadrado
(§4: "no lo diseñé, lo descubrí"). Mantener ese encuadre y no dejar que se
deslice hacia "diseñé la gobernanza y después la validé".

---

### 1.3 Qué sobrevivió y qué se descartó — [EMERGENTE]

De los 63 patrones documentados, 11 estaban marcados **wedge** (el diferencial
declarado). El corte real:

**Sobrevivieron al producto:**
- 4.2 Tool use / Agentic actions → tool cards con summary
- 7.6 Execute / Act → los tiers reversible y destructivo
- 8.1 Action plan / Plan preview → el preview del gate, editable por checkbox
- 8.4 Permissions / Autonomy → el modelo de tres niveles
- 8.5 Human-in-the-loop checkpoints → el gate
- 10.4 Hallucination handling → **transformado**, ver abajo

**Se descartaron:**
- 6.1 Confidence indicators
- 6.2 Explainability / Reasoning
- 6.3 Caveats / Limitations
- 8.3 Agent monitoring / Run history
- 8.7 Delegation patterns

**Lo que vale contar es el descarte, y tiene una sola causa.** Los tres patrones
de *Trust builders* —el bloque que la investigación había marcado como wedge
central, "gestión de incertidumbre"— tienen todos la misma forma: **le piden al
modelo que reporte sobre sí mismo.** Un porcentaje de confianza, una cadena de
razonamiento, una advertencia sobre sus propios límites.

Countersign resolvió la confianza al revés: el server renderiza el dato
verdadero al lado de la prosa, y el auto-reporte del modelo se vuelve
innecesario. La instancia más clara: el modelo confundió un producto entero
(nombró un SKU mirando otro) y **no importó**, porque la card con el dato del
server estaba al lado. El render determinístico no mejora al modelo — lo vuelve
irrelevante como fuente de verdad.

El único de los tres que sobrevivió lo hizo **transformado**: el subtítulo
`interpreted from:` es explicabilidad, pero **escrita por el server** comparando
lo que el humano pidió contra el criterio que efectivamente se ejecutó. El modelo
no confiesa la reinterpretación; el sistema la marca. Es 6.2 dado vuelta.

**Un descarte que NO fue decisión:** 8.3 (run history / log de decisiones) se
cayó porque no hay base de datos. Nadie lo evaluó. Si aparece en la case study
como recorte de alcance, es racionalización — fue una consecuencia.

**Tradeoff.** Renunciaste a la mitad del wedge declarado: el vocabulario de
incertidumbre. Si alguien pregunta *"¿cómo comunicás la incertidumbre del
modelo?"*, la respuesta honesta es *"en este alcance eliminé la necesidad de que
el modelo se auto-reporte"*. Es una gran respuesta para un admin panel acotado y
una respuesta insuficiente como afirmación general — en un producto de
investigación o de escritura abierta, el auto-reporte vuelve a ser necesario y
no lo resolviste. Decir dónde termina tu principio es lo que lo hace sonar
pensado en vez de dogmático.

---

### 1.4 Lo que la investigación no previó — [EMERGENTE]

Cuatro cosas. Ninguna estaba en las 10 categorías.

**a) El hueco de vocabulario de lectura como clase de riesgo destructivo.** El
catálogo tiene categorías para input, procesamiento, output, confianza y error.
Ninguna para *"el verbo que el humano dijo no existe como tool, así que el modelo
agarra la más parecida, y la más parecida borra cosas"*. Es el hallazgo más
original del proyecto y ningún patrón de los 63 lo cubre. Corolario que tampoco
estaba: **los fixes son aditivos a la superficie, nunca correcciones al prompt.**

**b) El componente tiene que adaptarse al criterio, no a la tool** (R02). El
catálogo tiene "5.4 Cards / Structured results" como un patrón único. En la
práctica son cuatro tipos de medida (ratio, magnitude, recency, none) y el server
decide cuál desde el criterio ejecutado. El caso *none* —"cuáles están
discontinuados" no tiene nada que medir, la respuesta correcta es que la columna
de medición no existe— no está en ninguna librería.

**c) La velocidad como anti-feature.** La investigación asumía la latencia como
problema a gestionar. Groq la hizo desaparecer (respuesta entera en ~22ms) y con
ella los patrones que el demo existe para mostrar. La conclusión invierte la
premisa: para estos patrones, la variabilidad de latencia es la señal, no el
ruido.

**d) Una abstracción reapareciendo sola.** La distinción *missing* /
*not-applicable*, diseñada para `product_detail`, reapareció en la tabla sin que
nadie la programara ahí. Vale como evidencia de que la abstracción estaba bien
puesta — con la salvedad de que es una observación, no una medición.

---

## 2 · Por qué code-first

### 2.1 Code-first como método — [DECIDIDO] (y heredado)

**Contexto.** Experiencia previa en Fluuen: escalar el design system en Figma
dejó de aportar, y al pasar a Claude Code, CC generó los componentes faltantes
desde los existentes con muy buena calidad.

**Elección.** Invertir el pipeline: código como fuente de verdad, Figma como
espejo generado vía Desktop Bridge.

**Por qué.** Causa concreta, anterior y externa a este proyecto. Es la parte más
sólida de la decisión: no es una preferencia estética, es una conclusión de un
proyecto real.

**Tradeoff.** Asumido y documentado desde el principio: las variantes complejas
quedan al ~70% en el paso code→Figma y requieren acabado manual. En `ai-patterns`
el espejo se generó y llegó a ~90% de fidelidad.

---

### 2.2 Countersign sin Figma — [EMERGENTE]

Esta es la que hay que marcar bien, porque hoy se cuenta como método y no lo fue.

**Contexto.** Code-first no dice "sin Figma": dice "Figma se genera desde el
código". Para Countersign se escribió el prompt de bridge, con archivo destino
asignado y orden obligatorio (Variables → primitives → componentes). **No hay
registro de que se haya ejecutado.**

**Elección.** No la hubo. El ciclo de reviews tomó el foco y el espejo se cayó
del alcance sin que nadie lo decidiera. Hoy es conveniente llamarlo "code-first".

**Por qué resultó conveniente.** El loop real del proyecto fue *mirar el producto
corriendo → detectar el defecto → especificar → CC → volver a mirar*, unas veinte
veces en una semana. Con Figma en el medio ese loop no existe. Y sobre todo:
**los hallazgos que hacen la case study no son visibles en un mockup.** Que
`product_list` ordene por una dimensión que no tiene relación con la pregunta, o
que el modelo niegue el estado de vista que él mismo produjo, solo aparece
corriendo contra el modelo.

**Tradeoff — concreto, esto es lo que perdiste:**

1. **No hay artefacto visual presentable.** Una case study necesita frames:
   anatomía con partes nombradas, estados lado a lado, do's/don'ts. Es
   exactamente lo que tu propia estructura de documentación de 8 partes promete y
   lo único que tenés son capturas de una app corriendo. Más baratas de producir,
   mucho peores de componer.
2. **No exploraste alternativas visuales.** Cada decisión de UI se resolvió en una
   sola implementación. No hay una variante descartada del gate, de la tool card
   ni de la anatomía de fila. En arquitectura sí tenés opciones evaluadas (A vs B
   en R06, replay vs re-resolución en el gate restore); en lo visual, no. La
   repregunta *"¿qué otras opciones consideraste para el gate?"* hoy no tiene
   respuesta.
3. **Drift silencioso entre spec y código.** El panel está especificado en 380px y
   construido en 379px. Es trivial en sí mismo y es la prueba de que nada verifica
   contra la spec. Si generás el espejo desde `tokens-spec.md` hoy, el espejo sale
   mal.
4. **Ocho estados en el statechart, y nadie los vio juntos nunca.** `empty`,
   `error` y `stopped by user` existen en código; el flujo guiado no los cruza.
   Un catálogo de estados es precisamente el entregable que tu perfil promete.

**Cómo contarlo.** Cambiaste capacidad de exploración y de presentación por
velocidad de descubrimiento. Para *encontrar* la tesis fue el trade correcto.
Para *contarla* te falta el artefacto — y eso se arregla generando el espejo
ahora, con el código ya estable, que además es el orden que tu propio método
prescribe.

---

## 3 · El sistema visual sin fuente visual

### 3.1 Los tokens como fuente de verdad — [DECIDIDO]

**Contexto.** Arrancar un producto nuevo sin Figma y sin heredar deuda visual.

**Elección.** Dos capas —Primitives mode-agnostic (escala neutral cálida n0–n975
+ rojo/verde de estado) y Semantic con Light/Dark aliasando— definidas en
`tokens-spec.md` **antes** del scaffold, y portadas enteras a Countersign en la
primera iteración de CC. Monocromo, sin color de marca. Color solo para estado, y
siempre con ícono + texto.

**Por qué.** La decisión del monocromo viene de la etapa anterior con una tesis
dicha en su momento (descanso visual frente a la saturación digital; refuerza el
ángulo de carga cognitiva). Que además le caiga perfecto a un admin panel — donde
el color tiene que estar disponible para significar estado, no marca — es una
coincidencia afortunada que hoy se lee como intención. Marcarlo: la tesis es
genuina y anterior; **el ajuste al dominio es posterior**.

**Tradeoff.** Un demo monocromo de un SaaS ficticio se lee austero. Un revisor de
portfolio que escanea rápido puede leer "sin terminar" donde vos leés
"deliberado". Y no hay diferenciación de marca en las capturas: tus screenshots
no se distinguen de las de cualquier otro admin panel bien hecho. El texto tiene
que hacer el trabajo que el color no hace.

---

### 3.2 El método que reemplazó a la fuente visual — [EMERGENTE]

**Contexto.** Sin Figma no hay dónde mirar para saber si algo es consistente.

**Elección (reconstruida — no fue un método declarado):** tres mecanismos.
1. **Los tokens como restricción dura dentro de cada prompt a CC** — "nunca
   hardcodear un color, spacing o radio" viaja en el prompt, así que la
   consistencia la garantiza el ejecutor, no una revisión posterior.
2. **El log de reviews como QA visual** — contra el producto corriendo, con
   severidad y evidencia (`C` = fricción, ruido o inconsistencia visual).
3. **El ancho fijo del panel como restricción física** — 379px forzaron la
   anatomía de fila de dos líneas. La restricción hizo de grilla.

**Por qué funcionó.** Porque el sistema era chico y heredado. Con más superficie
o con más de un ejecutor, tres reglas en un prompt no alcanzan.

**Cómo decirlo sin inflarlo.** No diseñaste un sistema visual para Countersign:
heredaste uno y lo defendiste con reglas de ejecución. Dicho así suena a criterio;
dicho como "diseñé un design system nuevo" se cae al primer pedido de ver los
componentes en Figma.

**Qué se degradó:**
- **Densidad y escala tipográfica** vienen de un demo de chat panel y nunca se
  re-tunearon para una tabla de datos. Nadie revisó si la escala es la correcta
  para 30 filas con seis columnas.
- **Los estados de la tabla** (hover, selected, fila actualizada tras un write)
  existen en código y no están especificados en ningún lado.
- **Accesibilidad: [NO VERIFICADO].** No hay registro de una revisión de
  contraste del monocromo, de focus states, ni del orden de tabulación en el gate
  — que es el control más crítico del producto. Tu perfil declara cuidado de
  accesibilidad; afirmarlo acá sin haberlo revisado es el flanco más fácil de
  abrir. O se revisa (es media tarde) o no se menciona.

---

## 4 · Las decisiones de interfaz más difíciles

### 4.1 Undo en la card, sin countdown, ventana hasta el próximo write — [DECIDIDO]

**Contexto.** El tier reversible necesita comunicar "esto se puede deshacer,
durante un rato". El patrón por defecto de la industria es toast + countdown.

**Elección.** El control de undo vive **dentro de la tool card** que ejecutó la
acción. Sin toast, sin countdown, sin redo. La ventana se cierra con el próximo
write (no con lecturas).

**Por qué.** Un countdown pone presión temporal sobre la persona, y eso
contradice la tesis: la fricción tiene que ser una decisión, no una carrera. La
card es donde pasó la acción, así que el undo vive con su evidencia y el
historial queda. Cerrar con el próximo write y no con el tiempo hace que la
ventana dependa de la **actividad**, no del reloj.

**Tradeoff — el real.** **La ventana es invisible.** El usuario no sabe cuánto
tiempo le queda porque no hay señal hasta que el write que la cierra ocurre.
Cambiaste legibilidad temporal por coherencia de tesis. Y al no haber redo, un
undo accidental es irrecuperable: eliminaste una irreversibilidad e introdujiste
otra, más chica, en su lugar. El flujo guiado tapa el problema —el paso 04 cierra
la ventana del 03 con una nota que enseña la regla— pero en input libre nadie te
avisa. Si esto fuera producción, la regla necesita una señal en la card antes de
cerrarse, no después.

---

### 4.2 El agente usa los filtros del usuario, no un canal propio — [DECIDIDO]

**Contexto.** Dos hallazgos de severidad A que resultaron ser el mismo. R06:
`filter_view` dejaba la tabla en "3 of 30" sin control visible para volver. R07:
el modelo **negaba** el estado de vista que él mismo había producido
("el catálogo completo ya está en pantalla", con la tabla filtrada) — porque
podía **escribir** el estado del filtro pero no **leerlo**.

**Elección.** Un único `FilterState`, escrito idénticamente por el agente y por
el usuario, con el mismo control de limpiar. Dos tools disjuntas:
`filter_view(preset)` para filtros semánticos de primera clase y
`filter_compare(field, op, value)` para comparaciones. El estado se le pasa al
modelo en cada turno como contexto legible.

**Por qué.** El principio que abrió, más fuerte que el fix: **si el agente puede
hacer algo que la UI no puede mostrar ni deshacer, eso es superficie sin
gobernar.** La superficie de tools tiene que ser un subconjunto de la del
usuario. Y su corolario: todo estado que el agente puede cambiar, tiene que poder
observarlo, o va a inventar sobre sus propios efectos.

**Tradeoff.** **El agente no puede expresar nada que la UI no exprese.** Cada
filtro semántico ("below reorder point", "negative margin", "expired sale") hay
que definirlo de antemano como opción de primera clase. Una pregunta que no mapea
a un preset ni a `{field, op, value}` no puede cambiar la vista. Le pusiste techo
al poder del agente para preservar el control del usuario. En un admin panel es
el trade correcto —ahí la variación es el enemigo—; en una herramienta
exploratoria sería el equivocado. Decir dónde no aplica tu principio es lo que lo
vuelve criterio y no eslogan.

**Nota de honestidad.** La primera propuesta fue un parche: chip clickeable + undo
en la tool card, es decir, arreglar el canal paralelo en vez de eliminarlo. Se
descartó por la versión buena. Contá la descartada — es la evidencia de que
iteraste, y "no muevas el canal, sacá el canal" es una frase que se gana con esa
historia.

---

### 4.3 El input libre bloqueado hasta terminar el flujo guiado — [DECIDIDO]

**Contexto.** Demo público, contra un modelo chico, con routing no determinista.
Una respuesta rara en los primeros 15 segundos arruina la primera impresión y
nadie llega a ver la gobernanza.

**Elección.** `/scenario` arranca guiado: cuatro pasos apilados (read → read →
reversible → destructivo), cada uno etiquetado con su tier, solo el paso activo
clickeable. El input libre está bloqueado con placeholder explicativo y se libera
recién al completar el paso 04, junto con el cierre-tesis. Reset restaura el seed.

**Por qué.** Controlar la primera impresión. Al terminar, el visitante ya entendió
qué está mirando y una respuesta imperfecta no rompe nada — de hecho la refuerza.

**Tradeoff — el más caro del producto.** **Le sacás agencia al visitante
exactamente en el momento en que la tiene toda.** Un diseñador evaluándote puede
leerlo como demo sobre rieles, que es precisamente la acusación que el proyecto
existe para refutar ("no es un mockup, corre de verdad"). Y los cuatro pasos son
el happy path: el visitante **nunca ve fallar al modelo**, que es justo donde la
capa de gobernanza vale más. Estás escondiendo tu mejor evidencia para proteger
la primera impresión.

**Opción no explorada, registrarla como tal:** un acceso "free mode" desde la
home, para quien quiera romperlo a propósito. Cuesta poco y desactiva la lectura
de "está preparado".

---

### 4.4 El throttle de 28ms — [DECIDIDO], con un flanco abierto

**Contexto.** Groq devuelve la respuesta entera en ~22ms. El streaming deja de
ser perceptible y los patrones de loading —el corazón del demo— no se ven.

**Elección.** Throttle artificial de 28ms por token en el adapter de Groq,
documentado como anti-feature deliberado y como material de case study.

**Por qué.** Sin cadencia legible el demo no demuestra nada. Y la
contra-narrativa ("la velocidad es un anti-feature para estos patrones") es
buena, real y va contra el marketing de todos los proveedores de inferencia.

**Tradeoff.** **Estás introduciendo latencia falsa en un producto cuya tesis es
la honestidad del sistema.** Contado, es criterio. No contado en la interfaz, es
un flanco: un revisor técnico que mida va a encontrar 28ms uniformes y no va a
preguntar, va a concluir. El footer ya muestra provider · modelo; agregar
"cadence throttled for legibility" convierte el flanco en prueba de criterio y
cuesta una línea.

**Dato asociado que hay que cuidar:** 28ms/token ≈ 35 tok/s, o sea **más rápido
que el Ollama local (~18 tok/s)**. El deploy no reproduce la cadencia del
desarrollo local. No lo afirmes.

**Menciones honorables (mismo peso de decisión, menos tradeoff visible):** el
payload split (el modelo recibe `{count, criterion, label}`, el render recibe las
filas); la medida como parámetro derivado del criterio con su caso `none`; la
aprobación parcial encuadrada como **criterio humano** ("hay contexto que el
sistema no tiene") y no como error del modelo — que envejece mucho mejor.

---

## 5 · Qué cuenta como terminado

### 5.1 Terminado

Motor con statechart de 8 estados y arquitectura provider-agnostic (adapter
ignorante de gobernanza → gobernanza server-side → cliente refleja). Los tres
tiers completos, con undo-in-card y gate con las tres salidas (approve all /
approve subset / reject) y restore por re-resolución. Arquitectura de filtros con
estado compartido. Dos componentes de generative UI controlada (`product_list`
con cuatro medidas, `product_detail` con tres estados de campo). Flujo guiado de
cuatro pasos. Home con hero, franja de claims y catálogo como índice.
Resiliencia: auto-retry con backoff, rate limit por IP, fallback digno, y flujo
guiado que completa ejecutando tools reales aunque el modelo esté caído. Deploy
automático en Vercel.

### 5.2 Intencionalmente parcial — [DECIDIDO], con razón registrada

- **Sin base de datos.** Estado en memoria, reset vuelve al seed. Supabase con
  overrides por sesión queda para cuando se decida.
- **Input libre bloqueado** hasta terminar el flujo guiado (§4.3).
- **Seed de 30 filas** con conflictos plantados, no un dataset realista.
- **Sin auth, sin rutas reales** en la navegación lateral: es escenografía.
- **Catálogo de 63 patrones documentado, no construido.** El producto implementa
  la capa de gobernanza; el resto es referencia.
- **Un solo escenario** (productos). Northbase es ficticio y no pretende ser otra
  cosa.

### 5.3 Falta, sin decisión registrada — [EMERGENTE] / [NO VERIFICADO]

- **Loading States y Smart Input cableados a latencia real.** Pendiente desde el
  10 de julio, atravesó tres sesiones, nunca se decidió ni se cerró. **Es la base
  de la afirmación de latencia bimodal** (§6.3).
- **Decisión de proveedor de inferencia** (DeepInfra evaluado como top): abierta
  desde el 24 de julio.
- **Espejo de Figma de Countersign:** prompt escrito, ejecución [NO VERIFICADO].
- **Pattern 4 incorporado formalmente al master catalog:** pendiente.
- **R13** (auditoría de argumentos tipados sin validación, transversal a toda tool),
  **R08** y **R10**: estado posterior al 28 jul [NO VERIFICADO] en la copia
  disponible.
- **Revisión de accesibilidad:** sin registro.
- **Historial de decisiones del agente** (8.3): se cayó por falta de DB, no por
  decisión.

### 5.4 Cómo se entera el visitante de que los datos son simulados — [NO VERIFICADO], y es un problema

**Señales que existen:** nombre ficticio (Northbase), 30 filas, un reset visible
que restaura el seed, el flujo guiado narrando los tiers, y el footer con
provider · modelo.

**Señales que no encontré:** una afirmación explícita de que los datos son un
fixture, de que **no hay base de datos**, y de que **el estado es global y
compartido** — el visitante B recibe los cambios del visitante A hasta que
alguien resetea. Eso último no es un detalle: es la clase de cosa que un hiring
manager descubre solo, apretando reset y deduciendo.

**Y hay una línea de copy que empuja en la dirección contraria:** el lede de la
home dice *"an AI agent operating a real admin panel"*. Ahí "real" significa "que
funciona de verdad, no es un mockup" — pero se lee como "con datos reales".

**Recomendación (una línea, cierra el flanco):** en el footer del copilot o bajo
el hero — *"Demo environment · 30 seeded products · in-memory state, shared
across visitors · Reset restores the seed."* Declararlo primero siempre es mejor
que que lo descubran.

---

## 6 · Flancos

### 6.1 Docs que describen features que no existen

**a) Las instrucciones de este mismo proyecto** (`project-instructions-v2.md`).
Siguen describiendo el kit de Figma a la venta: tabla de tiers $149/$249/$449,
early-bird $99 para las primeras 20 compras, freebie en Figma Community, plan de
validación de tres semanas con criterio GO / STRONG GO / PIVOT, licencias por
equipo, roadmap de suscripción anual. **Todo eso está descartado desde julio y
marcado como "no reabrir".** Además describen un statechart de **7 estados**
(Countersign tiene 8), el esquema Track A / Track B que ya no mapea a nada, y
"AI Interface Patterns" como nombre de producto. No es público, pero contamina
todo lo que se genere desde ahí — incluido este documento si no se corrige.

**b) `countersign-review-log.md`** (la copia del proyecto) está congelado al 28
de julio con **ocho hallazgos abiertos**: R02, R04, R06, R07, R08, R10, R13, R14.
El estado real al 31 de julio es cero abiertos. Si linkeás el log como artefacto
de método —y deberías, es excelente material— **contradice tu propia afirmación
de que está cerrado**. Sincronizar antes de publicar.

**c) `patterns-registry.html` marca 8 patrones como "built"**: suggestions, open
chat, thinking, streaming, **skeleton**, **progress indicators**, generation
error y **stopped by user**. Están construidos en `ai-patterns` (estáticos), no
en Countersign. De skeleton, progress indicators y stopped-by-user no tengo
evidencia de que existan cableados acá. Si el registry cuelga de la case study de
Countersign, "built" se lee como "construido en esto".

**d) La outline de la case study adelanta como cerradas** decisiones que en la
copia del log figuran abiertas (R02 medida, R06 filtros). Están cerradas en el
repo — pero el desfase entre los dos documentos es exactamente el tipo de cosa
que se nota si alguien lee los dos.

### 6.2 Números publicados que no coinciden

| Dato | Una versión | Otra versión | Lo que corresponde |
|---|---|---|---|
| Patrones del catálogo | **"44 patrones en 10 categorías"** (repetido en varias sesiones) | **63** entradas en `patterns-registry.html` y en el master catalog | **63**. El 44 es la cantidad marcada `catalog`; hay además 11 `wedge` y 8 `built`. El número salió de contar una sola columna. |
| Productos bajo reorder point | **11** (spec del seed) | **13** (sistema corriendo, R05) | Verificar contra el seed y usar un solo número. R05 sí verificó, aparte, 20 productos con stock < 50. |
| Ancho del panel | **380px** (spec) | **379px** (componente) | Trivial en sí mismo; relevante como prueba de que nada verifica contra la spec. |
| Estados del statechart | **7** (instrucciones, Patrón 1) | **8** (Countersign) | 8. |
| Cantidad de reviews | **"~20"** (outline §4) | **R01–R14** en la copia disponible | Contar las del repo y usar ese número. No redondear para arriba: si son 14, son 14. |
| Cadencia | Ollama local **~18 tok/s** | Deploy con throttle 28ms ≈ **35 tok/s** | El deploy es más rápido que el local. No afirmar que reproduce la cadencia de desarrollo. |

### 6.3 Lo que hoy afirmarías y no podrías respaldar

1. **"Los umbrales de Loading States están tuneados contra latencia real."**
   Nunca se cableó. Lo que sí sostenés: *observé un comportamiento bimodal —TTFT
   de 0.4–0.5s en caliente contra varios segundos en frío— que invalida un umbral
   único*. Eso es una observación real y suficiente. Lo que no sostenés es haber
   ajustado el sistema en consecuencia.
2. **"El statechart es el contrato compartido entre código y Figma."** Cierto
   para `ai-patterns`. Para Countersign no hay espejo verificado. O lo atribuís al
   proyecto anterior, o generás el espejo y entonces es cierto.
3. **"El routing no es determinista."** Es verdad y lo observaste repetido, pero
   sin conteo. Si preguntan *"¿en cuántas corridas?"*, no hay número. Medirlo
   cuesta una tarde —el mismo prompt N veces, cuántas rutean distinto— y te
   devuelve el dato más duro de toda la case study. Hasta entonces, contalo como
   observación cualitativa.
4. **Especificidad de modelo.** Casi todos los hallazgos salieron de
   `llama3.2:3b` local; el deploy corre `llama-3.1-8b-instant`. Si decís "el
   modelo hace X", la repregunta es "¿cuál?". La versión que sí sostenés y que
   además es mejor: *diseñé la superficie para que aguante el modelo más débil que
   voy a servir*.
5. **"El modelo confundió un producto entero y no importó."** Es tu mejor momento
   y depende de una captura concreta (NB-ST-6002 nombrado mirando el 6005). Si no
   está guardada y reproducible, no lo cuentes hasta tenerla.
6. **El throttle no declarado** en la interfaz (§4.4).
7. **Accesibilidad.** Sin registro de revisión. No afirmar.
8. **Autoría.** No escribís el código: dirigís a Claude Code. Está bien y es
   coherente con el perfil, pero si la case study no lo dice y sale en la
   entrevista, el costo es de credibilidad, no de método. Decilo primero y
   encuadrado: specs y decisiones tuyas, ejecución delegada, review tuya — **y el
   log de reviews es la prueba documental de que el criterio es tuyo.**

---

## 7 · Tres arreglos baratos que cierran seis flancos

1. **Sincronizar el log de reviews y contar las entradas reales.** Cierra 6.1b,
   6.1d y el "~20".
2. **Dos líneas de copy:** el disclaimer de entorno demo (§5.4) y
   "cadence throttled for legibility" en el footer (§4.4). Cierra el flanco de
   datos simulados y el del throttle.
3. **Medir el no-determinismo del routing:** un prompt, 20 corridas, cuántas
   rutean distinto. Convierte tu afirmación central en dato y te da el gráfico
   que hoy no tenés.

---

## 8 · Resumen ejecutivo

### Llevar sin reservas

- El modelo de gobernanza de tres niveles, con el reencuadre de que la fricción
  escala inversamente con la ventana de reversión (no son tres cajones por
  intuición: es una variable continua discretizada).
- El hueco de vocabulario de lectura resolviendo a una tool destructiva, con el
  caso concreto y el conteo. Es el detalle que no se puede fabricar.
- Los fixes aditivos a la superficie, nunca correcciones al prompt.
- El payload split y la generative UI controlada, con la evidencia de falla
  propia — no entusiasmo, falla medida.
- La medida derivada del criterio y el caso `none` (la columna que no sobrevive a
  su razón de existir).
- El agente usando los filtros del usuario: la superficie de tools como
  subconjunto de la del usuario, con su corolario de observabilidad.
- `margin` excluido del comparador como oráculo de `cost`.
- Undo en la card, sin countdown, ventana hasta el próximo write.
- La aprobación parcial encuadrada como criterio humano, no como error del modelo.
- Lo que elegiste **no** construir: A2UI/AG-UI, open-ended, componentes de
  producción.
- El log de reviews como método de trabajo.

### Llevar, con la marca correcta

- **La tesis emergió de un bug.** Contala como descubrimiento; es más fuerte y es
  lo que pasó.
- **El catálogo nació para vender un kit de Figma.** El pivot es una decisión de
  producto, no una vergüenza.
- **Trust builders descartados:** "en este alcance eliminé la necesidad de que el
  modelo se auto-reporte", no "resolví la incertidumbre".
- **Code-first en Countersign** = nunca tuvo espejo de Figma. Encuadralo como
  velocidad de descubrimiento y nombrá lo que costó (§2.2).
- **El sistema visual fue heredado y defendido con reglas de ejecución**, no
  diseñado de nuevo.
- **Latencia bimodal** = observación, no medición ni tuneo.
- **No-determinismo del routing** = cualitativo hasta que lo cuentes.
- **Los hallazgos son de un modelo de 3B** — y esa es la fortaleza del argumento,
  no su debilidad, si se dice bien.
- **"Real admin panel"** = corre de verdad, datos ficticios. Explicitarlo.
- **63 patrones documentados**, no construidos.
- **Ejecución delegada a Claude Code**, decisiones y review propias.

### No llevar

- El modelo comercial del proyecto padre: tiers, freebie, plan de validación,
  Figma Community. Está muerto desde julio.
- **"44 patrones."**
- "Umbrales tuneados contra latencia real."
- "Contrato compartido entre código y Figma" dicho de Countersign.
- El log de reviews sin sincronizar, con ocho hallazgos abiertos.
- El "built" del registry presentado como construido en Countersign.
- Cualquier afirmación de accesibilidad sin una revisión registrada.
- "~20 reviews" si en el repo son 14.
- El throttle sin declarar en la interfaz.
- El statechart de 7 estados.
