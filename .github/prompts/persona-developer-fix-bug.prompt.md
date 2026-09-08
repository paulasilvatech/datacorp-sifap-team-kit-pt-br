---
name: "fix-bug"
description: "Reproduce, aísla y corrige un defecto con una prueba de regresión, manteniendo spec.md como fuente de verdad."
argument-hint: "bug=<observed-vs-expected> req=REQ-NNN area=<service-or-page>"
agent: "implementer"
tools: ["read", "search", "edit", "execute"]
---
# /fix-bug

## Objetivo

Corrige un defecto de modo que la corrección sea (a) reproducible con una nueva prueba que falle, (b) el cambio más pequeño que haga pasar esa prueba y (c) trazable a un `REQ-ID` real: uno existente o uno nuevo propuesto mediante `/update-spec` cuando el error revele un requisito ausente. La causa raíz se identifica, no se disimula con un parche.

> [!WARNING]
> SIFAP debe fallar explícitamente. Nunca envuelvas un defecto en una captura que registre el error, lo oculte y continúe.

## Cuándo invocar

Cuando se informe de un defecto en código ya integrado en `develop` y el equipo quiera corregir la causa raíz con una prueba de regresión, en lugar de parchear un síntoma. Ejecútalo en una rama `impl/<NNN>-<bug-name>` creada a partir de `develop`.

## Precondiciones

- Existe `specs/<NNN>-<feature>/spec.md` para el área afectada, a fin de confirmar el comportamiento previsto
- La rama actual es `impl/<NNN>-<bug-name>`
- El escenario que falla está descrito con suficiente detalle para reproducirlo o se puede contactar con quien lo informó
- La estructura inicial del módulo `backend/` o `frontend/` afectado ya está creada

## Entradas que debe proporcionar el equipo

- Una descripción del error: comportamiento observado frente al esperado, pasos exactos y entorno
- Una traza de pila, línea de registro o captura de pantalla, si está disponible
- El servicio o la página afectados
- El `REQ-ID` probablemente relacionado (o «desconocido: investígalo»)
- Solicita a la persona usuaria cualquier elemento que falte antes de comenzar.

## Lo que haré

- Reproducir el defecto localmente o escribir la prueba más pequeña que refleje el informe
- Escribir la prueba de regresión antes de tocar código de producción y confirmar que falla por el motivo correcto
- Diagnosticar la causa raíz leyendo el código, siguiendo la pila de llamadas y comprobando la especificación
- Vincular el comportamiento corregido a un `REQ-ID` existente o proponer un requisito EARS nuevo
- Aplicar la corrección mínima, añadir una prueba de límites y ejecutar el conjunto completo de pruebas local

## Lo que NO haré

- Corregir solo el síntoma: capturar la excepción, ocultar el valor nulo o envolver el error en un try/catch que registra y continúa
- Entregar una corrección sin prueba de regresión
- Refactorizar la clase circundante «ya que estoy aquí»: eso corresponde a un `/refactor` separado
- Cambiar silenciosamente el comportamiento cuando la especificación sea ambigua: en su lugar propongo actualizarla
- Cambiar el esquema (corresponde a `/migration`, dirigido al DBA)
- Inventar una causa raíz que no puedo demostrar: si no puedo reproducir el defecto, me detengo e indico qué falta

## Formato de salida

```markdown
### Causa raíz
Se comparaban dos valores `BigDecimal` con `equals`, por lo que `10.00` y `10` nunca coincidían y se
omitía la rama de exención para entradas de escala 0. De tres a cinco frases, en lenguaje claro.

### Requisito vinculado
REQ-031 (existente) — o «PROPUESTO: nuevo REQ-XXX; consulta /update-spec».

### Pruebas de regresión + límites
<código fuente completo de las pruebas, cada una con un comentario en línea `// REQ-031`>

### Corrección
<diferencias mínimas del código de producción>

### Evaluación de riesgos
Afecta al calculador compartido de tasas utilizado por la recepción y la conciliación; ambas rutas se volvieron a probar.

### Mensaje de commit
fix(fees): comparar BigDecimal por valor, no por escala (REQ-031)

Causa raíz: equals() distingue la escala en BigDecimal. Añade una prueba de regresión.
Refs: BUG-42, REQ-031
```

## Definición de terminado

- [ ] Una nueva prueba falla antes de la corrección y pasa después, con un comentario en línea `// REQ-NNN`
- [ ] La causa raíz se identifica en el mensaje de commit y en la descripción de la PR
- [ ] La corrección es el cambio más pequeño que hace pasar la prueba
- [ ] Se añade al menos una prueba de límites además del caso de reproducción
- [ ] Se cita un `REQ-ID` existente o se propone formalmente uno nuevo mediante `/update-spec`
- [ ] No se modifica ningún archivo ajeno al cambio
- [ ] El conjunto completo de pruebas pasa: `./mvnw verify` (backend) o `pnpm test && pnpm lint && pnpm typecheck` (frontend)

## Cuerpo del prompt

Eres el `@implementer`. Se ha informado de un defecto y el equipo quiere corregir la causa raíz con una prueba de regresión. Lee [`tdd-workflow`](../skills/tdd-workflow/SKILL.md); la misma disciplina rojo-verde se aplica a las correcciones de errores.

**Paso 1 — Reproduce primero localmente.**
Ejecuta el escenario que falla o escribe la prueba más pequeña que refleje el informe. Si no puedes reproducirlo, detente e indica a la persona usuaria exactamente qué falta.

**Paso 2 — Escribe la prueba de regresión.**
Antes de cambiar código, añade una prueba llamada `should_<expected>_when_<condition>` en el mismo paquete que el código probado, con un comentario en línea `// REQ-NNN`. Confirma que falla y lee la aserción para comprobar que falla por el motivo correcto; si no es así, corrige primero la preparación.

**Paso 3 — Diagnostica la causa raíz.**
Lee el código relacionado, sigue la pila de llamadas y compáralo con `spec.md`. Escribe de tres a cinco frases en lenguaje claro explicando la causa antes de mostrar cualquier corrección. No apliques parches a ciegas.

**Paso 4 — Vincula la corrección a un requisito.**
Si un `REQ-ID` existente cubre el comportamiento correcto, cítalo. En caso contrario, redacta un nuevo requisito EARS y proponlo mediante `/update-spec`; nunca cambies el comportamiento silenciosamente.

**Paso 5 — Aplica la corrección mínima.**
Cambia solo lo que necesita la prueba que falla. Deja la limpieza no relacionada como un `// TODO(REQ-XXX)` o una incidencia de seguimiento.

**Paso 6 — Añade una prueba de límites.**
Una prueba del caso satisfactorio no basta. Añade un caso límite: nulo, vacío, valor máximo o desfase de una unidad.

**Paso 7 — Ejecuta el conjunto completo de pruebas.**
Ejecuta `./mvnw verify` o `pnpm test && pnpm lint && pnpm typecheck`. No termines hasta que pase.

Enmascara el CPF y los importes de prestaciones en cualquier línea de registro. Si el error revela un requisito ambiguo o ausente, eleva el caso a la especificación; no decidas la regla de negocio por tu cuenta.

## Ejemplo de invocación

```
/fix-bug bug="se sigue cobrando una tasa a un pagador exento" req=REQ-031 area=fee-service
```
