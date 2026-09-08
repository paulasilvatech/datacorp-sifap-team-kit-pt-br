# copilot-sdk

Crea aplicaciones basadas en agentes con GitHub Copilot SDK.

## Qué incluye este complemento

| Componente | Tipo | Ubicación |
|-----------|------|----------|
| `copilot-sdk` | Habilidad | [`.github/skills/copilot-sdk/`](../../skills/copilot-sdk/) |

## Cómo se habilita

Copilot descubre de forma nativa el contenido de `.github/skills/` en este
repositorio, por lo que esta habilidad funciona aquí sin instalar ningún complemento. La capa
de complementos la agrupa en un paquete con nombre dentro del catálogo local `datacorp-mm-team-kit`
([`marketplace.json`](../marketplace.json)) y se declara en
[`.github/copilot/settings.json`](../../copilot/settings.json). Consulta el
[índice de complementos](../README.md) para conocer el mecanismo y sus limitaciones.
