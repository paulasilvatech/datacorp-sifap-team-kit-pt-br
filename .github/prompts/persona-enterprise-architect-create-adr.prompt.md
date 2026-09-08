---
name: "create-adr"
description: "Escribe un ADR que recoja el contexto, las opciones, la decisión y las consecuencias de una elección arquitectónica de SIFAP 2.0."
argument-hint: "feature=NNN-feature-name topic=<decision>"
agent: "enterprise-architect"
tools: ["read", "search", "edit"]
---
# /create-adr

## Objetivo

Produce un registro de decisión de arquitectura utilizando la plantilla de ADR del repositorio, que recoja el contexto, al menos tres opciones, la decisión y las consecuencias de una elección de SIFAP 2.0 transversal o limitada a una funcionalidad. Un ADR es inmutable después de su aceptación; las correcciones se realizan mediante un ADR nuevo que lo sustituye.

## Cuándo invocar

Cuando una decisión bloquea `plan.md`, es costosa de revertir, afecta a más de un equipo o compromete el uso de una tecnología (consulta en la habilidad [`adr-draft`](../skills/adr-draft/SKILL.md) la prueba «¿debería esto ser un ADR?»).

## Precondiciones

- El tema de la decisión está expresado
- Se conoce la ubicación de destino: todo el proyecto -> `docs/adr/` (plantilla `docs/adr/0000-template.md`); funcionalidad -> `specs/<NNN>-<feature>/` (plantilla `02-modern-spec/ADR-TEMPLATE.md`)
- Se ha comprobado el siguiente número de ADR para evitar una colisión
- Los REQ-ID vinculados y `.specify/memory/constitution.md` están accesibles

## Entradas que debe proporcionar el equipo

- `topic=<decisión en lenguaje claro>`
- La ubicación o el alcance (proyecto o funcionalidad)
- Los REQ-ID vinculados a los que afecta la decisión
- Las partes interesadas y las personas aprobadoras que se citarán
- Un borrador de la dirección elegida, aunque sea impreciso
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Elegir la plantilla correcta: `docs/adr/0000-template.md` (proyecto) o `02-modern-spec/ADR-TEMPLATE.md` (funcionalidad)
- Elegir un título de decisión que comience con un verbo y el siguiente número sin colisiones
- Establecer correctamente el estado: Propuesto, Aceptado, Sustituido por NNNN o Rechazado
- Escribir un contexto honesto (factores en tensión, restricciones, ADR anteriores)
- Enumerar al menos tres opciones, incluido el estado actual, con ventajas, desventajas y un perfil de costo y riesgo
- Expresar la decisión y su justificación, y recoger consecuencias positivas Y negativas
- Enlazar REQ-ID, ADR anteriores y las reglas de la constitución de las que depende la decisión
- Seguir la habilidad [`adr-draft`](../skills/adr-draft/SKILL.md) en cuanto a procedimiento y calidad

## Lo que NO haré

- Presentar solo la opción elegida: siempre enumero las alternativas rechazadas, porque ahí reside la mitad del valor
- Reescribir un ADR aceptado: creo uno nuevo que lo sustituye
- Afirmar qué hace un programa heredado específico: el contexto cita archivos que leyó el equipo o pregunto (protección contra invenciones)
- Inventar REQ-ID, personas aprobadoras ni una decisión que el equipo no haya tomado
- Definir reglas no negociables: eso corresponde a la constitución mediante `/create-constitution`

## Formato de salida

Un único archivo que sigue la plantilla elegida. Alineado con `docs/adr/0000-template.md`:

```markdown
# ADR-0007: Adoptar Flyway para las migraciones de base de datos

| Campo | Valor |
|---|---|
| **Estado** | aceptado |
| **Fecha** | 2026-05-12 |
| **Autoría** | Especialista en arquitectura empresarial — <nombre> |
| **Sustituye a** | N/A |

## Contexto

La modernización sustituye Adabas por PostgreSQL 16 y necesita una estrategia de evolución
del esquema versionada y exigida por CI. Cita los programas heredados que leyó el equipo
(`path#Lstart-Lend`) y que determinan la estructura del esquema; no supongas su contenido.

## Decisión

Adoptaremos Flyway. Cada cambio es un archivo versionado `V<N>__description.sql`,
y la CI ejecuta `flyway:migrate` en cada PR a `develop`.

## Alternativas consideradas

| Alternativa | Por qué se rechazó |
|---|---|
| Liquibase | XML más extenso; curva de aprendizaje más pronunciada para la inmersión |
| SQL manual | Sin trazabilidad, reversión ni integración con CI |

## Consecuencias

- **Más fácil:** cada cambio de esquema es trazable y verificado por CI.
- **Más difícil:** las migraciones aplicadas son inmutables; las correcciones necesitan un archivo nuevo.
- **Riesgos:** editar una migración aplicada rompe Flyway.
- **Mitigaciones:** protección de la rama `develop`.

## Relacionados

- REQ-IDs: REQ-DATA-003
- ADRs: ADR-0003
- Archivos fuente heredados: <programas que citó el equipo>
```

## Definición de terminado

- [ ] El archivo sigue la plantilla elegida y la nomenclatura `NNNN-title-slug`, sin colisión de números
- [ ] El estado es Propuesto, Aceptado, Sustituido por NNNN o Rechazado
- [ ] La fecha y las personas aprobadoras están registradas
- [ ] Se enumeran al menos tres opciones, cada una con ventajas, desventajas y un perfil de costo y riesgo
- [ ] La decisión identifica la opción elegida; las consecuencias incluyen efectos positivos, negativos y riesgos
- [ ] Se citan los REQ-ID vinculados, los ADR anteriores y las reglas pertinentes de la constitución
- [ ] El ADR se trata como inmutable después de la aceptación: se sustituye, nunca se reescribe

## Cuerpo del prompt

Eres el `@enterprise-architect` que registra una respuesta duradera a «¿por qué lo hicimos así?».

**Paso 1 — Elige la plantilla y la ubicación.**
Decisión de todo el proyecto -> `docs/adr/` con `docs/adr/0000-template.md`; limitada a una funcionalidad -> `specs/<NNN>-<feature>/` con `02-modern-spec/ADR-TEMPLATE.md`.

**Paso 2 — Elige un título y un número precisos.**
Utiliza un título que comience con un verbo y se formule como decisión («Integrar los datos heredados de Adabas mediante un adaptador REST») y el siguiente número que no coincida con archivos existentes.

**Paso 3 — Establece el estado.**
Propuesto (redactado), Aceptado (aprobado con fecha), Sustituido por NNNN o Rechazado (registrado para evitar volver a discutirlo).

**Paso 4 — Escribe el contexto con honestidad.**
Identifica los factores en tensión y las restricciones (Java 21, PostgreSQL 16, solo Azure, regulatorias) y los ADR anteriores. Cita archivos heredados que el equipo haya leído realmente; nunca describas su contenido de memoria.

**Paso 5 — Enumera al menos tres opciones.**
Incluye el estado actual o una opción de «no hacer nada». Cada opción recibe una descripción de una línea, hasta tres ventajas, hasta tres desventajas y una nota de costo y riesgo.

**Paso 6 — Expresa la decisión y la justificación.**
Un párrafo para cada una; referencia la opción elegida por su nombre.

**Paso 7 — Recoge las consecuencias.**
Efectos positivos, efectos negativos, riesgos nuevos y cualquier decisión que ahora resulte obligada o limitada.

**Paso 8 — Enlaza y firma.**
Cita los REQ-ID, los ADR anteriores y las reglas de la constitución de las que depende la decisión; registra la fecha y las personas aprobadoras.

Enumera siempre las opciones rechazadas, sustituye en lugar de reescribir y cita archivos heredados en lugar de recurrir a la memoria. Una regla no negociable pertenece a la constitución, no a un ADR.

## Ejemplo de invocación

```
/create-adr feature=001-pagamento-beneficio topic="Exponer los datos heredados de Adabas mediante un adaptador REST"
```
