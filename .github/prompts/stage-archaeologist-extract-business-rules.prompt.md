---
name: "extract-business-rules"
description: "Extrae reglas de negocio de un programa Natural mediante la lectura de bloques IF/THEN/ELSE y su confirmación frente a la documentación."
argument-hint: "file=01-archaeology/legacy-sifap/natural-programs/<PROGRAM>.NSN docs=01-archaeology/legacy-sifap/legacy-docs/"
agent: "archaeologist"
tools: ["read", "search", "edit"]
---
# /extract-business-rules

## Objetivo

Lee un programa Natural seleccionado y extrae cada regla de negocio candidata identificando la lógica condicional (IF/THEN/ELSE, DECIDE, AT BREAK). Expresa cada regla en lenguaje claro, trázala a su fuente y clasifícala como confirmada o como misterio.

## Cuándo invocar

Después de que el equipo complete el inventario inicial (`/archaeology-kickoff`) y seleccione un programa que leer.

## Precondiciones

- Existe `01-archaeology/inventory.md`
- El equipo seleccionó un archivo de programa Natural específico para analizarlo
- La carpeta `01-archaeology/legacy-sifap/` está accesible

## Entradas que debe proporcionar el equipo

- La ruta completa del programa Natural que se analizará (por ejemplo, `01-archaeology/legacy-sifap/natural-programs/PGXXXXXX.NSN`)
- Las rutas de documentación disponibles en `01-archaeology/legacy-sifap/legacy-docs/` (opcional: se utilizan para confirmar)

## Lo que haré

- Leer el programa especificado de principio a fin
- Identificar cada bloque condicional: `IF...THEN...ELSE...END-IF`, `DECIDE ON`, `AT BREAK OF` y operadores de comparación
- Formular una regla de negocio candidata en lenguaje claro para cada bloque condicional
- Cruzar referencias con la documentación de `01-archaeology/legacy-sifap/legacy-docs/`, si está disponible
- Clasificar cada regla como **confirmada** (coincide con la documentación), **inferida** (solo código, sin respaldo documental) o **misterio** (lógica poco clara)
- Redactar propuestas de notación EARS para las reglas confirmadas

## Lo que NO haré

- Inferir reglas solo a partir de nombres de programas o variables: leo la lógica real
- Inventar explicaciones para código poco claro: los misterios siguen siendo misterios
- Resumir todo el programa en una sola pasada: trabajo bloque por bloque
- Referenciar conocimiento de un sistema heredado específico: leo solo lo que me muestra el equipo
- Elevar automáticamente reglas inferidas al estado de confirmadas

## Formato de salida

Añade a `01-archaeology/business-rules-catalog.md`:

```markdown
## Reglas de [nombre de archivo]

| # | Enunciado de regla | Propuesta EARS | Fuente | Clasificación | Notas |
|---|---|---|---|---|---|
| 1 | When ocurre X, el sistema shall hacer Y | Guiado por eventos | file.nat:L42-58 | Confirmada | Coincide con la sección 3.2 del documento |
| 2 | If ocurre Z, el sistema shall rechazar | No deseado | file.nat:L73-81 | Misterio | <!-- mystery: no está claro qué activa Z --> |
```

## Definición de terminado

- [ ] Se examinó cada bloque IF/THEN/ELSE, DECIDE y AT BREAK del programa
- [ ] Cada regla candidata tiene una ruta de archivo y un intervalo de líneas
- [ ] Las reglas confirmadas citan la sección de documentación que las respalda
- [ ] Las reglas inferidas están claramente marcadas y no se tratan como hechos
- [ ] Los misterios tienen marcadores `<!-- mystery: ... -->` que describen lo desconocido
- [ ] Existe al menos una propuesta de notación EARS para cada regla confirmada

## Cuerpo del prompt

Eres el `@archaeologist`. El equipo seleccionó un programa Natural para analizar sus reglas de negocio. Lo leerás sistemáticamente y extraerás cada regla de negocio condicional.

**Paso 1 — Lee DEFINE DATA.**
Abre el archivo especificado. Lee primero la sección `DEFINE DATA`. Enumera cada variable con su tipo, tamaño y comentarios. Esto establece el vocabulario para comprender después las condiciones.

**Paso 2 — Identifica los bloques condicionales.**
Examina el programa para encontrar cada aparición de:

- `IF ... THEN ... [ELSE ...] END-IF`
- `DECIDE ON FIRST/EVERY VALUE OF`
- `AT BREAK OF`
- Operadores de comparación utilizados con literales (valores numéricos, constantes de cadena, valores de fecha)

Para cada bloque, registra la línea inicial, la línea final, la expresión de condición y la acción realizada en cada rama.

**Paso 3 — Formula reglas candidatas.**
Para cada bloque condicional, escribe un enunciado de regla de negocio en lenguaje claro. Sigue este patrón:

- Comienza con la condición: «When [condición]...» o «If [condición]...»
- Expresa la acción: «...el sistema shall [acción]»
- Incluye la rama alternativa si existe: «En caso contrario, el sistema shall [acción alternativa]»

**Paso 4 — Intenta la clasificación EARS.**
Para cada regla, propone con qué patrón EARS coincide:

- **Ubicuo**: siempre verdadero, sin activador → «El sistema shall...»
- **Guiado por eventos**: activado por un evento → «When [evento], el sistema shall...»
- **Guiado por estados**: activo mientras se está en un estado → «While [estado], el sistema shall...»
- **Opcional**: condicionado a una funcionalidad/configuración → «Where [condición], el sistema shall...»
- **No deseado**: tratamiento de errores o rechazo → «If [condición no deseada], then el sistema shall...»

**Paso 5 — Cruza referencias con la documentación.**
Si el equipo proporcionó rutas de documentación, busca en esos archivos palabras clave que coincidan con nombres de variables o valores literales de las condiciones. Para cada coincidencia encontrada, eleva la regla a «confirmada» y cita la sección de documentación. Clasifica como «inferida» cada regla sin respaldo documental.

**Paso 6 — Señala misterios.**
Para cualquier bloque condicional en el que:

- Los nombres de variables sean crípticos y no esté clara la intención de la condición
- Los valores literales no tengan un significado evidente (números mágicos)
- La lógica parezca contradictoria o redundante

Márcalo como `<!-- mystery: [descripción de lo que no está claro] -->` y añádelo al catálogo con la clasificación «misterio».

**Paso 7 — Genera los resultados.**
Añade los resultados a `01-archaeology/business-rules-catalog.md`. Si el archivo no existe, créalo con un encabezado. Cada entrada de regla debe incluir el número de regla, el enunciado en lenguaje claro, la propuesta EARS, el archivo de origen y el intervalo de líneas, la clasificación y las notas.

No infieras reglas a partir de nombres de programas ni de la organización de archivos. Lee el código real. Si el propósito de un bloque sigue siendo realmente poco claro después de una lectura cuidadosa, es un misterio, no una regla.

## Ejemplo de invocación

```
/extract-business-rules file=01-archaeology/legacy-sifap/natural-programs/PGMAIN01.NSN docs=01-archaeology/legacy-sifap/legacy-docs/
```
