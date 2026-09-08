---
description: "Utiliza al crear o revisar GitHub Actions, flujos de trabajo de CI/CD, puertas de canalizaciones YAML, comprobaciones de compilación y automatización de despliegues."
applyTo: ".github/workflows/**,.github/actions/**,**/action.yml,**/action.yaml"
---

# Convenciones de CI/CD — Puertas de GitHub Actions

Este archivo se activa al editar flujos de trabajo en `.github/workflows/`, acciones compuestas en `.github/actions/` o cualquier `action.yml`/`action.yaml`. Enseña a estructurar la canalización, fijar acciones, delimitar permisos y mantener las puertas fieles a lo que comprueban. Los dos flujos de trabajo activos, [`ci.yml`](../workflows/ci.yml) y [`spec-quality.yml`](../workflows/spec-quality.yml), son la referencia; léelos antes de cambiar una puerta.

## Las puertas activas

| Flujo de trabajo · Trabajo | Qué exige | ¿Bloqueante? |
|---|---|---|
| `ci.yml` · `detect-changes` | `dorny/paths-filter` establece las salidas `backend`/`frontend`/`infra` para que los trabajos posteriores solo se ejecuten ante cambios relevantes | No corresponde |
| `ci.yml` · `natural-format` | Falla cuando el código fuente Natural utiliza declaraciones de formato decimal con coma como `(P9,2)` en lugar de la forma con punto de Natural CE `(P9.2)` | Sí |
| `ci.yml` · `backend` | JDK 21 (temurin) + `./mvnw -B verify`; carga el informe de Jacoco | Sí |
| `ci.yml` · `frontend` | pnpm 9 + Node 20; `pnpm lint`, `pnpm typecheck`, `pnpm test --run --coverage` | Sí |
| `ci.yml` · `infra` | `terraform fmt -check -recursive`, después `init -backend=false` + `validate` por módulo | Sí |
| `spec-quality.yml` · `markdown-lint` | `markdownlint-cli2` sobre `**/*.md` | Sí |
| `spec-quality.yml` · `spec-traceability` | Informa de los REQ-ID en `specs/` que aún no referencia una prueba (emite `::warning::`) | No |
| `spec-quality.yml` · `legacy-traceability` | Cada REQ-ID en `specs/` debe incluir una línea `source_legacy:` válida | Sí |
| `pages.yml` · `build` | Resuelve los tres snapshots de idioma, ejecuta pruebas unitarias y de navegador, y rechaza archivos, enlaces, anclas o descargas originales incompletos | Sí |
| `pages.yml` · `deploy` | Verifica de nuevo la visibilidad de Pages; un repositorio privado no puede publicar con acceso público o desconocido | Sí |

> [!IMPORTANT]
> `legacy-traceability` hace fallar la compilación; `spec-traceability` solo advierte. Consulta en [`requirements.instructions.md`](requirements.instructions.md) el formato exacto de `source_legacy:` que acepta la puerta.

## Fija cada acción mediante el SHA del commit

Referencia las acciones mediante el SHA completo de 40 caracteres del commit, con la etiqueta legible en un comentario al final. Las etiquetas son mutables; los SHA no.

```yaml
# Correcto: referencia inmutable
- uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6
# Incorrecto: una etiqueta puede trasladarse a código malicioso
- uses: actions/checkout@v6
```

## Permisos de privilegio mínimo

Declara `permissions` al principio de cada flujo de trabajo con el alcance más reducido y amplíalo por trabajo solo donde sea necesario.

```yaml
permissions:
  contents: read # Valor predeterminado para todo el flujo de trabajo

jobs:
  detect-changes:
    permissions:
      contents: read
      pull-requests: read # Solo este trabajo lo necesita
```

## Trabajos condicionales filtrados por ruta

Condiciona los trabajos pesados a `detect-changes` para que una PR que solo cambia documentación no ejecute Maven ni Terraform.

```yaml
backend:
  needs: detect-changes
  if: needs.detect-changes.outputs.backend == 'true'
```

## Concurrencia y tiempos de espera

Cada flujo de trabajo cancela las ejecuciones reemplazadas y cada trabajo establece `timeout-minutes` para que un paso bloqueado no agote los recursos del ejecutor.

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## Despliegue con OIDC (previsión futura)

Todavía no existe ningún trabajo de despliegue. Cuando añadas uno, autentícate en Azure mediante federación OIDC, nunca con un secreto de cliente almacenado, y solicita `id-token: write` solo en ese trabajo.

```yaml
permissions:
  id-token: write # Solicita el token OIDC de corta duración
  contents: read
steps:
  - uses: azure/login@<full-sha> # Fija la referencia
    with:
      client-id: ${{ vars.AZURE_CLIENT_ID }}
      tenant-id: ${{ vars.AZURE_TENANT_ID }}
      subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}
```

Las cargas de trabajo desplegadas se autentican entre servicios mediante identidades administradas (Managed Identity; consulta [`infrastructure.instructions.md`](infrastructure.instructions.md)); las listas de verificación de refuerzo se encuentran en la habilidad [`pipeline-hardening`](../skills/pipeline-hardening/SKILL.md).

## Convenciones

| Regla | Justificación |
|---|---|
| Fijar las acciones mediante el SHA completo del commit | Evita el secuestro de etiquetas en la cadena de suministro |
| Bloque `permissions:` en cada flujo de trabajo, con `contents: read` como valor predeterminado | Privilegio mínimo desde el diseño |
| `concurrency` + `cancel-in-progress` | Evita ejecuciones desperdiciadas o en competencia sobre la misma referencia |
| `timeout-minutes` en cada trabajo | Un paso bloqueado falla rápidamente |
| Federación OIDC, nunca un secreto de nube almacenado | Sin credenciales de larga duración en el repositorio |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Referenciar `@<sha> # vN` | Referenciar `@v4`, `@main` o una rama |
| Conceder `id-token: write` por trabajo de despliegue | Conceder `write-all` a nivel de flujo de trabajo |
| Leer el flujo de trabajo antes de editar una puerta | Adivinar qué comprueba una puerta |
| Dejar que `detect-changes` omita los trabajos irrelevantes | Ejecutar todos los trabajos en cada PR |

## Lista de verificación antes de abrir una PR

- [ ] Cada `uses:` está fijado a un SHA completo de commit con un comentario de versión
- [ ] El flujo de trabajo declara un bloque `permissions:` de nivel superior con alcance de privilegio mínimo
- [ ] Cada trabajo establece `timeout-minutes` y el flujo de trabajo establece `concurrency`
- [ ] Las nuevas puertas se describen con precisión en el archivo de instrucciones correspondiente
- [ ] Cada paso de nube utiliza OIDC, no un secreto almacenado, y solicita `id-token: write` con un alcance reducido
- [ ] `markdownlint-cli2` y los trabajos de CI existentes se superan localmente cuando es posible reproducirlos
