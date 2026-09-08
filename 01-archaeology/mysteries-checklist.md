# Lista de verificación de preguntas abiertas — Etapa 1

> **Ruta:** [Kit del equipo](../README.md) › [Etapa 1](README.md) › **Lista de verificación de preguntas abiertas**

**Trazabilidad de las incertidumbres antes de la Etapa 2.** Garantiza que cada pregunta abierta se registre con evidencia, una hipótesis marcada como sin confirmar y una persona responsable identificada.

| Campo | Valor |
|---|---|
| **Público objetivo** | Todas las parejas: completar durante la Etapa 1 |
| **Prerrequisitos** | Leer los programas asignados |
| **Etapa** | Etapa 1 — Arqueología |
| **Resultado esperado** | Lista de preguntas sin conclusiones, con trazabilidad y una persona responsable |

> [!IMPORTANT]
> **Puerta de trazabilidad.** Una pregunta permanece abierta hasta recibir validación humana explícita basada en evidencia. No debe convertirse en una respuesta, regla o requisito sin esa validación.

---

## El denominador es 20

SIFAP, el Sistema de Fiscalización y Administración de Pagos, contiene **20 misterios canónicos**: reglas de negocio, contradicciones y decisiones que nunca se documentaron y existen solo en el código. Hay **4 por pareja**, siguiendo la escala **2 Obvios + 1 Medio + 1 Difícil**.

| Regla | Valor |
|---|---|
| Total de misterios canónicos del grupo | **20** (`SIFAP-M-01` … `SIFAP-M-20`) |
| Por pareja | **4** |
| Pareja completa | 4 de 4 |
| Grupo completo | **≥16 de 20**, sin ninguna pareja por debajo de 2 |

> [!NOTE]
> **Por qué usar un número fijo.** Sin un denominador, cada pareja informaba una cantidad diferente después de leer exactamente el mismo material: una variación de más de 30 elementos según la granularidad de la agrupación y la cantidad de artefactos que abría cada persona. El denominador **no cambia**: los hallazgos fuera de la lista son **adicionales** reconocidos en la puesta en común, pero no reemplazan un misterio canónico faltante, y las personas facilitadoras no crean ID canónicos durante la inmersión.

Ocho de los veinte son **de dos fuentes**: solo cuentan con ambas evidencias (código **y** DDM, o código **y** documento heredado). Comparar fuentes no es opcional.

### Dónde buscar: por pareja

Las etiquetas indican el **área** del misterio, nunca el hallazgo.

| Pareja | Dominio | ID | Programas |
|---|---|---|---|
| 1 | Registro | `M-01` … `M-04` | `CADBENEF`, `CADDEPEN`, `CADPROG` |
| 2 | Batch | `M-05` … `M-08` | `BATCHPGT`, `BATCHREL`, `BATCHCON` |
| 3 | Cálculo | `M-09` … `M-12` | `CALCBENF`, `CALCCORR`, `CALCDSCT`\* |
| 4 | Validación | `M-13` … `M-16` | `VALBENEF`, `VALDOCS`, `VALELEG` |
| 5 | Consultas e informes | `M-17` … `M-20` | `CONSBENF`, `RELPGT`, `RELAUDIT` |

\* `CALCDSCT.NSP` es lectura de apoyo para la Pareja 3: no contiene ningún misterio canónico. Vale la pena preguntar por qué existe.

> [!TIP]
> **Si llevas más de 40 minutos sin avanzar, pide una pista a la persona facilitadora.** Una pista no resta puntos; quedarse bloqueado te deja fuera del ejercicio.

---

## Para cada pregunta abierta

- [ ] La pregunta se registró sin respuesta ni conclusión.
- [ ] La evidencia contiene `path:line`.
- [ ] Se registró el impacto.
- [ ] La hipótesis está marcada explícitamente como **sin confirmar**.
- [ ] Se identificó una persona o área responsable.
- [ ] Se registró el estado.

---

## Estructura del registro

| Pregunta abierta | Evidencia (`path:line`) | Impacto | Hipótesis (sin confirmar) | Persona/área responsable | Estado |
|---|---|---|---|---|---|
| <!-- completar --> | <!-- completar: path:line --> | <!-- completar --> | <!-- completar: sin confirmar --> | <!-- completar --> | <!-- completar: abierta / pendiente de validación humana / cerrada tras validación humana --> |

---

## Tabla de seguimiento de la pareja

Introduce los ID de tu pareja (por ejemplo, la Pareja 2 introduce de `M-05` a `M-08`).

| ID canónico | Encontrado | Registrado en `mysteries-found.md` |
|---|---|---|
| `SIFAP-M-__` | [ ] | [ ] |
| `SIFAP-M-__` | [ ] | [ ] |
| `SIFAP-M-__` | [ ] | [ ] |
| `SIFAP-M-__` | [ ] | [ ] |

**Hallazgos adicionales (bonus):** <!-- enumerar aquí; no cambian el denominador -->

---

## Métodos para encontrar misterios

Ninguno de estos consejos revela un hallazgo: todos son técnicas reutilizables de lectura de código heredado.

1. **Lee los comentarios antes que el código.** En un código de 29 años, los comentarios suelen ser el único lugar donde alguien intentó explicar el *porqué*. Un comentario con nombre y fecha vale oro.
2. **Lee el encabezado del programa.** Líneas como `* CHANGED: yyyy-mm-dd - NAME - reason` cuentan la historia del sistema cronológicamente.
3. **Compara el código con la documentación.** Cuando `legacy-docs/` y el código no coinciden, has encontrado algo.
4. **Compara el código con el DDM.** El tipo, el tamaño y el dominio de valores deben coincidir entre el programa y `adabas-ddms/`, y no siempre lo hacen.
5. **Busca literales numéricos.** Cada número sin explicar en un cálculo plantea preguntas: ¿de dónde salió, quién lo decidió y qué falla si cambia?
6. **Pregunta "¿quién escribe este campo?"** Elige un campo DDM y encuentra todos los programas que escriben en él. A veces la respuesta es: ninguno.
7. **Lee el código comentado.** Los bloques desactivados revelan lo que el sistema hacía antes y por qué dejó de hacerlo.
8. **Desconfía de `ESCAPE`, de `IF` sin `ELSE` y de las asignaciones incondicionales.** Las salidas anticipadas y las reglas que siempre se aplican ocultan decisiones que nadie registró.
9. **Coteja los tres programas de la pareja.** Varios misterios solo aparecen al comparar dos archivos.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [GUÍA de la Etapa 1](GUIDE.md)<br/><sub>Cronograma paso a paso.</sub> | [Registro de preguntas abiertas](mysteries-found.md)<br/><sub>Registro detallado con evidencia y persona responsable.</sub> |

<sub>[Volver al índice del kit](README.md)</sub>
