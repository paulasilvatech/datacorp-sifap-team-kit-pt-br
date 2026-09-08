# database-data-management

Habilidades de revisión de código y optimización de PostgreSQL.

## Qué incluye este complemento

| Componente | Tipo | Ubicación |
|-----------|------|----------|
| `postgresql-code-review` | Habilidad | [`.github/skills/postgresql-code-review/`](../../skills/postgresql-code-review/) |
| `postgresql-optimization` | Habilidad | [`.github/skills/postgresql-optimization/`](../../skills/postgresql-optimization/) |

PostgreSQL 16 es la base de datos de destino del kit, por lo que solo se
incluyen las habilidades de PostgreSQL.

## Contenido relacionado del kit

La inmersión mantiene un agente de persona [`dba`](../../agents/dba.agent.md) y una
habilidad [`query-optimization`](../../skills/query-optimization/). Son
artefactos propios del kit, no versiones de `postgresql-dba` o
`sql-optimization` del proyecto de origen con un mero cambio de nombre, por lo que aquí no se presentan como sustitutos.

## Referencias del proyecto de origen no incluidas

- `sql-code-review`, `sql-optimization` (habilidades): no están presentes en este kit.
- `ms-sql-dba`, `postgresql-dba` (agentes): no están presentes en este kit.

## Cómo se habilita

Copilot descubre de forma nativa el contenido de `.github/skills/` en este
repositorio, por lo que estas habilidades funcionan aquí sin instalar ningún complemento. La capa
de complementos las agrupa en un paquete con nombre dentro del catálogo local `datacorp-mm-team-kit`
([`marketplace.json`](../marketplace.json)) y se declara en
[`.github/copilot/settings.json`](../../copilot/settings.json). Consulta el
[índice de complementos](../README.md) para conocer el mecanismo y sus limitaciones.
