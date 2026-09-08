---
name: "comment-code-generate-a-tutorial"
description: "Refactoriza un archivo fuente, añade comentarios didácticos para principiantes y genera un tutorial README, delegando el flujo de trabajo a la habilidad comment-code-generate-a-tutorial."
argument-hint: "file=<path-to-source>"
agent: "tech-writer"
tools: ["read", "edit", "search"]
---
# /comment-code-generate-a-tutorial

## Objetivo

Convertir un único archivo fuente en un recurso didáctico: refactorizarlo para mejorar su claridad, añadir comentarios didácticos que expliquen el razonamiento y generar un tutorial en `README.md`. El flujo de trabajo completo se encuentra en la habilidad [`comment-code-generate-a-tutorial`](../skills/comment-code-generate-a-tutorial/SKILL.md); este prompt lo aplica a las tecnologías de SIFAP 2.0 sin repetirlo.

> [!NOTE]
> El ejemplo de la habilidad utiliza Python; en este kit, aplícala a Java 21 o TypeScript y sigue la guía de estilo correspondiente.

## Cuándo invocar

Durante las etapas 3/4, al preparar una explicación guiada para la inmersión; por ejemplo, para explicar un módulo traducido al resto del equipo.

## Precondiciones

- El archivo fuente de destino existe y se ejecuta (o compila)
- Se conocen el público y el concepto que se quiere enseñar
- El archivo no contiene datos sensibles sin enmascarar

## Entradas que debe proporcionar el equipo

- `file` — la ruta del archivo fuente que se va a documentar
- El público destinatario y el objetivo didáctico
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Seguir el procedimiento refactorización → comentarios → tutorial de la habilidad [`comment-code-generate-a-tutorial`](../skills/comment-code-generate-a-tutorial/SKILL.md)
- Aplicarlo a los lenguajes del kit: Java 21 (backend) o TypeScript sobre Next.js 15 (frontend)
- Añadir comentarios didácticos que expliquen la intención y el razonamiento, no la sintaxis
- Generar un `README.md` con una descripción general, instrucciones de configuración, explicación del funcionamiento y un ejemplo de uso

## Lo que NO haré

- Aplicar las convenciones de Python/PEP 8 a menos que el archivo realmente sea de Python
- Añadir comentarios superficiales que repitan el código
- Incluir datos sensibles (CPF, importes de prestaciones) en los ejemplos o las salidas de muestra
- Escribir el tutorial en un idioma distinto del de la rama de destino: español en `espanol`, inglés en `main` y `develop`, y portugués de Brasil en `portugues-br`

## Formato de salida

```markdown
### Refactorizado
`backend/.../PaymentRules.java` — nombres más claros y comentarios didácticos añadidos

### Tutorial (README.md)
- Descripción general del proyecto
- Instrucciones de configuración
- Cómo funciona
- Ejemplo de uso
- Salida de muestra (opcional)
```

## Definición de terminado

- [ ] El código se refactoriza para mejorar su claridad y sigue la guía de estilo del lenguaje
- [ ] Los comentarios didácticos explican el razonamiento, sin ruido
- [ ] `README.md` abarca la descripción general, la configuración, el funcionamiento y un ejemplo de uso
- [ ] No aparecen datos sensibles; toda la prosa del tutorial está en el idioma de la rama de destino

## Cuerpo del prompt

La habilidad [`comment-code-generate-a-tutorial`](../skills/comment-code-generate-a-tutorial/SKILL.md) define el procedimiento de refactorización, comentarios y tutorial: léela y aplícala al archivo.

**Paso 1 — Leer y refactorizar.**
Comprende el archivo y mejora los nombres y la estructura según las buenas prácticas de su lenguaje (Java 21 o TypeScript).

**Paso 2 — Aplicar la habilidad.**
Añade comentarios didácticos para principiantes y genera las secciones de `README.md` que prescribe la habilidad.

**Paso 3 — Respetar las reglas del kit.**
Utiliza la guía de estilo correcta para el lenguaje, escribe la prosa del tutorial en el idioma de la rama de destino y enmascara cualquier dato sensible.

**Paso 4 — Revisar.**
Confirma que los comentarios expliquen la intención y que el tutorial se entienda por sí solo.

## Ejemplo de invocación

```text
/comment-code-generate-a-tutorial file=backend/src/main/java/com/sifap/payment/PaymentRules.java
```
