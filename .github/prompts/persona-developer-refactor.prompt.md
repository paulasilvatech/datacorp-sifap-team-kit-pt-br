---
name: "refactor"
description: "Mejora la estructura interna con pruebas satisfactorias, sin cambiar el comportamiento observable ni romper la trazabilidad REQ-ID."
argument-hint: "target=<file-or-package> smell=<code-smell>"
agent: "implementer"
tools: ["read", "search", "edit", "execute"]
---
# /refactor

## Objetivo

Mejora la estructura interna del código existente sin cambiar lo que hace. Un cambio que altera el comportamiento no es una refactorización: corresponde a `/implement` o `/fix-bug`. El resultado mantiene todas las pruebas existentes satisfactorias, con los mismos nombres, y cada enlace `REQ-ID` intacto: un indicio de mal diseño, una transformación, una PR.

> [!WARNING]
> Si cambia cualquier salida, aserción o firma pública, no es una refactorización. Detente y utiliza `/implement` o `/fix-bug`.

## Cuándo invocar

Cuando un indicio de mal diseño identificado esté ralentizando al equipo y el destino tenga (o pueda obtener rápidamente) una red de seguridad de pruebas satisfactorias. Ejecútalo en una rama dedicada `impl/<NNN>-<feature>`, separada de cualquier trabajo de funcionalidades o errores.

## Precondiciones

- El archivo, paquete o componente de destino existe y compila
- Sus pruebas pasan actualmente o pueden añadirse primero pruebas de caracterización
- No hay ningún `/fix-bug` pendiente sobre el mismo código: los defectos se corrigen antes de refactorizar desde una base limpia
- Se conocen las restricciones de `plan.md` o los ADR (por ejemplo, «los controladores se mantienen ligeros»)

## Entradas que debe proporcionar el equipo

- El archivo, paquete o componente de destino
- La motivación: el indicio de mal diseño observado (método largo, duplicación, obsesión por primitivos, envidia de funcionalidades, etc.)
- Las restricciones de `plan.md` o los ADR que limiten el cambio
- La cobertura de pruebas actual del área (ejecuta un informe de cobertura si se desconoce)
- Solicita a la persona usuaria cualquier elemento que falte.

## Lo que haré

- Confirmar la red de seguridad: si la cobertura de líneas es inferior al 80%, escribir primero pruebas de caracterización
- Nombrar con precisión el indicio de mal diseño según el catálogo y citar una o dos líneas de evidencia
- Elegir una transformación de Fowler adecuada y aplicarla como un único paso que conserve el comportamiento
- Ejecutar pruebas antes y después de cada paso pequeño, manteniendo el conjunto satisfactorio en cada commit
- Mover cada anotación `@implements REQ-NNN` junto con su método, sin cambios

## Lo que NO haré

- Refactorizar sin pruebas: eso es una reescritura con otro nombre
- Cambiar el comportamiento bajo la apariencia de refactorización: si cambia cualquier salida o aserción, el trabajo queda invalidado
- Hacer «pequeñas mejoras» en código vecino: me limito estrictamente al indicio de mal diseño identificado
- Renombrar o reestructurar una API pública sin un plan de migración o retirada
- Combinar una refactorización con una funcionalidad o corrección de error en la misma PR
- Inventar un comportamiento nuevo que no describa la especificación: solo cambio estructural; las preguntas de requisitos se dirigen a `/update-spec`

## Formato de salida

```markdown
### Indicio de mal diseño identificado
Método largo: `FeeService.calculate()` abarca 74 líneas repartidas entre tres ramas anidadas.

### Refactorización elegida
Extraer método: llevar cada rama a `applyExemption`, `applyCeiling` y `applyRounding`.

### Diferencias
<antes/después de cada archivo modificado>

### Resultados de pruebas
`./mvnw test` → 12 satisfactorias (los mismos nombres que antes).

### Nota de conservación del comportamiento
API pública sin cambios. Sin nuevas cláusulas throws. Sin migración de base de datos. Sin nuevas variables de entorno.

### Mensaje de commit
refactor(fees): extraer los pasos del cálculo de tasas

Divide calculate() en tres métodos privados. Sin cambios de comportamiento.
Refs: REQ-031
```

## Definición de terminado

- [ ] Todas las pruebas que pasaban antes siguen pasando, con los mismos nombres
- [ ] Sin cambios en la API pública, nuevas excepciones ni nuevas dependencias
- [ ] La cobertura no disminuye
- [ ] Un indicio de mal diseño, una transformación, una PR
- [ ] Todas las anotaciones `@implements REQ-NNN` permanecen presentes y correctas
- [ ] El mensaje de commit utiliza el tipo `refactor:` e indica «sin cambios de comportamiento»

## Cuerpo del prompt

Eres el `@implementer`. El equipo quiere una mejora estructural que conserve el comportamiento. Lee [`refactor-safely`](../skills/refactor-safely/SKILL.md) antes de comenzar; define los procedimientos de red de seguridad, pasos pequeños y pruebas de caracterización.

**Paso 1 — Confirma la red de seguridad.**
Comprueba la cobertura de líneas del destino. Si es inferior al 80%, escribe pruebas de caracterización que fijen el comportamiento actual, incluidas sus particularidades, antes de cambiar nada. Refactorizar sin pruebas es reescribir.

**Paso 2 — Nombra con precisión el indicio de mal diseño.**
Elige del catálogo: método largo, clase grande, obsesión por primitivos, grupos de datos, envidia de funcionalidades, cirugía de escopeta o cambio divergente. Cita una o dos líneas de evidencia. Se rechaza «hazlo más limpio».

**Paso 3 — Elige una transformación de Fowler.**
Selecciona la transformación adecuada (extraer método, extraer clase, reemplazar condicional por polimorfismo o introducir objeto de parámetros) y aplica exactamente una por commit.

**Paso 4 — Ejecuta las pruebas antes de tocar nada.**
Confirma que pasan. Si alguna falla o se omite, corrígelo primero; nunca refactorices una compilación averiada.

**Paso 5 — Aplica la transformación.**
Prioriza las herramientas de refactorización del IDE (Extract, Rename, Move). Las ediciones manuales deben conservar las firmas de métodos, salvo que la transformación sea cambiar la declaración de función con un plan de migración.

**Paso 6 — Ejecuta las pruebas después de cada paso pequeño.**
El conjunto de pruebas debe pasar en cada commit. Si falla y no sabes por qué, revierte y da un paso más pequeño. Mueve cada anotación `@implements REQ-NNN` junto con su método.

**Paso 7 — Detente cuando desaparezca el indicio de mal diseño.**
Resiste la tentación de refactorizar código vecino. Cada invocación es un chat, una PR y un indicio de mal diseño.

Si surge un cambio real de comportamiento o un requisito nuevo durante la refactorización, detente y dirígelo a `/implement`, `/fix-bug` o `/update-spec`; no lo incorpores a este cambio.

## Ejemplo de invocación

```
/refactor target=backend/src/main/java/com/example/app/fees/FeeService.java smell=long-method
```
