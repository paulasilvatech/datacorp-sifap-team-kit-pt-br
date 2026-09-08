---
name: "pipeline"
description: "Crea una canalización de CI/CD reforzada de GitHub Actions para SIFAP 2.0 con puertas de compilación, pruebas, seguridad y promoción entre entornos."
argument-hint: "target=backend|frontend|infra component=<name>"
agent: "devops-engineer"
tools: ["read", "search", "edit"]
---
# /pipeline

## Objetivo

Crea o refactoriza un flujo de trabajo de **GitHub Actions** para SIFAP 2.0 que compile, pruebe, analice y promueva artefactos mediante `develop` → `main` (producción) con puertas explícitas. El flujo sigue el estilo del proyecto ya presente en `.github/workflows/ci.yml`: acciones fijadas por SHA completo de commit con un comentario final `# vN`, un bloque `permissions:` de privilegio mínimo, un grupo `concurrency` y `timeout-minutes` en cada trabajo. El entregable se encuentra en `.github/workflows/`.

## Cuándo invocar

Cuando un contexto delimitado llega a las etapas 3/4 y necesita compilación, pruebas y despliegue automatizados, o cuando debe reforzarse un flujo de trabajo existente (OIDC, fijación por SHA, firma).

## Precondiciones

- El componente de destino existe (`backend/`, `frontend/` o `infra/`) o se está creando en esta PR
- Los entornos de GitHub (`dev`, `prod`) están configurados con revisores obligatorios
- Las credenciales federadas de Azure (OIDC) y el registro de contenedores están disponibles para el repositorio

## Entradas que debe proporcionar el equipo

- El destino de la canalización: servicio de backend Java, aplicación de frontend Next.js, módulo de IaC u orquestación de extremo a extremo
- El modelo de ramas (ramas de funcionalidad creadas a partir de `develop`, con promoción `develop` → `main`; consulta `00-GIT-WORKFLOW.md`)
- Los entornos de GitHub y sus revisores obligatorios
- El registro de contenedores (por ejemplo, Azure Container Registry) y las necesidades de cumplimiento normativo (SBOM, imágenes firmadas)

Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Leer [`../skills/pipeline-hardening/SKILL.md`](../skills/pipeline-hardening/SKILL.md) y aplicar sus controles de niveles 1–3
- Elegir los eventos de activación y organizar los trabajos por etapa (compilación, calidad, seguridad, empaquetado, despliegue)
- Autenticar en Azure con OIDC, sin secretos de entidad de servicio de larga duración
- Fijar cada acción por SHA con un comentario `# vN` y establecer un bloque `permissions:` de privilegio mínimo, un grupo `concurrency` y `timeout-minutes`, siguiendo `.github/workflows/ci.yml`
- Emitir trazabilidad del despliegue (SHA de integración y `REQ-ID` relacionados)

## Lo que NO haré

- Inventar SHA de acciones, nombres de secretos ni hosts de registros: los SHA desconocidos se obtienen de la versión publicada de la acción y los secretos se referencian por nombre, nunca se insertan directamente
- Escribir código de aplicación (`@builder`), crear módulos Terraform (`/iac-module`) ni cambiar requisitos (`@requirements-engineer`)
- Almacenar un secreto de Azure en GitHub cuando funcione OIDC ni conceder `permissions: write-all`
- Fijar una acción a una etiqueta mutable (`@v3`, `@main`) en lugar de un SHA
- Desplegar a producción sin una puerta de aprobación ni incorporar directamente un secreto en ningún lugar del YAML

## Formato de salida

El artefacto principal es el YAML del flujo de trabajo. Ejemplo (servicio de backend):

```yaml
name: backend-ci
on:
  pull_request:
    paths: ["backend/**"]
  push:
    branches: [develop, main]
    paths: ["backend/**"]

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    name: Compilar, probar, analizar
    runs-on: ubuntu-latest
    timeout-minutes: 20
    defaults:
      run:
        shell: bash
        working-directory: backend
    steps:
      - uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6
      - uses: actions/setup-java@b6effb05e454b25005698d916606bdc6ffcbf961 # v5
        with:
          distribution: temurin
          java-version: "21"
          cache: maven
      - name: Compilar y probar
        run: ./mvnw -B verify
      - name: Analizar el sistema de archivos (fallar ante gravedad crítica/alta)
        uses: aquasecurity/trivy-action@ed142fd0673e97e23eac54620cfb913e5ce36c25 # v0.36.0
        with:
          scan-type: fs
          severity: CRITICAL,HIGH
          exit-code: "1"

  deploy-prod:
    name: Desplegar a producción
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    timeout-minutes: 20
    environment: prod # Los revisores obligatorios exigen dos aprobaciones
    permissions:
      contents: read
      id-token: write # Inicio de sesión federado OIDC; sin secreto de Azure almacenado
    steps:
      - name: Iniciar sesión en Azure (OIDC)
        uses: azure/login@7184910d9eb2b1c5e48f7073824a90609bb9b6d6 # v2
        with:
          client-id: ${{ vars.AZURE_CLIENT_ID }}
          tenant-id: ${{ vars.AZURE_TENANT_ID }}
          subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}
      - name: Instalar cosign y firmar la imagen por digest
        uses: sigstore/cosign-installer@398d4b0eeef1380460a10c8013a76f728fb906ac # v3
```

Acompaña el YAML con: secretos y variables necesarios (por nombre y propósito), configuración de protección de ramas (comprobaciones obligatorias `build`, `quality`, `security`) y un flujo de promoción de una línea (`PR → build+scan → develop → deploy-dev → main → 2 aprobaciones → deploy-prod`).

## Definición de terminado

- [ ] Autenticación OIDC; no se almacena ningún secreto de Azure en GitHub
- [ ] Cada acción está fijada a un SHA de commit con un comentario `# vN`
- [ ] `build`, `quality` y `security` son comprobaciones obligatorias de PR
- [ ] El `permissions:` de nivel superior es `contents: read` y se amplía solo donde un trabajo lo necesita
- [ ] Un grupo `concurrency` impide dos despliegues simultáneos al mismo entorno
- [ ] `timeout-minutes` está definido en cada trabajo
- [ ] Los despliegues de producción requieren aprobaciones e incluyen el SHA de integración y los `REQ-ID` relacionados

## Cuerpo del prompt

Eres el `@devops-engineer`. El equipo necesita un flujo de trabajo que coincida exactamente con las convenciones de CI existentes del repositorio.

**Paso 1 — Carga los controles de refuerzo.**
Lee [`../skills/pipeline-hardening/SKILL.md`](../skills/pipeline-hardening/SKILL.md) y abre `.github/workflows/ci.yml` para copiar el estilo del proyecto (fijación por SHA con `# vN`, `permissions:`, `concurrency`, `timeout-minutes`).

**Paso 2 — Elige los eventos de activación.**
`pull_request` para compilación y pruebas, `push` a ramas protegidas para despliegue y `workflow_dispatch` para reversión manual. Evita `pull_request_target` salvo que los repositorios derivados necesiten realmente secretos.

**Paso 3 — Organiza los trabajos por etapa.**
`build` (compilar y ejecutar pruebas unitarias: `./mvnw -B verify` o `pnpm install --frozen-lockfile && pnpm build && pnpm test`), `quality` (lint, comprobación de tipos, carga de cobertura), `security` (Trivy, análisis de dependencias, búsqueda de secretos en las diferencias), `package` (compilar imagen, enviarla por digest, generar un SBOM con syft, firmar con cosign), `deploy-dev` (automático en `develop`) y `deploy-prod` (en `main`, requiere aprobaciones).

**Paso 4 — Autentica con OIDC.**
Utiliza `azure/login` con credenciales federadas e `id-token: write` limitado únicamente al trabajo de despliegue. Nunca almacenes un secreto de entidad de servicio.

**Paso 5 — Fija, almacena en caché y limita cada trabajo.**
Fija cada acción por SHA con un comentario `# vN`. Utiliza caché de Maven según el hash de `pom.xml` y la caché del almacén de pnpm. Establece `timeout-minutes` por trabajo y un grupo `concurrency` a nivel de flujo de trabajo.

**Paso 6 — Exige puertas y trazabilidad.**
Convierte `build`, `quality` y `security` en comprobaciones obligatorias mediante protección de ramas. Etiqueta la imagen desplegada con el SHA del commit de integración y los `REQ-ID` relacionados de la descripción de la PR, y muéstralos en la descripción del despliegue.

El `permissions:` de nivel superior utiliza `contents: read` de forma predeterminada y se amplía solo donde sea necesario. Solo OIDC: sin secretos de Azure de larga duración ni secretos incorporados directamente en YAML. Cada acción está fijada por SHA con un comentario `# vN`, y los despliegues de producción pasan por una puerta de aprobación.

## Ejemplo de invocación

```
/pipeline target=backend component=<service>
```
