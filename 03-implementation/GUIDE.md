# Etapa 3 — Implementación (70 min)

> **Ruta:** [Kit del equipo](../README.md) › [Etapa 3](README.md) › **GUÍA**

**Esta guía conduce a las Parejas 3 y 4 en la construcción del prototipo funcional de SIFAP 2.0, desde la estructura inicial hasta las funcionalidades implementadas con pruebas, migraciones y trazabilidad a los REQ-ID.**

![Etapa 3](https://img.shields.io/badge/Stage-3%20%C2%B7%20Implementation-171717?style=flat-square) ![Duración: 70 min](https://img.shields.io/badge/Duration-70%20min-737373?style=flat-square) ![Horario: 15:00–16:10](https://img.shields.io/badge/Time-15%3A00--16%3A10-A3A3A3?style=flat-square)

| Campo | Valor |
|---|---|
| **Público objetivo** | Lideran la Pareja 3 (TL + Desarrollador) y la Pareja 4 (DBA + QA); la Pareja 5 prepara la estructura de CI |
| **Prerrequisitos** | Transición H2 aceptada; `spec.md`, `plan.md` y `tasks.md` listos con REQ-ID y `source_legacy:` |
| **Tiempo estimado** | 70 min |
| **Etapa** | Etapa 3 — Implementación |
| **Resultado esperado** | Backend y frontend funcionales; pruebas aprobadas; commits con `Implements REQ-XXX` |

> [!IMPORTANT]
> Consulta el cronograma exacto en [`00-TEAM-FLOW.md`](../00-TEAM-FLOW.md). Las insignias muestran solo la duración de la etapa.

---

## Concepto: Monolito Modular

Un Monolito Modular es una arquitectura en la que los contextos delimitados son módulos Java independientes dentro de una única JVM, con límites explícitos entre ellos. Es el punto de partida recomendado para modernizar SIFAP antes de cualquier extracción futura de microservicios.

**Por qué importa:** el SIFAP heredado tiene acoplamiento implícito entre módulos mediante memoria compartida (Natural/Adabas). El Monolito Modular hace que este acoplamiento sea explícito y controlado. Cada módulo expone solo la interfaz que necesitan los demás módulos.

**Strangler Fig:** patrón de migración que rodea gradualmente el sistema heredado. El prototipo de la Etapa 3 no necesita reemplazar todo SIFAP. Moderniza un contexto delimitado a la vez y mantén activo el sistema heredado para las partes que aún no se hayan migrado.

---

## Concepto: Testcontainers

Testcontainers es una biblioteca Java que inicia contenedores Docker reales durante las pruebas. En lugar de simular PostgreSQL con una base de datos en memoria (H2), las pruebas usan el motor de base de datos real de producción.

**Por qué importa:** las pruebas con H2 pueden aprobarse y luego fallar con PostgreSQL debido a diferencias en SQL, tipos y comportamiento de las transacciones. Testcontainers elimina esta divergencia.

**Error común:** olvidar iniciar Docker Desktop antes de ejecutar `./mvnw test`. El error es `Could not find a valid Docker environment`.

---

## Concepto: TDD (desarrollo guiado por pruebas)

TDD es la práctica de escribir la prueba antes de la implementación. El ciclo es: escribir una prueba que falle (rojo), implementar el código mínimo necesario para que pase (verde) y mejorar el código sin romper la prueba (refactorizar).

**En SIFAP:** antes de implementar el cálculo de ajuste de beneficios (REQ-042), escribe una prueba que valide los criterios de aceptación definidos en `spec.md`. La prueba falla hasta que se implementa la lógica.

---

## Criterios de preparación — antes de empezar

> [!IMPORTANT]
> Confirma todos los puntos antes de iniciar esta etapa:

- [ ] El PO aceptó la transición H2.
- [ ] La persona `@builder` está seleccionada en Copilot Chat.
- [ ] `specs/<NNN>-<feature>/spec.md` tiene REQ-ID con entradas `source_legacy:` válidas.
- [ ] `specs/<NNN>-<feature>/plan.md` contiene las decisiones necesarias para la primera tarea.
- [ ] El equipo definió las rutas iniciales del prototipo (`backend/`, `frontend/` y, si es necesario, `infra/`).
- [ ] Se creó la rama `impl/<NNN>-<feature>` desde la rama `develop` actualizada.

---

## Objetivo

Crea desde cero el primer prototipo funcional de SIFAP 2.0 e implementa las funcionalidades priorizadas en la Etapa 2. El kit no proporciona una base de código, contenerización lista ni un enlace simbólico a un prototipo. El equipo crea la estructura, implementa las funcionalidades y escribe las pruebas. Cada funcionalidad debe ser trazable a un REQ-ID.

La Etapa 3 es donde la especificación se encuentra con la realidad. Un requisito EARS bien escrito de la Etapa 2 se convierte en una prueba que se aprueba o falla. Cada commit incluye una referencia `Implements REQ-XXX:` en el mensaje. Sin ella, termina la trazabilidad.

---

## Primeros 15 minutos: creación de la estructura inicial

### Paso 1 — Crea las carpetas del prototipo

```bash
mkdir -p backend frontend
```

### Paso 2 — Crea la estructura mínima

- **Backend:** Spring Boot 3.3, Java 21, Maven Wrapper y paquete base `br.gov.sifap`.
- **Frontend:** Next.js 15 App Router, TypeScript estricto y Tailwind CSS.
- **Base de datos:** migraciones Flyway en `backend/src/main/resources/db/migration/`.

> [!CAUTION]
> No uses código ni contenerización de prototipos externos. El objetivo de la inmersión es que el equipo construya el prototipo moderno a partir de su lectura del sistema heredado.

### Paso 3 — Verifica que la configuración mínima funcione

- Backend: `cd backend && ./mvnw test` debe aprobarse en cuanto exista la estructura inicial.
- Frontend: `cd frontend && npm test` (o el comando definido por el equipo) debe aprobarse.
- Crea `infra/` solo cuando el equipo empiece a describir IaC o la composición local.

---

## Estructura del backend

```text
src/main/java/br/gov/client/sifap/
└── <feature>/
    ├── domain/
    ├── application/
    └── infrastructure/
```

### Capas (de dentro hacia fuera)

| Capa | Responsabilidad | Ejemplos |
|---|---|---|
| **domain** | Reglas de negocio puras sin dependencia del framework | Enumeraciones de estado, interfaces de repositorio y objetos de valor |
| **application** | Casos de uso y orquestación | Servicios y DTO de solicitud/respuesta |
| **infrastructure** | Detalles técnicos y entrada/salida | Controladores REST, entidades JPA y repositorios Spring Data |

> [!IMPORTANT]
> La capa `domain` nunca importa clases de `infrastructure`. El flujo siempre es Controller → Service → Repository (interfaz en domain, implementación en infrastructure).

---

## Paso a paso: añade una funcionalidad

- [ ] **Vuelve a leer el requisito EARS.** Abre `spec.md` y relee el REQ-ID que vas a implementar.
- [ ] **Verifica la evidencia del legado.** Confirma `source_legacy:` y vuelve a leer el programa `.NSN` correspondiente.
- [ ] **Modela el comportamiento.** Define la entidad, los casos de uso y los contratos REST en el contexto correcto.
- [ ] **Crea la migración Flyway.** Añade `V<N>__description.sql` en `db/migration/`.
- [ ] **Escribe primero la prueba.** Crea la prueba de integración antes de implementar (TDD).
- [ ] **Implementa el código.** Controller → Service → Repository, siguiendo las capas.
- [ ] **Ejecuta las pruebas.** `./mvnw test` debe aprobarse con Docker en ejecución.
- [ ] **Crea el commit del cambio.** Incluye `Implements REQ-XXX` en el mensaje.

> [!CAUTION]
> Usa Flyway. Nunca modifiques migraciones existentes. Crea siempre nuevas (`V2__`, `V3__`, etc.). Editar una migración antigua corrompe el historial del esquema y rompe los despliegues.

---

## Flujo con Copilot Plan

Para implementar funcionalidades con trazabilidad:

1. Selecciona los archivos relevantes en VS Code (Ctrl+clic).
2. Abre Copilot en modo Plan.
3. Describe el cambio en lenguaje natural y solicita un plan antes de ejecutarlo:
   > "Planifica la implementación del requisito EARS `REQ-XXX`. Enumera los archivos involucrados, los riesgos y las pruebas necesarias. No implementes todavía."
4. Revisa el plan y el diff antes de aceptarlos. Verifica que sigan la arquitectura.
5. Ejecuta las pruebas para confirmarlo.

> [!TIP]
> Prefiere el modo Plan para funcionalidades pequeñas. El modo Agent de Copilot es más adecuado para la Etapa 4, que concede mayor autonomía de alcance.

---

## Pruebas

### Ejecuta todas las pruebas

```bash
cd backend
./mvnw test
```

**Prerrequisito:** Docker debe estar en ejecución. Las pruebas usan Testcontainers para iniciar una instancia real de PostgreSQL.

### Tipos de pruebas esperados

| Tipo | Clase | Qué prueba |
|---|---|---|
| Unitaria | `*ServiceTest.java` | Lógica de negocio aislada |
| Integración | `*ControllerTest.java` | Endpoint completo (HTTP → DB) |
| Repositorio | `*RepositoryTest.java` | Consultas personalizadas |

---

## Frontend

### Ejecuta el frontend localmente

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:3000`.

### Arquitectura del frontend

El frontend usa Next.js 15 con App Router y Server Components:

```text
src/app/
├── layout.tsx
├── page.tsx
└── <feature>/
    └── page.tsx
```

| Tipo de componente | Cuándo usarlo |
|---|---|
| **Server Component** (predeterminado) | Obtención de datos en el servidor; sin JavaScript del lado del cliente |
| **Client Component** (`"use client"`) | Interactividad: formularios, modales y estado local |

---

## Trazabilidad: requisito → código → prueba

Documenta la trazabilidad de cada funcionalidad implementada:

| Requisito EARS | Archivo de implementación | Archivo de prueba |
|---|---|---|
| `REQ-XXX` | `<!-- completar -->` | `<!-- completar -->` |

Cada commit que implemente un comportamiento de la especificación debe incluir `Implements REQ-XXX` en el mensaje. Esto cierra el ciclo especificación → código → prueba y permite que `/speckit.analyze` detecte desalineaciones.

---

<details>
<summary><strong>Errores habituales — ampliar</strong></summary>

| Si estás haciendo esto | Haz esto en su lugar |
|---|---|
| Una rama enorme de ocho horas | Usa commits pequeños y PR pequeñas. Una funcionalidad = una PR |
| Implementar sin pruebas y planear "hacerlas después" | Escribe la prueba junto con el código |
| Editar una migración Flyway antigua | Nunca lo hagas. Crea siempre una migración nueva (`V5__`, `V6__`...) |
| Crear un endpoint sin `@Valid` en el DTO | Usa siempre Bean Validation en el controlador |
| Mezclar lógica de dominio en el controlador | El controlador llama a un servicio. La lógica pertenece al servicio o al dominio |
| Importar clases de infraestructura entre contextos | Preserva los límites definidos por el equipo |
| Crear commits sin `Implements REQ-XXX` | La trazabilidad valida el trabajo de la etapa anterior |

</details>

---

<details>
<summary><strong>Solución de problemas — ampliar</strong></summary>

| Problema | Solución |
|---|---|
| El entorno local no se inicia | Comprueba Java 21, Node, las variables de entorno y si los puertos 5432/8080/3000 están libres |
| El backend no puede conectarse a PostgreSQL | Comprueba la URL configurada y si está en ejecución la instancia de PostgreSQL seleccionada por el equipo |
| El frontend muestra "Failed to load" | ¿Está en ejecución el backend? Prueba con `curl http://localhost:8080/actuator/health` |
| Falla una prueba con Testcontainers | Docker Desktop debe estar en ejecución. Alternativa: una prueba unitaria con Mockito |
| La migración falla al iniciar | Nunca edites una migración existente. Crea una nueva (`V5__`, `V6__`...) |
| Error de importación en `mvn test-compile` | Verifica que el paquete siga `domain/` → `application/` → `infrastructure/` |
| Swagger UI no aparece | Prueba `http://localhost:8080/swagger-ui/index.html` |

</details>

---

## Criterios de finalización

- [ ] El flujo priorizado por el equipo está implementado y documentado.
- [ ] La interfaz necesaria para ese flujo está disponible.
- [ ] Las pruebas definidas por el equipo se aprueban con `./mvnw test`.
- [ ] La ejecución local está documentada en el prototipo.
- [ ] Los contratos expuestos están documentados con Swagger/OpenAPI.
- [ ] La regla priorizada de la Etapa 1 está implementada y probada.
- [ ] Cada commit incluye `Implements REQ-XXX` en el mensaje.

---

## Siguiente paso

Durante la transición H3 (alrededor de las 17:00), la Pareja 3 entrega código funcional a la Pareja 5 (Operaciones), que se ocupa de Terraform y CI/CD en la Etapa 4. La Pareja 4 continúa las pruebas finales.

Consulta [`../04-evolution/GUIDE.md`](../04-evolution/GUIDE.md) para la siguiente etapa.

---

<details>
<summary><strong>Prompts útiles para Copilot Chat — ampliar</strong></summary>

1. "Crea un endpoint REST para [feature] siguiendo la arquitectura existente."
2. "Escribe una prueba de integración para el endpoint [endpoint]."
3. "Añade Bean Validation al DTO [class]."
4. "Crea una migración Flyway para añadir [table/column]."
5. "Implementa la regla de negocio BR-XXX: [descripción de la regla]."
6. "Crea un React Server Component para listar [entity]."
7. "Añade manejo de errores para [scenario]."
8. "Refactoriza este servicio para separar la lógica de [responsibility]."

</details>

> [!TIP]
> No intentes implementarlo todo. Céntrate en la calidad, no en la cantidad. Un endpoint bien construido con pruebas, validación y documentación vale más que cinco endpoints rotos.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Etapa 2 — Especificación](../02-modern-spec/GUIDE.md)<br/><sub>14:00–15:00 · Escribir requisitos EARS, ADR y diagramas C4.</sub> | [Etapa 4 — Evolución](../04-evolution/GUIDE.md)<br/><sub>16:10–16:50 · Copilot Agent + Terraform + CI/CD.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
