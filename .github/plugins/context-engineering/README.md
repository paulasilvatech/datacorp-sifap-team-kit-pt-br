# context-engineering

Mapeo del contexto para maximizar la eficacia de GitHub Copilot.

## Qué incluye este complemento

| Componente | Tipo | Ubicación |
|-----------|------|----------|
| `context-map` | Habilidad | [`.github/skills/context-map/`](../../skills/context-map/) |

## Contenido relacionado del kit

La inmersión también mantiene
[`.github/skills/context-audit/`](../../skills/context-audit/) y
[`.github/skills/refactor-safely/`](../../skills/refactor-safely/), que son los
equivalentes propios del kit de las habilidades `what-context-needed` y `refactor-plan`
del proyecto de origen.

## Referencias del proyecto de origen no incluidas

- `refactor-plan`, `what-context-needed` (habilidades): el kit utiliza
  `refactor-safely` y `context-audit` en su lugar.
- `context-architect` (agente): no está presente en este kit.

## Cómo se habilita

Copilot descubre de forma nativa el contenido de `.github/skills/` en este
repositorio, por lo que esta habilidad funciona aquí sin instalar ningún complemento. La capa
de complementos la agrupa en un paquete con nombre dentro del catálogo local `datacorp-mm-team-kit`
([`marketplace.json`](../marketplace.json)) y se declara en
[`.github/copilot/settings.json`](../../copilot/settings.json). Consulta el
[índice de complementos](../README.md) para conocer el mecanismo y sus limitaciones.
