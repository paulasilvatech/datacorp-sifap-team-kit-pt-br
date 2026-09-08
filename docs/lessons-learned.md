# Lecciones aprendidas — Errores comunes de los equipos

![Tipo: referencia](https://img.shields.io/badge/Type-Reference-171717?style=flat-square)
![Lectura de 5 min](https://img.shields.io/badge/Read-5%20min-737373?style=flat-square)

> **Ruta:** [Kit del equipo](../README.md) › [Documentación](README.md) › **Lecciones aprendidas**

**Registro de los diez errores más comunes observados en equipos anteriores**, con sus consecuencias y medidas correctivas.

| Campo | Valor |
|---|---|
| **Público objetivo** | Todo el equipo, especialmente el Líder Técnico |
| **Cuándo leerlo** | Antes de que empiece la inmersión |
| **Resultado esperado** | Reconocer patrones de fallo y conocer la solución antes de necesitarla |

---

## Los diez errores más comunes

### 1. "No necesitamos inspeccionar el sistema heredado: basta con el resumen del proyecto"

- **Consecuencia:** el equipo escribe EARS sin `source_legacy:`. La CI rechaza la pull request a las 14:30. El equipo pierde una hora rehaciendo el trabajo.
- **Solución:** aplica la puerta obligatoria de la Etapa 1: la persona facilitadora la valida a las 13:50. Consulta [`01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md`](../01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md).

### 2. "Empezaré a programar mientras otra persona escribe la especificación"

- **Consecuencia:** el código no coincide con los requisitos EARS. La refactorización llega al final del día. La demostración queda incompleta.
- **Solución:** la Etapa 3 empieza solo después de la transición H2. El Líder Técnico detiene los intentos de adelantarse.

### 3. El Responsable de Producto aprueba todo y nada queda fuera del alcance

- **Consecuencia:** el equipo intenta implementar 12 funcionalidades en tres horas y no completa ninguna.
- **Solución:** el Responsable de Producto rechaza solicitudes al menos tres veces durante el día. Regla de decisión: _"¿Afecta al ciclo mensual de pagos? Sí → v1. No → backlog."_

### 4. Cada integrante usa Copilot de una manera diferente

- **Consecuencia:** las respuestas son incoherentes. El equipo debate con el asistente en lugar de producir artefactos.
- **Solución:** todo el equipo selecciona el mismo agente de etapa (`@archaeologist`, `@architect`, etc.) en el chat.

### 5. Omitir `/speckit.clarify` para ahorrar tiempo

- **Consecuencia:** las ambigüedades se convierten en errores en la Etapa 3. Treinta minutos de preguntas ahora evitan dos horas de trabajo repetido después.
- **Solución:** cada pregunta de `clarify` representa un error evitado. Respóndelas todas.

### 6. Ejecutar `git push --force` en `develop`

- **Consecuencia:** se pierde el trabajo de dos personas sin una vía sencilla de recuperación.
- **Solución:** protege `develop` (Paso 4 de `00-SETUP.md`). Nunca uses `--force` en una rama compartida.

### 7. Editar una migración antigua en lugar de crear una nueva

- **Consecuencia:** Flyway detecta una discrepancia de checksum y la base de datos deja de iniciarse.
- **Solución:** nunca edites un archivo de migración ya aplicado. Crea siempre `V<N+1>__description.sql`. Consulta [`docs/troubleshooting.md`](troubleshooting.md).

### 8. Delegar una Issue vaga a Copilot Agent

- **Consecuencia:** la pull request generada no se puede usar y se descarta el trabajo.
- **Solución:** vincula la Issue a la evidencia y escribe criterios de aceptación verificables antes de delegar. Una Issue bien escrita produce una pull request utilizable.

### 9. Ejecutar `terraform apply` en lugar de `plan`

- **Consecuencia:** se crean recursos de Azure y se facturan de inmediato. La inmersión no autoriza `apply`.
- **Solución:** ejecuta solo `terraform plan`. Consulta [`04-evolution/GUIDE.md`](../04-evolution/GUIDE.md).

### 10. No ensayar la demostración

- **Consecuencia:** el equipo dedica sus tres minutos de demostración a buscar la pestaña correcta, un comando que falla o una pull request perdida.
- **Solución:** el horario 16:50–17:00 está reservado para ensayar. Usa [`demo-script.md`](demo-script.md).

---

## Cinco hábitos que distinguen a los buenos equipos de los excelentes

1. **Reunión breve de dos minutos** al final de cada etapa: todos conocen el estado actual.
2. **Cada pull request tiene una descripción**: usa la plantilla de GitHub.
3. **Los commits pequeños incluyen un REQ-ID** en el mensaje.
4. **La regla de los 20 minutos**: ¿no puedes avanzar? Pide ayuda. No luches en silencio.
5. **Confía en el proceso**: no inventes un flujo diferente a mitad del día.

---

## La regla fundamental

> **La modernización es arqueología digital, no un proyecto greenfield.**
> Un equipo que trate SIFAP como un sistema nuevo pierde 29 años de reglas de negocio.
> Un equipo que primero haga arqueología entrega un SIFAP 2.0 que realmente puede reemplazar la versión 1.0.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Lista de verificación del líder](CHECKLIST-LIDER.md)<br/><sub>Comprobaciones hora por hora para el día.</sub> | [Guion de la demo](demo-script.md)<br/><sub>Guion para los minutos finales.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
