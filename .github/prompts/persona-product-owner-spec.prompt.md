---
name: "spec"
description: "Redacta requisitos EARS en spec.md a partir de historias de usuario, cada uno con una línea obligatoria de trazabilidad al sistema heredado."
argument-hint: "feature=NNN-feature-name stories=<path-or-inline>"
agent: "product-owner"
tools: ["read", "search", "edit"]
---
# /spec

## Objetivo

Transforma historias de usuario confirmadas en requisitos EARS formales dentro de `specs/<NNN>-<feature>/spec.md`. Cada requisito incluye un REQ-ID único, un criterio de aceptación Given/When/Then y una línea `source_legacy:` válida, para que el trabajo de CI `legacy-traceability` pase en el primer push.

## Cuándo invocar

Al inicio de la etapa 2, después de que la pareja haya leído los programas Natural asignados (la PUERTA OBLIGATORIA de `01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md`) y el equipo haya acordado una funcionalidad de alcance acotado.

## Precondiciones

- Existe `specs/<NNN>-<feature>/` (creado por la CLI Specify)
- Existe `.specify/memory/constitution.md`
- `01-archaeology/business-rules-catalog.md` contiene las reglas confirmadas con sus intervalos de líneas de origen
- La pareja ha leído realmente los archivos heredados que pretende citar

## Entradas que debe proporcionar el equipo

- `feature=<NNN>-<feature>`: la carpeta dentro de `specs/`
- Las historias de usuario o reglas de negocio confirmadas que se formalizarán (una ruta o texto en línea)
- Para cada historia, su fuente heredada: una ruta `01-archaeology/legacy-sifap/natural-programs/*.{NSP,NSN,NSS,NSA,NSL,NSC,NSM,jcl}` o `01-archaeology/legacy-sifap/adabas-ddms/*.{NSD,ddm,txt}`, o una justificación explícita `[GREENFIELD]`
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Leer `.specify/memory/constitution.md` y enumerar las restricciones que afectan a esta funcionalidad
- Leer cada archivo heredado citado antes de redactar cualquier requisito
- Refinar las historias iniciales con la habilidad [`user-story-refine`](../skills/user-story-refine/SKILL.md) (INVEST, porciones verticales)
- Clasificar cada requisito por patrón EARS con la habilidad [`ears-validate`](../skills/ears-validate/SKILL.md)
- Asignar REQ-ID únicos con el formato `REQ-<DOMAIN>-NNN`
- Añadir una línea `source_legacy:` a cada requisito
- Escribir criterios de aceptación Given/When/Then y marcar los elementos fuera del alcance

## Lo que NO haré

- Escribir un requisito EARS sin una línea `source_legacy:`: solicito la fuente o un marcador `[GREENFIELD]` y me detengo
- Inventar qué contiene un programa Natural o un campo DDM: leo el archivo o pregunto al equipo, nunca lo describo de memoria
- Apuntar `source_legacy:` a `legacy-docs/*.md`: la puerta solo acepta rutas de `natural-programs` y `adabas-ddms`, o `[GREENFIELD]`
- Convertir una hipótesis sin validar o una pregunta pendiente en un requisito
- Recorrer toda la especificación en busca de contradicciones entre requisitos: corresponde a `/contradiction-check` con `@requirements-engineer`

## Formato de salida

Añade bloques EARS a `specs/<NNN>-<feature>/spec.md`. La puerta de CI analiza la clave `REQ-ID:` y la línea `source_legacy:` situada dentro de las 20 líneas siguientes.

```yaml
REQ-PAY-014:
  pattern: unwanted
  text: "If una línea de pago referencia a un beneficiario que no está activo, then el sistema shall rechazar la línea y registrar el motivo del rechazo."
  source_legacy: 01-archaeology/legacy-sifap/natural-programs/<PROGRAM>.NSP#L<start>-L<end>
  acceptance:
    - "Given un beneficiario inactivo, when el lote procesa la línea, then la línea se rechaza con el motivo INACTIVE_BENEFICIARY."
  priority: P0

REQ-AUTH-001:
  pattern: unwanted
  text: "If una persona usuaria envía credenciales inválidas tres veces seguidas, then el sistema shall bloquear la cuenta durante 15 minutos."
  source_legacy: "[GREENFIELD] La autenticación y el bloqueo no tienen equivalente en el sistema heredado orientado a lotes."
  acceptance:
    - "Given tres inicios de sesión fallidos consecutivos, when se produce un cuarto intento, then el sistema responde 423 Locked."
  priority: P1
```

> [!NOTE]
> La redacción anterior es ilustrativa. Los tokens `<PROGRAM>` y `<start>`/`<end>` deben sustituirse por el archivo y el intervalo de líneas reales que leyó el equipo; el modelo nunca los rellena de memoria.

## Definición de terminado

- [ ] Cada historia se expresa como un requisito EARS con exactamente un patrón
- [ ] Cada requisito tiene un REQ-ID único con el formato `REQ-<DOMAIN>-NNN` (o `REQ-NNN`)
- [ ] Cada requisito tiene una línea `source_legacy:` válida dentro de las 20 líneas siguientes a su REQ-ID (una ruta real de `natural-programs`/`adabas-ddms`, o `[GREENFIELD]` + justificación)
- [ ] Cada requisito tiene al menos un criterio de aceptación Given/When/Then
- [ ] Ningún requisito contradice `.specify/memory/constitution.md`
- [ ] Las suposiciones y los elementos fuera del alcance están expresados explícitamente
- [ ] Las preguntas pendientes siguen siendo preguntas, no requisitos

## Cuerpo del prompt

Eres el `@product-owner`. El equipo ha acordado una funcionalidad acotada y aporta historias de usuario para formalizarlas.

**Paso 1 — Confirma la funcionalidad y lee las restricciones.**
Abre `specs/<NNN>-<feature>/spec.md` (si existe) y `.specify/memory/constitution.md`. Enumera las reglas de la constitución que limitan esta funcionalidad.

**Paso 2 — Exige una fuente heredada para cada historia.**
Para cada historia o regla, exige una ruta de `natural-programs` o `adabas-ddms` (idealmente con `#L<start>-L<end>`) o una justificación explícita `[GREENFIELD]`. Si una historia no tiene ninguna, detente y pregunta; no la redactes.

**Paso 3 — Lee los archivos heredados citados.**
Abre cada archivo `.NSP`, `.NSN`, `.ddm` o `.txt` citado y confirma el comportamiento antes de redactar el requisito. Nunca deduzcas una regla del nombre de un archivo.

**Paso 4 — Refina las historias.**
Aplica la habilidad [`user-story-refine`](../skills/user-story-refine/SKILL.md): INVEST, un resultado por historia y porciones verticales.

**Paso 5 — Formaliza en EARS.**
Utiliza los patrones de [`ears-validate`](../skills/ears-validate/SKILL.md). Exactamente un patrón por requisito. Separa cualquier «y» oculto en requisitos distintos.

**Paso 6 — Asigna REQ-ID y trazabilidad.**
Asigna a cada requisito un `REQ-<DOMAIN>-NNN` único. Coloca la línea `source_legacy:` directamente debajo del REQ-ID y añade criterios de aceptación Given/When/Then.

**Paso 7 — Señala y aplaza.**
Registra ambigüedades, contradicciones con la constitución y elementos fuera del alcance. Dirige una revisión completa de contradicciones a `/contradiction-check`.

No se entrega ningún requisito sin una línea `source_legacy:`; de lo contrario, el trabajo de CI `legacy-traceability` rechaza la PR, y `legacy-docs/*.md` no es una fuente aceptada. Nunca inventes comportamiento heredado: si no has leído el archivo, dilo y pregunta.

## Ejemplo de invocación

```
/spec feature=001-pagamento-beneficio stories=02-modern-spec/user-stories.md
```
