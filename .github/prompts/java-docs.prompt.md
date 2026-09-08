---
name: "java-docs"
description: "Aplica buenas prácticas de Javadoc a tipos y miembros Java, delegando la lista de verificación completa en la habilidad java-docs."
argument-hint: "target=<file-or-package>"
agent: "tech-writer"
tools: ["read", "edit", "search"]
---
# /java-docs

## Objetivo

Ajusta el Javadoc de un archivo o paquete Java al estándar del proyecto: frases de resumen, `@param`, `@return`, `@throws`, genéricos y bloques `{@code}`, para que los miembros públicos y protegidos estén documentados de forma correcta y coherente. La lista de verificación detallada se encuentra en la habilidad [`java-docs`](../skills/java-docs/SKILL.md); este prompt la aplica al backend de SIFAP 2.0 sin repetirla.

> [!NOTE]
> Documenta *por qué*, no *qué*: la frase de resumen expresa la intención, no repite la firma del método.

## Cuándo invocar

Durante las etapas 3/4, al implementar o revisar Java del backend, una vez que la clase o el paquete de destino compile y su interfaz pública sea lo bastante estable para documentarla.

## Precondiciones

- El archivo `.java` o paquete de destino existe y compila
- Se han identificado los elementos públicos y protegidos que se documentarán
- El código sigue las convenciones de Java 21 de [`backend.instructions.md`](../instructions/backend.instructions.md)

## Entradas que debe proporcionar el equipo

- `target`: el archivo o paquete que se documentará (por ejemplo, `backend/src/main/java/com/sifap/payment`)
- Cualquier término del dominio que aclare la intención de una frase de resumen
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Aplicar las convenciones de Javadoc de la habilidad [`java-docs`](../skills/java-docs/SKILL.md) a cada miembro público y protegido del destino
- Escribir una frase de resumen concisa para cada miembro y después documentar parámetros, retornos, excepciones lanzadas y parámetros de tipo
- Utilizar `{@inheritDoc}` donde el comportamiento no cambie y documentar las diferencias donde sí cambie
- Mantener intacto el comportamiento compilado: solo documentación

## Lo que NO haré

- Añadir comentarios innecesarios que repitan la firma o lo evidente
- Cambiar cuerpos de métodos, firmas o visibilidad para «facilitar la documentación»
- Poner datos sensibles (CPF, importes de prestaciones) en ejemplos `{@code}`: los enmascaro
- Escribir Javadoc en un idioma distinto del de la rama de destino: inglés en `main` y `develop`, portugués de Brasil en `portugues-br` y español en `espanol`

## Formato de salida

Los archivos de destino con Javadoc añadido directamente, más un resumen breve:

```markdown
### Documentado
| Miembro | Javadoc añadido |
|---|---|
| `PaymentService#approve(PaymentId)` | resumen, `@param`, `@return`, `@throws` |

### Omitido
- `PaymentService#toString()`: se explica por sí mismo; no necesita Javadoc.
```

## Definición de terminado

- [ ] Cada miembro público y protegido tiene una frase de resumen terminada en punto
- [ ] `@param`, `@return`, `@throws` y `@param <T>` están presentes donde corresponde
- [ ] Ningún dato sensible aparece en los ejemplos
- [ ] Todo el Javadoc respeta el idioma de la rama de destino y el archivo sigue compilando

## Cuerpo del prompt

La habilidad [`java-docs`](../skills/java-docs/SKILL.md) define el conjunto completo de convenciones de Javadoc: léela y después aplícala al destino.

**Paso 1 — Localiza los elementos que documentar.**
Abre `target` y enumera cada tipo y miembro público o protegido que carezca de Javadoc correcto.

**Paso 2 — Aplica la habilidad.**
Documenta cada miembro según la habilidad: primero una frase de resumen y después `@param` (en minúsculas, sin punto final), `@return`, `@throws`, `@param <T>` y `{@code}`/`<pre>{@code ...}</pre>` donde resulte útil.

**Paso 3 — Respeta las reglas del kit.**
Mantén el comportamiento sin cambios, escribe en el idioma de la rama de destino (inglés en `main` y `develop`, portugués de Brasil en `portugues-br`, español en `espanol`) y enmascara el CPF y los importes de prestaciones en todos los ejemplos. El idioma de la conversación no modifica esta política.

**Paso 4 — Informa.**
Resume lo que documentaste y lo que omitiste deliberadamente.

## Ejemplo de invocación

```
/java-docs target=backend/src/main/java/com/sifap/payment
```
