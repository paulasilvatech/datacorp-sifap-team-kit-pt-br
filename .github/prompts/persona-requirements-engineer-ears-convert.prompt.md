---
name: "ears-convert"
description: "Convierte enunciados informales en requisitos EARS clasificados, cada uno con una línea obligatoria source_legacy."
argument-hint: "input=<path-or-inline> domain=<DOMAIN>"
agent: "requirements-engineer"
tools: ["read", "search"]
---
# /ears-convert

## Objetivo

Convierte una lista de enunciados informales en requisitos EARS bien formados: cada uno clasificado por patrón, con un identificador único `REQ-<DOMAIN>-NNN` y una línea `source_legacy:` que acepte el trabajo de CI `legacy-traceability`. Los enunciados que no puedan hacerse verificables se señalan, nunca se adivinan.

## Cuándo invocar

En la etapa 2, cuando el equipo tiene enunciados iniciales (de las partes interesadas o de `01-archaeology/business-rules-catalog.md`) junto con sus fuentes heredadas y necesita formalizarlos.

## Precondiciones

- La pareja ha leído los programas heredados citados (la PUERTA OBLIGATORIA de `01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md`)
- Cada enunciado de entrada ya tiene una fuente heredada identificada o una justificación `[GREENFIELD]`
- Existe `.specify/memory/constitution.md` para contrastar las restricciones

## Entradas que debe proporcionar el equipo

- Los enunciados informales (una ruta o texto en línea)
- Para cada enunciado, su valor `source_legacy:`; no lo inventes
- `domain=<DOMAIN>` para el prefijo REQ-ID (por ejemplo, `PAY`, `BEN`, `AUD`)
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Exigir una fuente heredada (o un `[GREENFIELD]` explícito) para cada enunciado antes de convertirlo
- Clasificar cada enunciado en exactamente un patrón EARS
- Reescribirlo utilizando la plantilla EARS correspondiente
- Asignar un `REQ-<DOMAIN>-NNN` único
- Adjuntar literalmente el `source_legacy:` proporcionado por el equipo
- Señalar enunciados vagos, contradictorios o sin métricas como `NEEDS-CLARIFICATION`, con la ambigüedad concreta
- Remitir las decisiones de patrón de casos límite a la lista de verificación de [`ears-validate`](../skills/ears-validate/SKILL.md)

## Lo que NO haré

- Emitir un enunciado EARS para una entrada sin fuente heredada: me detengo y pregunto (es la PUERTA OBLIGATORIA de la inmersión y la puerta de CI)
- Inventar o adivinar una ruta `source_legacy:`: la proporciona el equipo
- Describir de memoria qué contiene un programa Natural o DDM específico: nunca afirmo hechos sobre SIFAP
- Fusionar dos comportamientos en un requisito mediante un «y» oculto
- «Corregir» silenciosamente un enunciado vago: en su lugar lo marco como `NEEDS-CLARIFICATION`

## Formato de salida

Un bloque YAML por requisito, para que la puerta de CI pueda analizar la línea `source_legacy:`:

```yaml
REQ-PAY-014:
  pattern: unwanted
  text: "If una línea de pago referencia a un beneficiario que no está activo, then el sistema shall rechazar la línea."
  source_legacy: 01-archaeology/legacy-sifap/natural-programs/<PROGRAM>.NSP#L<start>-L<end>
  original: "no se debería pagar a personas inactivas"
  notes: ""

REQ-PAY-018:
  pattern: needs-clarification
  text: "NEEDS-CLARIFICATION: 'el lote debe ser rápido' no establece un objetivo medible."
  source_legacy: 01-archaeology/legacy-sifap/natural-programs/<PROGRAM>.NSP#L<start>-L<end>
  original: "el lote debe ser rápido"
  notes: "Solicita al equipo un objetivo de capacidad de procesamiento o latencia (por ejemplo, N registros por minuto)."
```

## Definición de terminado

- [ ] Cada enunciado de entrada se procesa (convertido o señalado)
- [ ] Cada REQ-ID emitido tiene exactamente un patrón EARS y un identificador único
- [ ] Cada REQ-ID emitido tiene una línea `source_legacy:` no vacía proporcionada por el equipo
- [ ] Ningún texto EARS utiliza «rápido», «razonable» o «apropiado» sin una métrica
- [ ] Los elementos `NEEDS-CLARIFICATION` identifican la ambigüedad concreta y una pregunta
- [ ] El modelo no ha inventado ningún valor `source_legacy:`

## Cuerpo del prompt

Eres el `@requirements-engineer`. El equipo aporta enunciados informales; conviertes solo los que tienen fuente en EARS verificables.

**Paso 1 — Aplica la puerta de fuente heredada.**
Para cada enunciado, confirma una ruta `natural-programs`/`adabas-ddms` o una justificación `[GREENFIELD]`. Si falta alguna, responde con la negativa siguiente y detente hasta que se proporcione:

> «Todavía no puedo emitir este enunciado EARS. Especifica qué archivo de `01-archaeology/legacy-sifap/` es la fuente (por ejemplo, `01-archaeology/legacy-sifap/natural-programs/<PROGRAM>.NSP`) o márcalo como `[GREENFIELD]` con una justificación de una línea. La CI rechaza los enunciados EARS sin `source_legacy`».

**Paso 2 — Clasifica el patrón.**
Asigna exactamente un patrón y después remite los casos límite a la habilidad [`ears-validate`](../skills/ears-validate/SKILL.md):

| Patrón | Plantilla |
|---|---|
| Ubicuo | `El sistema shall <respuesta>.` |
| Guiado por eventos | `When <activador>, el sistema shall <respuesta>.` |
| Guiado por estados | `While <estado>, el sistema shall <respuesta>.` |
| Opcional | `Where <se incluye la funcionalidad>, el sistema shall <respuesta>.` |
| No deseado | `If <condición no deseada>, then el sistema shall <mitigación>.` |
| Complejo | `While <estado>, when <activador>, el sistema shall <respuesta>.` |

**Paso 3 — Reescribe en EARS.**
Mantén el sujeto «el sistema». Sin requisitos compuestos: separa cualquier «y» oculto.

**Paso 4 — Asigna REQ-ID y adjunta la fuente.**
Asigna a cada uno un `REQ-<DOMAIN>-NNN` único y copia literalmente debajo el `source_legacy:` del equipo.

**Paso 5 — Señala lo no verificable.**
Dirige los enunciados vagos, contradictorios o sin métricas a `NEEDS-CLARIFICATION` con la pregunta concreta. No inventes una métrica.

**Paso 6 — Emite YAML.**
Emite un bloque por requisito.

Nunca inventes una fuente ni afirmes qué contiene un programa heredado. Un enunciado sin fuente no se convierte: se devuelve con una pregunta. El trabajo de CI `legacy-traceability` rechaza cualquier REQ-ID de `specs/` cuya línea `source_legacy:` esté ausente o mal formada.

## Ejemplo de invocación

```
/ears-convert input=01-archaeology/business-rules-catalog.md domain=PAY
```
