---
name: "playwright-generate-test"
description: "Genera una prueba de extremo a extremo de Playwright en TypeScript a partir de un escenario descrito, usando Playwright MCP paso a paso, y luego ejecútala hasta que pase. Úsala cuando la persona pida crear o grabar una prueba de navegador o E2E con Playwright para un flujo web."
---
# Generación de pruebas de extremo a extremo con Playwright

Genera una prueba de extremo a extremo (E2E) de Playwright en TypeScript explorando, paso a paso, el flujo de usuario descrito con el servidor Playwright MCP. Después, genera una especificación `@playwright/test` y ejecútala hasta que pase. Esta skill abarca las pruebas de regresión de navegador para el frontend Next.js 15 de SIFAP 2.0; el comportamiento unitario y de componentes sigue en Vitest + Testing Library (consulta [`tests.instructions.md`](../../instructions/tests.instructions.md)).

> [!NOTE]
> Esta skill utiliza el **servidor Playwright MCP**, que debe estar instalado y en ejecución contra un frontend accesible. Si el servidor MCP no está disponible, instálalo e inícialo antes de invocar la skill; no escribas manualmente la prueba basándote solo en el escenario.

## Cuándo invocar

- "Genera una prueba de Playwright para el flujo de aprobación de pagos."
- "Graba una prueba de extremo a extremo que inicie sesión y abra el panel."
- "Crea una prueba de regresión de navegador para este escenario."
- "Convierte este recorrido de usuario en una especificación de Playwright."

## Flujo de exploración y posterior generación

Nunca escribas código de prueba basándote únicamente en la descripción del escenario. Observa primero el DOM real mediante MCP y después genera la prueba.

1. **Obtén el escenario.** Si la persona no describió un flujo, solicítalo. Confirma la URL base del frontend en ejecución.
2. **Explora paso a paso.** Recorre el flujo con una acción a la vez mediante las herramientas de Playwright MCP (navegar, hacer clic, rellenar y comprobar). Usa cada estado observado de la página para determinar el siguiente paso.
3. **Prefiere localizadores accesibles.** Selecciona los elementos por rol, etiqueta o texto (`getByRole`, `getByLabel`), no por CSS frágil ni `data-testid` cuando exista un rol. Esto sigue la convención de Testing Library usada en el resto del kit.
4. **Genera la especificación.** Solo después de confirmar cada paso, genera una prueba TypeScript de `@playwright/test` a partir de las interacciones registradas. Estructúrala como Preparar-Actuar-Comprobar y añade un comentario inline `// REQ-NNN` cuando el flujo tenga trazabilidad a un requisito.
5. **Guárdala** en el directorio `tests/` del frontend como `<feature>.spec.ts`.
6. **Ejecuta e itera.** Ejecuta `npx playwright test <name>` y corrige los localizadores o las esperas hasta que la prueba pase de forma fiable. Nunca dejes una especificación que falle o sea inestable.

> [!WARNING]
> No incluyas secretos ni datos específicos del entorno en la especificación. Lee las URL base y las credenciales desde variables de entorno o la configuración de Playwright; nunca las incrustes en el código.

## Límites del alcance

| Nivel | Herramienta | Responsable |
|---|---|---|
| Extremo a extremo (navegador) | Playwright | Esta skill |
| Componente / interacción | Vitest + Testing Library | [`tests.instructions.md`](../../instructions/tests.instructions.md) |
| Unitarias / lógica pura | Vitest (frontend) o JUnit 5 (backend) | [`test-strategy`](../test-strategy/SKILL.md) |

## Plantilla de salida

```typescript
import { test, expect } from '@playwright/test';

// REQ-XXX: un analista aprueba un pago pendiente
test('analyst approves a pending payment', async ({ page }) => {
  await page.goto('/payments');                                    // Preparar

  await page
    .getByRole('row', { name: /pending/i })
    .first()
    .getByRole('link', { name: /review/i })
    .click();

  await page.getByRole('button', { name: /approve/i }).click();    // Actuar

  await expect(page.getByRole('status')).toHaveText(/approved/i);  // Comprobar
});
```

Resultado de ejecución que debe informarse:

```text
npx playwright test payment-approval
  1 passed (2.1s)
```

## Puerta de calidad

- [ ] El flujo se exploró paso a paso mediante Playwright MCP antes de escribir código.
- [ ] La especificación utiliza `@playwright/test` y se encuentra en el directorio `tests/` del frontend.
- [ ] Los elementos se seleccionan por rol o etiqueta accesible, no mediante selectores frágiles.
- [ ] Los flujos derivados de requisitos incluyen un comentario inline `// REQ-NNN`.
- [ ] La prueba pasa y no es inestable; no hay secretos incrustados en el código.
- [ ] La cobertura unitaria y de componentes permanece en Vitest + Testing Library.
