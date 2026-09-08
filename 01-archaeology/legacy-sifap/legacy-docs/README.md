---

title: "Documentación heredada - SIFAP"
description: "Documentos técnicos históricos del sistema SIFAP original (1997–2012)"
author: "Paula Silva, Software GBB de las Américas, Microsoft"
date: "2026-04-23"
version: "1.0.0"
status: "approved"
tags: ["legacy", "documentation", "sifap", "architecture", "history"]
---

# Documentación heredada — SIFAP

> **Ruta:** [Kit del equipo](../../../README.md) › [Etapa 1](../../README.md) › [SIFAP heredado](../README.md) › **Documentación heredada**

**Documentos técnicos históricos del sistema SIFAP original, que abarcan el período de 1997 a 2012.** Material de referencia de solo lectura para el ejercicio de arqueología de software.

| Campo | Valor |
|---|---|
| **Público objetivo** | Todas las parejas durante la Etapa 1 |
| **Prerrequisitos** | Ninguno |
| **Etapa** | Etapa 1 — Arqueología |
| **Resultado esperado** | Comprender el contexto histórico para contrastarlo con el código fuente |

> [!IMPORTANT]
> Los documentos de esta carpeta son **material de referencia de solo lectura**. Las reglas de negocio documentadas aquí deben contrastarse con los programas Natural para verificar su vigencia: la documentación puede estar desactualizada respecto al código de producción.

---

## Contenido

| Archivo | Año | Descripción |
|---|---|---|
| `ORIGINAL-ARCHITECTURE-1997.md` | 1997 | Documento de arquitectura técnica del proyecto original: la visión planificada antes de empezar a programar |
| `ORIGINAL-ARCHITECTURE-1997.docx` | 1997 | Formato original (Word) |
| `TECHNICAL-MANUAL-SIFAP-2008.md` | 2008 | Manual técnico de operaciones: cubre los módulos de registro y parte de los módulos de cálculo y batch |
| `TECHNICAL-MANUAL-SIFAP-2008.docx` | 2008 | Formato original (Word) |
| `BUSINESS-RULES-2012.md` | 2012 | Levantamiento parcial de reglas de negocio: interrumpido; 47 páginas de un total estimado de más de 200 |
| `BUSINESS-RULES-2012.docx` | 2012 | Formato original (Word) |

---

## Cómo usar estos documentos

Los archivos `.md` son versiones convertidas que facilitan la lectura de los documentos en VS Code y GitHub. Los archivos `.docx` son el formato original.

Al leer los programas Natural, usa estos documentos para:

1. **Confirmar** una regla inferida del código: si el comportamiento coincide con la documentación, clasifícala como `Confirmada` en el catálogo.
2. **Contextualizar** decisiones de arquitectura que parecen arbitrarias en el código: aquí suelen estar registradas las justificaciones técnicas o normativas.
3. **Identificar lagunas**: lo que la documentación describe pero el código no implementa, y viceversa.

> [!WARNING]
> Los módulos de cálculo (`CALCBENF`, `CALCCORR`, `CALCDSCT`) **no tienen documentación formal en esta carpeta**. Las reglas de estos programas existen exclusivamente en el código fuente. No supongas que el comportamiento actual coincide con la documentación de 2008.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [SIFAP heredado — descripción general](../README.md)<br/><sub>Contexto del sistema e inventario completo.</sub> | [Etapa 1 — GUÍA](../../GUIDE.md)<br/><sub>Agenda con horarios de 90 minutos.</sub> |

<sub>[Volver al índice del kit](../../../README.md)</sub>
