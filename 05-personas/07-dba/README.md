# DBA — Kit de Copilot

> **Ruta:** [Kit del equipo](../../README.md) › [Personas](../OVERVIEW.md) › **DBA**

**Kit de referencia para la persona DBA en la inmersión de modernización de SIFAP.**

![Persona](https://img.shields.io/badge/Persona-DBA-171717?style=flat-square) ![Pareja 4](https://img.shields.io/badge/Par-4%20%C2%B7%20Qualidade-404040?style=flat-square) ![Etapa 3](https://img.shields.io/badge/Est%C3%A1gio-3%20%C2%B7%20Implementa%C3%A7%C3%A3o-737373?style=flat-square)

| Campo | Valor |
|---|---|
| **Público objetivo** | Quien asume la persona DBA en la inmersión |
| **Enfoque** | Modelado de datos, migraciones Flyway, optimización de consultas y auditoría de inyección SQL |
| **Fase del SDLC** | Etapa 3 — Implementación (esquema + migraciones) |
| **Resultado esperado** | Esquema PostgreSQL 16 coherente con las entidades JPA y los datos iniciales de prueba |

Lee primero: [PERSONA.md](PERSONA.md).

---

## Concepto

El DBA (Administrador de Bases de Datos) es responsable de la capa de datos de SIFAP 2.0. En la modernización del legado, esto significa traducir los 4 DDM de Adabas —con sus campos MU (multivalor) y PE (periódicos)— a un esquema relacional normalizado de PostgreSQL 16, escribir migraciones Flyway idempotentes y proteger la integridad de los datos durante todo el proyecto.

Por qué importa: el modelo de datos es la base de las entidades JPA del Desarrollador y de la infraestructura aprovisionada por DevOps. Un esquema frágil o unas migraciones irreversibles comprometen toda la Etapa 3.

## Kit de la persona

Todos los artefactos activos residen en el directorio `.github/` de la raíz del repositorio. Esta carpeta es una referencia; edita los archivos de `.github/` cuando necesiten mantenimiento.

| Archivo | Tipo | Propósito |
|---|---|---|
| `PERSONA.md` | Perfil | Responsabilidades, etapas, prompts y rúbricas del DBA |
| `.github/agents/dba.agent.md` | Agente | Modelado de datos, migraciones y auditoría SQL |
| `.github/prompts/persona-dba-migration.prompt.md` | Prompt | `/migration` |
| `.github/prompts/persona-dba-query-audit.prompt.md` | Prompt | `/query-audit` |
| `.github/instructions/database.instructions.md` | Instrucciones | Convenciones de base de datos |

> [!TIP]
> Si la persona facilitadora solicita una configuración MCP local y este kit tiene `mcp.json`, copia solo ese archivo a `.vscode/mcp.json`.

## Dónde residen los artefactos activos

- Agentes: `.github/agents/`
- Prompts: `.github/prompts/persona-*.prompt.md`
- Skills: `.github/skills/`
- Instrucciones: `.github/instructions/`

## Prácticas recomendadas

- [ ] **Mide el impacto de los índices en ambas direcciones.** Los índices aceleran las lecturas y ralentizan las escrituras; mide ambas antes de crear uno.
- [ ] **Usa expand-contract para las migraciones.** Los cambios de esquema deben mantener la compatibilidad durante al menos dos despliegues consecutivos.
- [ ] **Detecta las consultas N+1 antes de staging.** Son errores de rendimiento, no mejoras opcionales.
- [ ] **Valida las copias de seguridad restaurándolas.** Una copia que nunca se ha restaurado no es confiable.

## Ejemplo de SIFAP

En la Etapa 1, el DBA lee el DDM `SIFAP-BEN.ddm` y mapea los campos MU de beneficiarios a posibles tablas relacionadas. En la Etapa 3, escribe `V2__create_beneficiarios.sql` con Flyway, define índices para los campos usados en cláusulas `WHERE` de consultas críticas del ciclo mensual y carga `src/test/resources/seed.sql` para las pruebas de integración del Ingeniero de Calidad.

## Referencias

- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Use the Index, Luke — Markus Winand](https://use-the-index-luke.com/)
- [High Performance MySQL / PostgreSQL — Schwartz et al.](https://www.oreilly.com/)
- [Prácticas recomendadas de Azure Database for PostgreSQL](https://learn.microsoft.com/azure/postgresql/)

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Descripción general de las personas](../OVERVIEW.md)<br/><sub>Tabla de las 10 personas y sus parejas.</sub> | [PERSONA.md](PERSONA.md)<br/><sub>Perfil completo de la persona DBA.</sub> |

<sub>[Volver al índice del kit](../../README.md)</sub>
