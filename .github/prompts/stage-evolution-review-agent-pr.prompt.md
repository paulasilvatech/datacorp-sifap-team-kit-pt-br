---
name: "review-agent-pr"
description: "Revisa una PR generada por Copilot Agent en la nube, con atención explícita a los modos de fallo típicos de la IA."
argument-hint: "pr=<number> issue=<slug>"
agent: "evolution"
tools: ["read", "search", "edit", "execute", "github/*"]
---
# /review-agent-pr

## Objetivo

Revisa sistemáticamente una solicitud de cambios generada por Copilot Agent, comprobándola frente a los criterios de aceptación de la incidencia original y señalando modos de fallo típicos de la IA. Los hallazgos se clasifican por gravedad.

## Cuándo invocar

Cuando Copilot Agent crea una PR a partir de una incidencia delegada y el equipo necesita revisarla.

## Precondiciones

- Existe una PR de Copilot Agent (el equipo proporciona el número de PR o el nombre de rama)
- Existe el borrador de la incidencia original en `04-evolution/issues/<slug>.md`
- Existe la lista de seguimiento de delegación en `04-evolution/delegations/<slug>.md`

## Entradas que debe proporcionar el equipo

- El número de PR o el nombre de rama
- El slug de la incidencia original (para referenciar los criterios de aceptación)

## Lo que haré

- Obtener las diferencias de la PR y analizar cada archivo modificado
- Comparar los cambios con los criterios de aceptación de la incidencia
- Comprobar modos de fallo típicos de IA (API inventadas, pruebas sin significado, ampliación indebida del alcance)
- Clasificar los hallazgos por gravedad: corrección obligatoria, corrección recomendada, aplazable
- Producir un documento de revisión estructurado

## Lo que NO haré

- Aprobar la PR: el equipo decide si la integra
- Corregir problemas automáticamente: informo de ellos y el equipo actúa
- Omitir PR no triviales sin señalar al menos un punto de revisión
- Aceptar PR sin pruebas para comportamiento nuevo

## Formato de salida

Un documento de revisión en `04-evolution/reviews/<pr-number>.md`:

```markdown
# Revisión de PR: #[number] — [título]
## Verificación de criterios de aceptación
| Criterio | Estado | Evidencia |
## Examen de modos de fallo de IA
| Comprobación | Resultado | Detalles |
## Hallazgos clasificados
### Corrección obligatoria antes de integrar
### Corrección recomendada antes de integrar
### Corrección aplazable a seguimiento
## Recomendación
```

## Definición de terminado

- [ ] Cada criterio de aceptación de la incidencia se verifica (satisfactorio/fallido/parcial)
- [ ] El examen de modos de fallo de IA cubre las siete comprobaciones estándar
- [ ] Cada hallazgo tiene una ruta de archivo y una referencia de línea
- [ ] Los hallazgos se clasifican como corrección obligatoria / corrección recomendada / aplazable
- [ ] Se proporciona una recomendación clara: integrar, integrar con correcciones o rechazar
- [ ] Se verifican las pruebas del comportamiento nuevo (o se señala su ausencia como corrección obligatoria)

## Cuerpo del prompt

Eres el `@evolution`. El equipo necesita revisar una PR generada por Copilot Agent.

**Paso 1 — Carga el contexto.**
Lee la incidencia original en `04-evolution/issues/<slug>.md`. Extrae los criterios de aceptación y la lista de archivos afectados. Lee la lista de seguimiento en `04-evolution/delegations/<slug>.md`.

**Paso 2 — Obtén las diferencias de la PR.**
Utiliza solo comandos de lectura de GitHub CLI para obtener los datos de la PR: `gh pr view <pr-number>` y `gh pr diff <pr-number>`. No ejecutes comandos de revisión, integración, comentarios, escritura ni ninguna otra mutación de GitHub. Enumera cada archivo modificado, añadido o eliminado. Compáralos con los archivos esperados de la lista de seguimiento. Señala cualquier cambio de archivo inesperado como posible ampliación indebida del alcance.

**Paso 3 — Verifica los criterios de aceptación.**
Para cada criterio de aceptación de la incidencia original:

- **Satisfactorio**: la PR implementa claramente este criterio. Cita el código específico.
- **Fallido**: la PR no implementa este criterio. Anota qué falta.
- **Parcial**: algunos aspectos están implementados, pero no todos. Describe la laguna.

**Paso 4 — Examina los modos de fallo típicos de IA.**
Comprueba cada elemento siguiente. Para cada comprobación, informa de Satisfactorio o Fallido con referencias file:line específicas:

1. **Importaciones inventadas**: ¿todas las importaciones se resuelven a dependencias reales del proyecto o clases del JDK?
2. **Llamadas a API inventadas**: ¿todas las llamadas a métodos apuntan a métodos que realmente existen en la clase de destino?
3. **Pruebas sin significado**: ¿las aserciones verifican comportamiento real? (Vigila `assertTrue(true)`, aserciones sobre la entrada en lugar de la salida o aserciones sobre valores incorporados directamente)
4. **Discrepancia entre comentarios y código**: ¿los comentarios describen correctamente lo que hace el código?
5. **Ampliación indebida del alcance**: ¿la PR cambia archivos fuera del alcance de la incidencia?
6. **Tratamiento de errores ausente**: ¿se gestionan las rutas de error o solo el caso satisfactorio?
7. **Infracciones de estilo**: ¿el código sigue las convenciones del proyecto (registros para DTO, inyección por constructor, sin campos `@Autowired`, sin retornos `null`)?

**Paso 5 — Clasifica los hallazgos.**
Ordena todos los hallazgos en tres categorías:

- **Corrección obligatoria antes de integrar**: errores, problemas de seguridad, pruebas fallidas, pruebas ausentes para comportamiento nuevo y API inventadas. La PR no debe integrarse hasta resolverlos.
- **Corrección recomendada antes de integrar**: infracciones de estilo, tratamiento de errores incompleto y Javadoc ausente. Deberían corregirse, pero no bloquean.
- **Corrección aplazable a seguimiento**: mejoras menores, casos de prueba adicionales y actualizaciones de documentación. Regístralos como una incidencia nueva.

**Paso 6 — Escribe la recomendación.**
Según los hallazgos:

- **Integrar**: no hay elementos de corrección obligatoria. Opcionalmente, anota los de corrección recomendada para que los aborde el equipo.
- **Integrar con correcciones**: existen elementos de corrección obligatoria, pero son pequeños. Enumera las correcciones específicas requeridas.
- **Rechazar**: problemas fundamentales (enfoque incorrecto, funcionalidad principal ausente, vulnerabilidad de seguridad). Explica por qué y sugiere los pasos siguientes.

**Paso 7 — Escribe el documento de revisión.**
Genera la salida en `04-evolution/reviews/<pr-number>.md`.

Debe señalarse al menos un hallazgo para una PR no trivial. Si realmente no hay nada incorrecto, indica: «No se encontraron problemas de corrección obligatoria. La PR cumple todos los criterios de aceptación». Pero esto debería ser poco habitual en código generado por IA.

## Ejemplo de invocación

```
/review-agent-pr pr=<number> issue=<slug>
```
