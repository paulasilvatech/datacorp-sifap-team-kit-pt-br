# Scripts de draw-io

Scripts de utilidad para trabajar con archivos de diagrama `.drawio` en el proyecto cxp-bu-order-ms.

## Requisitos

- Python 3.8+
- Sin dependencias externas (solo usa la biblioteca estándar: `xml.etree.ElementTree`, `argparse`, `json`, `sys`, `pathlib`)

## Scripts

### `validate-drawio.py`

Valida la estructura XML de un archivo `.drawio` según las restricciones obligatorias.

**Uso**

```bash
python scripts/validate-drawio.py <path-to-diagram.drawio>
```

**Ejemplos**

```bash
# Validar un solo archivo
python scripts/validate-drawio.py docs/architecture.drawio

# Validar todos los archivos drawio de un directorio
for f in docs/**/*.drawio; do python scripts/validate-drawio.py "$f"; done
```

**Comprobaciones realizadas**

| Comprobación | Descripción |
|-------|-------------|
| Celdas raíz | Verifica que las celdas id="0" e id="1" estén presentes en cada página del diagrama |
| ID únicos | Todos los valores id de `mxCell` son únicos dentro de un diagrama |
| Conectividad de aristas | Cada arista tiene atributos `source` y `target` válidos que apuntan a celdas existentes |
| Geometría | Cada celda de vértice tiene un elemento secundario `mxGeometry` |
| Cadena de padres | El atributo `parent` de cada celda referencia el id de una celda existente |
| XML bien formado | El archivo es XML válido |

**Códigos de salida**

- `0`: validación superada
- `1`: se encontraron uno o más errores de validación (se imprimen en stdout)

---

### `add-shape.py`

Añade una forma nueva (celda de vértice) a un archivo de diagrama `.drawio` existente.

**Uso**

```bash
python scripts/add-shape.py <diagram.drawio> <label> <x> <y> [options]
```

**Argumentos**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `diagram` | Sí | Ruta del archivo `.drawio` |
| `label` | Sí | Etiqueta de texto de la forma nueva |
| `x` | Sí | Coordenada X (píxeles desde la esquina superior izquierda) |
| `y` | Sí | Coordenada Y (píxeles desde la esquina superior izquierda) |

**Opciones**

| Opción | Valor predeterminado | Descripción |
|--------|---------|-------------|
| `--width` | `120` | Ancho de la forma en píxeles |
| `--height` | `60` | Alto de la forma en píxeles |
| `--style` | `"rounded=1;whiteSpace=wrap;html=1;"` | Cadena de estilo de draw.io |
| `--diagram-index` | `0` | Índice de la página del diagrama (base 0) |
| `--dry-run` | false | Imprimir el XML de la celda nueva sin modificar el archivo |

**Ejemplos**

```bash
# Añadir un recuadro redondeado básico
python scripts/add-shape.py docs/flowchart.drawio "New Step" 400 300

# Añadir una forma con estilo personalizado
python scripts/add-shape.py docs/flowchart.drawio "Decision" 400 400 \
  --width 160 --height 80 \
  --style "rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"

# Obtener una vista previa sin escribir
python scripts/add-shape.py docs/architecture.drawio "Service X" 600 200 --dry-run
```

**Salida**

Imprime el id de la celda nueva cuando la operación se completa correctamente:

```
Added shape id="auto_abc123" to page 0 of docs/flowchart.drawio
```

---

## Flujos de trabajo habituales

### Validar antes de hacer commit

```bash
# Validar todos los diagramas
find . -name "*.drawio" -not -path "*/node_modules/*" | \
  xargs -I{} python scripts/validate-drawio.py {}
```

### Añadir rápidamente un nodo de marcador de posición

```bash
python scripts/add-shape.py docs/architecture.drawio "TODO: Service" 800 400 \
  --style "rounded=1;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;"
```

### Comprobar que una plantilla sea válida

```bash
python scripts/validate-drawio.py .github/skills/draw-io-diagram-generator/templates/flowchart.drawio
```
