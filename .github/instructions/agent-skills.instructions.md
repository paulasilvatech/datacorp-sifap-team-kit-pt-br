---
description: "Utiliza al crear, revisar o depurar una habilidad de agente de GitHub Copilot en .github/skills/: frontmatter de SKILL.md, regla de coincidencia entre name y directorio, ajuste de description para la carga automática, divulgación progresiva y recursos incluidos."
applyTo: ".github/skills/**/SKILL.md"
---

# Habilidades de agentes — Guía de autoría

Este archivo se activa al crear o editar un `SKILL.md` en `.github/skills/`. Enseña a crear una habilidad que se cargue de forma fiable y tenga un alcance bien delimitado: el esquema de frontmatter de dos claves, la regla de que `name` debe coincidir con el directorio de la habilidad, cómo `description` dirige la carga automática, la divulgación progresiva y cómo incluir scripts y referencias. Enseña a estructurar y empaquetar una habilidad; no decide qué habilidades necesita esta inmersión ni qué debe contener el procedimiento de dominio de una habilidad concreta. Eso se define en el `SKILL.md` de cada habilidad y en [`.github/copilot-instructions.md`](../copilot-instructions.md).

## Qué es una habilidad

Una habilidad es una carpeta autónoma que contiene un `SKILL.md` y, opcionalmente, recursos incluidos (scripts, referencias, plantillas y recursos estáticos), y enseña a Copilot una capacidad especializada y repetible. Las habilidades no son el mismo tipo de primitiva que estos archivos de instrucciones:

| Primitiva | Propósito | Se carga |
|---|---|---|
| Archivo de instrucciones (`*.instructions.md`) | Reglas permanentes para archivos que coinciden con `applyTo` | Siempre que haya un archivo coincidente en el contexto |
| Habilidad (`SKILL.md`) | Un flujo de trabajo o una capacidad bajo demanda | Solo cuando la solicitud coincide con su `description` |

Las habilidades son portables entre VS Code, Copilot CLI y el agente de programación de Copilot, y se cargan progresivamente: el cuerpo y los recursos permanecen fuera del contexto hasta que se necesitan.

## Dónde se encuentran las habilidades

| Ubicación | Alcance |
|---|---|
| `.github/skills/<skill-name>/` | Este repositorio: donde deben estar todas las habilidades de la inmersión |
| `~/.copilot/skills/<skill-name>/` | Personal, en todos tus repositorios |

Cada habilidad tiene su propio directorio y debe contener al menos un `SKILL.md`. Este archivo de instrucciones rige `.github/skills/**/SKILL.md`.

## Frontmatter — Solo dos claves

El frontmatter de `SKILL.md` acepta exactamente dos claves: `name` y `description`.

```yaml
---
name: "draw-io-diagram-generator"
description: "Utiliza al crear, editar o generar archivos de diagramas draw.io (.drawio, .drawio.svg, .drawio.png), diagramas de flujo, de arquitectura, de secuencia, ER o de clases UML."
---
```

| Campo | Obligatorio | Restricción |
|---|---|---|
| `name` | Sí | Solo letras minúsculas, números y guiones; máximo 64 caracteres; **debe coincidir exactamente con el nombre del directorio padre** |
| `description` | Sí | Indica *cuándo utilizar* la habilidad; rica en palabras clave; máximo 1024 caracteres |

> [!IMPORTANT]
> `name` debe ser idéntico al nombre de la carpeta de la habilidad. `.github/skills/draw-io-diagram-generator/SKILL.md` debe declarar `name: "draw-io-diagram-generator"`. Si difieren, aunque sea en una mayúscula o un guion bajo, la habilidad **no se carga y no se muestra ningún aviso**: no hay error ni advertencia; simplemente nunca se ofrece a Copilot.

> [!WARNING]
> Solo `name` y `description` forman parte del esquema. Claves como `license`, `allowed-tools`, `compatibility` y `metadata` **no** se reconocen: se ignoran y su presencia da la falsa impresión de que se aplica una restricción. No las añadas ni distribuyas un `LICENSE.txt` suponiendo que una clave `license:` lo vincula.

## description dirige la carga automática

Copilot solo lee `name` y `description` durante el descubrimiento y después decide si incorpora la habilidad completa. Una descripción vaga hace que la habilidad nunca se active. Incluye tres elementos:

1. **Qué** hace la habilidad (su capacidad).
2. **Cuándo** utilizarla: activadores concretos, tipos de archivo o expresiones que escribiría quien la solicita.
3. **Palabras clave** que probablemente mencionaría esa persona.

Correcto: suficientemente específico para activarse de forma fiable:

```yaml
description: "Utiliza al crear, editar o generar archivos de diagramas draw.io (.drawio, .drawio.svg, .drawio.png), diagramas de flujo, de secuencia o ER."
```

Deficiente: demasiado vago para llegar a activarse:

```yaml
description: "Ayudas para diagramas"
```

Escribe el valor entre comillas. Utiliza comillas simples cuando la descripción incluya frases de activación entre comillas dobles, para no tener que escaparlas.

## Estructura obligatoria del cuerpo en este repositorio

Después del frontmatter, cada habilidad de la inmersión utiliza un título `#` con mayúscula inicial y luego estas secciones en orden. Este es el estándar que debe cumplir todo el árbol `.github/skills/`:

- `## Cuándo invocar`: tres o cuatro solicitudes realistas, entre comillas, que deberían activar la habilidad.
- Una o más secciones de procedimiento: las tablas de decisión, listas de verificación o secuencias de pasos concretas.
- `## Plantilla de salida`: un bloque delimitado que muestra el artefacto exacto que produce la habilidad.
- `## Puerta de calidad`: una lista `- [ ]` que el trabajo debe superar antes de considerarse terminado.

```markdown
## Cuándo invocar

- "Dibuja un diagrama de secuencia para el flujo de pagos."
- "Convierte este boceto ER en un archivo .drawio."

## Generación del diagrama

Aquí se incluyen las tablas de decisión, los procedimientos y las reglas de estilo.

## Plantilla de salida

El artefacto exacto que produce la habilidad.

## Puerta de calidad

- [ ] Criterio verificable
```

Añade secciones `## Errores frecuentes`, `## Solución de problemas` o `## Referencias` cuando aporten información útil, pero las cuatro anteriores son obligatorias.

## Divulgación progresiva

Las habilidades se cargan en tres niveles para mantener bajo el costo de instalación:

| Nivel | Qué se carga | Cuándo |
|---|---|---|
| Descubrimiento | Solo `name` y `description` | Siempre |
| Instrucciones | El cuerpo completo de `SKILL.md` | Cuando la solicitud coincide con la descripción |
| Recursos | Scripts, referencias y plantillas | Solo cuando el cuerpo los enlaza y Copilot sigue el enlace |

Mantén enfocado el cuerpo de `SKILL.md`. A partir de unas 200 líneas, traslada el material detallado a `references/` y enlázalo, para que Copilot incorpore los detalles bajo demanda en lugar de pagar su costo desde el principio. Considera unas 500 líneas como límite máximo estricto.

## Inclusión de recursos

| Carpeta | Contenido | ¿Se lee en el contexto? |
|---|---|---|
| `scripts/` | Automatización ejecutable (`.py`, `.sh`, `.ts`) | Solo al ejecutarse |
| `references/` | Documentación que Copilot lee para decidir | Sí, cuando se enlaza |
| `templates/` | Estructuras iniciales que Copilot modifica y amplía | Sí, cuando se enlazan |
| `assets/` | Archivos estáticos que se entregan sin cambios en la salida | No |

La distinción entre `templates/` y `assets/` responde a la intención: si Copilot edita el archivo, es una plantilla; si se entrega tal cual, es un recurso estático. Referencia los archivos incluidos con rutas relativas al directorio de la habilidad, por ejemplo, `[el validador](./scripts/validate-drawio.py)`.

Prioriza un script frente a código en línea regenerado cuando la misma lógica se reescribiría en cada ejecución, cuando importe el comportamiento determinista (ediciones de archivos, llamadas a API) o cuando la operación merezca sus propias pruebas. Los scripts deben ofrecer `--help`, fallar con mensajes claros, no almacenar secretos y utilizar rutas relativas.

## Creación de habilidades de alto impacto

- **Enseña solo lo que Copilot haría mal sin estas indicaciones.** Omite la sintaxis del lenguaje y la documentación introductoria; dedica el presupuesto a convenciones internas, valores predeterminados no evidentes, particularidades de versiones y flujos de trabajo del dominio.
- **Protege el presupuesto compartido de las descripciones.** La descripción de cada habilidad instalada compite por la misma ventana de descubrimiento. Mantén las descripciones breves y ricas en palabras clave.
- **Los errores frecuentes son el contenido de mayor valor informativo.** Una advertencia proactiva como «nunca hagas X porque Y» evita toda una clase de errores; añade una cada vez que Copilot produzca un resultado incorrecto.
- **Prioriza orientaciones flexibles frente a pasos rígidos** para trabajos abiertos. Reserva los pasos numerados para procedimientos en los que la secuencia realmente importe (compilación, despliegue, configuración).

Los pasos rígidos atan a Copilot a una estructura de archivos y quedan obsoletos rápidamente:

```text
1. Abre src/api/handlers.ts
2. Busca processOrder
3. Añade un try-catch alrededor de las líneas 45-60
```

Las orientaciones flexibles se adaptan al código real:

```text
Al reforzar el tratamiento de errores en los controladores de API:
- Envuelve cada llamada a la base de datos en la utilidad de tratamiento de errores del proyecto
- Registra los fallos con suficiente contexto para depurar en producción
```

## Convenciones

| Regla | Justificación |
|---|---|
| El frontmatter contiene solo `name` y `description` | Cualquier otra clave se ignora y oculta una suposición falsa |
| `name` coincide exactamente con el nombre del directorio de la habilidad | Una discrepancia impide que la habilidad se cargue, sin mostrar ningún aviso |
| `description` indica *cuándo* utilizar la habilidad, en 1024 caracteres o menos, ricos en palabras clave | Es el único texto que ve el descubrimiento; un texto vago nunca se activa |
| El cuerpo sigue `## Cuándo invocar`, después un procedimiento, luego `## Plantilla de salida` y finalmente `## Puerta de calidad` | Coincide con el estándar que debe cumplir cada habilidad de la inmersión |
| Los detalles profundos pasan a `references/` a partir de unas 200 líneas | Mantiene bajo el costo de los niveles de descubrimiento e instrucciones |
| Los scripts ofrecen `--help`, gestionan errores y no almacenan secretos | La automatización incluida debe ser segura y autodescriptiva |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Asignar a la carpeta y a `name` nombres idénticos | Cambiar el nombre de uno sin cambiar el otro |
| Escribir una `description` rica en activadores | Distribuir una descripción vaga como «ayudas» |
| Mantener solo `name` y `description` en el frontmatter | Añadir `license`, `allowed-tools`, `compatibility` o `metadata` |
| Enlazar los archivos incluidos con rutas relativas | Incorporar rutas absolutas o específicas de una máquina |
| Dividir las habilidades grandes mediante `references/` | Dejar que un `SKILL.md` supere unas 500 líneas |
| Incluir las cuatro secciones obligatorias en cada habilidad | Omitir `## Cuándo invocar`, `## Plantilla de salida` o `## Puerta de calidad` |

## Lista de verificación antes de abrir una PR

- [ ] El frontmatter de `SKILL.md` contiene solo `name` y `description`, ambos entre comillas
- [ ] `name` está en minúsculas y separado por guiones, tiene 64 caracteres o menos y coincide con el nombre del directorio padre
- [ ] `description` indica qué hace la habilidad y cuándo utilizarla, sin superar los 1024 caracteres
- [ ] El cuerpo contiene `## Cuándo invocar`, al menos una sección de procedimiento, `## Plantilla de salida` y `## Puerta de calidad`
- [ ] El contenido enseña conocimientos no evidentes, no sintaxis del lenguaje ni documentación introductoria
- [ ] Los scripts, referencias, plantillas o recursos estáticos incluidos se enlazan con rutas relativas
- [ ] El cuerpo se mantiene enfocado, con los detalles profundos en `references/`, y no se han introducido emojis ni directivas de lint en línea
