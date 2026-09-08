# Desarrollador — Kit de Copilot

> **Ruta:** [Kit del equipo](../../README.md) › [Personas](../OVERVIEW.md) › **Desarrollador**

**Kit de referencia para la persona Desarrollador en la inmersión de modernización de SIFAP.**

![Persona](https://img.shields.io/badge/Persona-Developer-171717?style=flat-square) ![Pareja 3](https://img.shields.io/badge/Par-3%20%C2%B7%20Implementa%C3%A7%C3%A3o-404040?style=flat-square) ![Etapa 3](https://img.shields.io/badge/Est%C3%A1gio-3%20%C2%B7%20Implementa%C3%A7%C3%A3o-737373?style=flat-square)

| Campo | Valor |
|---|---|
| **Público objetivo** | Quien asume la persona Desarrollador en la inmersión |
| **Enfoque** | Implementación Java 21 + Next.js 15, TDD y corrección de errores |
| **Fase del SDLC** | Etapa 3 — Implementación; Etapa 4 — Evolución |
| **Resultado esperado** | Backend + frontend de la porción priorizada, con pruebas aprobadas |

Lee primero: [PERSONA.md](PERSONA.md).

---

## Concepto

El Desarrollador transforma las especificaciones EARS en código ejecutable. En la modernización de SIFAP (Sistema de Fiscalización y Administración de Pagos), esta persona traduce programas Natural y modelos DDM/Adabas a Java 21 con Spring Boot 3.3, JPA/Hibernate y PostgreSQL 16, e implementa también el frontend en Next.js 15 con TypeScript.

Por qué importa: sin el Desarrollador, los requisitos siguen siendo texto. Esta persona convierte la prueba de concepto en software probado y listo para integrarse.

## Kit de la persona

Todos los artefactos activos residen en el directorio `.github/` de la raíz del repositorio. Esta carpeta es una referencia; edita los archivos de `.github/` cuando necesiten mantenimiento.

| Archivo | Tipo | Propósito |
|---|---|---|
| `PERSONA.md` | Perfil | Responsabilidades, etapas, prompts y rúbricas del Desarrollador |
| `.github/agents/implementer.agent.md` | Agente | Implementación, TDD y corrección de errores |
| `.github/prompts/persona-developer-implement.prompt.md` | Prompt | `/implement` |
| `.github/prompts/persona-developer-fix-bug.prompt.md` | Prompt | `/fix-bug` |
| `.github/prompts/persona-developer-tdd.prompt.md` | Prompt | `/tdd` |
| `.github/prompts/persona-developer-refactor.prompt.md` | Prompt | `/refactor` |

> [!TIP]
> Si la persona facilitadora solicita una configuración MCP local y este kit tiene `mcp.json`, copia solo ese archivo a `.vscode/mcp.json`.

## Dónde residen los artefactos activos

- Agentes: `.github/agents/`
- Prompts: `.github/prompts/persona-*.prompt.md`
- Skills: `.github/skills/`
- Instrucciones: `.github/instructions/`

## Prácticas recomendadas

- [ ] **Escribe las pruebas antes del código o junto con él.** Cuando el diseño esté claro, escribe primero la prueba. Cada commit incluye pruebas.
- [ ] **Mantén pequeñas las PR.** Un tema por PR, revisable en unos 20 minutos.
- [ ] **Separa la refactorización de los cambios de comportamiento.** Usa commits distintos para cada intención.
- [ ] **Comenta el porqué, no el qué.** El código describe lo que hace; el comentario explica la razón.

## Ejemplo de SIFAP

En la Etapa 3, el Desarrollador recibe los REQ-ID del Especialista en Requisitos y la estructura de paquetes del Arquitecto de Software. La tarea concreta es, por ejemplo, implementar el endpoint `POST /api/v1/beneficios` según las reglas extraídas del programa Natural `SIFAP-BEN.NSN`, con pruebas de integración de Testcontainers sobre el esquema generado por las migraciones Flyway del DBA.

## Referencias

- [Clean Code — Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
- [Refactoring — Martin Fowler](https://refactoring.com/)
- [Test-Driven Development — Kent Beck](https://www.oreilly.com/library/view/test-driven-development/0321146530/)
- [Prácticas recomendadas de GitHub Copilot](https://docs.github.com/en/copilot)

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Descripción general de las personas](../OVERVIEW.md)<br/><sub>Tabla de las 10 personas y sus parejas.</sub> | [PERSONA.md](PERSONA.md)<br/><sub>Perfil completo de la persona Desarrollador.</sub> |

<sub>[Volver al índice del kit](../../README.md)</sub>
