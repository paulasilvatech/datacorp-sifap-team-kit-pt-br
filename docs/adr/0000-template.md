<!-- markdownlint-disable MD024 -->

# ADR-NNNN: título breve y concluyente

> **Ruta:** [Kit del equipo](../../README.md) › [Documentación](../README.md) › [ADR](README.md) › **Plantilla**

> [!NOTE]
> Esta es la plantilla de ADR. Copia este archivo a `NNNN-your-title.md`, reemplazando `NNNN` por el siguiente número secuencial, como `0007`. Reemplaza cada bloque de instrucciones con el contenido real de la decisión.

| Campo | Valor |
|---|---|
| **Estado** | propuesto \| aceptado \| obsoleto \| sustituido |
| **Fecha** | YYYY-MM-DD |
| **Autores** | Persona — Nombre |
| **Sustituye a** | ADR-NNNN \| N/A |

---

## Contexto

> [!NOTE]
> Describe el problema que motiva esta decisión. Haz referencia al objetivo de negocio, la restricción del legado o la necesidad de una parte interesada. Sé específico. Cita REQ-ID o programas de `01-archaeology/legacy-sifap/` cuando sea pertinente.

_Completa esta sección._

---

## Decisión

> [!NOTE]
> Expresa el cambio propuesto en voz activa. Usa uno o dos párrafos. Ejemplos: "Adoptaremos …", "No migraremos …".

_Completa esta sección._

---

## Alternativas consideradas

> [!NOTE]
> Enumera al menos dos alternativas. Explica por qué se rechazó cada una.

| Alternativa | Por qué se rechazó |
|---|---|
| Opción A | — |
| Opción B | — |

---

## Consecuencias

> [!NOTE]
> ¿Qué se vuelve más fácil? ¿Qué se vuelve más difícil? ¿Hay riesgos nuevos?

- **Más fácil:** —
- **Más difícil:** —
- **Riesgos:** —
- **Mitigaciones:** —

---

## Relaciones

- REQ-ID: —
- ADR: —
- Archivos fuente del legado: —

---

## Referencias

> [!NOTE]
> Cita documentos, RFC o investigaciones que sirvieron de base para la decisión.

---

<details>
<summary><strong>Ejemplo completado — ADR-0001: adoptar Flyway para las migraciones de base de datos</strong></summary>

| Campo | Valor |
|---|---|
| **Estado** | aceptado |
| **Fecha** | 2026-05-12 |
| **Autores** | DBA — Carla Souza |
| **Sustituye a** | N/A |

### Contexto

El SIFAP heredado usa Adabas, una base de datos no relacional. La modernización adopta PostgreSQL 16. Necesitamos una estrategia controlada de evolución del esquema que registre los cambios, permita recuperarse de errores y se integre con la CI. El programa `SIFAP-PAGTO.NSN` (líneas 45–78) revela que el ciclo mensual de pagos requiere al menos tres transformaciones del esquema a lo largo del tiempo.

### Decisión

Adoptaremos Flyway como herramienta de migración. Cada cambio del esquema estará representado por un archivo `V<N>__description.sql` bajo control de versiones en el repositorio. La CI ejecutará `mvn flyway:migrate` en cada pull request hacia `develop`.

### Alternativas consideradas

| Alternativa | Por qué se rechazó |
|---|---|
| Liquibase | Formato XML más extenso y una curva de aprendizaje más pronunciada para el equipo durante esta inmersión |
| Migraciones manuales | Sin trazabilidad, rollback automatizado ni integración con la CI |

### Consecuencias

- Más fácil: trazabilidad completa de los cambios del esquema; la CI los valida antes de la integración.
- Más difícil: los archivos de migración son inmutables después de integrarlos; cada corrección requiere un archivo nuevo.
- Riesgos: editar accidentalmente una migración aplicada provoca fallos en Flyway.
- Mitigaciones: protección de la rama `develop` y la regla documentada en `troubleshooting.md`.

</details>

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [ADR — Índice](README.md)<br/><sub>Índice de decisiones registradas.</sub> | [Especificación moderna](../../02-modern-spec/GUIDE.md)<br/><sub>Donde se generan los ADR.</sub> |

<sub>[Volver al índice del kit](../../README.md)</sub>
