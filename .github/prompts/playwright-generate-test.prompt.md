---
name: "playwright-generate-test"
description: "Genera una prueba de extremo a extremo de Playwright a partir de un escenario mediante Playwright MCP, delegando el procedimiento en la habilidad playwright-generate-test."
argument-hint: "scenario=\"<flujo de usuario que se probará>\""
agent: "qa-engineer"
tools: ["read", "search", "edit", "execute"]
---
# /playwright-generate-test

## Objetivo

Explora un flujo de usuario descrito con Playwright MCP y emite una prueba de extremo a extremo satisfactoria en TypeScript con `@playwright/test` para el frontend de SIFAP 2.0. El procedimiento completo se encuentra en la habilidad [`playwright-generate-test`](../skills/playwright-generate-test/SKILL.md); este prompt lo aplica al frontend Next.js 15 sin repetirlo.

> [!IMPORTANT]
> No escribas código de prueba solo a partir del escenario: primero ejecuta el flujo paso a paso con Playwright MCP y después genera la prueba a partir de los pasos observados.

## Cuándo invocar

Durante las etapas 3/4, cuando el equipo quiera una prueba de regresión de extremo a extremo para un flujo de usuario del frontend Next.js 15.

## Precondiciones

- La aplicación `frontend/` está en ejecución y es accesible
- Playwright y el servidor Playwright MCP están disponibles
- El escenario que se probará está descrito (o se proporcionará al solicitarlo)

## Entradas que debe proporcionar el equipo

- `scenario`: el flujo de usuario que se probará (solicita uno si falta)
- La URL base del frontend en ejecución
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Seguir el procedimiento de explorar y después generar de la habilidad [`playwright-generate-test`](../skills/playwright-generate-test/SKILL.md)
- Recorrer el escenario paso a paso mediante Playwright MCP antes de escribir código
- Emitir una especificación de prueba TypeScript con `@playwright/test` en el directorio `tests/` del frontend
- Ejecutar la prueba e iterar hasta que pase

## Lo que NO haré

- Generar código de prueba prematuramente solo a partir del escenario
- Cubrir aquí comportamiento unitario o de componentes (permanece en Vitest + Testing Library)
- Dejar una prueba fallida o intermitente
- Incorporar directamente secretos o datos específicos del entorno en la especificación de prueba

## Formato de salida

```markdown
### Generado
`frontend/tests/payment-approval.spec.ts` — @playwright/test

### Ejecución
`npx playwright test payment-approval` → 1 satisfactoria
```

## Definición de terminado

- [ ] El flujo se exploró paso a paso con Playwright MCP antes de escribir código
- [ ] La especificación de prueba utiliza `@playwright/test` y se encuentra en el directorio `tests/` del frontend
- [ ] La prueba pasa y no es intermitente
- [ ] La cobertura unitaria y de componentes permanece en Vitest + Testing Library

## Cuerpo del prompt

La habilidad [`playwright-generate-test`](../skills/playwright-generate-test/SKILL.md) define el procedimiento de exploración y generación guiado por MCP: léela y después aplícala al escenario.

**Paso 1 — Obtén el escenario.**
Si no se proporcionó ninguno, solicítalo. Confirma la URL del frontend.

**Paso 2 — Aplica la habilidad.**
Ejecuta el escenario paso a paso con Playwright MCP y después emite la especificación de prueba `@playwright/test` a partir de los pasos registrados.

**Paso 3 — Respeta las reglas del kit.**
Utiliza como destino el frontend Next.js 15 App Router, guarda la especificación de prueba en `frontend/tests/` y mantén los secretos fuera del archivo.

**Paso 4 — Verifica.**
Ejecuta la prueba e itera hasta que pase.

## Ejemplo de invocación

```
/playwright-generate-test scenario="aprobar un pago pendiente como analista"
```
