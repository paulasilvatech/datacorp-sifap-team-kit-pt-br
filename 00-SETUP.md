# Guía de configuración: de cero al código

> **Ruta:** [Kit del equipo](README.md) › **Configuración**

**Esta guía te lleva de "todavía no tenemos nada" a "repositorio creado, Copilot funcionando y todas las personas listas" en 45 minutos.**

![Configuración](https://img.shields.io/badge/Setup-00-171717?style=flat-square) ![Duración: 45 min](https://img.shields.io/badge/Duration-45%20min-737373?style=flat-square) ![Cuándo: antes del Día 2](https://img.shields.io/badge/When-Before%20Day%202-A3A3A3?style=flat-square)

| Campo | Valor |
|---|---|
| **Público objetivo** | Líder del equipo + cada integrante en su propio portátil |
| **Prerrequisitos** | Cuenta de GitHub con Copilot habilitado |
| **Tiempo estimado** | 45 minutos |
| **Resultado esperado** | Repositorio protegido, Copilot activo, personas validadas y prueba de humo en verde |

> [!WARNING]
> **Usuarios de Windows:** los bloques de terminal con heredoc o `for` presuponen **Git Bash** o **WSL**. No uses PowerShell ni CMD para esos bloques.

**Son cinco integrantes. Cada uno usa dos personas. Tienen una jornada de trabajo.** Todos siguen los pasos en su propio portátil. Una persona comparte la pantalla para mostrar los pasos y las otras cuatro los repiten. Al final, todos los portátiles están completamente configurados.

## Resumen

- [Antes de empezar: modelo mental](#antes-de-empezar-modelo-mental)
- [Paso 1: comprueba los prerrequisitos de tu portátil](#paso-1-comprueba-los-prerrequisitos-de-tu-portátil)
- [Paso 2: crea el repositorio del equipo a partir de la plantilla (solo el líder)](#paso-2-crea-el-repositorio-del-equipo-a-partir-de-la-plantilla-solo-el-líder)
- [Paso 3: clona el repositorio y crea `develop` (solo el líder)](#paso-3-clona-el-repositorio-y-crea-develop-solo-el-líder)
- [Paso 4: protege la rama `main` (solo el líder)](#paso-4-protege-la-rama-main-solo-el-líder)
- [Paso 5: añade a los otros cuatro integrantes (solo el líder)](#paso-5-añade-a-los-otros-cuatro-integrantes-solo-el-líder)
- [Paso 6: cada integrante clona el repositorio](#paso-6-cada-integrante-clona-el-repositorio)
- [Paso 7: activa GitHub Copilot en VS Code (todos)](#paso-7-activa-github-copilot-en-vs-code-todos)
- [Paso 8: valida los agentes y prompts de tus personas (todos)](#paso-8-valida-los-agentes-y-prompts-de-tus-personas-todos)
- [Paso 9: instala Spec-Kit (todos)](#paso-9-instala-spec-kit-todos)
- [Paso 10: usa el flujo de Spec-Kit (todos)](#paso-10-usa-el-flujo-de-spec-kit-todos)
- [Paso 11: comprende la estrategia de ramas](#paso-11-comprende-la-estrategia-de-ramas)
- [Paso 12: flujo diario por persona](#paso-12-flujo-diario-por-persona)
- [Paso 13: prueba de humo (todo el equipo, a las 10:30)](#paso-13-prueba-de-humo-todo-el-equipo-a-las-1030)
- [Solución de problemas](#solución-de-problemas)

---

## Antes de empezar: modelo mental

Trabajarán con **dos repositorios de GitHub**:

```text
GitHub
├── <TEMPLATE_ORG>/workshop-preto-00/       (repositorio principal de la inmersión, usado una vez como plantilla)
└── <WORKSHOP_ORG>/workshop-team-XX/        (repositorio de trabajo de TU equipo, donde creas commits)
```

En tu portátil, clona solo el repositorio de tu equipo:

```bash
~/Code/workshop-team-XX/
```

| Repositorio | Qué haces con él | Dónde reside |
|---|---|---|
| `workshop-preto-00` | Lo usas una vez como plantilla al principio | `github.com/<TEMPLATE_ORG>/workshop-preto-00` |
| `workshop-team-XX` | Todo tu trabajo va aquí | `github.com/<WORKSHOP_ORG>/workshop-team-XX` (privado, lo creas tú) |

> [!NOTE]
> Las personas facilitadoras proporcionarán la organización exacta el día de la inmersión. Pertenecerá a la cuenta empresarial [software-gbb-workshops](https://github.com/enterprises/software-gbb-workshops).

> [!IMPORTANT]
> Nunca hagas push al repositorio principal de la inmersión. Los commits de tu equipo van solo a `workshop-team-XX`. El **Sistema de Fiscalización y Administración de Pagos (SIFAP)** heredado ya se incluye en el kit, en `01-archaeology/legacy-sifap/`, y es material de lectura, no de edición.

---

## Paso 1: comprueba los prerrequisitos de tu portátil

**Cada integrante del equipo realiza esta lista de verificación en su propio portátil.**

- [ ] **Comprueba las herramientas.**

| Herramienta | Versión mínima | Cómo comprobarla | Si falta |
|---|---|---|---|
| **Git** | 2.40+ | `git --version` | <https://git-scm.com/downloads> |
| **Cuenta de GitHub** | - | Inicia sesión en github.com | <https://github.com/signup> |
| **GitHub CLI** | 2.40+ | `gh --version` | <https://cli.github.com> |
| **VS Code** | 1.93+ | Help -> About | <https://code.visualstudio.com/download> |
| **Docker Desktop** | 4.30+ | `docker --version` y abrir la aplicación | <https://www.docker.com/products/docker-desktop> |
| **Java 21 JDK** | 21 | `java -version` | <https://learn.microsoft.com/java/openjdk/download> |
| **Node.js** | 20 LTS | `node --version` | <https://nodejs.org/en/download> |

> [!CAUTION]
> ¿Te faltan la mayoría de estos elementos? Instala las herramientas antes de que empiece la inmersión. Este kit no incluye un entorno preconstruido ni una configuración inicial automática.

### Comprobación de licencia (una persona la hace para el equipo)

- [ ] **Abre <https://github.com/settings/copilot>** - deberías ver "Active subscription" (Individual) o "Business plan". Si ves "Get GitHub Copilot", llama a una persona facilitadora.

---

## Paso 2: crea el repositorio del equipo a partir de la plantilla (solo el líder)

**Elijan a una persona como líder del equipo** (normalmente quien desempeña la persona Líder Técnico en la Pareja 3). Solo el líder realiza los Pasos 2 a 5. Los otros cuatro integrantes esperan y continúan desde el Paso 6.

### Uso de la plantilla en GitHub

> [!IMPORTANT]
> Este flujo requiere que **Template repository** esté habilitado en el kit público del equipo. Si **Use this template** no está disponible, contacta con una persona facilitadora antes de crear el repositorio del equipo.

- [ ] **Crea el repositorio a partir de la plantilla.**

1. Abre el [kit público del equipo](https://github.com/workshop-gbb/datacorp-sifap-modernization-team-kit/tree/main).
2. Haz clic en **Use this template** -> **Create a new repository**.
3. Completa:
   - **Owner**: la organización de la inmersión proporcionada por las personas facilitadoras, dentro de la cuenta empresarial `software-gbb-workshops`. No elijas tu usuario personal.
   - **Repository name**: `workshop-team-XX` (reemplaza XX por el número de tu equipo, por ejemplo, `workshop-team-01`)
   - **Description**: `DATACORP 2026 Workshop - Team XX`
   - **Visibility**: Private
   - **Include all branches**: déjalo sin marcar. Copia solo la rama `main` en inglés; el Paso 3 crea `develop` desde el mismo historial.
4. Haz clic en **Create repository**.

Ahora deberías ver una copia completa del kit en `https://github.com/<WORKSHOP_ORG>/workshop-team-XX`, incluida la documentación, el código heredado, las plantillas, los workflows y los archivos de `.github/`.

La plantilla usa `main` de forma predeterminada, incluso si navegas por una rama traducida antes de crear el repositorio.
Para leer el material en portugués, abre la [edición en portugués de Brasil](https://github.com/workshop-gbb/datacorp-sifap-modernization-team-kit/tree/portugues-br); para leerlo en español, abre la [edición en español](https://github.com/workshop-gbb/datacorp-sifap-modernization-team-kit/tree/espanol).
Mantén las ramas `main` y `develop` del equipo en inglés; las ramas de idiomas no son ramas de integración y sus árboles de documentación traducida no deben integrarse en `main` ni en `develop`.

---

## Paso 3: clona el repositorio y crea `develop` (solo el líder)

- [ ] **Clona el repositorio y crea la rama `develop`.**

```bash
# 1. Elige una carpeta para todo tu código
mkdir -p ~/Code && cd ~/Code

# 2. Clona el repositorio de tu equipo
git clone --branch main https://github.com/<WORKSHOP_ORG>/workshop-team-01.git
cd workshop-team-01

# 3. Confirma que la plantilla se copió intacta
ls 01-archaeology/legacy-sifap .github/agents .github/prompts .github/instructions .github/skills

# 4. Crea la rama de integración del equipo
git checkout -b develop
git push -u origin develop
```

> [!WARNING]
> A partir de este momento, nunca hagas push directamente a `main`. El Paso 4 protege esa rama.

`develop` es donde se integran las ramas de funcionalidades de todos. Las promociones a `main` se realizan mediante PR después de cada etapa.

---

## Paso 4: protege la rama `main` (solo el líder)

Esto impide que cualquiera, salvo un administrador del repositorio, haga push directamente a `main`. Cada cambio debe pasar por una pull request.

> [!NOTE]
> Como el repositorio se crea en una organización dentro de la cuenta empresarial `software-gbb-workshops`, la protección de ramas debería estar disponible. Si no ves la opción, pide a una persona facilitadora que verifique los permisos.

### Desde el sitio web

- [ ] **Crea la regla de protección.**

1. Ve a **Settings** -> **Branches** (barra lateral izquierda).
2. En **Branch protection rules**, haz clic en **Add rule**.
3. Patrón del nombre de la rama: `main`
4. Marca:
   - **Require a pull request before merging**
   - **Require approvals** - establécelo en `1`
   - **Require conversation resolution before merging**
5. Haz clic en **Create**.

### Desde la CLI

```bash
gh api -X PUT "repos/<WORKSHOP_ORG>/workshop-team-01/branches/main/protection" \
  --input - <<'JSON'
{
  "required_status_checks": null,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": false,
    "require_code_owner_reviews": false
  },
  "restrictions": null,
  "required_conversation_resolution": true
}
JSON
```

> **Por qué importa.** Sin esta regla, alguien del equipo acabará enviando un error a `main` en el minuto 90 y la demo fallará en el minuto 480. Costo: 30 segundos. Ahorro: horas.

---

## Paso 5: añade a los otros cuatro integrantes (solo el líder)

### Opción A: usar el sitio web

- [ ] **Invita a los otros cuatro compañeros de equipo.**

1. Ve al repositorio en GitHub: `https://github.com/<WORKSHOP_ORG>/workshop-team-XX`
2. Haz clic en **Settings** -> **Collaborators and teams** -> **Manage access**.
3. Haz clic en **Add people**.
4. Escribe el nombre de usuario de GitHub y selecciónalo de la lista.
5. Elige el rol **Write** (no Admin ni Read).
6. Haz clic en **Add ... to this repository**.
7. Repite el proceso para las otras tres personas.

> [!TIP]
> Si las personas facilitadoras crearon un equipo de GitHub para cada equipo de la inmersión, añade al equipo completo con permiso Write en lugar de invitar a las personas una por una. Cada persona invitada recibe un correo y debe hacer clic en **Accept invitation** antes de poder hacer push.

### Opción B: usar la CLI

```bash
for user in alice bob carla dani; do
  gh api -X PUT "repos/<WORKSHOP_ORG>/workshop-team-01/collaborators/${user}" \
    -f permission=write
done
```

---

## Paso 6: cada integrante clona el repositorio

**Ahora se incorporan todos.** Los otros cuatro integrantes del equipo realizan estos pasos.

### 6.1 Acepta la invitación

- [ ] **Acepta la invitación desde el correo electrónico o la notificación de GitHub.**

### 6.2 Clona y cambia a `develop`

- [ ] **Clona el repositorio y confirma el acceso.**

```bash
mkdir -p ~/Code && cd ~/Code

# Reemplaza 01 por el número real de tu equipo y <WORKSHOP_ORG> por la organización indicada ese día
git clone --branch main https://github.com/<WORKSHOP_ORG>/workshop-team-01.git
cd workshop-team-01

# Cambia a la rama develop, donde se realiza el trabajo diario
git checkout develop
```

### 6.3 Ábrelo en VS Code

```bash
code .
```

### 6.4 Confirma las herramientas locales

Este kit no incluye un entorno preconstruido, un prototipo listo ni contenerización heredada. Cada persona valida sus herramientas localmente. El prototipo se crea desde cero en la Etapa 3.

```bash
git --version
java -version
node --version
docker --version
specify version
```

### 6.5 Confirma que la plantilla se copió intacta

```bash
ls 01-archaeology/legacy-sifap .github/agents .github/prompts .github/instructions .github/skills
```

---

## Paso 7: activa GitHub Copilot en VS Code (todos)

### 7.1 Inicia sesión

- [ ] **Autentícate en Copilot.**

1. En VS Code, haz clic en el icono de Copilot de la barra de estado inferior.
2. Elige **Sign in with GitHub**.
3. Se abre una ventana del navegador. Haz clic en **Authorize Visual Studio Code**.
4. Vuelve a VS Code. Espera a que aparezca "Copilot ready" cerca de la esquina inferior derecha.

### 7.2 Abre el panel de Copilot Chat

| Sistema operativo | Atajo |
|---|---|
| Mac | Cmd+Ctrl+I |
| Windows / Linux | Ctrl+Alt+I |

### 7.3 Verifica que los tres modos estén disponibles

| Modo | Cuándo usarlo |
|---|---|
| **Ask** | Hacer preguntas, explorar código y debatir opciones |
| **Plan** | Planificar cambios en varios archivos antes de ejecutarlos |
| **Agent** | Delegar una funcionalidad completa mediante una Issue y después revisar la PR |

- [ ] **Confirma que Ask, Plan y Agent aparezcan en la lista desplegable.**

Si **Plan** o **Agent** no aparecen, actualiza VS Code a una versión reciente o usa VS Code Insiders.

### 7.4 Prueba de humo de Copilot

- [ ] **Envía una pregunta de prueba.**

En Copilot Chat, escribe:

```text
¿Qué conjunto de tecnologías usamos en este proyecto?
```

Debería responder **Java 21 + Spring Boot 3.3 + Next.js 15 + PostgreSQL 16**. Si no lo hace, no se está cargando el archivo del proyecto `.github/copilot-instructions.md`. Consulta [Solución de problemas](#solución-de-problemas).

---

## Paso 8: valida los agentes y prompts de tus personas (todos)

### 8.1 Encuentra tu rol

- [ ] **Lee el `PERSONA.md` de ambas personas.**

Abre `05-personas/` en VS Code. Dentro de la carpeta de cada rol, lee `PERSONA.md` de principio a fin (~10 minutos). Te indica:

- Qué haces en las cuatro etapas
- Qué modo de Copilot usar
- Prompts específicos que puedes copiar y pegar
- De quién dependes y quién depende de ti

### 8.2 Valida tu kit

```bash
# Debe enumerar los agentes, prompts, instrucciones y skills consolidados
ls .github/agents .github/prompts .github/instructions .github/skills
```

No copies `.github/*` manualmente. El repositorio consolidado ya incluye todo.

### 8.3 Correspondencia entre personas y kits

| Persona | Kit consolidado |
|---|---|
| Responsable de Producto | `05-personas/01-product-owner/PERSONA.md` |
| Especialista en Requisitos | `05-personas/02-requirements-engineer/PERSONA.md` |
| Arquitecto Empresarial | `05-personas/03-enterprise-architect/PERSONA.md` |
| Arquitecto de Software | `05-personas/04-software-architect/PERSONA.md` |
| Líder Técnico | `05-personas/05-technical-lead/PERSONA.md` |
| Desarrollador | `05-personas/06-developer/PERSONA.md` |
| DBA | `05-personas/07-dba/PERSONA.md` |
| Ingeniero de Calidad | `05-personas/08-qa-engineer/PERSONA.md` |
| Ingeniero DevOps | `05-personas/09-devops-engineer/PERSONA.md` |
| Redactor Técnico | `05-personas/10-tech-writer/PERSONA.md` |

### 8.4 Actualiza el `copilot-instructions.md` del equipo

- [ ] **El líder actualiza `.github/copilot-instructions.md` con los nombres del equipo.**

Busca la sección:

```markdown
## Personas activas en este equipo

- [ ] 01 — Responsable de Producto
- [ ] 02 — Especialista en Requisitos
      ...
```

Marca las casillas y escribe el nombre junto a cada rol:

```markdown
- [x] 01 — Responsable de Producto — Maria Santos
- [x] 02 — Especialista en Requisitos — João Silva
- [x] 03 — Arquitecto Empresarial — Ana Costa
      ...
```

Crea un commit y haz push a `develop`. Las sugerencias de Copilot ahora saben quién está en tu equipo.

---

## Paso 9: instala Spec-Kit (todos)

[**Spec-Kit**](https://github.com/github/spec-kit) es el kit de herramientas oficial de GitHub para el desarrollo guiado por especificaciones. Úsalo para **borradores rápidos de funcionalidades** en la Etapa 2.

### 9.1 Instala Specify CLI en tu portátil

- [ ] **Instala Specify CLI.**

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z
specify version
```

Reemplaza `vX.Y.Z` por la versión más reciente de <https://github.com/github/spec-kit/releases>.

### 9.2 Inicialízalo en el repositorio del equipo

- [ ] **Inicialízalo en la raíz del repositorio.**

```bash
specify init . --integration copilot
```

Esto crea la configuración de `.specify/`, los scripts de automatización y los comandos de barra `/speckit.*` para GitHub Copilot.

### 9.3 Verifica los comandos en Copilot

| Comando | Cuándo usarlo |
|---|---|
| `/speckit.constitution` | Definir principios, estándares y puertas del proyecto |
| `/speckit.specify` | Crear la especificación de la funcionalidad |
| `/speckit.clarify` | Resolver ambigüedades antes del plan |
| `/speckit.plan` | Crear el plan técnico |
| `/speckit.tasks` | Generar tareas implementables |
| `/speckit.analyze` | Comprobar coherencia y cobertura |
| `/speckit.implement` | Implementar la funcionalidad guiándose por la especificación |

### 9.4 Escribe una funcionalidad

En Copilot Chat:

```text
/speckit.specify <describe la funcionalidad que el equipo identificó en el código heredado>. Conserva la trazabilidad al legado con source_legacy en cada requisito.
```

Spec-Kit crea una rama numerada y esta estructura:

```text
specs/<NNN>-<feature>/
└── spec.md
```

Después ejecuta:

```text
/speckit.clarify
/speckit.plan Usa Java 21, Spring Boot 3.3, PostgreSQL 16, Next.js 15 y la arquitectura de Monolito Modular de la inmersión.
/speckit.tasks
```

### 9.5 Regla de la inmersión

Cada requisito que provenga del sistema heredado sigue necesitando `source_legacy:` apuntando a un `.NSN` o `.ddm`. Los requisitos sin equivalente en el legado usan `[GREENFIELD]` con una justificación.

---

## Paso 10: usa el flujo de Spec-Kit (todos)

| Fase | Comando | Salida principal | Persona responsable |
|---|---|---|---|
| Constitución | `/speckit.constitution` | `.specify/memory/constitution.md` | Líder Técnico + Arquitecto |
| Especificación | `/speckit.specify` | `specs/<NNN>-<feature>/spec.md` | Especialista en Requisitos |
| Aclaración | `/speckit.clarify` | Preguntas resueltas en la especificación | Especialista en Requisitos + Responsable de Producto |
| Plan | `/speckit.plan` | `specs/<NNN>-<feature>/plan.md` | Arquitecto de Software |
| Tareas | `/speckit.tasks` | `specs/<NNN>-<feature>/tasks.md` | Líder Técnico |
| Análisis | `/speckit.analyze` | Lagunas e incoherencias | Ingeniero de Calidad + Arquitecto |
| Implementación | `/speckit.implement` | Código + pruebas guiados por la especificación | Desarrollador + Ingeniero de Calidad |

> [!IMPORTANT]
> El equipo revisa explícitamente `spec.md`, `plan.md` y `tasks.md` antes de que comience la implementación (puertas LGTM).

---

## Paso 11: comprende la estrategia de ramas

```text
main                    <- lista para publicación, protegida, requiere 1 revisión
develop                 <- integración de todas las funcionalidades
spec/NNN-feature        <- trabajo de especificación (Etapa 2)
impl/NNN-feature        <- trabajo de implementación (Etapa 3)
infra/NNN-azure         <- trabajo de infraestructura (Etapa 4)
```

### Convención de nombres

| Tipo | Patrón | Ejemplo |
|---|---|---|
| Especificación | `spec/<NNN>-<feature>` | `spec/001-calculo-beneficio` |
| Implementación | `impl/<NNN>-<feature>` | `impl/001-calculo-beneficio` |
| Infraestructura | `infra/<componente>` | `infra/azure-postgres` |

`NNN` es el número de la funcionalidad (coincide con la carpeta de `specs/<NNN>-<feature>/`).

### Crea una rama de funcionalidad

- [ ] **Crea una rama desde `develop`.**

```bash
git checkout develop
git pull

git checkout -b spec/<NNN>-<feature>

git add -A
git commit -m "feat: draft EARS requirements"
git push -u origin spec/<NNN>-<feature>
```

### Abre una pull request

- [ ] **Abre la PR y completa la plantilla.**

1. Después del push, GitHub muestra una URL para crear la PR. Haz clic en ella.
2. Título: usa Conventional Commits - `feat: add feature spec`
3. Completa la plantilla (`.github/PULL_REQUEST_TEMPLATE.md`): qué cambió, REQ-ID, cómo probar e issues vinculadas.
4. Añade al menos una persona revisora que desempeñe otro rol.
5. Haz clic en **Create pull request**.
6. Espera a que la CI esté en verde.
7. Después de la aprobación, haz clic en **Rebase and merge** (no Merge commit ni Squash).
8. Elimina la rama de funcionalidad cuando se te solicite.

---

## Paso 12: flujo diario por persona

### Responsable de Producto / Especialista en Requisitos

```text
1. Lee los hallazgos de la Etapa 1 (glosario y catálogo de reglas de negocio)
2. Ejecuta /speckit.specify "feature-name" con indicaciones sobre source_legacy
3. Ejecuta /speckit.clarify y valida con las personas interesadas (PO + EA)
4. Ejecuta /speckit.plan con las tecnologías de la inmersión y las opciones de arquitectura
5. Ejecuta /speckit.tasks después de que se apruebe el plan
6. Abre una PR en la rama spec/<NNN>-<feature>
7. Entrega el trabajo al Arquitecto de Software (puerta LGTM)
```

### Arquitecto Empresarial / Arquitecto de Software

```text
1. Obtén la versión más reciente de develop
2. git checkout spec/NNN-feature (lee la especificación EARS)
3. Ejecuta /speckit.plan -> produce plan.md, research.md y contratos
4. Añade ADR en docs/adr/ para decisiones no triviales
5. Abre una PR y revisa la sección de diseño de la PR de especificación
6. Entrega el trabajo al Líder Técnico (puerta LGTM)
```

### Líder Técnico

```text
1. Lee el plan.md aprobado y los ADR
2. Ejecuta /speckit.tasks -> produce tasks.md con ID de tareas (T001, T002, ...)
3. Abre una GitHub Issue por tarea usando .github/ISSUE_TEMPLATE/task.yml
4. Asigna cada issue a Desarrollador / DBA / QA
5. Observa si la CI está en verde o rojo y ayuda a las personas a avanzar
```

### Desarrollador

```text
1. Elige una issue de tarea (T-NNN) del tablero del equipo
2. git checkout -b impl/NNN-feature (desde develop)
3. En Copilot, ejecuta /implement (prompt activo: .github/prompts/persona-developer-implement.prompt.md)
4. Primero las pruebas (rojo), luego el código (verde) y después refactoriza
5. Ejecuta la puerta local definida por el prototipo (./mvnw verify, npm test, npm run lint o equivalente)
6. git commit, git push, abrir PR
7. Marca la issue con "Closes #NN" en el cuerpo de la PR
```

### DBA

```text
1. Elige una tarea de esquema o migración
2. git checkout -b impl/NNN-feature
3. Añade la migración Flyway en backend/src/main/resources/db/migration/
4. Ejecuta el prompt /migration (prompt activo: .github/prompts/persona-dba-migration.prompt.md)
5. Prueba localmente con el Postgres del equipo o con Testcontainers
6. Abre una PR y solicita la revisión del Desarrollador
```

### Ingeniero de Calidad

```text
1. Sigue cada PR de implementación
2. Ejecuta el prompt /coverage-gaps para encontrar REQ-ID sin cobertura
3. Añade pruebas en la rama de implementación (en pareja con el Desarrollador)
4. El prompt /test-strategy produce un plan de pruebas para nuevas funcionalidades
5. Bloquea la integración si la cobertura cae por debajo del 70%
```

### Ingeniero DevOps

```text
1. Elige una tarea de infraestructura (configuración de Azure, CI/CD o despliegue)
2. git checkout -b infra/NNN-azure-foo
3. Edita los módulos Terraform de infra/
4. Ejecuta terraform fmt + terraform validate localmente
5. Ejecuta el prompt /iac-module (prompt activo: .github/prompts/persona-devops-engineer-iac-module.prompt.md)
6. Abre una PR; workflows/ci.yml ejecuta la validación de Terraform
```

### Redactor Técnico

```text
1. Después de cada integración en develop, busca desalineaciones en los ADR y el glosario
2. Ejecuta el prompt /doc-drift (prompt activo: .github/prompts/persona-tech-writer-doc-drift.prompt.md)
3. Actualiza 01-archaeology/glossary.md, docs/adr/ y los README
4. Abre una PR pequeña por cada actualización de documentación
```

---

## Paso 13: prueba de humo (todo el equipo, a las 10:30)

El líder del equipo lee cada punto en voz alta. Cada persona lo confirma en su propio portátil.

- [ ] Cada integrante clonó `workshop-team-XX`
- [ ] Cada integrante puede ejecutar `git checkout develop && git pull origin develop` (acceso de escritura confirmado)
- [ ] La CI se ejecutó en el commit inicial de la plantilla: marca verde en la pestaña **Actions**
- [ ] El equipo confirmó que no hay un prototipo listo: `backend/`, `frontend/` y los archivos Docker/de infraestructura se crearán en la Etapa 3 cuando sean necesarios
- [ ] Cada Copilot Chat responde correctamente a "¿Qué conjunto de tecnologías usamos en este proyecto?"
- [ ] Cada integrante instaló el Spec-Kit oficial: `specify version` muestra una versión
- [ ] Los comandos `/speckit.*` aparecen en Copilot después de ejecutar `specify init . --integration copilot`
- [ ] Al abrir **New issue** en GitHub aparecen tres plantillas (spec, adr, task)
- [ ] Los cinco integrantes del equipo aparecen en Settings -> Collaborators del repositorio
- [ ] Cada persona leyó su ficha en `05-personas/XX-role/PERSONA.md`
- [ ] El líder del equipo actualizó `.github/copilot-instructions.md` con los nombres de todos
- [ ] `.github/agents`, `.github/prompts`, `.github/instructions` y `.github/skills` están presentes y consolidados
- [ ] Se leyó [`00-TEAM-FLOW.md`](00-TEAM-FLOW.md) en voz alta una vez (el cronograma del día)

Cuando los 13 puntos estén en verde, tu equipo estará listo para la **Etapa 1: arqueología**.

---

## Solución de problemas

<details>
<summary><strong>Errores comunes y cómo corregirlos</strong> - haz clic para ampliar</summary>

### Copilot no lee `copilot-instructions.md`

- VS Code debe estar abierto **en la raíz del repositorio**, no dentro de una subcarpeta.
- Reinicia VS Code después de editar el archivo.
- En Settings, confirma que `github.copilot.chat.useProjectInstructions` sea `true` (valor predeterminado en 1.93+).

### No aparece el botón **Use this template**

- Confirma que abriste el repositorio principal de la inmersión, no el de otro equipo.
- Si sigue sin aparecer, pide a las personas facilitadoras que confirmen si **Template repository** está habilitado en Settings -> General.
- No uses **Import repository**. La vía oficial de la inmersión es **Use this template**.

### El nombre `workshop-team-XX` ya está en uso

- Confirma que estás usando el número de equipo correcto.
- Si las personas facilitadoras lo permiten, añade un sufijo corto, por ejemplo, `workshop-team-01b`.

### `specify init` falla o no aparecen los comandos `/speckit.*`

- Confirma que estén instalados `uv`, Python 3.11+ y Git.
- Ejecuta `specify version` para confirmar que instalaste la CLI oficial.
- Ejecuta de nuevo `specify init . --integration copilot` en la raíz del repositorio.
- Recarga VS Code: paleta de comandos -> **Developer: Reload Window**.

### La CI falla en el primer push con "no tests found"

- Es lo esperado. El workflow `ci.yml` solo ejecuta trabajos cuyas rutas hayan cambiado. Cuando se incorpore código de backend o frontend, se ejecutarán los trabajos correspondientes.

### Docker no está disponible cuando el equipo lo necesita

- Es posible que los puertos 5432, 8080 o 3000 ya estén en uso. Ejecuta:

  ```bash
  lsof -i :5432 -i :8080 -i :3000
  ```

  Termina el proceso que está usando el puerto (`kill -9 <PID>`) antes de iniciar el entorno creado por el equipo.

- Asegúrate de que Docker Desktop esté **en ejecución** (el icono de la barra de menús debe estar fijo, no animado).

### El modo Agent de Copilot no aparece en la lista desplegable

- Actualiza VS Code a la **versión 1.93 o posterior** (o instala **VS Code Insiders**).
- Recarga la ventana: paleta de comandos -> **Developer: Reload Window**.

### "Permission denied" al hacer push a `main`

- La protección de ramas (Paso 4) está cumpliendo su función. Abre una pull request desde tu rama de funcionalidad.

### Actualicé `develop`, pero mi IDE sigue mostrando código antiguo

- Recarga la ventana de VS Code: paleta de comandos -> **Developer: Reload Window**.
- Si VS Code sigue mostrando un estado desactualizado, cierra y vuelve a abrir la carpeta del repositorio.

### La carpeta `.github/` parece dañada

- No copies kits de personas manualmente sobre el `.github/` consolidado.
- Si algo parece dañado, restáuralo con `git checkout develop -- .github/` o pide ayuda a una persona facilitadora antes de intentar sobrescribir archivos.

</details>

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Flujo del equipo](00-TEAM-FLOW.md)<br/><sub>Cronograma de 8 horas, transiciones entre parejas, regla de los 20 minutos y definición de terminado.</sub> | [Descripción general de las 10 personas](05-personas/OVERVIEW.md)<br/><sub>Tabla comparativa: pareja, liderazgo de etapa y opciones de emergencia.</sub> |

<sub>[Volver al índice del kit](README.md)</sub>
