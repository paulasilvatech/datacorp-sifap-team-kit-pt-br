# Lista de verificación de exploración del legado

> **Ruta:** [Kit del equipo](../README.md) › [Etapa 1](README.md) › **Lista de verificación de exploración**

**Puerta obligatoria antes de la Etapa 2.** Esta lista de verificación garantiza que cada pareja leyó sus programas asignados y que las reglas candidatas son trazables al código heredado.

| Campo | Valor |
|---|---|
| **Público objetivo** | Todas las parejas: completar durante la Etapa 1 |
| **Prerrequisitos** | Acceso a `legacy-sifap/natural-programs/` y `adabas-ddms/` |
| **Tiempo estimado** | Se completa a lo largo de los 90 minutos |
| **Etapa** | Etapa 1 — Arqueología |
| **Resultado esperado** | Matriz de lectura completa por pareja y criterios de finalización verificados |

> [!IMPORTANT]
> **Puerta obligatoria antes de la Etapa 2.** No se acepta ningún requisito EARS sin una referencia a un programa Natural o archivo DDM. Los requisitos greenfield (sin equivalente en el legado) deben marcarse como `[GREENFIELD]` y justificarse por escrito en la especificación.

> [!WARNING]
> En la edición anterior de la inmersión, varios equipos omitieron la exploración del legado y escribieron especificaciones basadas solo en el resumen de modernización. El resultado fueron especificaciones que no preservaban las reglas de negocio reales de los 29 años de SIFAP como Sistema de Fiscalización y Administración de Pagos. Esta puerta es obligatoria.

---

## 1. La regla de trazabilidad

Cada `REQ-ID` de `specs/<NNN>-<feature>/spec.md` debe tener una línea `source_legacy:` que apunte a uno de los siguientes elementos:

- un programa `.NSN` específico en `01-archaeology/legacy-sifap/natural-programs/` (preferiblemente con un rango de líneas);
- un archivo `.ddm` específico en `01-archaeology/legacy-sifap/adabas-ddms/`;
- `[GREENFIELD]` con una justificación de una línea.

La CI rechaza las PR hacia `develop` si algún `REQ-ID` carece de una línea `source_legacy:`. Las personas facilitadoras realizan verificaciones por muestreo durante la transición H2 a las 15:00.

---

## 2. Los 15 programas Natural: quién lee qué

Cada pareja recibe 3 programas. Ningún programa puede quedarse sin alguien que lo lea.

| Pareja | Programas que debe leer | Misterios | Motivo |
|---|---|---|---|
| **1 · Visión** (PO + RE) | `CADBENEF.NSP`, `CADDEPEN.NSP`, `CADPROG.NSP` | `SIFAP-M-01` … `M-04` | Lógica de registro: entidades centrales que se convierten en sujetos EARS. |
| **2 · Arquitectura** (EA + SA) | `BATCHPGT.NSP`, `BATCHREL.NSP`, `BATCHCON.NSP` | `SIFAP-M-05` … `M-08` | Los flujos batch revelan los límites de los módulos (contextos delimitados). |
| **3 · Implementación** (TL + Dev) | `CALCBENF.NSN`, `CALCCORR.NSP`, `CALCDSCT.NSP`\* | `SIFAP-M-09` … `M-12` | Los cálculos son donde residirá el código moderno; el equipo debe reproducirlos. |
| **4 · Calidad** (DBA + QA) | `VALBENEF.NSN`, `VALDOCS.NSP`, `VALELEG.NSN` | `SIFAP-M-13` … `M-16` | Las validaciones se convierten en pruebas; el DBA también mapea los campos DDM. |
| **5 · Operaciones** (DevOps + TW) | `CONSBENF.NSP`, `RELPGT.NSP`, `RELAUDIT.NSP` | `SIFAP-M-17` … `M-20` | Las rutas de lectura alimentan el glosario y el runbook. |

\* `CALCDSCT.NSP` es **lectura de apoyo** para la Pareja 3: no contiene ningún misterio canónico. Aun así, vale la pena preguntar por qué existe y quién lo llama.

> [!IMPORTANT]
> **Hay 20 misterios canónicos, 4 por pareja**: esta es la única meta numérica de la Etapa 1. Los ID y las áreas están en [`mysteries-checklist.md`](mysteries-checklist.md); regístralos en [`mysteries-found.md`](mysteries-found.md). Los hallazgos fuera de la lista cuentan como adicionales y **no** cambian el denominador.

### Lista de verificación para cada programa

Para cada programa asignado a tu pareja, registra suficientes notas de lectura para confirmar que se examinó:

- [ ] **Identificar el programa.** Registrar su nombre, autor y año de la última modificación.
- [ ] **Mapear las entradas.** Qué DDM lee.
- [ ] **Mapear las salidas.** En qué DDM escribe.
- [ ] **Registrar las llamadas.** Otros programas llamados mediante `CALLNAT`.
- [ ] **Catalogar las reglas candidatas.** Cuando el programa contenga una regla relevante para el alcance, registrarla en `business-rules-catalog.md` con el `Programa de origen` y un rango de líneas.

> [!WARNING]
> Una fila sin `Programa de origen` no puede sustentar un requisito EARS.

---

## 3. Los 4 DDM: mapeo de campos

La Pareja 4 (DBA + QA) lidera. Todas las demás parejas contribuyen con revisiones.

| DDM | Responsable | Artefacto de destino en PostgreSQL |
|---|---|---|
| `BENEFIC.ddm` | Pareja 4 | <!-- definir a partir de la evidencia --> |
| `PAYMENT.ddm` | Pareja 4 | <!-- definir a partir de la evidencia --> |
| `SOCPROG.ddm` | Pareja 4 | <!-- definir a partir de la evidencia --> |
| `AUDIT.ddm` | Pareja 4 | <!-- definir a partir de la evidencia --> |

Revisa los DDM necesarios para la funcionalidad seleccionada. El mapeo completo a PostgreSQL corresponde a la planificación y la implementación; no es un prerrequisito para iniciar la especificación.

---

## 4. Registro de preguntas abiertas

Usa [`mysteries-checklist.md`](mysteries-checklist.md) para registrar preguntas abiertas sin anticipar respuestas. El registro es un catálogo de incertidumbres, no una clave de respuestas ni una fuente de reglas.

Registra en `mysteries-found.md` solo las preguntas que afecten al alcance. Cada registro debe incluir:

| Campo | Descripción |
|---|---|
| Pregunta abierta | Texto de la pregunta sin una conclusión |
| Evidencia | `path:line` |
| Impacto | Efecto sobre el alcance |
| Hipótesis | Marcada explícitamente como sin confirmar |
| Responsable | Persona o área que puede validar |
| Estado | `open` / `awaiting human validation` / `closed after human validation` |

Una pregunta solo puede cerrarse o usarse como base de una regla después de una validación humana explícita respaldada por la evidencia registrada.

---

## 5. Verificación antes de iniciar la Etapa 2

Aproximadamente a las 13:50, una persona facilitadora verifica el trabajo de la pareja con esta matriz. Una línea roja bloquea el avance a la Etapa 2.

| Verificación | Criterio de la puerta |
|---|---|
| Lectura asignada | Cada pareja confirmó la lectura de los tres programas que recibió. |
| Catálogo de reglas | Cada regla candidata dentro del alcance tiene un `Programa de origen` no vacío. |
| Alcance | El informe de descubrimiento identifica una funcionalidad pequeña y lo que se pospuso. |
| Preguntas abiertas | Se registraron las incertidumbres relevantes sin convertirlas en requisitos. |

---

## 6. Formato obligatorio de la Etapa 2

Escribe EARS solo en `specs/<NNN>-<feature>/spec.md` con Spec-Kit. Cada `REQ-ID` necesita un patrón EARS, criterios Given/When/Then y `source_legacy:`. No completes ningún requisito hasta que el equipo confirme la fuente o la justificación greenfield.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [GUÍA de la Etapa 1](GUIDE.md)<br/><sub>Cronograma.</sub> | [Plantillas](templates/)<br/><sub>Plantillas para completar los artefactos de la etapa.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
