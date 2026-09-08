# Solución de problemas consolidada

> **Ruta:** [Kit del equipo](../README.md) › [Documentación](README.md) › **Solución de problemas**

**Guía de diagnóstico y resolución de los errores más comunes de la inmersión** — usa `Ctrl+F` para buscar el síntoma.

| Campo | Valor |
|---|---|
| **Público** | Todo el equipo |
| **Cómo usarla** | Usa `Ctrl+F` para buscar el síntoma. Si no lo encuentras, consulta [FAQ.md](FAQ.md) |
| **Resultado esperado** | El problema se resuelve siguiendo los pasos descritos |

---

## Tabla de contenido

- [Configuración y entorno](#configuración-y-entorno)
- [Copilot, agentes y personas](#copilot-agentes-y-personas)
- [Spec-Kit y EARS](#spec-kit-y-ears)
- [Backend — Java y Spring Boot](#backend--java-y-spring-boot)
- [Frontend — Next.js y Node](#frontend--nextjs-y-node)
- [Docker](#docker)
- [Git y GitHub](#git-y-github)
- [Terraform y Azure](#terraform-y-azure)
- [Plan B — Interrupción de Copilot](#plan-b--interrupción-de-copilot)

---

## Configuración y entorno

### Faltan herramientas locales (Java, Node, Maven)

| Campo | Detalles |
|---|---|
| **Síntoma** | Mensaje de error "command not found" para `java`, `node` o `mvn` |
| **Causa probable** | Las herramientas locales aún no están instaladas |
| **Corrección** | Instala las versiones especificadas en [`00-SETUP.md`](../00-SETUP.md) y después valídalas con `java -version`, `node --version` y `git --version` |
| **Cómo confirmarlo** | Los tres comandos devuelven la versión esperada sin errores |

### "git: command not found" en el terminal de VS Code (Mac)

| Campo | Detalles |
|---|---|
| **Síntoma** | Se produce un error al intentar ejecutar cualquier comando `git` |
| **Causa probable** | Las herramientas CLI de Xcode no están instaladas |
| **Corrección** | Ejecuta `xcode-select --install` y sigue el instalador |
| **Cómo confirmarlo** | `git --version` devuelve una versión sin errores |

---

## Copilot, agentes y personas

### El comando de barra no aparece en el chat

| Campo | Detalles |
|---|---|
| **Síntoma** | `/ears-convert`, `/tdd` u otros comandos no aparecen en las sugerencias |
| **Causa probable** | VS Code no ha recargado el directorio `.github/` consolidado o la ventana se abrió fuera de la raíz del repositorio |
| **Corrección** | Confirma que `.github/prompts/` contiene archivos y después recarga la ventana: `Cmd+Shift+P` → _Developer: Reload Window_ |
| **Cómo confirmarlo** | Los comandos aparecen al escribir `/` en el chat |

> [!CAUTION]
> Nunca crees copias paralelas de agentes, prompts o skills fuera de `.github/`. Es la única fuente activa y no debe editarse.

### "No puedo seleccionar `@archaeologist` en el chat"

| Campo | Detalles |
|---|---|
| **Síntoma** | El agente `@archaeologist` no aparece en el selector del chat |
| **Causa 1** | El directorio `06-stage-agents/` no está en el espacio de trabajo |
| **Causa 2** | La extensión GitHub Copilot Chat está desactualizada |
| **Corrección** | Ejecuta `ls 06-stage-agents/` para confirmar que el directorio está presente. Actualiza la extensión desde la vista Extensions de VS Code |
| **Cómo confirmarlo** | El agente aparece en la lista desplegable del chat |

### Copilot responde sin el contexto relevante

| Campo | Detalles |
|---|---|
| **Síntoma** | Respuestas genéricas sin relación con SIFAP (Sistema de Fiscalización y Administración de Pagos) o la etapa actual |
| **Causa probable** | No se seleccionó un agente de etapa o se seleccionó el agente equivocado |
| **Corrección** | Confirma la etapa actual con el equipo y selecciona el agente correspondiente en la lista desplegable del chat |
| **Cómo confirmarlo** | Las respuestas empiezan a hacer referencia a la etapa y al contexto del sistema heredado |

### "Quiero usar el modo Plan, pero solo está disponible Ask"

| Campo | Detalles |
|---|---|
| **Síntoma** | El modo Plan no está disponible |
| **Causa probable** | La extensión de Copilot está desactualizada |
| **Corrección** | Actualiza la extensión GitHub Copilot Chat en VS Code |
| **Cómo confirmarlo** | El modo Plan aparece en el selector de modos |

---

## Spec-Kit y EARS

### "`specify version` devuelve command not found"

| Campo | Detalles |
|---|---|
| **Síntoma** | Se produce un error al ejecutar cualquier comando `specify` |
| **Causa probable** | Spec-Kit no está instalado |
| **Corrección** | Ejecuta los comandos siguientes |
| **Cómo confirmarlo** | `specify version` devuelve un número de versión |

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify version
```

### La CI rechazó la PR: `missing source_legacy`

| Campo | Detalles |
|---|---|
| **Síntoma** | La CI bloquea la pull request con un error de trazabilidad |
| **Causa probable** | Uno o más requisitos EARS no incluyen una línea `source_legacy:` |
| **Corrección** | Abre `specs/<NNN>-<feature>/spec.md`, localiza los REQ-ID sin `source_legacy:` y añade el campo apuntando a `01-archaeology/legacy-sifap/...#L<linha>` o marcándolo como `[GREENFIELD] <motivo>` |
| **Cómo confirmarlo** | La CI se aprueba en la siguiente ejecución |

Consulta [`07-concepts/05-ears-notation.md`](../07-concepts/05-ears-notation.md) para ver el formato correcto.

### `/speckit.clarify` hace demasiadas preguntas

| Campo | Detalles |
|---|---|
| **Síntoma** | El comando hace 10 preguntas o más |
| **Causa** | No es un problema: es el comportamiento esperado |
| **Acción** | Responde todas las preguntas. Cada respuesta ayuda a prevenir un error futuro |

---

## Backend — Java y Spring Boot

### El backend no se inicia — Error de conexión con Postgres

| Campo | Detalles |
|---|---|
| **Síntoma** | Se produce un error `Connection refused` o similar al iniciar el backend |
| **Causa probable** | Postgres no está en ejecución o la URL de `application.yml` es incorrecta |
| **Corrección** | Revisa `application.yml` e inicia Postgres mediante el método definido por el equipo (local, Testcontainers o Docker Compose) |
| **Cómo confirmarlo** | El backend se inicia y responde en `/actuator/health` |

### Flyway: `Migration checksum mismatch`

| Campo | Detalles |
|---|---|
| **Síntoma** | Se produce un error de Flyway al iniciar el backend |
| **Causa probable** | Se editó un archivo de migración existente después de aplicarlo |
| **Corrección** | Restaura la versión original usando `git log` y crea un archivo nuevo `V<N+1>__descricao.sql` |
| **Cómo confirmarlo** | El backend se inicia sin errores de Flyway |

> [!CAUTION]
> Nunca edites archivos de migración que ya se hayan aplicado (V1, V2, V3...). Crea siempre un archivo nuevo con el siguiente número de versión.

### Testcontainers: `Could not find a valid Docker environment`

| Campo | Detalles |
|---|---|
| **Síntoma** | Las pruebas que usan Testcontainers fallan con un error del entorno Docker |
| **Causa probable** | Docker no está en ejecución o el socket usa una ruta no estándar |
| **Corrección (macOS)** | `export DOCKER_HOST=unix:///var/run/docker.sock` o `export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock` |
| **Cómo confirmarlo** | Las pruebas se aprueban en la siguiente ejecución |

---

## Frontend — Next.js y Node

### El frontend muestra `ECONNREFUSED localhost:8080`

| Campo | Detalles |
|---|---|
| **Síntoma** | La página del frontend muestra un error de conexión rechazada |
| **Causa probable** | El backend no está en ejecución o usa un puerto diferente |
| **Corrección** | Confirma que el backend esté en ejecución y que la URL del frontend apunte al puerto correcto |
| **Cómo confirmarlo** | La página carga los datos normalmente |

### `Module not found: shadcn/ui`

| Campo | Detalles |
|---|---|
| **Síntoma** | Se produce un error de módulo no encontrado al iniciar el frontend |
| **Causa probable** | Las dependencias no están instaladas |
| **Corrección** | `cd frontend && npm install` |
| **Cómo confirmarlo** | El frontend se inicia sin errores de módulos |

---

## Docker

### `Cannot connect to the Docker daemon`

| Campo | Detalles |
|---|---|
| **Síntoma** | Todos los comandos Docker fallan con un error del daemon |
| **Causa probable** | Docker Desktop está detenido |
| **Corrección** | Abre Docker Desktop y espera a que el servicio se inicie completamente |
| **Cómo confirmarlo** | `docker ps` devuelve la lista de contenedores sin errores |

### `port is already allocated`

| Campo | Detalles |
|---|---|
| **Síntoma** | El contenedor no se inicia debido a un conflicto de puertos |
| **Causa probable** | Otro proceso ya está usando el puerto 5432, 8080 o 3000 |
| **Corrección** | Ejecuta `lsof -i :8080` para identificar y detener el proceso, o cambia el puerto en la configuración local |
| **Cómo confirmarlo** | El contenedor se inicia sin un error de puerto |

### Docker Desktop informa de `Out of memory`

| Campo | Detalles |
|---|---|
| **Síntoma** | Los contenedores fallan o se vuelven lentos y aparece una advertencia de memoria |
| **Causa probable** | El límite de RAM asignado a Docker Desktop es demasiado bajo |
| **Corrección** | Docker Desktop → Settings → Resources → Memory → 8 GB o más |
| **Cómo confirmarlo** | Los contenedores se inician y responden normalmente |

---

## Git y GitHub

### Push rechazado: `protected branch`

| Campo | Detalles |
|---|---|
| **Síntoma** | `git push` se rechaza con un mensaje de rama protegida |
| **Causa probable** | Se intentó hacer push directamente a `main` o `develop` |
| **Corrección** | Crea una rama y abre una pull request. Consulta [`00-GIT-WORKFLOW.md`](../00-GIT-WORKFLOW.md) |
| **Cómo confirmarlo** | La pull request se crea correctamente |

### Conflicto de integración

| Campo | Detalles |
|---|---|
| **Síntoma** | Aparecen marcadores `<<<<<<<` en los archivos durante un merge o rebase |
| **Causa probable** | Alguien modificó el mismo archivo en `develop` antes que tú |
| **Corrección** | Ejecuta el bloque siguiente, resuelve los conflictos manualmente y completa el rebase |
| **Cómo confirmarlo** | `git status` ya no muestra archivos con conflictos |

```bash
git fetch origin
git rebase origin/develop
# Resuelve los conflictos en los archivos que contienen marcadores
git add <file>
git rebase --continue
```

### Commit creado accidentalmente directamente en `develop`

```bash
git reset --soft HEAD~1
git stash
git checkout -b nova-branch
git stash pop
git commit -m "..."
```

### `gh: command not found`

| Campo | Detalles |
|---|---|
| **Síntoma** | Se produce un error al usar cualquier comando `gh` |
| **Causa probable** | GitHub CLI no está instalado |
| **Corrección** | `brew install gh && gh auth login` |
| **Cómo confirmarlo** | `gh --version` devuelve una versión sin errores |

---

## Terraform y Azure

### `Error: building AzureRM Client`

| Campo | Detalles |
|---|---|
| **Síntoma** | Terraform falla al inicializar el proveedor de Azure |
| **Causa probable** | La sesión de Azure CLI expiró o no se ha iniciado |
| **Corrección** | Ejecuta `az login` |
| **Cómo confirmarlo** | `terraform plan` se ejecuta sin errores de autenticación |

### `terraform plan` muestra cientos de recursos nuevos

| Campo | Detalles |
|---|---|
| **Síntoma** | La salida de `plan` enumera muchos recursos que crear |
| **Causa** | El archivo de estado está vacío: este es el comportamiento esperado en la primera ejecución |
| **Acción** | Revisa el plan. No ejecutes `apply`. |

> [!CAUTION]
> La inmersión autoriza solo `terraform plan`. Ejecutar `terraform apply` crea recursos reales de Azure y genera costos de inmediato.

---

## Plan B — Interrupción de Copilot

Si Copilot Chat deja de responder durante más de 5 minutos:

> [!WARNING]
> No esperes pasivamente. La inmersión dura 8 horas y cada minuto de inactividad tiene un costo alto para el equipo.

- [ ] **Recarga** — prueba `Cmd+Shift+P` → _Reload Window_. Si Copilot vuelve, continúa normalmente.
- [ ] **Trabaja manualmente** — si sigue sin conexión, vuelve a las plantillas y los artefactos que el equipo ya produjo.
- [ ] **Estructura el siguiente artefacto** — usa la evidencia disponible sin inventar datos.
- [ ] **Documéntalo en la PR** — escribe: _"Completado manualmente en X min (Copilot sin conexión)"_ — esto sirve de apoyo al informe de la Etapa 4.
- [ ] **Coordínate con quien recibe el trabajo** — acuerden que el artefacto puede estar menos pulido de lo habitual.

La CI sigue validando los cambios incluso mientras Copilot está sin conexión. El trabajo no se detiene.

| Artefacto sin Copilot | Siguiente paso |
|---|---|
| EARS en la Etapa 2 | Usa los hallazgos trazables y el flujo de trabajo de [Spec-Kit](../09-cheat-sheets/spec-kit-workflow.md) |
| ADR en la Etapa 2 | Completa la [plantilla de ADR](adr/0000-template.md) |
| Implementación en la Etapa 3 | Revisa los requisitos EARS priorizados, los DDM y las decisiones del equipo |
| Issue para Agent en la Etapa 4 | Escribe el contexto, los criterios de aceptación y la trazabilidad del cambio |

---

## Cuando ninguna de las soluciones anteriores funciona

| Tiempo sin avanzar | Acción |
|---|---|
| 5 min | Vuelve a leer el error con atención. Usa Copilot Ask: _"¿Qué significa este error: `<pegar el error>`?"_ |
| 10 min | Pregunta a tu compañero |
| 20 min | Levanta la mano para llamar a la persona facilitadora (regla de TEAM-FLOW §6) |
| 30 min | Pausa esta tarea y trabaja en otra mientras alguien te ayuda |

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Kit en español](../README.md)<br/><sub>Centro principal.</sub> | [FAQ](FAQ.md)<br/><sub>Preguntas frecuentes.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
