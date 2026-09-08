# Referencia para detectar el stack

Carga este archivo cuando el stack tecnológico sea ambiguo, por ejemplo, si hay varios manifiestos, extensiones de archivo desconocidas o ningún `package.json` / `go.mod` evidente.

---

## Archivo de manifiesto → Ecosistema

| Archivo | Ecosistema | Campos principales que debes leer |
|------|-----------|--------------------|
| `package.json` | Node.js / JavaScript / TypeScript | `dependencies`, `devDependencies`, `scripts`, `main`, `type`, `engines` |
| `go.mod` | Go | Ruta del módulo, versión de Go, bloque `require` |
| `requirements.txt` | Python (pip) | Lista de paquetes con versiones fijadas |
| `Pipfile` | Python (pipenv) | `[packages]`, `[dev-packages]`, versión de Python en `[requires]` |
| `pyproject.toml` | Python (poetry / uv / hatch) | `[tool.poetry.dependencies]`, `[project]`, `[build-system]` |
| `setup.py` / `setup.cfg` | Python (setuptools, formato heredado) | `install_requires`, `python_requires` |
| `Cargo.toml` | Rust | `[dependencies]`, `[[bin]]`, `[lib]` |
| `pom.xml` | Java / Kotlin (Maven) | `<dependencies>`, `<artifactId>`, `<groupId>`, `<java.version>` |
| `build.gradle` / `build.gradle.kts` | Java / Kotlin (Gradle) | `dependencies {}`, `sourceCompatibility` |
| `composer.json` | PHP | `require`, `require-dev` |
| `Gemfile` | Ruby | Declaraciones `gem`, restricción de versión de `ruby` |
| `mix.exs` | Elixir | `deps/0`, `elixir: "~> X.Y"` |
| `pubspec.yaml` | Dart / Flutter | `dependencies`, `dev_dependencies`, `environment.sdk` |
| `*.csproj` | .NET / C# | `<PackageReference>`, `<TargetFramework>` |
| `*.sln` | Solución .NET | Referencias a varios proyectos `.csproj` |
| `deno.json` / `deno.jsonc` | Deno (entorno de ejecución de TypeScript) | `imports`, `tasks` |
| `bun.lockb` | Bun (entorno de ejecución de JavaScript) | Archivo de bloqueo binario; consulta las dependencias en `package.json` |

---

## Detección de la versión del entorno de ejecución del lenguaje

| Lenguaje | Dónde encontrar la versión |
|----------|--------------------------|
| Node.js | `.nvmrc`, `.node-version`, `engines.node` en `package.json`, `FROM node:X` de Docker |
| Python | `.python-version`, `pyproject.toml [requires-python]`, Docker `FROM python:X` |
| Go | Primera línea de `go.mod` (`go 1.21`) |
| Java | `<java.version>` en `pom.xml`, `sourceCompatibility` en `build.gradle`, `FROM eclipse-temurin:X` de Docker |
| Ruby | `.ruby-version`, `Gemfile` `ruby 'X.Y.Z'` |
| Rust | `rust-toolchain.toml`, archivo `rust-toolchain` |
| .NET | `<TargetFramework>` en `.csproj` (por ejemplo, `net8.0`) |

---

## Detección del framework (Node.js / TypeScript)

| Dependencia en `package.json` | Framework |
|-----------------------------|-----------|
| `express` | Express.js (servidor HTTP minimalista) |
| `fastify` | Fastify (servidor HTTP de alto rendimiento) |
| `next` | Next.js (React con SSR/SSG; busca el directorio `pages/` o `app/`) |
| `nuxt` | Nuxt.js (SSR/SSG Vue) |
| `@nestjs/core` | NestJS (framework de Node.js con convenciones definidas e inyección de dependencias) |
| `koa` | Koa (centrado en middleware, sin enrutador integrado) |
| `@hapi/hapi` | Hapi |
| `@trpc/server` | tRPC (API con seguridad de tipos, sin esquemas REST/GraphQL) |
| `routing-controllers` | routing-controllers (envoltorio de Express basado en decoradores) |
| `typeorm` | TypeORM (ORM de SQL con decoradores) |
| `prisma` | Prisma (ORM con seguridad de tipos; revisa `prisma/schema.prisma`) |
| `mongoose` | Mongoose (ODM de MongoDB) |
| `sequelize` | Sequelize (ORM de SQL) |
| `drizzle-orm` | Drizzle (ORM ligero de SQL) |
| `react` sin `next` | SPA de React sin framework adicional (busca `react-router-dom`) |
| `vue` sin `nuxt` | SPA de Vue sin framework adicional |

---

## Detección del framework (Python)

| Paquete | Framework |
|---------|-----------|
| `fastapi` | FastAPI (REST asíncrono, documentación OpenAPI automática) |
| `flask` | Flask (framework web WSGI minimalista) |
| `django` | Django (funcionalidades integradas; revisa `settings.py`) |
| `starlette` | Starlette (ASGI, usado a menudo como base de FastAPI) |
| `aiohttp` | aiohttp (cliente y servidor HTTP asíncronos) |
| `sqlalchemy` | SQLAlchemy (ORM de SQL; busca migraciones de `alembic`) |
| `alembic` | Alembic (herramienta de migración de SQLAlchemy) |
| `pydantic` | Pydantic (validación de datos; componente central de FastAPI) |
| `celery` | Celery (cola de tareas distribuida) |

---

## Detección de monorepositorios

Comprueba estos indicios en orden:

1. `pnpm-workspace.yaml`: espacios de trabajo de pnpm
2. `lerna.json`: monorepositorio de Lerna
3. `nx.json`: monorepositorio de Nx (revisa también `workspace.json`)
4. `turbo.json` — Turborepo
5. `rush.json`: Rush (gestor de monorepositorios de Microsoft)
6. `moon.yml` — Moon
7. `package.json` con `"workspaces": [...]`: espacios de trabajo de npm/yarn
8. Presencia de directorios `packages/`, `apps/`, `libs/` o `services/` con su propio `package.json`

Si detectas un monorepositorio, cada espacio de trabajo puede tener dependencias y convenciones **independientes**. Documenta cada subpaquete por separado en `STACK.md` y registra la estructura del monorepositorio en `STRUCTURE.md`.

---

## Detección de alias de rutas de TypeScript

Si `tsconfig.json` contiene una clave `paths`, las importaciones con prefijos no relativos son alias. Determina sus correspondencias antes de documentar la estructura.

```json
// Ejemplo de tsconfig.json
"paths": {
  "@/*": ["./src/*"],
  "@components/*": ["./src/components/*"],
  "@utils/*": ["./src/utils/*"]
}
```

Las importaciones como `import { foo } from '@/utils/bar'` se resuelven a `src/utils/bar`. Documenta la ruta como `src/utils/bar`, no como `@/utils/bar`.

---

## Imagen base de Docker → Entorno de ejecución

Si no hay ningún manifiesto, pero existe un `Dockerfile`, la línea `FROM` revela el entorno de ejecución:

| Patrón de la línea FROM | Entorno de ejecución |
|------------------|---------|
| `FROM node:X` | Node.js X |
| `FROM python:X` | Python X |
| `FROM golang:X` | Go X |
| `FROM eclipse-temurin:X` | Java X (Eclipse Temurin JDK) |
| `FROM mcr.microsoft.com/dotnet/aspnet:X` | .NET X |
| `FROM ruby:X` | Ruby X |
| `FROM rust:X` | Rust X |
| `FROM alpine` (sin más) | Comprueba qué se instala mediante `RUN apk add` |
