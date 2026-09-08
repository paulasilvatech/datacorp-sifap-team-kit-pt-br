# Referencia del esquema XML de draw.io

Referencia completa del formato de archivo `.drawio` (XML mxGraph). Úsala para generar, analizar o validar archivos de diagrama.

---

## Estructura de nivel superior

Cada archivo `.drawio` es XML con esta estructura raíz:

```xml
<!-- Establecer modified con la marca de tiempo actual en ISO 8601 al generar un archivo nuevo -->
<mxfile host="Electron" modified=""
        agent="draw.io" version="26.0.0" type="device">
  <diagram id="<unique-id>" name="<Nombre de página>">
    <mxGraphModel ...attributes...>
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- Todas las celdas de contenido aquí -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### Atributos de `<mxfile>`

| Atributo | Obligatorio | Valor predeterminado | Descripción |
| ----------- | ---------- | --------- | ------------- |
| `host` | No | `"app.diagrams.net"` | Editor de origen (`"Electron"` para escritorio/VS Code) |
| `modified` | No | — | Marca de tiempo ISO 8601 |
| `agent` | No | — | Cadena del agente de usuario |
| `version` | No | — | Versión de draw.io |
| `type` | No | `"device"` | Tipo de almacenamiento |

### Atributos de `<diagram>`

| Atributo | Obligatorio | Descripción |
| ----------- | ---------- | ------------- |
| `id` | Sí | Identificador único de página (cualquier cadena) |
| `name` | Sí | Etiqueta de pestaña mostrada en el editor |

### Atributos de `<mxGraphModel>`

| Atributo | Tipo | Valor predeterminado | Descripción |
| ----------- | ------ | --------- | ------------- |
| `dx` | int | `1422` | Desplazamiento horizontal X |
| `dy` | int | `762` | Desplazamiento vertical Y |
| `grid` | `0`/`1` | `1` | Mostrar la cuadrícula |
| `gridSize` | int | `10` | Tamaño del ajuste a cuadrícula en píxeles |
| `guides` | `0`/`1` | `1` | Mostrar guías de alineación |
| `tooltips` | `0`/`1` | `1` | Habilitar información sobre herramientas |
| `connect` | `0`/`1` | `1` | Habilitar flechas de conexión al pasar el puntero |
| `arrows` | `0`/`1` | `1` | Mostrar flechas de dirección |
| `fold` | `0`/`1` | `1` | Habilitar el plegado de grupos |
| `page` | `0`/`1` | `1` | Mostrar el límite de página |
| `pageScale` | float | `1` | Escala de zoom de página |
| `pageWidth` | int | `1169` | Ancho de página en píxeles (A4 horizontal) |
| `pageHeight` | int | `827` | Alto de página en píxeles (A4 horizontal) |
| `math` | `0`/`1` | `0` | Habilitar la representación matemática de LaTeX |
| `shadow` | `0`/`1` | `0` | Sombra global de las formas |

**Tamaños habituales de página (píxeles a 96dpi):**

| Formato | Ancho | Alto |
| -------- | ------- | -------- |
| A4 horizontal | `1169` | `827` |
| A4 vertical | `827` | `1169` |
| A3 horizontal | `1654` | `1169` |
| Carta horizontal | `1100` | `850` |
| Carta vertical | `850` | `1100` |
| Pantalla (16:9) | `1654` | `931` |

---

## Celdas reservadas (siempre obligatorias)

```xml
<mxCell id="0" />                 <!-- Celda raíz: nunca omitir ni añadir atributos -->
<mxCell id="1" parent="0" />     <!-- Capa predeterminada: todas las celdas son secundarias de esta -->
```

Estas dos celdas DEBEN ser las primeras entradas de `<root>`. Los ID `0` y `1` están reservados y no deben usarse para ninguna otra celda.

---

## Elemento de vértice (forma)

```xml
<mxCell
  id="2"
  value="Texto de etiqueta"
  style="rounded=1;whiteSpace=wrap;html=1;"
  vertex="1"
  parent="1">
  <mxGeometry x="200" y="160" width="120" height="60" as="geometry" />
</mxCell>
```

### Atributos de vértice de `<mxCell>`

| Atributo | Obligatorio | Tipo | Descripción |
| ----------- | ---------- | ------ | ------------- |
| `id` | Sí | string | Identificador único dentro de este diagrama |
| `value` | Sí | string | Texto de etiqueta (se admite HTML si el estilo tiene `html=1`) |
| `style` | Sí | string | Cadena de estilo key=value delimitada por puntos y comas |
| `vertex` | Sí | `"1"` | Debe ser `"1"` para declararlo como forma |
| `parent` | Sí | string | ID de la celda principal (`"1"` para la capa predeterminada) |

### Atributos de vértice de `<mxGeometry>`

| Atributo | Obligatorio | Tipo | Descripción |
| ----------- | ---------- | ------ | ------------- |
| `x` | Sí | float | Borde izquierdo de la forma (píxeles desde el origen del lienzo) |
| `y` | Sí | float | Borde superior de la forma (píxeles desde el origen del lienzo) |
| `width` | Sí | float | Ancho de la forma en píxeles |
| `height` | Sí | float | Alto de la forma en píxeles |
| `as` | Sí | `"geometry"` | Siempre `"geometry"` |

---

## Elemento de arista (conector)

```xml
<mxCell
  id="5"
  value="Etiqueta"
  style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;"
  edge="1"
  source="2"
  target="3"
  parent="1">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

### Atributos de arista de `<mxCell>`

| Atributo | Obligatorio | Tipo | Descripción |
| ----------- | ---------- | ------ | ------------- |
| `id` | Sí | string | Identificador único |
| `value` | Sí | string | Etiqueta del conector (cadena vacía si no hay etiqueta) |
| `style` | Sí | string | Cadena de estilo (consulta Estilos de aristas) |
| `edge` | Sí | `"1"` | Debe ser `"1"` para declararlo como conector |
| `source` | No | string | ID del vértice de origen |
| `target` | No | string | ID del vértice de destino |
| `parent` | Sí | string | ID de la celda principal (normalmente `"1"`) |

### Atributos de arista de `<mxGeometry>`

| Atributo | Obligatorio | Tipo | Descripción |
| ----------- | ---------- | ------ | ------------- |
| `relative` | No | `"1"` | Siempre `"1"` para aristas |
| `as` | Sí | `"geometry"` | Siempre `"geometry"` |

### Arista con desplazamiento de etiqueta

```xml
<mxGeometry x="-0.1" y="10" relative="1" as="geometry">
  <mxPoint as="offset" />
</mxGeometry>
```

El valor `x` de la geometría relativa desplaza la etiqueta a lo largo de la arista (de -1 a 1). `y` es el desplazamiento perpendicular en píxeles.

### Arista con puntos de paso manuales (puntos de control)

```xml
<mxGeometry relative="1" as="geometry">
  <Array as="points">
    <mxPoint x="340" y="80" />
    <mxPoint x="340" y="200" />
  </Array>
</mxGeometry>
```

---

## Diagramas de varias páginas

```xml
<mxfile>
  <diagram id="page-1" name="Descripción general">
    <mxGraphModel>...</mxGraphModel>
  </diagram>
  <diagram id="page-2" name="Detalle">
    <mxGraphModel>...</mxGraphModel>
  </diagram>
</mxfile>
```

Cada `<diagram>` es una página o pestaña independiente. Los ID de celda tienen el ámbito de su propio `<diagram>`; el mismo valor puede aparecer en páginas diferentes sin conflictos.

---

## Celdas de capa

Las capas reemplazan la capa predeterminada `id="1"`. Las celdas se asignan a una capa mediante `parent`:

```xml
<mxCell id="0" />
<mxCell id="1" value="Fondo" parent="0" />        <!-- capa 1 -->
<mxCell id="layer2" value="Servicios" parent="0" />     <!-- capa 2 -->
<mxCell id="layer3" value="Conectores" parent="0" />   <!-- capa 3 -->

<!-- Asignar la capa mediante el atributo parent -->
<mxCell id="10" value="API" ... parent="layer2">
  <mxGeometry ... />
</mxCell>
```

Alternar la visibilidad de la capa:

```xml
<mxCell id="layer2" value="Servicios" parent="0" visible="0" />
```

---

## Contenedor de carriles

```xml
<!-- Contenedor de carriles -->
<mxCell id="swim1" value="Proceso" style="shape=pool;startSize=30;horizontal=1;"
        vertex="1" parent="1">
  <mxGeometry x="40" y="40" width="800" height="340" as="geometry" />
</mxCell>

<!-- Carril 1 (secundario del contenedor de carriles) -->
<mxCell id="lane1" value="Cliente" style="swimlane;startSize=30;"
        vertex="1" parent="swim1">
  <mxGeometry x="0" y="30" width="800" height="150" as="geometry" />
</mxCell>

<!-- Forma dentro del carril (secundaria del carril) -->
<mxCell id="step1" value="Realizar pedido" style="rounded=1;whiteSpace=wrap;html=1;"
        vertex="1" parent="lane1">
  <mxGeometry x="80" y="50" width="120" height="60" as="geometry" />
</mxCell>
```

> **Clave**: las celdas dentro de un carril tienen `parent` establecido en el **ID del carril**, no en `"1"`.
> Las coordenadas dentro de los carriles son **relativas al origen del carril**.

---

## Celdas de grupo

```xml
<!-- Contenedor de grupo invisible -->
<mxCell id="group1" value="" style="group;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="300" height="200" as="geometry" />
</mxCell>

<!-- Elementos secundarios relativos al origen del grupo -->
<mxCell id="child1" value="A" style="rounded=1;" vertex="1" parent="group1">
  <mxGeometry x="20" y="20" width="100" height="60" as="geometry" />
</mxCell>
```

---

## Etiquetas HTML

Cuando el estilo incluye `html=1`, `value` puede contener HTML:

```xml
<mxCell value="&lt;b&gt;OrderService&lt;/b&gt;&lt;br&gt;&lt;i&gt;:8080&lt;/i&gt;"
        style="rounded=1;html=1;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="160" height="60" as="geometry" />
</mxCell>
```

El HTML debe escaparse para XML:

- `<` → `&lt;`
- `>` → `&gt;`
- `&` → `&amp;`
- `"` → `&quot;`

Etiquetas HTML habituales admitidas: `<b>`, `<i>`, `<u>`, `<br>`, `<font color="#hex">`, `<span style="...">`, `<hr/>`

---

## Información sobre herramientas y metadatos

```xml
<mxCell value="Nombre del servicio" tooltip="Gestiona el procesamiento de pedidos" style="..." vertex="1" parent="1">
  <mxGeometry ... />
</mxCell>
```

---

## Reglas de generación de ID

| Regla | Detalle |
| ------ | -------- |
| ID `0` y `1` | Reservados: siempre la raíz y la capa predeterminada |
| Todos los demás ID | Deben ser únicos dentro de su `<diagram>` |
| Patrón seguro | Enteros secuenciales a partir de `2` o cadenas UUID |
| Entre páginas | Los ID no necesitan ser únicos entre distintas páginas `<diagram>` |

**Ejemplo de ID secuenciales seguros:**

```text
id="2", id="3", id="4", ...
```

**Ejemplo de estilo UUID:**

```text
id="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

---

## Sistema de coordenadas

- El origen `(0, 0)` está en la **esquina superior izquierda** del lienzo
- `x` aumenta **hacia la derecha**
- `y` aumenta **hacia abajo**
- Todas las unidades son **píxeles**

---

## Espaciado recomendado

| Contexto | Valor |
| --------- | ------- |
| Separación mínima entre formas | `40px` |
| Separación cómoda | `80px` |
| Margen interior de carril | `20px` |
| Margen de página desde el borde | `40px` |
| Espacio libre para el recorrido de conectores | `10px` |

---

## Archivo `.drawio` mínimo válido

```xml
<mxfile host="Electron" modified="2026-03-25T00:00:00.000Z" version="26.0.0">
  <diagram id="main" name="Page-1">
    <mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1"
                  tooltips="1" connect="1" arrows="1" fold="1"
                  page="1" pageScale="1" pageWidth="1169" pageHeight="827"
                  math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Reglas de validación

### Comprobaciones obligatorias

- [ ] Las celdas `id="0"` e `id="1"` están siempre presentes como las dos primeras hijas de `<root>`
- [ ] Ninguna otra celda usa `id="0"` ni `id="1"`
- [ ] Todos los valores `id` son únicos dentro de cada `<diagram>`
- [ ] Cada `<mxCell>` tiene exactamente un elemento secundario `<mxGeometry>`
- [ ] `<mxGeometry>` tiene el atributo `as="geometry"`
- [ ] Las celdas de vértice tienen `vertex="1"` y las de arista `edge="1"`
- [ ] Los ID `source`/`target` de las aristas referencian ID de vértice existentes en el mismo diagrama
- [ ] Los elementos secundarios de carriles tienen `parent` establecido en el ID del contenedor o carril, no en `"1"`
- [ ] El HTML de los atributos `value` está escapado para XML

### Recomendaciones

- [ ] Las formas no se superponen salvo que sea intencional (usar una separación ≥40px)
- [ ] Las etiquetas de aristas son breves (≤4 palabras)
- [ ] Las celdas de capa tienen nombres `value` descriptivos
- [ ] Todas las formas caben dentro de los límites `pageWidth` × `pageHeight`
