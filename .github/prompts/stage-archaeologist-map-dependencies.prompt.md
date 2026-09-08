---
name: "map-dependencies"
description: "Mapea dependencias entre programas (CALLNAT, INCLUDE) y entre programas y datos (acceso a DDM) para un alcance seleccionado."
argument-hint: "scope=01-archaeology/legacy-sifap/natural-programs/ recursive=true"
agent: "archaeologist"
tools: ["read", "search", "edit"]
---
# /map-dependencies

## Objetivo

Construye un grafo de dependencias para un alcance seleccionado de la base de código heredada, rastreando llamadas CALLNAT, directivas INCLUDE y patrones de acceso a datos DDM. Genera un diagrama Mermaid en el que cada arista cite su fuente.

## Cuándo invocar

Después de que el equipo complete el inventario inicial y quiera comprender cómo se relacionan los programas entre sí y con los datos.

## Precondiciones

- Existe `01-archaeology/inventory.md`
- La carpeta `01-archaeology/legacy-sifap/` está accesible
- El equipo seleccionó un alcance: un programa, un flujo por lotes o una familia de transacciones

## Entradas que debe proporcionar el equipo

- El alcance que analizar: una ruta de archivo específica, un directorio o un conjunto de archivos
- Si se rastrea recursivamente (siguiendo los destinos CALLNAT hasta sus propias llamadas CALLNAT) o solo un nivel

## Lo que haré

- Buscar cada sentencia `CALLNAT`, `PERFORM` e `INCLUDE` dentro del alcance
- Para cada CALLNAT, identificar el nombre del subprograma de destino y verificar que existe en la base de código
- Buscar sentencias de acceso a datos: `READ`, `FIND`, `GET`, `STORE`, `UPDATE`, `DELETE` e `HISTOGRAM`, incluidas sus referencias a DDM o archivos de destino
- Construir un grafo Mermaid con dos tipos de arista: entre programas y entre programas y datos
- Enumerar las referencias rotas (CALLNAT a programas que no existen en la carpeta)

## Lo que NO haré

- Inventar conexiones que no estén presentes en el código fuente: cada arista debe tener un archivo y un número de línea
- Adivinar qué hace un destino CALLNAT por su nombre: solo mapeo la arista, no el comportamiento del destino
- Suponer ninguna estructura de programa: leo lo que realmente existe
- Seguir referencias fuera de la carpeta `01-archaeology/legacy-sifap/`

## Formato de salida

Un archivo Mermaid en `01-archaeology/dependency-map.mmd` y un archivo Markdown de apoyo en `01-archaeology/dependency-map.md`:

```markdown
# Mapa de dependencias — [Descripción del alcance]
## Diagrama Mermaid
## Aristas entre programas
| Origen | Destino | Tipo | Archivo | Línea |
## Aristas entre programas y datos
| Programa | DDM/Archivo | Operación | Archivo | Línea |
## Referencias rotas
## Observaciones
```

## Definición de terminado

- [ ] El archivo Mermaid existe y representa un grafo válido
- [ ] Cada nodo del grafo corresponde a un archivo real de la base de código
- [ ] Cada arista cita un archivo de origen y un número de línea
- [ ] Las referencias rotas (destinos no encontrados) se enumeran explícitamente
- [ ] Las aristas de acceso a datos distinguen las operaciones READ, FIND, STORE, UPDATE y DELETE

## Cuerpo del prompt

Eres el `@archaeologist`. El equipo quiere mapear dependencias en una parte de la base de código heredada. Rastrearás cada relación entre programas y entre programas y datos.

**Paso 1 — Identifica el alcance.**
Confirma el alcance con el equipo. ¿Es un programa (rastrear su árbol de llamadas), un directorio (todos sus programas) o un conjunto identificado de archivos? Registra el límite del alcance: no busques fuera de él salvo que el equipo solicite explícitamente un rastreo recursivo.

**Paso 2 — Busca sentencias CALLNAT.**
Dentro del alcance, busca cada aparición de `CALLNAT`. Para cada una, extrae:

- El programa que realiza la llamada (ruta de archivo)
- El nombre del subprograma de destino (el argumento de cadena de CALLNAT)
- El número de línea
- Los parámetros pasados (enuméralos; no los interpretes)

Verifica que cada subprograma de destino exista como archivo en la carpeta `01-archaeology/legacy-sifap/`. Si no existe, añádelo a la lista de referencias rotas.

**Paso 3 — Busca directivas INCLUDE.**
Dentro del alcance, busca cada sentencia `INCLUDE`. Para cada una, extrae:

- El programa que la incluye (ruta de archivo)
- El nombre del código de copia
- El número de línea

Verifica que el código de copia exista en la base de código.

**Paso 4 — Busca llamadas PERFORM.**
Dentro del alcance, busca sentencias `PERFORM`. Son subrutinas internas: regístralas como dependencias dentro del programa. No crean aristas en el grafo entre programas, pero enuméralas en una sección separada para completar la información.

**Paso 5 — Busca sentencias de acceso a datos.**
Dentro del alcance, busca `READ`, `FIND`, `GET`, `STORE`, `UPDATE`, `DELETE` e `HISTOGRAM`. Para cada una, extrae:

- El programa que realiza el acceso
- El DDM o número de archivo referenciado
- El tipo de operación
- El número de línea
- Cualquier descriptor utilizado en un FIND o READ LOGICAL (la clave de búsqueda)

**Paso 6 — Construye el grafo Mermaid.**
Crea un diagrama de flujo Mermaid con:

- Nodos de programa (rectángulos)
- Nodos DDM/datos (cilindros con la sintaxis `[(name)]`)
- Aristas CALLNAT (flechas continuas etiquetadas como "CALLNAT")
- Aristas INCLUDE (flechas discontinuas etiquetadas como "INCLUDE")
- Aristas de acceso a datos (flechas hacia nodos de datos etiquetadas con la operación)

Utiliza la paleta de colores: relleno de nodos `#0f172a`, borde `#334155`, texto `#e2e8f0`.

**Paso 7 — Documenta referencias rotas y observaciones.**
Enumera los destinos CALLNAT o INCLUDE que referencien archivos no encontrados en la base de código. Son señales importantes: pueden indicar archivos ausentes, programas renombrados o llamadas a sistemas externos.

Añade una sección de observaciones que registre el total de programas del alcance, el total de aristas encontradas, el programa más conectado (mayor grado), el DDM más accedido y los programas aislados (sin aristas entrantes ni salientes).

**Paso 8 — Escribe los archivos de salida.**
Escribe el diagrama Mermaid en `01-archaeology/dependency-map.mmd` y la documentación de apoyo en `01-archaeology/dependency-map.md`.

Cada arista debe citar un archivo de origen y un número de línea. Si no puedes encontrar una fuente para una arista, no la incluyas. No inventes conexiones.

## Ejemplo de invocación

```
/map-dependencies scope=01-archaeology/legacy-sifap/natural-programs/ recursive=true
```
