---
description: "Utiliza al crear, editar o revisar diagramas draw.io y XML mxGraph en archivos .drawio, .drawio.svg o .drawio.png."
applyTo: "**/*.drawio,**/*.drawio.svg,**/*.drawio.png"
---

# Diagramas draw.io — Convenciones y restricciones

Este archivo se activa al abrir o editar un archivo `.drawio`, `.drawio.svg` o `.drawio.png`. Define las restricciones de estructura, estilo y nomenclatura que debe satisfacer cada diagrama de este repositorio para que se represente al primer intento en VS Code con la extensión `hediet.vscode-drawio` y mantenga la coherencia con el kit. Enseña las invariantes que debe mantener un archivo de diagrama; no explica paso a paso cómo construirlo. El procedimiento de autoría, los ejemplos XML por tipo, las plantillas y el script de validación se encuentran en la [habilidad `draw-io-diagram-generator`](../skills/draw-io-diagram-generator/SKILL.md); léela antes de generar o reestructurar un diagrama y no dupliques sus pasos aquí.

## Invariantes de estructura

Estas invariantes no son negociables; un diagrama que incumple cualquiera de ellas se muestra en blanco o dañado.

- `id="0"` e `id="1"` son las **dos primeras celdas** de cada `<diagram>`, en ese orden, y nunca se reutilizan para el contenido.
- Cada `id` de celda es **único dentro de su página de diagrama** (los identificadores pueden repetirse en páginas distintas).
- Cada vértice (`vertex="1"`) tiene un hijo `<mxGeometry ... as="geometry">` que contiene `x`, `y`, `width` y `height`.
- Cada arista (`edge="1"`) apunta mediante `source`/`target` a identificadores de vértice existentes **o**, para aristas flotantes como las líneas de vida de diagramas de secuencia, contiene `<mxPoint as="sourcePoint">` y `<mxPoint as="targetPoint">` dentro de su `<mxGeometry>`.
- Cada celda, excepto `id="0"`, tiene un `parent` que se resuelve a un identificador existente.
- Los hijos de un contenedor (carril, tabla) utilizan coordenadas **relativas al padre**, no al lienzo.

```xml
<root>
  <mxCell id="0" />
  <mxCell id="1" parent="0" />
  <!-- Todas las demás celdas establecen parent en un identificador existente -->
</root>
```

> [!WARNING]
> Un archivo que se abre en blanco en VS Code casi siempre carece de las celdas raíz `id="0"`/`id="1"` o tiene una arista cuyo identificador `source`/`target` no se resuelve. Comprueba primero esas dos invariantes.

## Paleta de colores semántica

Utiliza una misma paleta en todo el repositorio para que el color de una forma siempre signifique lo mismo. `fillColor` se combina con su `strokeColor` correspondiente.

| Función | fillColor | strokeColor |
|---|---|---|
| Principal / Información (predeterminado) | `#dae8fc` | `#6c8ebf` |
| Éxito / Inicio / Positivo | `#d5e8d4` | `#82b366` |
| Advertencia / Decisión | `#fff2cc` | `#d6b656` |
| Error / Fin / Peligro | `#f8cecc` | `#b85450` |
| Neutro / Interfaz | `#f5f5f5` | `#666666` |
| Externo / Socio | `#e1d5e7` | `#9673a6` |

## Convenciones de archivos, nomenclatura y distribución

| Aspecto | Convención |
|---|---|
| Extensión | `.drawio` para diagramas bajo control de versiones; `.drawio.svg` cuando el archivo se incrusta en Markdown |
| Nombre de archivo | `kebab-case`, por ejemplo, `payment-flow.drawio`, `database-schema.drawio` |
| Ubicación | Junto al código que documenta el diagrama, en `docs/` o `architecture/` |
| Cuadrícula | Alinea cada coordenada con la cuadrícula de 10 px (valores divisibles por 10) |
| Espaciado | 40–60 px entre formas de la misma fila; 80–120 px entre filas de niveles |
| Tamaño de página | A4 horizontal predeterminado, `1169 × 827` px |
| Densidad | Máximo 40 celdas por página; divide los sistemas más grandes en varias páginas `<diagram>` |
| Título | Añade una celda de texto de título en la parte superior de cada página |

## Validación

Antes de crear un commit, ejecuta el comprobador `validate-drawio.py` documentado en la [habilidad `draw-io-diagram-generator`](../skills/draw-io-diagram-generator/SKILL.md) y después abre el archivo en VS Code para confirmar que se representa correctamente. La habilidad define la invocación exacta y la tabla de solución de problemas; este archivo define las invariantes que exige el comprobador.

## Convenciones

| Regla | Justificación |
|---|---|
| `id="0"` e `id="1"` son las dos primeras celdas de cada página | draw.io las trata como raíz reservada; sin ellas el archivo no se representa |
| Cada estilo de vértice incluye `whiteSpace=wrap;html=1` | Las etiquetas se ajustan y representan HTML de forma coherente en lugar de desbordarse |
| Los conectores utilizan `edgeStyle=orthogonalEdgeStyle` | Un trazado limpio en ángulos rectos mantiene legibles los diagramas |
| La paleta de colores semántica se utiliza de forma coherente | Un color tiene el mismo significado en todos los diagramas |
| Los archivos de diagramas utilizan `kebab-case` y se ubican junto al código | Los diagramas se encuentran con facilidad y sus diferencias se revisan bien en el control de versiones |
| Los pasos y procedimientos de autoría permanecen en la habilidad, no aquí | Una sola fuente de procedimiento evita que dos copias diverjan |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Situar `id="0"` e `id="1"` primero, seguidos de las celdas de contenido | Reutilizar `0` o `1` para una forma u omitirlos |
| Apuntar cada arista a identificadores de vértice existentes o utilizar puntos flotantes | Dejar sin destino válido el `source`/`target` de una arista |
| Reutilizar la paleta de colores semántica | Inventar colores ad hoc para cada diagrama |
| Enlazar la habilidad para el flujo de autoría | Copiar los procedimientos paso a paso de la habilidad en este archivo |
| Mantener las coordenadas de los hijos relativas a su contenedor | Utilizar coordenadas del lienzo para celdas dentro de un carril |
| Dividir un diagrama cargado entre varias páginas | Amontonar más de 40 celdas en una página |

## Lista de verificación antes de abrir una PR

- [ ] `<mxCell id="0" />` y `<mxCell id="1" parent="0" />` son las dos primeras celdas de cada página
- [ ] Todos los identificadores de celda son únicos dentro de su diagrama y cada `parent` se resuelve
- [ ] Cada `source`/`target` de arista se resuelve, o la arista utiliza `sourcePoint`/`targetPoint`
- [ ] Cada vértice tiene un `<mxGeometry as="geometry">` y los hijos de contenedores utilizan coordenadas relativas
- [ ] La paleta de colores semántica y el estilo de vértice `whiteSpace=wrap;html=1` se aplican de forma coherente
- [ ] El archivo utiliza `kebab-case`, se encuentra en `docs/` o `architecture/` y tiene una celda de título por página
- [ ] El comprobador `validate-drawio.py` de la habilidad se supera y el archivo se representa correctamente en VS Code
