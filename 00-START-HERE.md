# Primeros 15 minutos: empieza aquí

> **Ruta:** [Kit del equipo](README.md) › **Empieza aquí**

**Idioma:** español (`espanol`). El [selector de idiomas y las instrucciones de Copilot](README.md#idiomas-del-repositorio) también enlazan a las ediciones en inglés (`main`) y portugués de Brasil (`portugues-br`).

**Si acabas de llegar y quieres saber "¿qué hago ahora?", esta página es para ti.** No importa si eres Responsable de Producto, Redactor Técnico, Desarrollador, analista de negocio o DBA. Los siguientes 15 minutos sirven para todos.

![Inicio](https://img.shields.io/badge/Start-00-171717?style=flat-square) ![Duración: 15 min](https://img.shields.io/badge/Duration-15%20min-737373?style=flat-square) ![Público: todo el equipo](https://img.shields.io/badge/Audience-Whole%20team-A3A3A3?style=flat-square)

| Campo | Valor |
|---|---|
| **Público objetivo** | Cualquier participante, independientemente de su perfil técnico |
| **Prerrequisitos** | Ninguno: esto es solo lectura |
| **Tiempo estimado** | 15 minutos |
| **Etapa** | Preparación (antes de la Etapa 1) |
| **Resultado esperado** | Sabes a qué pareja perteneces, qué harás hoy y qué sucede en la Etapa 1 |

---

## Cronograma de 15 minutos

| Minuto | Qué hacer | Tiempo |
|---|---|---|
| 0-2 | Paso 1 - Confirmar tu pareja | 2 min |
| 2-4 | Paso 2 - Abrir el cronograma del día | 2 min |
| 4-6 | Paso 3 - Abrir el glosario visual | 2 min |
| 6-11 | Paso 4 - Leer el `PERSONA.md` de tu rol | 5 min |
| 11-15 | Paso 5 - Abrir la Etapa 1 y la ficha de Copilot | 4 min |

> [!NOTE]
> ¿Todavía te falta completar la configuración técnica? No hay problema. Estos 15 minutos son solo de lectura. La configuración técnica viene después, guiada por `00-SETUP.md`.

---

## Paso 1: confirma tu pareja (2 min)

El equipo tiene **cinco integrantes y 10 personas** (cada integrante cubre dos personas, en una pareja).

| Pareja | Personas | Qué haces |
|---|---|---|
| **1 - Visión** | Responsable de Producto + Especialista en Requisitos | Decides **qué** se moderniza |
| **2 - Arquitectura** | Arquitecto Empresarial + Arquitecto de Software | Decides **cómo** se organiza el sistema |
| **3 - Implementación** | Líder Técnico + Desarrollador | Escribes el **código** |
| **4 - Calidad** | DBA + Ingeniero de Calidad | Te encargas de los **datos** y las **pruebas** |
| **5 - Operaciones** | Ingeniero DevOps + Redactor Técnico | Te encargas del **despliegue** y la **documentación** |

- [ ] **Confirma tu pareja.** Pregunta a la persona facilitadora a qué pareja perteneces. Anótalo: Mi pareja: _______ - Mis personas: _______ + _______

> [!TIP]
> ¿No programas? No hay problema. PO, RE, Redactor Técnico y parte de QA no necesitan programar. Cada persona tiene una misión clara. No pasarás el día viendo cómo alguien compila Java en silencio.

---

## Paso 2: abre el cronograma del día (2 min)

- [ ] **Abre `00-TEAM-FLOW.md` en una pestaña.** Mira solo el cronograma. El día tiene cuatro etapas.

![Cronograma del día: preparación previa, cuatro etapas y demo, con las tres transiciones H1, H2 y H3](assets/timeline-stages.svg)

**En qué debes fijarte:**

- No puedes saltarte etapas. La Etapa 2 depende de lo que salga de la Etapa 1.
- **Hay una transición entre etapas**: la pareja de una etapa entrega su trabajo a la siguiente (una sincronización en vivo de cinco minutos). Eso es lo que mantiene el día en marcha.
- Si llevas más de **20 minutos** sin poder avanzar, levanta la mano. Esa regla se aplica a todos los equipos.

---

## Paso 3: abre el glosario visual (2 min)

Hoy verás siglas y términos técnicos (EARS, ADR, REQ-ID, DDM, Flyway, JPA...). No necesitas memorizar ninguno. Abre esta página en una pestaña y vuelve cuando lo necesites:

[`07-concepts/03-visual-glossary.md`](07-concepts/03-visual-glossary.md)

Cada término tiene tres líneas: **qué es**, una **analogía cotidiana** y **dónde aparece**. Úsalo siempre que lo necesites.

- [ ] **Abre el glosario en una pestaña del navegador o de VS Code.**

> **Ejemplo:** el término "EARS" puede parecer intimidante. El glosario lo explica así: "una forma estándar de escribir requisitos sin ambigüedades: cada requisito sigue una plantilla con condición, sujeto, acción y resultado esperado".

---

## Paso 4: lee el `PERSONA.md` de tu rol (5 min)

Tienes **dos personas**. Lee el `PERSONA.md` de cada una:

```text
05-personas/01-product-owner/PERSONA.md
05-personas/02-requirements-engineer/PERSONA.md
05-personas/03-enterprise-architect/PERSONA.md
05-personas/04-software-architect/PERSONA.md
05-personas/05-technical-lead/PERSONA.md
05-personas/06-developer/PERSONA.md
05-personas/07-dba/PERSONA.md
05-personas/08-qa-engineer/PERSONA.md
05-personas/09-devops-engineer/PERSONA.md
05-personas/10-tech-writer/PERSONA.md
```

- [ ] **Lee el `PERSONA.md` de la persona A.**
- [ ] **Lee el `PERSONA.md` de la persona B.**

**Céntrate en tres secciones de cada `PERSONA.md`:**

1. **"Dónde participas en cada etapa"** - una tabla de cuatro filas. Muestra si lideras, apoyas u observas en cada etapa.
2. **"Si no puedes avanzar (opciones de emergencia)"** - qué hacer cuando te sientes perdido.
3. **"Tres ejemplos de prompts"** - prompts listos para copiar y pegar en Copilot.

> [!TIP]
> Si tus dos personas parecen "iguales", fíjate en **cuándo** lidera cada una. Rara vez lideran juntas. Por eso dos personas en una pareja pueden cubrir todo el día sin quedarse inactivas.

---

## Paso 5: abre la Etapa 1 y la ficha de Copilot (4 min)

### 5a. Abre la guía de la Etapa 1

[`01-archaeology/GUIDE.md`](01-archaeology/GUIDE.md)

Lee solo:

- La sección **"Cronograma"** (entregables de la Etapa 1)
- La tabla **"Quién lee qué"** (qué tres programas Natural lee tu pareja)
- El horario **11:00-12:00 + 13:30-14:00** (qué hace tu pareja en la Etapa 1)

- [ ] **Lee la sección "Cronograma" del `GUIDE.md` de la Etapa 1.**

### 5b. Abre la ficha de los tres modos de Copilot

[`09-cheat-sheets/copilot-3-modes.md`](09-cheat-sheets/copilot-3-modes.md)

Esto te ahorra 30 minutos de confusión. Copilot tiene tres modos:

| Modo | Cuándo usarlo | Ejemplo del Sistema de Fiscalización y Administración de Pagos (SIFAP) |
|---|---|---|
| **Ask** | Quieres entender algo | *"Explica esta sección del programa Natural SIFAP0001.NSN"* |
| **Plan** | Quieres cambiar código con cuidado | *"Planifica la validación de CPF. Muéstrame el plan antes de hacer cambios."* |
| **Agent** | Quieres delegar una funcionalidad completa | Issue de la Etapa 4 para Copilot Agent |

- [ ] **Abre la ficha en una pestaña.**

### 5c. Si nunca has abierto Copilot Chat

- VS Code -> icono de Copilot en la barra de actividades -> abrir el chat
- ¿No ves el icono? Pregunta a la persona facilitadora. Puede que la extensión no esté habilitada.

---

## Lista de verificación de los primeros 15 minutos

Antes de continuar, comprueba lo siguiente:

- [ ] Sé a qué pareja pertenezco y cuáles son mis dos personas
- [ ] Tengo `00-TEAM-FLOW.md` abierto en una pestaña (el cronograma del día)
- [ ] Tengo `visual-glossary.md` abierto en otra pestaña (para consultar la terminología)
- [ ] Leí los archivos `PERSONA.md` de mis dos personas (y me centré en las tres secciones recomendadas)
- [ ] Sé qué sucederá en la Etapa 1
- [ ] Conozco los tres modos de Copilot (Ask, Plan, Agent)

Si todo está marcado, **estás listo**. Pasa a la configuración técnica (`00-SETUP.md`) o directamente a la Etapa 1, según el cronograma del día.

---

## Primera hora: recorrido minuto a minuto (para quienes nunca han usado VS Code o Copilot)

Si nunca has abierto VS Code, Docker o Copilot, este recorrido literal te prepara en 60 minutos. Síguelo **en orden**, sin saltarte pasos.

> [!TIP]
> Hazlo con alguien de tu pareja a tu lado. Dos personas resuelven los problemas de configuración en la mitad de tiempo.

| Minuto | Acción | Cómo saber que funcionó |
|---:|---|---|
| **00** | Abre un terminal y ejecuta `cd ~/Code/workshop-team-XX` | El nombre del repositorio aparece en el prompt |
| **02** | Ejecuta `code .` para abrir VS Code | VS Code se abre y muestra la lista de carpetas (`00-...`, `01-...`) |
| **04** | Abre el terminal integrado (`` Ctrl+` ``) y ejecuta `git status` | Aparecen la rama y el estado del repositorio sin errores |
| **08** | Valida las herramientas: `java -version`, `node --version`, `git --version` | Cada comando muestra una versión |
| **13** | Valida Docker (no inicies nada todavía): `docker --version` | El comando muestra una versión de Docker |
| **18** | Valida Spec-Kit: `specify version` | El comando muestra una versión de Specify CLI |
| **20** | Vuelve a VS Code -> icono de Copilot en la barra de actividades | El panel de Copilot Chat se abre a la derecha |
| **22** | En el chat, escribe: *"Hola. ¿Qué puedes hacer?"* | Copilot responde y explica los tres modos |
| **25** | Selecciona el agente del día en la lista desplegable del chat | Ves `@archaeologist`, `@architect`, `@builder` y `@evolution` en la lista |
| **28** | Abre dos pestañas en el navegador: [`00-TEAM-FLOW.md`](00-TEAM-FLOW.md) y [`07-concepts/03-visual-glossary.md`](07-concepts/03-visual-glossary.md) | Quedan dos pestañas fijadas para consulta |
| **32** | Abre las carpetas de tus dos personas en `05-personas/0X-.../` y lee cada `PERSONA.md` | Conoces tus dos misiones del día |
| **42** | Valida el `.github/` consolidado: `ls .github/agents .github/prompts .github/skills` | Las carpetas existen y ya contienen agentes, prompts y skills |
| **45** | Recarga VS Code: `Cmd+Shift+P` -> *Reload Window* | Aparecen comandos de barra como `/ears-convert` al escribir `/` en el chat |
| **50** | Abre [`01-archaeology/GUIDE.md`](01-archaeology/GUIDE.md) y lee la sección "Quién lee qué" | Sabes qué tres programas `.NSN` leerá tu pareja |
| **55** | Acuerda con tu pareja quién cubre cada persona | Ambos saben quién hace qué |
| **60** | Estás listo para iniciar la Etapa 1 | - |

### Si algo te bloquea durante este recorrido

| Bloqueo en... | Ve a |
|---|---|
| Minuto 04 (terminal/Git) | [`docs/troubleshooting.md`](docs/troubleshooting.md) - sección *Configuración* |
| Minuto 13 (Docker) | [`docs/troubleshooting.md`](docs/troubleshooting.md) - sección *Docker* |
| Minuto 20 (Copilot no se abre) | [`docs/troubleshooting.md`](docs/troubleshooting.md) - sección *Copilot* |
| Minuto 45 (el comando de barra no funciona) | [`docs/troubleshooting.md`](docs/troubleshooting.md) - sección *"El comando de barra no aparece"* |

> [!WARNING]
> ¿Llevas más de 20 minutos sin poder avanzar? Detente y pide ayuda. Esa regla está definida en `00-TEAM-FLOW.md` §6.

---

## Situaciones comunes en los primeros 15 minutos

<details>
<summary><strong>Preguntas frecuentes - haz clic para ampliar</strong></summary>

| Situación | Qué hacer |
|---|---|
| No sé a qué pareja pertenezco | Pregunta a la persona facilitadora de la sala |
| No encuentro mi `PERSONA.md` | La carpeta es `05-personas/0X-name/PERSONA.md` - confirma el número en el Paso 1 |
| Un término del glosario sigue sin quedar claro | Abre `07-concepts/03-visual-glossary.md` y usa Ctrl+F |
| VS Code o Copilot no se abren | Ve a `00-SETUP.md` § "Paso 1: comprueba los prerrequisitos de tu portátil" |
| El cronograma parece muy ajustado | Lo es. Confía en la distribución por parejas. No lo harás todo a solas |
| No programo. ¿Me perderé? | No. Consulta `01-archaeology/legacy-sifap/HOW-TO-READ-NATURAL.md` (para la Etapa 1) y las opciones de tu `PERSONA.md` |

</details>

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Kit del equipo](README.md)<br/><sub>Centro principal de este repositorio. Empieza allí si es la primera vez que abres el kit.</sub> | [Flujo del equipo](00-TEAM-FLOW.md)<br/><sub>Cronograma de 8 horas, transiciones entre parejas, regla de los 20 minutos y definición de terminado.</sub> |

<sub>[Volver al índice del kit](README.md)</sub>
