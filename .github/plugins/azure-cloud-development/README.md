# azure-cloud-development

Habilidades de desarrollo en la nube de Azure: optimización de costos, precios y estado de los recursos.

## Qué incluye este complemento

El manifiesto hace referencia a habilidades que se encuentran en el repositorio, bajo
`.github/skills/`. Se mantienen en una única ubicación y se comparten en todo el kit.

| Componente | Tipo | Ubicación |
|-----------|------|----------|
| `az-cost-optimize` | Habilidad | [`.github/skills/az-cost-optimize/`](../../skills/az-cost-optimize/) |
| `azure-pricing` | Habilidad | [`.github/skills/azure-pricing/`](../../skills/azure-pricing/) |
| `azure-resource-health-diagnose` | Habilidad | [`.github/skills/azure-resource-health-diagnose/`](../../skills/azure-resource-health-diagnose/) |

## Referencias del proyecto de origen no incluidas

El complemento `azure-cloud-development` del proyecto de origen también enumeraba los elementos siguientes.
No están presentes en los directorios consolidados `.github/skills/` y
`.github/agents/` de este kit, por lo que el manifiesto los omite:

- `import-infrastructure-as-code` (habilidad)
- `azure-logic-apps-expert`, `azure-principal-architect`, `azure-saas-architect`,
  `azure-verified-modules-bicep`, `azure-verified-modules-terraform`,
  `terraform-azure-implement`, `terraform-azure-planning` (agentes)

## Cómo se habilita

Copilot descubre de forma nativa el contenido de `.github/skills/` en este
repositorio, por lo que estas habilidades funcionan aquí sin instalar ningún complemento. La capa
de complementos las agrupa en un paquete con nombre dentro del catálogo local `datacorp-mm-team-kit`
([`marketplace.json`](../marketplace.json)) y se declara en
[`.github/copilot/settings.json`](../../copilot/settings.json). Consulta el
[índice de complementos](../README.md) para conocer el mecanismo y sus limitaciones.
