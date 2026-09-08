# Etapa 1 — Arqueología

> **Ruta:** [Kit del equipo](../README.md) › **Etapa 1 — Arqueología**

**Descripción general de la Etapa 1.** Lee esta página antes de abrir la GUÍA; presenta el objetivo, los artefactos esperados y los participantes.

| Campo | Valor |
|---|---|
| **Público objetivo** | Las 5 parejas del equipo |
| **Prerrequisitos** | Ninguno: este es el punto de partida |
| **Tiempo estimado** | 90 min (11:00–12:00 + 13:30–14:00) |
| **Etapa** | Etapa 1 — Arqueología |
| **Resultado esperado** | Catálogo de reglas, mapa de dependencias, glosario e informe de descubrimiento |

![Etapa 1](https://img.shields.io/badge/Stage-1%20%C2%B7%20Archaeology-171717?style=flat-square) ![Puerta obligatoria](https://img.shields.io/badge/Gate-Hard%20Gate-404040?style=flat-square) ![Todas las parejas en paralelo](https://img.shields.io/badge/Pairs-All%20in%20parallel-737373?style=flat-square)

> [!IMPORTANT]
> **Lee primero:** [`LEGACY-EXPLORATION-CHECKLIST.md`](LEGACY-EXPLORATION-CHECKLIST.md) — puerta obligatoria antes de iniciar la Etapa 2. No se acepta ningún requisito EARS sin trazabilidad al código heredado.

> [!TIP]
> **El sistema está en ejecución, no solo archivado.** Los mismos datos que vas a estudiar pueden consultarse desde el terminal del visor compartido en <https://sifap-lab-438k30.eastus2.cloudapp.azure.com/terminal/>. Inicia sesión como `viewer` con la contraseña que la persona facilitadora comparte en privado. Leer el código fuente sigue siendo la puerta de entrada; la pantalla en vivo solo hace tangible la evidencia.

---

## Qué es la Etapa 1

La **arqueología de software** es la práctica de extraer conocimiento de sistemas heredados mediante la lectura sistemática del código fuente sin modificarlo. En esta inmersión, la arqueología tiene un objetivo preciso: reunir suficiente evidencia para escribir requisitos trazables en la Etapa 2.

SIFAP, el Sistema de Fiscalización y Administración de Pagos, lleva 29 años en funcionamiento. La mayor parte del conocimiento sobre sus reglas de negocio está en el código Natural, no en la documentación. Sin leer el código, el equipo escribiría especificaciones basadas en suposiciones, algo que la CI rechaza porque exige un `source_legacy:` válido.

---

## Dónde encaja en el flujo de la inmersión

![Cronograma del día: preparación previa, 4 etapas y demo, con las tres transiciones H1, H2 y H3](../assets/timeline-stages.svg)

---

## Quién trabaja aquí

Las 5 parejas trabajan en paralelo, cada una responsable de 3 programas Natural. La Pareja 1 (Visión) lidera la síntesis al final de la etapa. Consulta la asignación completa en [`GUIDE.md`](GUIDE.md).

---

## Artefactos de la Etapa 1

| Archivo | Propósito |
|---|---|
| [`LEGACY-EXPLORATION-CHECKLIST.md`](LEGACY-EXPLORATION-CHECKLIST.md) | **Puerta obligatoria.** Responsabilidad de los programas por pareja y criterios de finalización antes de la Etapa 2. |
| [`GUIDE.md`](GUIDE.md) | Guía paso a paso con un cronograma. |
| [`glossary.md`](glossary.md) | Glosario de términos y abreviaturas del dominio SIFAP. |
| [`business-rules-catalog.md`](business-rules-catalog.md) | Catálogo de reglas de negocio extraídas con `Programa de origen` obligatorio. |
| [`dependency-map.md`](dependency-map.md) | Mapa de dependencias entre programas y DDM. |
| [`discovery-report.md`](discovery-report.md) | Informe de descubrimiento que consolida la evidencia de la etapa. |
| [`mysteries-checklist.md`](mysteries-checklist.md) | Lista de verificación de trazabilidad para preguntas abiertas. |
| [`mysteries-found.md`](mysteries-found.md) | Registro detallado de preguntas abiertas con evidencia y persona responsable. |

El código heredado está en [`legacy-sifap/`](legacy-sifap/) (compartido por el kit).

El laboratorio compartido de Azure se opera fuera de este repositorio. Los participantes no reciben material de despliegue ni administración; usa el visor de solo lectura descrito en [`docs/legacy-system-access.md`](../docs/legacy-system-access.md).

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Kit del equipo](../README.md)<br/><sub>Centro principal del repositorio.</sub> | [GUÍA de la Etapa 1](GUIDE.md)<br/><sub>Cronograma de 90 minutos para leer el sistema heredado y catalogar reglas.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
