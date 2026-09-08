# Publicación de comentarios y cuerpos largos en Windows

En Windows, el comando `az` se resuelve a `az.cmd`, un envoltorio por lotes invocado por `cmd.exe`. La línea de comandos completa tiene un límite de aproximadamente 8191 caracteres, por lo que un valor largo de `--discussion`, `--description` o `--content` puede truncarse silenciosamente o fallar. Detecta el shell antes de construir un argumento largo y elige la vía adecuada. Omitir este paso es el motivo más habitual por el que el agente malgasta 3-5 turnos recurriendo a la obtención directa de tokens y llamadas REST.

## Detectar primero el shell

| Entorno | Indicio | Acción |
|---|---|---|
| PowerShell en Windows | `$IsWindows -eq $true` y `$PSVersionTable.PSVersion` está definido | Usar `azps.ps1` (consulta más abajo) |
| PowerShell en macOS / Linux | `$IsWindows -eq $false` | Se puede usar `az` directamente; no hay envoltorio cmd.exe |
| bash / zsh / sh | `$BASH_VERSION` o `$ZSH_VERSION` está definido, o `uname` funciona | Se puede usar `az` directamente; no hay envoltorio cmd.exe |
| `cmd.exe` de Windows | `%ComSpec%` termina en `cmd.exe`, no existe `$PSVersionTable` | Usar `azps.ps1` si PowerShell está instalado; en otro caso, consultar la alternativa `az devops invoke` más abajo |

## Opción 1: `azps.ps1` (PowerShell en Windows)

`azps.ps1` viene incluido en el instalador de Azure CLI e invoca directamente el punto de entrada Python. No tiene el límite de longitud de `cmd.exe`.

```powershell
# Leer el cuerpo largo en una variable y pasarlo directamente, sin complicaciones de comillas.
$body = Get-Content -Raw .\comment.md
azps.ps1 boards work-item update --id 1234 --discussion $body
```

## Opción 2: opción específica `--file-path` cuando Azure CLI la ofrezca

Algunos comandos tienen una opción nativa de archivo y debes preferirla a cualquier cuerpo inline:

- `az devops wiki page create` y `az devops wiki page update` aceptan `--file-path` (con `--encoding` opcional).
- Úsala en cualquier shell, incluido Windows.

```bash
az devops wiki page create --path 'My page' --wiki myproject --file-path ./page.md --encoding utf-8
```

## Opción 3: alternativa con `az devops invoke`

Cuando no exista `--file-path` (`--discussion` de elementos de trabajo, `--description` de PR) y no estés en PowerShell, publica el cuerpo mediante la API REST subyacente. `az devops invoke` se ejecuta dentro del punto de entrada Python, por lo que tampoco está sujeto al límite de `cmd.exe`, y toma el cuerpo de la solicitud de un archivo mediante `--in-file`:

```bash
# Publicar un comentario de discusión largo en el elemento de trabajo 1234.
# REST: POST /{project}/_apis/wit/workItems/{id}/comments?api-version=7.0-preview.3
az devops invoke \
  --area wit --resource comments \
  --route-parameters project={project} workItemId=1234 \
  --api-version 7.0-preview.3 \
  --http-method POST \
  --in-file ./comment.json
```

Donde `comment.json` contiene `{ "text": "<cuerpo Markdown largo>" }`. Esta es la alternativa universal cuando no están disponibles ni `azps.ps1` ni `--file-path`. El propio `az devops invoke` acepta `--in-file` de forma nativa.

## No depender de `@<file>` para argumentos de cadena simples

La convención `@<file>` de Azure CLI está documentada para parámetros JSON (consulta [la guía oficial de comillas](https://learn.microsoft.com/en-us/cli/azure/use-azure-cli-successfully-quoting)). No se garantiza que expanda argumentos de cadena simples como `--discussion` o `--description`, así que no la uses para sustituir las tres opciones anteriores.
