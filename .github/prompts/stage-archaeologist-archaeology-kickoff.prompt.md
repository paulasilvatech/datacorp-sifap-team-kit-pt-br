---
name: "archaeology-kickoff"
description: "Inicia la etapa 1: guía al equipo por la carpeta heredada y produce un inventario inicial."
argument-hint: "path=01-archaeology/legacy-sifap/"
agent: "archaeologist"
model: Claude Opus 5 (copilot)
tools: ["read", "search", "edit"]
---
# /archaeology-kickoff

## Objetivo

Guía al equipo por la base de código heredada mediante un inventario de lo general a lo particular antes de leer cualquier programa individual. Esta es la primera actividad de la etapa 1: mapea el terreno antes de excavar.

## Cuándo invocar

Al comienzo de la etapa 1, inmediatamente después de que el equipo reciba acceso a la carpeta `01-archaeology/legacy-sifap/`.

## Precondiciones

- La carpeta `01-archaeology/legacy-sifap/` está disponible en el espacio de trabajo; forma parte del kit y no depende de un script de configuración
- El equipo todavía no ha abierto programas individuales

## Entradas que debe proporcionar el equipo

- La ruta de la carpeta heredada (normalmente `01-archaeology/legacy-sifap/`)
- Confirmación de que el equipo no ha empezado a leer archivos individuales (este prompt es de orientación, no de lectura profunda)

## Lo que haré

- Examinar recursivamente la carpeta `01-archaeology/legacy-sifap/` y enumerar todos los directorios
- Contar archivos por extensión (`.NSN`, `.cpy`, `.ddm`, `.map` y cualquier otra)
- Clasificar programas por prefijos de patrones de nombres (por ejemplo, `BN-*` para lotes, `PG-*` para ejecución en línea)
- Señalar los 3 elementos que parezcan más inusuales según la longitud del nombre, el tamaño del archivo o la ubicación
- Proponer un orden de lectura basado en la clasificación

## Lo que NO haré

- Abrir o leer archivos individuales de programas (eso corresponde a prompts posteriores)
- Decir al equipo qué hacen los programas: el equipo lo descubre de forma independiente
- Inventar explicaciones de convenciones de nombres: si un prefijo no está claro, lo marco como desconocido
- Referenciar detalles internos específicos del sistema: trabajo solo con lo que revela la estructura de carpetas

## Formato de salida

Un archivo Markdown en `01-archaeology/inventory.md` con:

```markdown
# Inventario heredado — [Nombre del equipo]
## Estructura de carpetas
## Recuento de archivos por tipo
## Patrones de convenciones de nombres
## Elementos inusuales (los 3 principales)
## Orden de lectura propuesto
```

## Definición de terminado

- [ ] El archivo de inventario existe y documenta la estructura de carpetas
- [ ] Los recuentos de archivos son correctos (verificables por otra persona del equipo al ejecutar `find`)
- [ ] Se identifican al menos 3 patrones de convenciones de nombres con sus recuentos
- [ ] Se señalan tres elementos que «parecen inusuales» con rutas de archivo y motivos
- [ ] El orden de lectura propuesto se justifica por patrones de nombres o posición estructural

## Cuerpo del prompt

Eres el `@archaeologist` que inicia una orientación de la etapa 1 con el equipo. El equipo acaba de recibir su base de código heredada y todavía no ha abierto ningún archivo.

Realiza los pasos siguientes en orden. No omitas ninguno.

**Paso 1 — Mapea el árbol de carpetas.**
Enumera todos los directorios y subdirectorios de la ruta heredada proporcionada. Muestra la estructura del árbol. Cuenta el número total de directorios.

**Paso 2 — Cuenta archivos por extensión.**
Para cada extensión encontrada (`.NSN`, `.cpy`, `.ddm`, `.map`, `.txt`, `.md` o cualquier otra), informa del recuento. Preséntalo como tabla: `| Extensión | Recuento | Propósito probable |`. Para «Propósito probable», utiliza solo conocimiento general de Natural/Adabas (por ejemplo, `.NSN` = programa fuente Natural, `.cpy` = código de copia, `.ddm` = módulo de definición de datos). No adivines el contenido de ningún archivo específico.

**Paso 3 — Identifica patrones de convenciones de nombres.**
Examina todos los nombres de archivo (sin abrir los archivos). Agrupa los archivos por patrón de prefijo (los primeros 2–3 caracteres antes de un delimitador como `-`, `_` o un dígito). Para cada patrón con 2+ archivos, informa: `| Prefijo | Recuento | Hipótesis |`. Basa la hipótesis solo en conocimiento general de las convenciones de Natural. Si un prefijo no tiene un patrón claro, marca la hipótesis como `Desconocido — investigar en el siguiente paso`.

**Paso 4 — Señala elementos inusuales.**
Identifica los 3 elementos más inusuales de la carpeta. «Inusual» significa cualquiera de los siguientes: archivo de mayor tamaño, anidamiento más profundo, patrón de nombre que aparece solo una vez o extensión que aparece solo una vez. Para cada elemento, proporciona la ruta del archivo, lo que lo hace inusual y una acción de investigación sugerida.

**Paso 5 — Propón un orden de lectura.**
Según los patrones identificados, propone qué archivos leer primero. Prioriza: (a) puntos de entrada por lotes (normalmente identificables por patrones de prefijos), (b) archivos DDM (para comprender los datos antes que el código) y (c) los programas más conectados (archivos cuyos nombres aparecen como argumentos en otros nombres de archivo, lo que sugiere relaciones CALLNAT). Indica claramente que es una hipótesis: el orden real de lectura cambiará cuando el equipo comience a rastrear dependencias.

**Paso 6 — Genera el inventario.**
Escribe el inventario completo en `01-archaeology/inventory.md` utilizando el formato de salida anterior. Incluye la fecha, un marcador de posición para el nombre del equipo y una nota que indique que es una primera pasada y se revisará a medida que el equipo lea archivos individuales.

No abras ningún archivo para leer su contenido. Este prompt trabaja solo con nombres de archivo y estructura de carpetas. Si el equipo te pide leer un archivo específico, redirígelo a `/extract-business-rules` o `/map-dependencies`.

## Ejemplo de invocación

```
/archaeology-kickoff path=01-archaeology/legacy-sifap/
```
