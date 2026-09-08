---
name: "create-constitution"
description: "Escribe .specify/memory/constitution.md: las reglas numeradas, verificables y no negociables de la funcionalidad."
argument-hint: "feature=NNN-feature-name"
agent: "enterprise-architect"
tools: ["read", "search", "edit"]
---
# /create-constitution

## Objetivo

Produce `.specify/memory/constitution.md`: un conjunto breve (≤ 80 líneas) y numerado de reglas verificables y no negociables, agrupadas por categoría, cada una con una consecuencia de incumplimiento y un marcador de mutable o inmutable. Los ADR toman decisiones; la constitución define los límites que esas decisiones no pueden cruzar.

## Cuándo invocar

Al inicio de una funcionalidad (o del proyecto), antes de que los ADR y las especificaciones dependan de restricciones compartidas. Vuelve a ejecutarlo para modificar la constitución mediante el proceso documentado.

## Precondiciones

- Existe `specs/<NNN>-<feature>/` o se ha acordado el alcance del proyecto
- Se conocen las restricciones organizativas (base de seguridad, solo Azure, OWASP Top 10, LGPD)
- Se ha identificado cualquier constitución superior de la que heredar

## Entradas que debe proporcionar el equipo

- `feature=<NNN>-<feature>` (o `project`)
- Las restricciones organizativas existentes que se codificarán
- Cualquier constitución superior de la que heredar
- Las personas aprobadoras identificadas (arquitectura empresarial, responsable técnico, InfoSec)
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Heredar de la constitución superior y adaptarla con justificación explícita
- Agrupar las reglas por tecnologías, seguridad, datos, operaciones, proceso y cumplimiento normativo
- Hacer verificable cada regla y asignarle un identificador (`C1`, `C2`, …)
- Expresar la consecuencia de incumplir cada regla
- Marcar cada regla como mutable (se puede flexibilizar mediante ADR + aprobación de InfoSec) o inmutable
- Fechar el archivo, versionarlo con semver y registrar las personas aprobadoras
- Mantenerlo en 80 líneas o menos

## Lo que NO haré

- Escribir principios («valoramos la calidad») en lugar de reglas («solo Java 21»)
- Emitir una regla sin identificador ni consecuencia de incumplimiento
- Superar las 80 líneas: una constitución que nadie puede recordar no funciona
- Inventar una restricción organizativa ni una persona aprobadora: pregunto al equipo
- Decidir un compromiso de diseño específico: corresponde a un ADR mediante `/create-adr`

## Formato de salida

El entregable es `.specify/memory/constitution.md`:

```markdown
# CONSTITUCIÓN — 001-pagamento-beneficio

- **Versión**: 1.0.0
- **Fecha**: 2026-04-29
- **Aprobadores**: @paula (arquitectura empresarial), @morgan (responsable técnico), @infosec-lead
- **Alcance**: reglas aplicables a esta funcionalidad

## 1. Tecnologías
| ID | Regla | Consecuencia |
|---|---|---|
| C1 | El backend se ejecuta solo en Java 21 (Temurin) y Spring Boot 3.3. | La compilación falla. |
| C2 | El frontend se ejecuta en Next.js 15 con TypeScript `strict: true`. Sin `any`. | El lint bloquea la integración. |
| C3 | PostgreSQL 16 es el único sistema de registro autorizado para los datos de SIFAP. | Se requiere una excepción de InfoSec. |

## 2. Seguridad
| ID | Regla | Consecuencia |
|---|---|---|
| C4 | La autenticación entre servicios utiliza identidad administrada de Azure. Sin secretos de cliente en código ni configuración. | PR bloqueada. |
| C5 | Los secretos se leen de Key Vault durante la ejecución. Ningún `.env` incluido en commits. | Gitleaks bloquea la integración. |
| C6 | Base OWASP Top 10: validación de entradas, SQL parametrizado, sin consultas construidas con cadenas. | PR rechazada. |

## 3. Datos
| ID | Regla | Consecuencia |
|---|---|---|
| C7 | Las columnas de PII incluyen un `COMMENT` que las identifica como PII. | La revisión del DBA bloquea. |
| C8 | Sin PII de producción en `dev` ni `stage`. Solo datos sintéticos. | Hallazgo de InfoSec, reversión inmediata. |

## 4. Operaciones
| ID | Regla | Consecuencia |
|---|---|---|
| C9 | Cada punto de conexión público emite un registro estructurado con `requestId`, `userId`, `latencyMs`. | La revisión de código bloquea. |
| C10 | Cada punto de conexión de cara al usuario tiene un SLO registrado en un `REQ-OPS-*`. | La revisión de especificación bloquea. |

## 5. Proceso
| ID | Regla | Consecuencia |
|---|---|---|
| C11 | Una rama por elemento de trabajo, creada a partir de `develop` con el prefijo de persona según `00-GIT-WORKFLOW.md` (`spec/`, `impl/`, `infra/`, `docs/`, `agent/`). Sin commits directos a `develop` ni `main`. | PR rechazada. |
| C12 | Cada requisito utiliza notación EARS y cada prueba cita un `REQ-ID`. | La revisión de especificación bloquea. |

## 6. Cumplimiento normativo
| ID | Regla | Consecuencia |
|---|---|---|
| C13 | Los puntos de conexión de derechos de titulares según la LGPD (leer, eliminar, exportar) están cubiertos por `REQ-COMP-*`. | La revisión de cumplimiento bloquea la publicación. |

## 7. Mutable frente a inmutable
- Mutables (se pueden flexibilizar mediante ADR + aprobación de InfoSec): C9–C12.
- Inmutables (requieren un cambio de constitución): C1, C3, C4, C5, C6, C7, C8, C13.

## 8. Proceso de modificación
Abre una PR para este archivo. El foro de arquitectura la revisa e incrementa la versión (`1.0.0` -> `1.1.0` menor, `-> 2.0.0` mayor). Las nuevas personas aprobadoras dan su conformidad.
```

## Definición de terminado

- [ ] El archivo tiene ≤ 80 líneas, excluidas las firmas
- [ ] Cada regla tiene un identificador y una consecuencia de incumplimiento
- [ ] Existe al menos una regla por categoría (tecnologías, seguridad, datos, operaciones, proceso, cumplimiento normativo)
- [ ] Se expresa la distinción entre mutable e inmutable
- [ ] El proceso de modificación está documentado
- [ ] Hereda de una constitución superior cuando existe
- [ ] Están registradas las personas aprobadoras, la fecha y una versión semver

## Cuerpo del prompt

Eres el `@enterprise-architect`. El equipo necesita fijar los límites antes de que las decisiones y el código dependan de ellos.

**Paso 1 — Hereda y adapta.**
Parte de la constitución del proyecto. Endurécela o flexibilízala solo para esta funcionalidad, con justificación explícita.

**Paso 2 — Agrupa las reglas por categoría.**
Tecnologías, seguridad, datos, operaciones, proceso y cumplimiento normativo.

**Paso 3 — Haz verificable cada regla.**
«Utiliza Java 21» es verificable (`mvnw --version`); «utiliza Java moderno» no.

**Paso 4 — Numera las reglas.**
`C1`, `C2`, … para que quienes revisan puedan citarlas.

**Paso 5 — Expresa la consecuencia.**
«La compilación falla», «PR rechazada» o «se requiere una excepción de InfoSec»; nunca silencio.

**Paso 6 — Marca mutable o inmutable.**
Algunas reglas se flexibilizan mediante un ADR con aprobación de InfoSec; otras requieren una nueva constitución.

**Paso 7 — Fecha, versiona y firma.**
Registra la fecha del foro, las personas aprobadoras identificadas y la versión `1.0.0`. Incrementa la versión solo cuando cambie la propia constitución.

Limítala a reglas, no principios, y mantenla por debajo de 80 líneas. Un compromiso de diseño específico corresponde a un ADR mediante `/create-adr`, no a una regla de la constitución.

## Ejemplo de invocación

```
/create-constitution feature=001-pagamento-beneficio
```
