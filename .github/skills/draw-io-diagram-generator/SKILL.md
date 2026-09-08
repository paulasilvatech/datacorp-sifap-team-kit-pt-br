---
name: "draw-io-diagram-generator"
description: "Úsala para crear, editar o generar archivos de diagrama draw.io (.drawio, .drawio.svg, .drawio.png). Abarca la creación de XML mxGraph, bibliotecas de formas, cadenas de estilo, diagramas de flujo, arquitectura de sistemas, diagramas de secuencia, ER y clases UML, topología de red, estrategia de distribución, la extensión hediet.vscode-drawio de VS Code y el flujo completo del agente, desde la solicitud hasta un archivo listo para abrir."
---
# Generador de diagramas draw.io

Esta skill permite generar, editar y validar archivos de diagrama draw.io (`.drawio`) con una estructura XML mxGraph correcta. Todos los archivos generados se abren directamente en la [extensión draw.io de VS Code](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio) (`hediet.vscode-drawio`), sin correcciones manuales. También puedes abrirlos en la aplicación web o de escritorio de draw.io si lo prefieres.

| Sección | Finalidad |
|---|---|
| Cuándo invocar | Frases de activación y tipos de diagrama admitidos |
| Prerrequisitos | Extensión y herramientas Python opcionales |
| Flujo del agente paso a paso | De la solicitud a la distribución, el XML y el archivo validado |
| Procedimientos por tipo de diagrama | Fragmentos de diagramas de flujo, arquitectura, secuencia, ER y UML |
| Varias páginas y edición | Archivos de varias páginas y cambios seguros en diagramas existentes |
| Plantilla de salida | Artefacto `.drawio` exacto que se entregará |
| Puerta de calidad | Comprobaciones estructurales antes de entregar |
| Referencias | Plantillas, referencias y scripts incluidos |

---

## Cuándo invocar

- "Crea un diagrama de arquitectura de sistema para estos servicios."
- "Dibuja un diagrama de flujo de este proceso de aprobación."
- "Genera un diagrama ER a partir de estas tablas."
- "Convierte esta secuencia de llamadas a API en un diagrama de secuencia."

Cualquier solicitud de crear o modificar un archivo `.drawio`, `.drawio.svg` o `.drawio.png` carga esta skill. Otras frases de activación incluyen "diseñar un diagrama de secuencia", "hacer un diagrama de clases UML", "crear un diagrama ER", "documentar la arquitectura", "mostrar el modelo de datos" y "visualizar el flujo".

> [!NOTE]
> Los archivos generados se representan en la **extensión draw.io de VS Code** (`hediet.vscode-drawio`), el editor que la inmersión usa para diagramas. Si no está instalada, el archivo `.drawio` sigue siendo válido; ábrelo en la aplicación web o de escritorio de draw.io. Los scripts Python bajo `scripts/` son auxiliares opcionales y requieren Python 3.8+.

**Tipos de diagrama admitidos**

| Tipo de diagrama | Plantilla disponible | Descripción |
|---|---|---|
| Diagrama de flujo | `assets/templates/flowchart.drawio` | Flujos de proceso con decisiones y bifurcaciones |
| Arquitectura de sistema | `assets/templates/architecture.drawio` | Arquitectura de servicios de varios niveles o capas |
| Diagrama de secuencia | `assets/templates/sequence.drawio` | Líneas de vida de actores y flujos de mensajes en el tiempo |
| Diagrama ER | `assets/templates/er-diagram.drawio` | Tablas de base de datos con relaciones |
| Diagrama de clases UML | `assets/templates/uml-class.drawio` | Clases, interfaces, enumeraciones y relaciones |
| Topología de red | (usar biblioteca de formas) | Enrutadores, servidores, firewalls y subredes |
| Flujo BPMN | (usar biblioteca de formas) | Eventos, tareas y compuertas de procesos de negocio |
| Mapa mental | (manual) | Tema central con ramas radiales |

---

## Prerrequisitos

- Si se ejecuta con la integración de VS Code habilitada, instala la **extensión draw.io de VS Code**, `hediet.vscode-drawio` (ID de extensión). Instálala con:

  ```text
  ext install hediet.vscode-drawio
  ```

- **Extensiones de archivo admitidas**: `.drawio`, `.drawio.svg`, `.drawio.png`
- **Python 3.8+** (opcional): para los scripts de validación e inserción de formas en `scripts/`

---

## Flujo del agente paso a paso

Sigue estos pasos en orden en cada tarea de generación de diagramas.

### Paso 1: Comprender la solicitud

Pregunta o deduce:

1. **Tipo de diagrama**: ¿qué tipo? (flujo, arquitectura, UML, ER, secuencia, red...)
2. **Entidades y actores**: ¿cuáles son los componentes, actores, clases o tablas principales?
3. **Relaciones**: ¿cómo se conectan? ¿En qué dirección? ¿Con qué cardinalidad?
4. **Ruta de salida**: ¿dónde debe guardarse el archivo `.drawio`?
5. **Archivo existente**: ¿se crea un archivo nuevo o se edita uno existente?

Si la solicitud es ambigua, deduce el tipo más razonable según el contexto (por ejemplo, "mostrar las tablas" → diagrama ER; "mostrar el flujo de la llamada a API" → diagrama de secuencia).

### Paso 2: Seleccionar una plantilla o empezar desde cero

- **Usa una plantilla** cuando el tipo de diagrama coincida con uno de `assets/templates/`. Copia su estructura y sustituye los valores de marcador de posición.
- **Empieza desde cero** para distribuciones nuevas. Parte de la estructura mínima válida:

```xml
<!-- Establecer modified="" con la marca de tiempo actual en ISO 8601 al generar un archivo nuevo -->
<mxfile host="Electron" modified="" version="26.0.0">
  <diagram id="page-1" name="Page-1">
    <mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1"
                  tooltips="1" connect="1" arrows="1" fold="1"
                  page="1" pageScale="1" pageWidth="1169" pageHeight="827"
                  math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- Tus celdas van aquí -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

> **Regla**: los ID `0` y `1` son SIEMPRE obligatorios y deben ser las dos primeras celdas. Nunca los reutilices.

### Paso 3: Planificar la distribución

Antes de generar XML, esboza la ubicación lógica:

- Organiza en **filas** o **niveles** (usa carriles para las capas)
- **Separación horizontal**: 40–60px entre formas de una misma fila
- **Separación vertical**: 80–120px entre filas de niveles
- Tamaño estándar de forma: `120x60` píxeles para recuadros de proceso y `160x80` para carriles
- Lienzo predeterminado: A4 horizontal = `1169 x 827` píxeles

### Paso 4: Generar el XML mxGraph

**Celda de vértice** (cada forma):

```xml
<mxCell id="unique-id" value="Etiqueta"
        style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;"
        vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="120" height="60" as="geometry" />
</mxCell>
```

**Celda de arista** (cada conector):

```xml
<mxCell id="edge-id" value="Etiqueta (opcional)"
        style="edgeStyle=orthogonalEdgeStyle;html=1;"
        edge="1" source="source-id" target="target-id" parent="1">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

**Reglas críticas**:

- Cada ID de celda debe ser **único globalmente** dentro del archivo
- Cada vértice debe tener un elemento secundario `mxGeometry` con `x`, `y`, `width`, `height` y `as="geometry"`
- Cada arista debe tener `source` y `target` que coincidan con ID de vértices existentes; **excepción**: las aristas flotantes (por ejemplo, líneas de vida de diagramas de secuencia) usan `sourcePoint`/`targetPoint` dentro de `<mxGeometry>`; consulta el procedimiento de diagramas de secuencia
- El `parent` de cada celda debe referenciar el ID de una celda existente
- Usa `html=1` en el estilo cuando la etiqueta contenga HTML (`<b>`, `<i>`, `<br>`)
- Escapa los caracteres especiales XML en las etiquetas: `&` => `&amp;`, `<` => `&lt;`, `>` => `&gt;`

### Paso 5: Aplicar estilos correctos

Usa la paleta estándar de colores semánticos para mantener la coherencia:

| Finalidad | fillColor | strokeColor |
|---|---|---|
| Principal / Información | `#dae8fc` | `#6c8ebf` |
| Éxito / Inicio | `#d5e8d4` | `#82b366` |
| Advertencia / Decisión | `#fff2cc` | `#d6b656` |
| Error / Fin | `#f8cecc` | `#b85450` |
| Neutral | `#f5f5f5` | `#666666` |
| Externo / Socio | `#e1d5e7` | `#9673a6` |

Cadenas de estilo habituales por tipo de diagrama:

| Finalidad | Cadena de estilo |
|---|---|
| Recuadro de proceso redondeado (diagrama de flujo) | `rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;` |
| Rombo de decisión | `rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;` |
| Terminal de inicio o fin | `ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;` |
| Cilindro de base de datos | `shape=mxgraph.flowchart.database;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;` |
| Contenedor de carriles (nivel) | `swimlane;startSize=30;fillColor=#dae8fc;strokeColor=#6c8ebf;fontStyle=1;` |
| Recuadro de clase UML | `swimlane;fontStyle=1;align=center;startSize=40;fillColor=#dae8fc;strokeColor=#6c8ebf;` |
| Recuadro de interfaz o estereotipo | `swimlane;fontStyle=3;align=center;startSize=40;fillColor=#f5f5f5;strokeColor=#666666;` |
| Contenedor de tabla ER | `shape=table;startSize=30;container=1;collapsible=1;childLayout=tableLayout;` |
| Conector ortogonal | `edgeStyle=orthogonalEdgeStyle;html=1;` |
| Relación ER (pata de cuervo) | `edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERmany;startArrow=ERone;` |

> Consulta el catálogo completo de claves de estilo en `references/style-reference.md` y todos los nombres de bibliotecas de formas en `references/shape-libraries.md`.

### Paso 6: Guardar y validar

1. **Escribe el archivo** en la ruta solicitada con la extensión `.drawio`
2. **Ejecuta el validador** (opcional, pero recomendado):

   ```bash
   python .github/skills/draw-io-diagram-generator/scripts/validate-drawio.py <path-to-file.drawio>
   ```

3. **Indica a la persona** cómo abrir el archivo:
   > "Abre `<filename>` en VS Code: se representará automáticamente con la extensión draw.io. También puedes usar la aplicación web o de escritorio de draw.io si lo prefieres."
4. **Proporciona una descripción breve** del contenido del diagrama para que la persona sepa qué esperar.

---

## Procedimientos por tipo de diagrama

### Diagrama de flujo

Elementos clave: Inicio (elipse) => Proceso (rectángulo redondeado) => Decisión (rombo) => Fin (elipse)

```xml
<!-- Nodo de inicio -->
<mxCell id="start" value="Inicio"
        style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
        vertex="1" parent="1">
  <mxGeometry x="500" y="80" width="120" height="60" as="geometry" />
</mxCell>

<!-- Proceso -->
<mxCell id="p1" value="Paso de proceso"
        style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;"
        vertex="1" parent="1">
  <mxGeometry x="500" y="200" width="120" height="60" as="geometry" />
</mxCell>

<!-- Decisión -->
<mxCell id="d1" value="¿Condición?"
        style="rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
        vertex="1" parent="1">
  <mxGeometry x="460" y="320" width="200" height="100" as="geometry" />
</mxCell>

<!-- Flecha: de start a p1 -->
<mxCell id="e1" value=""
        style="edgeStyle=orthogonalEdgeStyle;html=1;"
        edge="1" source="start" target="p1" parent="1">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

### Diagrama de arquitectura (3 niveles)

Usa **contenedores de carriles** para cada nivel. Todos los recuadros de servicio son elementos secundarios de su carril.

```xml
<!-- Carril del nivel -->
<mxCell id="tier1" value="Capa de cliente"
        style="swimlane;startSize=30;fillColor=#dae8fc;strokeColor=#6c8ebf;fontStyle=1;"
        vertex="1" parent="1">
  <mxGeometry x="60" y="100" width="1050" height="130" as="geometry" />
</mxCell>

<!-- Servicio dentro del nivel (parent="tier1", coordenadas relativas al nivel) -->
<mxCell id="webapp" value="Aplicación web"
        style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;"
        vertex="1" parent="tier1">
  <mxGeometry x="80" y="40" width="120" height="60" as="geometry" />
</mxCell>
```

> Los conectores entre niveles usan coordenadas absolutas con `parent="1"`.

### Diagrama de secuencia

Elementos clave: actores (arriba), líneas de vida (líneas verticales discontinuas), recuadros de activación y flechas de mensajes.

- Líneas de vida: `edge="1"` con `endArrow=none` y `dashed=1`, sin source/target; usa `sourcePoint`/`targetPoint` en la geometría
- Mensaje síncrono: `endArrow=block;endFill=1`
- Mensaje de retorno: `endArrow=open;endFill=0;dashed=1`
- Llamada a sí mismo: traza un bucle con dos puntos Array hacia la derecha y de vuelta

**Fragmento XML mínimo:**

```xml
<!-- Actor (figura de palitos) -->
<mxCell id="actorA" value="Cliente"
        style="shape=mxgraph.uml.actor;pointerEvents=1;dashed=0;whiteSpace=wrap;html=1;aspect=fixed;"
        vertex="1" parent="1">
  <mxGeometry x="110" y="80" width="60" height="80" as="geometry" />
</mxCell>

<!-- Recuadro de servicio -->
<mxCell id="actorB" value="Servidor API"
        style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
        vertex="1" parent="1">
  <mxGeometry x="480" y="100" width="160" height="60" as="geometry" />
</mxCell>

<!-- Línea de vida: arista flotante que usa sourcePoint/targetPoint, NO atributos source/target -->
<mxCell id="lifA" value=""
        style="edgeStyle=none;dashed=1;endArrow=none;"
        edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="140" y="160" as="sourcePoint" />
    <mxPoint x="140" y="700" as="targetPoint" />
  </mxGeometry>
</mxCell>

<!-- Recuadro de activación (rectángulo estrecho sobre la línea de vida) -->
<mxCell id="actA1" value=""
        style="fillColor=#dae8fc;strokeColor=#6c8ebf;"
        vertex="1" parent="1">
  <mxGeometry x="130" y="220" width="20" height="180" as="geometry" />
</mxCell>

<!-- Mensaje síncrono -->
<mxCell id="msg1" value="POST /orders"
        style="edgeStyle=elbowEdgeStyle;elbow=vertical;html=1;endArrow=block;endFill=1;"
        edge="1" source="actA1" target="actorB" parent="1">
  <mxGeometry relative="1" as="geometry" />
</mxCell>

<!-- Mensaje de retorno (discontinuo) -->
<mxCell id="msg2" value="201 Created"
        style="edgeStyle=elbowEdgeStyle;elbow=vertical;dashed=1;html=1;endArrow=open;endFill=0;"
        edge="1" source="actorB" target="actA1" parent="1">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

> **Nota:** Las líneas de vida son aristas flotantes que usan `sourcePoint`/`targetPoint` en `<mxGeometry>` en lugar de atributos `source`/`target`. Este es el patrón estándar de draw.io para diagramas de secuencia.

### Diagrama ER

Usa contenedores `shape=table` con `childLayout=tableLayout`. Las filas son celdas `shape=tableRow` con `portConstraint=eastwest`. Las columnas dentro de cada fila son `shape=partialRectangle`.

Las flechas de relación usan `edgeStyle=entityRelationEdgeStyle`:

- Uno a uno: `startArrow=ERone;endArrow=ERone`
- Uno a muchos: `startArrow=ERone;endArrow=ERmany`
- Muchos a muchos: `startArrow=ERmany;endArrow=ERmany`
- Obligatorio: `ERmandOne`, opcional: `ERzeroToOne`

### Diagrama de clases UML

Los recuadros de clases son contenedores de carriles. Los atributos y métodos son celdas de texto simple. Los separadores son elementos secundarios del carril con altura cero.

Estilos de flecha por tipo de relación:

| Relación | Cadena de estilo |
|---|---|
| Herencia (extends) | `edgeStyle=orthogonalEdgeStyle;html=1;endArrow=block;endFill=0;` |
| Realización (implements) | `edgeStyle=orthogonalEdgeStyle;dashed=1;html=1;endArrow=block;endFill=0;` |
| Composición | `edgeStyle=orthogonalEdgeStyle;html=1;startArrow=diamond;startFill=1;endArrow=none;` |
| Agregación | `edgeStyle=orthogonalEdgeStyle;html=1;startArrow=diamond;startFill=0;endArrow=none;` |
| Dependencia | `edgeStyle=orthogonalEdgeStyle;dashed=1;html=1;endArrow=open;endFill=0;` |
| Asociación | `edgeStyle=orthogonalEdgeStyle;html=1;endArrow=open;endFill=0;` |

---

## Diagramas de varias páginas

Añade varios elementos `<diagram>` para sistemas complejos:

```xml
<mxfile host="Electron" version="26.0.0">
  <diagram id="overview" name="Descripción general">
    <!-- mxGraphModel de descripción general -->
  </diagram>
  <diagram id="detail" name="Vista detallada">
    <!-- mxGraphModel de detalle -->
  </diagram>
</mxfile>
```

Cada página tiene su propio espacio de nombres independiente para ID de celdas. El mismo ID puede aparecer en páginas diferentes sin conflicto.

---

## Edición de diagramas existentes

Al modificar un archivo `.drawio` existente:

1. **Lee** primero el archivo para comprender los ID, las posiciones y la jerarquía de celdas existentes
2. **Identifica la página de destino** por índice o atributo `name`
3. **Asigna ID nuevos y únicos** que no colisionen con los existentes
4. **Respeta la jerarquía de contenedores**: los elementos secundarios de un carril usan coordenadas relativas a su padre
5. **Verifica las aristas**: después de recolocar nodos, confirma que los ID source/target sigan siendo válidos

Usa `scripts/add-shape.py` para añadir una forma de manera segura sin editar XML directamente:

```bash
python .github/skills/draw-io-diagram-generator/scripts/add-shape.py docs/arch.drawio "New Service" 700 380
```

---

## Buenas prácticas

**Distribución**

- Alinea las formas a la cuadrícula de 10px (todas las coordenadas divisibles por 10)
- Agrupa las formas relacionadas dentro de contenedores de carriles
- Un tema de diagrama por página; usa archivos de varias páginas para sistemas complejos
- Procura no superar 40 celdas por página para facilitar la lectura

**Etiquetas**

- Añade una celda de texto de título (`text;strokeColor=none;fillColor=none;fontSize=18;fontStyle=1`) en la parte superior de cada página
- Establece siempre `whiteSpace=wrap;html=1` en las formas de vértice
- Mantén las etiquetas concisas: 3 palabras o menos por forma cuando sea posible

**Coherencia de estilos**

- Usa de forma coherente en todo el proyecto la paleta semántica del paso Aplicar estilos correctos (paso 5)
- Prefiere `edgeStyle=orthogonalEdgeStyle` para conectores claros en ángulo recto
- No incluyas HTML arbitrario en las etiquetas salvo que sea necesario

**Nomenclatura de archivos**

- Usa kebab-case: `order-service-flow.drawio`, `database-schema.drawio`
- Coloca los diagramas junto al código que documentan: `docs/` o `architecture/`

---

## Solución de problemas

| Problema | Causa probable | Corrección |
|---|---|---|
| El archivo se abre en blanco en VS Code | Falta la celda id=0 o id=1 | Añadir ambas celdas raíz antes de cualquier otra |
| Forma en una posición incorrecta | Es un elemento secundario de un contenedor; las coordenadas son relativas | Comprobar `parent`; ajustar x/y respecto al contenedor |
| Arista no visible | source o target no coincide con ningún ID de vértice | Verificar que ambos ID existan exactamente como están escritos |
| El diagrama muestra "Compressed" | mxGraphModel está codificado en base64 | Abrir en draw.io web, File > Export > XML (sin comprimir) |
| El estilo de la forma no se representa | Error tipográfico en el nombre de shape= | Consultar la cadena exacta en `references/shape-libraries.md` |
| La etiqueta muestra HTML escapado | html=0 en una celda con etiqueta HTML | Añadir `html=1;` al estilo de la celda |
| Los elementos secundarios se superponen al borde del contenedor | Altura del contenedor demasiado pequeña | Aumentar la altura del contenedor en mxGeometry |

---

## Plantilla de salida

Entrega un archivo `.drawio` completo y válido. El artefacto mínimo bien formado que produce esta skill tiene este aspecto:

```xml
<mxfile host="Electron" modified="2026-01-01T00:00:00.000Z" version="26.0.0">
  <diagram id="page-1" name="Descripción general">
    <mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1"
                  tooltips="1" connect="1" arrows="1" fold="1"
                  page="1" pageScale="1" pageWidth="1169" pageHeight="827"
                  math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title" value="Vista del sistema"
                style="text;html=1;strokeColor=none;fillColor=none;fontSize=18;fontStyle=1;"
                vertex="1" parent="1">
          <mxGeometry x="60" y="30" width="300" height="30" as="geometry" />
        </mxCell>
        <mxCell id="webapp" value="Aplicación web"
                style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;"
                vertex="1" parent="1">
          <mxGeometry x="80" y="100" width="120" height="60" as="geometry" />
        </mxCell>
        <mxCell id="api" value="Servidor API"
                style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
                vertex="1" parent="1">
          <mxGeometry x="320" y="100" width="120" height="60" as="geometry" />
        </mxCell>
        <mxCell id="e1" style="edgeStyle=orthogonalEdgeStyle;html=1;"
                edge="1" source="webapp" target="api" parent="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

Junto al archivo, proporciona siempre:

1. **Un resumen de una frase** sobre lo que muestra el diagrama.
2. **Cómo abrirlo**:
   > "Abre `<filename>` en VS Code: la extensión draw.io lo representará automáticamente. También puedes abrirlo en la aplicación web o de escritorio de draw.io si lo prefieres."
3. **Cómo editarlo** (si es probable que la persona lo personalice):
   > "Haz clic en una forma para seleccionarla. Haz doble clic para editar la etiqueta. Arrástrala para cambiarla de posición."
4. **Estado de validación**: si se ejecutó el script validador y se superó la comprobación.

---

## Puerta de calidad

Antes de entregar cualquier archivo `.drawio` generado, verifica:

- [ ] El archivo empieza con el elemento raíz `<mxfile>`
- [ ] Cada `<diagram>` tiene un atributo `id` no vacío
- [ ] `<mxCell id="0" />` es la primera celda de cada diagrama
- [ ] `<mxCell id="1" parent="0" />` es la segunda celda de cada diagrama
- [ ] Todos los valores `id` de celda son únicos dentro de cada diagrama
- [ ] Cada celda de vértice tiene `vertex="1"` y un elemento secundario `<mxGeometry as="geometry">`
- [ ] Cada celda de arista tiene `edge="1"` y: (a) `source`/`target` que apuntan a ID de vértices existentes, o (b) `<mxPoint as="sourcePoint">` y `<mxPoint as="targetPoint">` en su `<mxGeometry>` (arista flotante, usada en líneas de vida de diagramas de secuencia)
- [ ] Cada celda (excepto id=0) tiene un `parent` que apunta a un ID existente
- [ ] El estilo incluye `html=1` en cualquier etiqueta con contenido HTML
- [ ] El XML está bien formado (sin etiquetas sin cerrar ni `&`, `<`, `>` sin escapar en valores de atributos)
- [ ] Existe una celda de etiqueta de título en la parte superior de cada página

Ejecuta el validador automatizado:

```bash
python .github/skills/draw-io-diagram-generator/scripts/validate-drawio.py <file.drawio>
```

---

## Referencias

Todos los archivos complementarios están en `.github/skills/draw-io-diagram-generator/`:

| Archivo | Contenido |
|---|---|
| `references/drawio-xml-schema.md` | Referencia completa de atributos de mxfile / mxGraphModel / mxCell, sistema de coordenadas, celdas reservadas y reglas de validación |
| `references/style-reference.md` | Todas las claves de estilo con valores admitidos, claves de vértices y aristas, catálogo de formas y paleta semántica |
| `references/shape-libraries.md` | Todas las categorías de bibliotecas de formas (General, Flowchart, UML, ER, Network, BPMN, Mockup, K8s) con sus cadenas de estilo |
| `assets/templates/flowchart.drawio` | Plantilla de diagrama de flujo lista para usar |
| `assets/templates/architecture.drawio` | Plantilla de arquitectura de sistema de 4 niveles |
| `assets/templates/sequence.drawio` | Plantilla de diagrama de secuencia con 3 actores |
| `assets/templates/er-diagram.drawio` | Diagrama ER de 3 tablas con relaciones de pata de cuervo |
| `assets/templates/uml-class.drawio` | Interfaz + 2 clases + enumeración con flechas de relación |
| `scripts/validate-drawio.py` | Script Python para validar la estructura XML de cualquier archivo .drawio |
| `scripts/add-shape.py` | CLI Python para añadir una forma nueva a un diagrama existente |
| `scripts/README.md` | Cómo usar los scripts, con ejemplos |
