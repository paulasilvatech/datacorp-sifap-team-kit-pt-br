# Glosario del SIFAP heredado

> **Ruta:** [Kit del equipo](../README.md) › [Etapa 1](README.md) › **Glosario**

**Artefacto que completa el equipo durante la Etapa 1.** Tabla de todos los términos, abreviaturas y siglas encontrados en el código Natural/Adabas: la base del lenguaje ubicuo para la Etapa 2.

| Campo | Valor |
|---|---|
| **Público objetivo** | Todas las parejas: cada una aporta términos de sus programas |
| **Prerrequisitos** | Abrir los archivos `.NSN` y `.ddm` asignados |
| **Etapa** | Etapa 1 — Arqueología |
| **Resultado esperado** | 30 o más términos con un programa de origen y estado CONFIRMED/HYPOTHESIS |

> [!NOTE]
> Guía paso a paso: [`GUIDE.md`](GUIDE.md).

---

## Por qué importa el glosario

Los sistemas heredados tienen su propio vocabulario, que rara vez está documentado en un lugar accesible: vive en los nombres de variables, las abreviaturas de campos y los comentarios del código. Si el equipo de la Etapa 2 no sabe qué significan `DSCT`, `BENF`, `PE` o `CTC`, escribirá una especificación basada en suposiciones sobre esos términos.

El glosario convierte las abreviaturas de 3 a 6 caracteres en un lenguaje ubicuo compartido por todo el equipo y proporciona la base para los nombres de entidades y atributos del modelo de dominio de la Etapa 3.

**Error común:** marcar un término como CONFIRMED sin evidencia literal en el código o en la documentación histórica. Si inferiste el significado a partir del contexto, márcalo como HYPOTHESIS e identifica a la persona responsable de la validación.

---

## Cómo completarlo

| Columna | Qué registrar |
|---|---|
| **Término** | La abreviatura o sigla exactamente como aparece en el código. |
| **Significado completo** | El significado completo del término. |
| **Programa** | El archivo `.NSN` o `.ddm` donde se encontró el término. |
| **Contexto** | Breve explicación de cómo y dónde se usa el término. |
| **Estado** | `CONFIRMED`: evidencia literal en el código o la documentación. `HYPOTHESIS`: inferido a partir del contexto y pendiente de validación. |

### Consejo para la extracción con Copilot Chat

Antes de usar el siguiente prompt, pega el contenido de 2 a 3 archivos `.NSN` en el chat:

> "Enumera todas las abreviaturas y siglas usadas en este código Natural. Para cada una, sugiere el significado completo y márcala como 'CONFIRMED' o 'HYPOTHESIS'."

Compara la sugerencia de Copilot con lo que observaste directamente en el código. Si coinciden, regístralo como CONFIRMED; de lo contrario, regístralo como HYPOTHESIS.

---

## Términos encontrados

| # | Término | Significado completo | Programa | Contexto | Estado |
|---|---|---|---|---|---|
| 1 | <!-- completar --> | <!-- completar --> | <!-- completar --> | <!-- completar --> | <!-- completar --> |
| 2 | <!-- completar --> | <!-- completar --> | <!-- completar --> | <!-- completar --> | <!-- completar --> |
| 3 | <!-- completar --> | <!-- completar --> | <!-- completar --> | <!-- completar --> | <!-- completar --> |

> [!NOTE]
> Organiza por dominio (registro, cálculo, batch, validación) si facilita la navegación. Añade tantas filas como sea necesario: el objetivo es llegar a 30 o más términos.

---

## Definición de terminado

- [ ] 30 o más términos registrados.
- [ ] Cada término tiene un programa de origen.
- [ ] Cada término tiene el estado CONFIRMED o HYPOTHESIS.
- [ ] Hipótesis señaladas para validarlas con una persona facilitadora.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [GUÍA de la Etapa 1](GUIDE.md)<br/><sub>Cronograma paso a paso.</sub> | [Informe de descubrimiento](discovery-report.md)<br/><sub>Consolidación final de la etapa.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
