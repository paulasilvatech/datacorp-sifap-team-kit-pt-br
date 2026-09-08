# Etapa 1 — Arqueología digital (90 min)

> **Ruta:** [Kit del equipo](../README.md) › [Etapa 1](README.md) › **GUÍA**

**Cronograma de 90 minutos para leer los programas Natural asignados, registrar evidencia trazable y definir el alcance del prototipo.**

| Campo | Valor |
|---|---|
| **Público objetivo** | Las 5 parejas |
| **Prerrequisitos** | Leer [`README.md`](README.md) y acceder al directorio `legacy-sifap/` |
| **Tiempo estimado** | 90 min (11:00–12:00 + 13:30–14:00) |
| **Etapa** | Etapa 1 — Arqueología |
| **Resultado esperado** | Catálogo de reglas candidatas, informe de descubrimiento y transición H1 completada |

> [!IMPORTANT]
> **Puerta obligatoria.** Antes de escribir EARS en la Etapa 2, la pareja debe haber leído los programas Natural asignados y contar con evidencia de cada comportamiento seleccionado. Cada requisito formal posterior necesita un `source_legacy:` válido o `[GREENFIELD]` con justificación. La puerta no es una meta de cantidad.

---

## Objetivo

Leer los programas Natural asignados, registrar evidencia trazable y elegir un alcance pequeño que pueda convertirse en una funcionalidad. El objetivo no es explicar todo SIFAP, el Sistema de Fiscalización y Administración de Pagos, completar documentación enciclopédica ni resolver misterios.

---

## Cronograma

| Horario | Actividad | Resultado mínimo |
|---|---|---|
| 11:00–11:10 | Abrir los tres programas asignados a la pareja y acordar quién lee cada uno. | Cobertura de programas y nombres de quienes los leen. |
| 11:10–11:40 | Lectura guiada: entradas, salidas, llamadas y decisiones del dominio. | Notas con rutas y rangos de líneas. |
| 11:40–12:00 | Registrar reglas candidatas y preguntas sin inferir comportamientos ausentes. | Evidencia en el catálogo y asuntos abiertos explícitos. |
| 13:30–13:45 | Consolidar solo la evidencia que sustenta el alcance del prototipo. | Catálogo e informe de descubrimiento actualizados. |
| 13:45–13:55 | El PO prioriza **una funcionalidad acotada**; el equipo descarta o pospone el resto. | Decisión de alcance para la Etapa 2. |
| 13:55–14:00 | Transición H1 con la Pareja 2. | Fuentes, alcance y preguntas transferidos en vivo. |

---

## Quién lee qué

Cada pareja lee los tres programas siguientes. La lectura puede centrarse en las decisiones del dominio; no intentes traducir cada instrucción Natural durante este paso.

| Pareja | Programas |
|---|---|
| 1 · Visión | `CADBENEF.NSP`, `CADDEPEN.NSP`, `CADPROG.NSP` |
| 2 · Arquitectura | `BATCHPGT.NSP`, `BATCHREL.NSP`, `BATCHCON.NSP` |
| 3 · Implementación | `CALCBENF.NSN`, `CALCCORR.NSP`, `CALCDSCT.NSP` |
| 4 · Calidad | `VALBENEF.NSN`, `VALDOCS.NSP`, `VALELEG.NSN` |
| 5 · Operaciones | `CONSBENF.NSP`, `RELPGT.NSP`, `RELAUDIT.NSP` |

La Pareja 4 también revisa los DDM necesarios para la funcionalidad seleccionada. Mapear todos los campos o proponer el esquema completo no es obligatorio en esta etapa.

---

## Qué registrar

Usa las [plantillas](templates/) como apoyo. Para cada regla candidata dentro del alcance, registra al menos:

- una breve descripción del comportamiento observado;
- la ruta `.NSN` o `.ddm` y, cuando sea posible, el rango de líneas;
- la pregunta que aún impide llegar a una conclusión, sin convertirla en un requisito;
- el impacto de la regla en la funcionalidad priorizada.

`business-rules-catalog.md` es la entrada de la especificación formal; usa la [plantilla del catálogo](templates/business-rules-catalog.template.md) si el archivo todavía no existe. El glosario, el mapa de dependencias y el registro de misterios pueden enriquecerse si ayudan al alcance, pero las metas numéricas no bloquean la transición.

> [!IMPORTANT]
> **Excepción: los misterios tienen un denominador fijo.** SIFAP contiene **20 misterios canónicos**, **4 por pareja**. Esta es la única meta numérica de la Etapa 1, porque sin ella cada pareja informaba una cantidad diferente después de leer el mismo material. Consulta los ID de tu pareja en [`mysteries-checklist.md`](mysteries-checklist.md) y regístralos en [`mysteries-found.md`](mysteries-found.md). Los hallazgos fuera de la lista son adicionales y no cambian el denominador.

---

## Transición H1

En cinco minutos, la Pareja 1 entrega lo siguiente a la Pareja 2:

1. la funcionalidad acotada seleccionada y lo que queda fuera del alcance;
2. las reglas que pueden convertirse en requisitos, con rutas del legado;
3. las preguntas abiertas que **no deben** convertirse en EARS;
4. las referencias a DDM y dependencias solo cuando afecten a la funcionalidad.

La Pareja 2 confirma que recibió suficiente evidencia para iniciar `specs/<NNN>-<feature>/spec.md`. Si no es así, el equipo reduce el alcance; no inventa una fuente.

---

## Definición de terminado

- [ ] Se leyeron los tres programas asignados a cada pareja.
- [ ] El comportamiento seleccionado tiene evidencia en `.NSN` o `.ddm`, o se separó explícitamente como una propuesta greenfield.
- [ ] El catálogo identifica la fuente de cada regla candidata.
- [ ] El informe de descubrimiento registra el alcance y las preguntas relevantes.
- [ ] La transición H1 se realizó antes de las 14:00.

---

## Referencias

- [Lista de verificación de exploración](LEGACY-EXPLORATION-CHECKLIST.md): verificación de la puerta y criterios por pareja.
- [Guía de la Etapa 2](../02-modern-spec/GUIDE.md): siguiente paso después de la transición H1.
- [Cómo leer Natural](legacy-sifap/HOW-TO-READ-NATURAL.md): tutorial de sintaxis para quienes no desarrollan software.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Etapa 1 — README](README.md)<br/><sub>Descripción general de la etapa.</sub> | [Lista de verificación de exploración](LEGACY-EXPLORATION-CHECKLIST.md)<br/><sub>Puerta obligatoria antes de la Etapa 2.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
