# Runbook

![Tipo: runbook](https://img.shields.io/badge/Type-Runbook-171717?style=flat-square)
![Responsable: DevOps](https://img.shields.io/badge/Owner-DevOps-737373?style=flat-square)

> **Ruta:** [Kit del equipo](../README.md) › [Documentación](README.md) › **Runbook**

**Guía operativa para ejecutar, verificar y diagnosticar el entorno de la inmersión.**

| Campo | Valor |
|---|---|
| **Público objetivo** | Ingeniero DevOps y todo el equipo |
| **Prerrequisitos** | Configuración local completada según [`00-SETUP.md`](../00-SETUP.md) |
| **Resultado esperado** | Entorno local funcional, CI comprensible y solicitud de ayuda adecuada |

---

## Comprobaciones iniciales (primer uso)

- [ ] **Verifica los prerrequisitos** — ejecuta cada línea y confirma que no haya errores:

```bash
git --version
java -version
node --version
docker --version
specify version
```

> [!NOTE]
> El kit no incluye un prototipo listo. Cuando el equipo cree `backend/`, `frontend/` y, si es necesario, `infra/`, registra aquí los comandos reales de ejecución.

Después de crear el prototipo, documenta:

| Servicio | URL / Comando |
|---|---|
| Estado de salud del backend | — |
| Swagger UI | — |
| Frontend local | — |
| Credenciales de demostración | — |

---

## Rutina diaria

- [ ] **Comprueba el estado del repositorio:**

```bash
git status
```

- [ ] **Ejecuta las pruebas del backend** (cuando exista `backend/`):

```bash
cd backend && ./mvnw test
```

- [ ] **Ejecuta las pruebas del frontend** (cuando exista `frontend/`):

```bash
cd frontend && npm test
```

---

## CI — Comprende los workflows

La CI se ejecuta automáticamente con los pushes a `main`, `develop`, `spec/**` e `impl/**`.

| Archivo de workflow | Qué verifica | Cuándo se ejecuta |
|---|---|---|
| `ci.yml` | `mvn verify` del backend, lint + pruebas + comprobación de tipos del frontend, fmt + validate de Terraform | En cada push y PR |
| `spec-quality.yml` | markdownlint y trazabilidad de REQ-ID | Cuando cambian archivos `.md` o `specs/` |

- [ ] **Cuando falle la CI** — abre la pestaña Actions de GitHub, selecciona la ejecución fallida y lee el log.
- [ ] **Corrige localmente** — reproduce el error con los comandos del prototipo creado por el equipo antes de volver a hacer push.

---

## Azure — Etapa 4

En la Etapa 4, el equipo aplica Terraform a una suscripción de pruebas proporcionada por las personas facilitadoras.

> [!CAUTION]
> Cada equipo tiene una única cuota de suscripción. Etiqueta cada recurso con `team=workshop-XX` o `apply` fallará.

```bash
cd infra
terraform init
terraform plan -var-file=envs/dev/terraform.tfvars
terraform apply -var-file=envs/dev/terraform.tfvars
```

---

## Problemas comunes

| Síntoma | Causa probable | Corrección | Cómo confirmarlo |
|---|---|---|---|
| El entorno local se bloquea | El puerto 5432, 8080 o 3000 ya está en uso | Ejecuta `lsof -i :5432` y detén el proceso | El servicio se inicia sin un error de puerto |
| `mvn verify` falla en Testcontainers | Docker no está en ejecución | Inicia Docker Desktop | Las pruebas se aprueban en la siguiente ejecución |
| `pnpm test` falla en las instantáneas | El componente se modificó intencionalmente | Ejecuta `pnpm test -- -u` para actualizar las instantáneas | Las pruebas se aprueban después de la actualización |
| Se rechaza `terraform apply` | El recurso carece de la etiqueta `team=` | Añade la etiqueta al recurso que falla | `terraform plan` no presenta errores de validación |
| GitHub Actions no puede acceder a Azure | No coincide la declaración del sujeto OIDC | Ejecuta de nuevo `az ad sp create-for-rbac` para el equipo | El workflow se aprueba en la siguiente ejecución |

---

## Cuándo pedir ayuda a la persona facilitadora

- [ ] El build lleva más de 20 minutos fallando sin solución.
- [ ] La suscripción de Azure parece estar suspendida.
- [ ] Se ejecutó por error una acción irreversible, como `terraform destroy`.

Usa el formato de solicitud de ayuda de tres líneas descrito en [`00-TEAM-FLOW.md §4`](../00-TEAM-FLOW.md).

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [FAQ](FAQ.md)<br/><sub>Preguntas frecuentes.</sub> | [Solución de problemas](troubleshooting.md)<br/><sub>Errores comunes y soluciones.</sub> |

<sub>[Volver al índice del kit](README.md)</sub>
