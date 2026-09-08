---
name: "comment-code-generate-a-tutorial"
description: "Refactoriza un script Python conforme a PEP 8, añade comentarios didácticos para principiantes y genera un tutorial README.md completo (descripción general, configuración, funcionamiento y ejemplo de uso). Úsala cuando la persona quiera convertir un script Python en un proyecto cuidado y didáctico o crear una guía paso a paso."
---
# Comentar código y generar un tutorial

Usa esta skill para convertir un script funcional en un recurso didáctico. Refactoriza el código para mejorar su claridad, añade comentarios que expliquen el razonamiento de cada decisión y escribe un tutorial `README.md` que permita a una persona nueva ejecutar el script y comprender su funcionamiento. El ejemplo desarrollado es de Python y el mismo procedimiento de tres pasos se aplica a cualquier lenguaje.

> [!NOTE]
> En esta inmersión, el prompt [`/comment-code-generate-a-tutorial`](../../prompts/comment-code-generate-a-tutorial.prompt.md) aplica este procedimiento al stack Java 21 y TypeScript del kit. Mantén esta skill como la fuente de verdad del procedimiento a la que se remite el prompt.

## Cuándo invocar

- "Refactoriza este script Python y escribe un tutorial README."
- "Añade comentarios para principiantes a este script y explica cómo funciona."
- "Convierte esta utilidad en un proyecto didáctico con documentación de configuración y uso."
- "Genera una guía paso a paso de este script."

## Flujo de trabajo

### 1. Refactorizar para mejorar la claridad

- Aplica la guía de estilo del lenguaje (PEP 8 para Python).
- Renombra las variables y funciones poco claras para que sus nombres expresen la intención.
- Extrae los bloques largos en funciones pequeñas con nombre.
- Mantén idénticas la interfaz pública y la salida observable. Esta es una revisión de legibilidad, no una reescritura.

### 2. Añadir comentarios didácticos

Explica el razonamiento, no la sintaxis. Un comentario útil responde al "por qué"; uno deficiente repite el "qué".

| Escribe comentarios que | Evita comentarios que |
|---|---|
| Expliquen por qué se tomó una decisión de diseño | Repitan una línea, como `i += 1  # sumar uno` |
| Presenten una expresión idiomática la primera vez que aparece | Repitan el nombre de la función en prosa |
| Adviertan sobre un caso límite o un invariante | Narren un flujo de control evidente |
| Nombren el concepto que una persona principiante debería consultar | Añadan ruido que envejezca mal |

### 3. Generar el tutorial

Escribe un `README.md` junto al script con estas secciones: descripción general del proyecto, instrucciones de configuración, funcionamiento, ejemplo de uso y, de forma opcional, una salida de ejemplo.

## Reglas

- Conserva el comportamiento, la codificación del archivo y el estilo de fin de línea. La elaboración de un tutorial nunca debe romper la compilación.
- Usa únicamente caracteres de teclado estándar en el código y los comentarios. Nada de emojis.
- Escribe cada comentario y cada sección del tutorial en el idioma de la edición: inglés en `main` y `develop`, portugués de Brasil en `portugues-br` y español en `espanol`.
- Nunca incluyas datos sensibles (por ejemplo, números de CPF o importes de prestaciones) en los ejemplos ni en las salidas de ejemplo.
- Ejecuta el comando de configuración y el ejemplo antes de publicar el tutorial.

## Plantilla de salida

El `README.md` generado comienza con un H1 que nombra el proyecto, seguido de estas secciones:

```markdown
## Descripción general del proyecto
`wordcount.py` cuenta cuántas veces aparece cada palabra en un archivo de texto
e imprime las más frecuentes. Demuestra la lectura de archivos, la agregación
en diccionarios y la ordenación en Python.

## Configuración
- Requiere Python 3.8 o posterior
- Sin dependencias de terceros

Ejecútalo desde la raíz del proyecto:

    python3 wordcount.py sample.txt --top 10

## Cómo funciona
1. Lee el archivo y convierte cada línea a minúsculas para que el recuento no distinga entre mayúsculas y minúsculas.
2. Divide cada línea por los espacios en blanco y cuenta las palabras en un diccionario.
3. Ordena el diccionario por frecuencia e imprime las N entradas más frecuentes.

## Ejemplo de uso
    python3 wordcount.py article.txt --top 5

## Salida de ejemplo
    the      42
    and      31
    data     27
```

## Puerta de calidad

- [ ] El script sigue ejecutándose y produce una salida idéntica después de la refactorización.
- [ ] Los nombres expresan la intención y no cambia ningún comportamiento durante la revisión de legibilidad.
- [ ] Los comentarios explican el razonamiento y las expresiones idiomáticas, no la sintaxis evidente.
- [ ] El `README.md` incluye descripción general, configuración, funcionamiento y ejemplo de uso.
- [ ] El comando de configuración y el ejemplo están probados y son correctos.
- [ ] Todo está escrito en el idioma de la edición (`main`/`develop`: inglés; `portugues-br`: portugués de Brasil; `espanol`: español), sin emojis ni datos sensibles.
