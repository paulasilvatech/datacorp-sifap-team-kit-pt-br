---
name: "add-educational-comments"
description: "Añade comentarios didácticos claros y adecuados al nivel a un archivo fuente existente para convertirlo en un recurso de aprendizaje, preservando la estructura, la codificación y la corrección de la compilación. Úsala cuando la persona pida explicar, anotar o añadir comentarios educativos a un archivo de código concreto, en cualquier lenguaje; si no indica un archivo, solicítalo."
---
# Adición de comentarios didácticos

Añade comentarios didácticos a los archivos de código para convertirlos en recursos de aprendizaje eficaces. Si no se proporciona un archivo, solicítalo y ofrece una lista numerada de coincidencias aproximadas para facilitar la selección.

## Cuándo invocar

- "Añade comentarios didácticos a este archivo para que una persona principiante pueda aprender con él."
- "Anota este módulo y explica las partes complicadas."
- "Convierte este archivo fuente en un recurso de aprendizaje para el equipo."
- "Explica en el propio código qué hace y por qué."

> [!NOTE]
> Esta skill enseña conceptos de lenguajes y frameworks. Cuando anotes código legado, describe lo que muestra el código y deja que el equipo determine su significado de negocio mediante su propia lectura, siguiendo [`01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md`](../../../01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md). Nunca inventes hechos sobre SIFAP ni incluyas datos sensibles, como números de CPF o importes de prestaciones, en un comentario.

## Rol

Eres especialista en enseñanza y redacción técnica. Puedes explicar temas de programación a principiantes, estudiantes de nivel intermedio y profesionales avanzados. Adaptas el tono y el detalle a los niveles de conocimiento configurados por la persona, con una orientación didáctica y alentadora.

- Proporciona explicaciones fundamentales para principiantes
- Añade ideas prácticas y buenas prácticas para personas de nivel intermedio
- Ofrece contexto más profundo (rendimiento, arquitectura y funcionamiento interno del lenguaje) para personas avanzadas
- Sugiere mejoras solo cuando contribuyan de forma significativa a la comprensión
- Respeta siempre las **Reglas de los comentarios didácticos**

## Objetivos

1. Transforma el archivo proporcionado añadiendo comentarios didácticos acordes con la configuración.
2. Mantén la estructura, la codificación y la corrección de la compilación del archivo.
3. Aumenta el número total de líneas en un **125%** utilizando únicamente comentarios didácticos (hasta 400 líneas nuevas). En archivos ya procesados con este prompt, actualiza las notas existentes en lugar de volver a aplicar la regla del 125%.

### Orientación sobre el número de líneas

- Comportamiento predeterminado: añade líneas hasta que el archivo alcance el 125% de su longitud original.
- Límite estricto: nunca añadas más de 400 líneas de comentarios didácticos.
- Archivos grandes: si el archivo supera las 1.000 líneas, procura no añadir más de 300 líneas de comentarios didácticos.
- Archivos ya procesados: revisa y mejora los comentarios existentes; no vuelvas a buscar el incremento del 125%.

## Reglas de los comentarios didácticos

### Codificación y formato

- Determina la codificación del archivo antes de editarlo y no la cambies.
- Usa únicamente caracteres disponibles en un teclado QWERTY estándar.
- No insertes emojis ni otros símbolos especiales.
- Conserva el estilo original de fin de línea (LF o CRLF).
- Mantén los comentarios de una sola línea en una sola línea.
- Conserva el estilo de sangría que exige el lenguaje (Python, Haskell, F#, Nim, Cobra, YAML, Makefiles, etc.).
- Cuando se indique `Line Number Referencing = yes`, antepón `Note <number>` a cada comentario nuevo (por ejemplo, `Note 1`).

### Expectativas de contenido

- Céntrate en las líneas y los bloques que mejor ilustren los conceptos del lenguaje o la plataforma.
- Explica el porqué de la sintaxis, las expresiones idiomáticas y las decisiones de diseño.
- Refuerza conceptos anteriores solo cuando mejore la comprensión (`Repetitiveness`).
- Señala posibles mejoras con tacto y únicamente con una finalidad didáctica.
- Si `Line Number Referencing = yes`, utiliza los números de las notas para relacionar explicaciones.

### Seguridad y cumplimiento

- No alteres espacios de nombres, importaciones, declaraciones de módulos ni encabezados de codificación de forma que impida la ejecución.
- Evita introducir errores de sintaxis (por ejemplo, errores de codificación de Python según [PEP 263](https://peps.python.org/pep-0263/)).
- Introduce los datos como si se escribieran en el teclado de la persona.

## Flujo de trabajo

1. **Confirmar las entradas**: comprueba que se proporcione al menos un archivo de destino. Si falta, responde: `Proporciona uno o varios archivos a los que añadir comentarios didácticos, preferiblemente como variable del chat o contexto adjunto.`
2. **Identificar los archivos**: si hay varias coincidencias, presenta una lista ordenada para que la persona elija por número o nombre.
3. **Revisar la configuración**: combina los valores predeterminados del prompt con los indicados por la persona. Interpreta los errores tipográficos evidentes (por ejemplo, `Line Numer`) según el contexto.
4. **Planificar los comentarios**: decide qué secciones del código respaldan mejor los objetivos de aprendizaje configurados.
5. **Añadir comentarios**: aplica comentarios didácticos con los niveles configurados de detalle, repetición y conocimiento. Respeta la sangría y la sintaxis del lenguaje.
6. **Validar**: confirma que el formato, la codificación y la sintaxis permanezcan intactos. Comprueba que se cumplan la regla del 125% y los límites de líneas.

## Referencia de configuración

### Propiedades

- **Escala numérica**: `1-3`
- **Secuencia numérica**: `ordered` (los números más altos representan mayor conocimiento o intensidad)

### Parámetros

| Parámetro | Valores | Significado | Valor predeterminado |
|---|---|---|---|
| Nombre del archivo (`File name`) | Rutas | Archivo o archivos de destino que se comentarán | Obligatorio |
| Detalle del comentario (`Comment detail`) | `1-3` | Profundidad de cada explicación | `2` |
| Repetición (`Repetitiveness`) | `1-3` | Frecuencia con la que se retoman conceptos similares | `2` |
| Naturaleza didáctica (`Educational nature`) | Texto | Enfoque del dominio | `Computer Science` |
| Conocimiento de la persona (`User knowledge`) | `1-3` | Familiaridad general con informática o ingeniería de software | `2` |
| Nivel educativo (`Educational level`) | `1-3` | Familiaridad con el lenguaje o framework concreto | `1` |
| Referencia numérica de líneas (`Line number referencing`) | `yes/no` | Antepone un número de nota a cada comentario nuevo | `yes` |
| Anidar comentarios (`Nest comments`) | `yes/no` | Aplica sangría a los comentarios dentro de los bloques de código | `yes` |
| Lista de consulta (`Fetch list`) | URL | Referencias autoritativas opcionales | Ninguna |

Si falta un elemento configurable, usa el valor predeterminado. Si aparecen opciones nuevas o inesperadas, aplica tu **Rol didáctico** para interpretarlas de forma razonable y alcanzar el objetivo.

### Configuración predeterminada

- Nombre del archivo: `File Name`
- Detalle del comentario: `Comment Detail = 2`
- Repetición: `Repetitiveness = 2`
- Naturaleza didáctica: `Educational Nature = Computer Science`
- Conocimiento de la persona: `User Knowledge = 2`
- Nivel educativo: `Educational Level = 1`
- Referencia numérica de líneas: `Line Number Referencing = yes`
- Anidar comentarios: `Nest Comments = yes`
- Lista de consulta: `Fetch List`:
  - <https://peps.python.org/pep-0263/>

## Ejemplos

### Archivo no proporcionado

```text
[user]
> /add-educational-comments
[agent]
> Proporciona uno o varios archivos a los que añadir comentarios didácticos, preferiblemente como variable del chat o contexto adjunto.
```

### Configuración personalizada

```text
[user]
> /add-educational-comments #file:output_name.py Comment Detail = 1, Repetitiveness = 1, Line Numer = no
```

Interpreta `Line Numer = no` como `Line Number Referencing = no` y ajusta el comportamiento en consecuencia, manteniendo todas las reglas anteriores.

## Plantilla de salida

El artefacto es el archivo original con los comentarios didácticos añadidos. En Python, los comentarios con notas numeradas tienen este aspecto. Se mantienen con sangría dentro de una función para que ninguno empiece en la columna cero:

```python
def sum_of_squares(numbers):
    # Note 1 - Una comprension de listas construye el resultado en una pasada legible.
    # Expresa "elevar cada valor al cuadrado", mas claro aqui que un bucle manual.
    squares = [value * value for value in numbers]

    # Note 2 - Una clausula de guarda retorna antes y evita sangrar el flujo principal.
    # Prefiere esto a un gran if/else cuando el caso vacio es excepcional.
    if not squares:
        return 0
    return sum(squares)
```

Junto al archivo, informa de los cambios realizados:

- Líneas añadidas y proporción resultante respecto de la longitud original
- Configuración utilizada (detalle de los comentarios, nivel de conocimiento y referencia numérica de líneas)
- Conceptos que convendría estudiar a continuación

## Puerta de calidad

- [ ] El archivo transformado cumple el objetivo de número de líneas sin superar los límites.
- [ ] La codificación, el estilo de fin de línea y la sangría no cambian, y el archivo sigue compilando o ejecutándose.
- [ ] Cada comentario respeta la configuración y las reglas de los comentarios didácticos.
- [ ] Los comentarios explican el razonamiento; las sugerencias aclaratorias aparecen solo cuando favorecen el aprendizaje.
- [ ] En archivos ya procesados se perfeccionan los comentarios existentes en lugar de volver a aumentar el número de líneas.
- [ ] Ningún comentario contiene emojis, caracteres ajenos al teclado ni datos sensibles.
