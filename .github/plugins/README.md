# Complementos de Copilot

Este directorio empaqueta las **habilidades** y los **agentes** de Copilot seleccionados para el kit como
complementos con nombre y los publica mediante un **catálogo** local de complementos para que
puedan declararse en [`.github/copilot/settings.json`](../copilot/settings.json).

## Qué contiene este directorio

- Diez directorios de complementos, cada uno con un manifiesto `plugin.json` y un `README.md`.
- [`marketplace.json`](marketplace.json): un **catálogo de directorio** local
  llamado `datacorp-mm-team-kit` que enumera los diez complementos.

El contenido real de las habilidades y los agentes **no** se duplica aquí. Se mantiene
en una única ubicación del repositorio, en [`.github/skills/`](../skills/) y
[`.github/agents/`](../agents/). Cada `plugin.json` hace referencia a ese contenido
compartido mediante rutas relativas como `../../skills/<name>/` y
`../../agents/<name>.agent.md`.

## Dos capas, una única fuente de verdad

1. **Descubrimiento nativo (en este repositorio).** Copilot carga automáticamente todas las
   habilidades de `.github/skills/` y todos los agentes de `.github/agents/`. En
   este repositorio, esos componentes ya funcionan sin instalar nada.
2. **Empaquetado de complementos (para asignar nombres y reutilizar).** Los complementos agrupan los
   componentes compartidos en paquetes temáticos y los publican mediante el mecanismo
   oficial de catálogo / `enabledPlugins`.

## Catálogo

| Complemento | Contenido | Estado |
|--------|---------|--------|
| [`arch`](arch/) | — | solo de catálogo (sin componentes en este kit) |
| [`azure-cloud-development`](azure-cloud-development/) | 3 habilidades | habilitado |
| [`chromium-control-canvas`](chromium-control-canvas/) | — | solo de catálogo (sin componentes en este kit) |
| [`context-engineering`](context-engineering/) | 1 habilidad | habilitado |
| [`copilot-sdk`](copilot-sdk/) | 1 habilidad | habilitado |
| [`database-data-management`](database-data-management/) | 2 habilidades | habilitado |
| [`frontend-web-dev`](frontend-web-dev/) | 1 agente, 1 habilidad | habilitado |
| [`java-development`](java-development/) | 4 habilidades | habilitado |
| [`software-engineering-team`](software-engineering-team/) | 1 agente | habilitado |
| [`testing-automation`](testing-automation/) | 2 habilidades | habilitado |

Estos manifiestos se adaptaron del catálogo `github/awesome-copilot`. De las
48 referencias a componentes de los manifiestos originales, 16 se resuelven a contenido que
existe en este kit y se conservan; las otras 32 apuntan a habilidades, agentes o
extensiones que no forman parte de este kit y se eliminaron. El README de cada complemento
enumera exactamente qué se omitió.

## Cómo se habilitan los complementos

La configuración declarativa se encuentra en
[`.github/copilot/settings.json`](../copilot/settings.json):

```json
{
  "extraKnownMarketplaces": {
    "datacorp-mm-team-kit": {
      "source": { "source": "directory", "path": ".github/plugins" }
    }
  },
  "enabledPlugins": {
    "java-development@datacorp-mm-team-kit": true
  }
}
```

- `extraKnownMarketplaces` registra el catálogo de directorio local. La estructura
  del valor (`{ "source": { "source": "directory", "path": ... } }`) es exactamente la que
  escribe la CLI al registrar un catálogo de directorio.
- Las claves de `enabledPlugins` son **especificaciones** de complementos con el formato `name@marketplace`, nunca
  nombres aislados ni rutas del sistema de archivos. Solo se habilitan los ocho complementos que contienen
  componentes; las dos entradas que son solo de catálogo figuran en él, pero no
  se habilitan, porque habilitarlas no cargaría nada.

Para registrar el catálogo bajo demanda desde la raíz del repositorio, utiliza el
comando que admite la CLI para un origen de tipo directorio (el prefijo explícito `./` es
obligatorio para que la ruta no se interprete como una especificación `owner/repo` de GitHub):

```bash
copilot plugin marketplace add ./.github/plugins
copilot plugin marketplace browse datacorp-mm-team-kit
```

## Limitaciones declaradas con transparencia

- **En este repositorio, los complementos no añaden ninguna capacidad nueva.** Todo el contenido al que
  hacen referencia ya se carga mediante el descubrimiento nativo de `.github/skills/` y
  `.github/agents/`. La capa de complementos proporciona documentación y empaquetado: registra
  qué componentes compartidos forman cada paquete y los publica mediante el mecanismo
  oficial de catálogo.
- **Los complementos instalados copian únicamente su propio directorio.** Cuando un complemento se
  instala desde un catálogo, Copilot copia el directorio de ese complemento, no la
  raíz del repositorio. Como estos manifiestos apuntan a contenido compartido **fuera**
  del directorio del complemento (`../../skills/...`, `../../agents/...`), esos componentes
  no se copian durante la instalación y no aparecerán en otro repositorio ni en una
  instalación global. Esto se verificó empíricamente: instalar un complemento de este tipo
  informa de que se completó correctamente, pero no incluye ninguna habilidad. Para distribuir un complemento autónomo, el
  contenido referenciado debe incluirse dentro del directorio del complemento. Este kit
  no duplica deliberadamente ese contenido, porque se mantiene en una única ubicación en
  la raíz del repositorio.
- **Las ejecuciones sin interfaz de `copilot -p` no aplicaron
  `extraKnownMarketplaces` del repositorio.** En una sesión de prompts no interactiva solo se
  cargaron los catálogos predeterminados. La configuración declarativa está documentada para
  sesiones interactivas y de agentes; la forma fiable y verificada de registrar el
  catálogo local es el comando `copilot plugin marketplace add ./.github/plugins`
  mostrado anteriormente.

## Validación

```bash
# Todos los manifiestos y archivos de configuración se analizan como JSON
python3 -c "import json,glob; [json.load(open(f)) for f in \
  glob.glob('.github/plugins/*/plugin.json') + \
  ['.github/copilot/settings.json', '.github/plugins/marketplace.json']]"

# Lint de Markdown (utiliza .markdownlint-cli2.jsonc de la raíz)
npx --yes markdownlint-cli2 ".github/plugins/**/*.md"
```

## Referencias

- Complementos de Copilot CLI:
  <https://docs.github.com/copilot/concepts/agents/copilot-cli/about-cli-plugins>
- Creación de complementos:
  <https://docs.github.com/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating>
- Referencia de Copilot CLI:
  <https://docs.github.com/copilot/how-tos/copilot-cli>
- Catálogo del proyecto de origen: <https://github.com/github/awesome-copilot>
