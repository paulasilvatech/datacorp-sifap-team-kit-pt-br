---
name: "tdd"
description: "Guía un comportamiento por un ciclo estricto rojo-verde-refactorización, produciendo commits separados red, green y refactor."
argument-hint: "behavior=<behavior> req=REQ-NNN target=<file-or-class>"
agent: "implementer"
tools: ["read", "search", "edit", "execute"]
---
# /tdd

## Objetivo

Produce un ciclo completo guiado por pruebas para un único comportamiento, entregado como tres commits separados: `red`, `green` y `refactor`. No se escribe código de producción sin una prueba que falle, y la primera prueba no se escribe para pasar de inmediato. El comportamiento debe corresponder exactamente a un criterio de aceptación de un `REQ-ID`.

> [!NOTE]
> Una prueba que falle a la vez. Nunca mantengas dos estados rojos. Si la primera prueba resulta difícil de escribir, el diseño te está indicando algo.

## Cuándo invocar

Durante la etapa 3, al descubrir o reforzar un comportamiento pequeño (lógica nueva, un límite o un caso extremo), cuando el diseño aún no es evidente y una red de seguridad basada en escribir primero la prueba aporta el mayor valor.

## Precondiciones

- `specs/<NNN>-<feature>/spec.md` contiene el `REQ-ID` y el criterio de aceptación al que corresponde el comportamiento
- La rama actual es `impl/<NNN>-<feature>`
- El marco de pruebas está disponible: JUnit 5 + AssertJ (Java) o Vitest + Testing Library (TypeScript)
- La estructura inicial del módulo de destino está creada o este ciclo crea su primera clase

## Entradas que debe proporcionar el equipo

- El comportamiento que se descubrirá, en lenguaje claro
- El `REQ-ID` vinculado en `specs/<NNN>-<feature>/spec.md`
- El archivo o clase de destino (si no existe, indícalo: TDD también guía el diseño, por lo que es aceptable crearlo)
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Elegir el caso no trivial más sencillo y escribir una prueba que falle y nombre el comportamiento
- Confirmar que la prueba falla por el motivo correcto y después crear un commit del estado rojo
- Escribir el código de producción mínimo que la haga pasar, confirmar que todo el conjunto de pruebas pasa y después crear un commit
- Refactorizar con una transformación de Fowler manteniendo todas las pruebas satisfactorias y después crear un commit
- Informar del comportamiento descubierto, los tres commits y la siguiente prueba que escribir

## Lo que NO haré

- Escribir la prueba y el código juntos: eso es verificación, no TDD
- Mantener dos pruebas fallidas a la vez ni omitir la fase de refactorización
- Cambiar el comportamiento bajo la apariencia de refactorización: si cambia una aserción, el ciclo queda invalidado
- Probar métodos privados ni simular todos los colaboradores
- Inventar un criterio de aceptación que no contenga la especificación: si el comportamiento no tiene `REQ-ID`, me detengo y lo dirijo a `/update-spec` en lugar de adivinar
- Implementar en este ciclo la siguiente prueba sugerida

## Formato de salida

```markdown
### Comportamiento descubierto
A un pagador exento de impuestos se le cobra una tasa de cero. (REQ-031, criterio 2)

### Commits
| Fase | Mensaje | Archivos | Resultado |
|---|---|---|---|
| red | `test(fees): red — tasa cero para un pagador exento` | `FeeServiceTest.java` | 1 fallida |
| green | `feat(fees): green — implementar REQ-031 (mínimo)` | `FeeService.java` | 12 satisfactorias |
| refactor | `refactor(fees): extraer la comprobación de exención` | `FeeService.java` | 12 satisfactorias |

### Archivo de pruebas
<código fuente completo de las pruebas, con un comentario en línea `// REQ-031`>

### Código de producción
<código fuente completo después de la fase de refactorización>

### Sugerencia para el siguiente ciclo
Añadir una prueba de límites: tasa en el umbral de exención. (No se implementa aquí).
```

## Definición de terminado

- [ ] Existen tres commits separados: `test:` (rojo), `feat:` (verde) y `refactor:`
- [ ] El commit rojo falla de forma reproducible: al restaurar esa revisión, la compilación falla
- [ ] El commit verde contiene lo mínimo necesario para pasar
- [ ] El commit de refactorización cambia solo la estructura: los nombres de pruebas y las aserciones permanecen intactos
- [ ] El conjunto completo de pruebas pasa al final
- [ ] El comportamiento corresponde exactamente a un criterio de aceptación de un `REQ-ID`, citado mediante un comentario en línea `// REQ-NNN`

## Cuerpo del prompt

Eres el `@implementer`. El equipo quiere descubrir un comportamiento escribiendo primero la prueba. Lee [`tdd-workflow`](../skills/tdd-workflow/SKILL.md) antes de comenzar; define el ciclo, las reglas y los antipatrones. Ejecuta exactamente tres fases y no las combines.

**Paso 1 — ROJO: escribe la prueba que falle.**
Elige el caso no trivial más sencillo: no el caso vacío ni el catastrófico. Nombra la prueba `should_<expected>_when_<condition>` y añade un comentario en línea `// REQ-NNN`. Utiliza preparar/actuar/verificar con líneas en blanco entre secciones.

**Paso 2 — ROJO: confirma y crea el commit.**
Ejecuta la prueba. Confirma que falla y lee el mensaje para verificar que falla por el motivo esperado (aserción o compilación, no un error de preparación). Crea el commit `test(<scope>): red — <comportamiento>`.

**Paso 3 — VERDE: escribe el código mínimo que pase.**
Escribe el código de producción mínimo que haga pasar la prueba: se permite «simularlo» con un valor fijo en el primer ciclo. Ejecuta la prueba individual y después el conjunto completo. Ambos deben pasar.

**Paso 4 — VERDE: crea el commit.**
Crea el commit `feat(<scope>): green — implementar REQ-NNN (mínimo)`.

**Paso 5 — REFACTORIZACIÓN: mejora manteniendo las pruebas satisfactorias.**
Busca duplicación, nombres engañosos y obsesión por primitivos. Aplica una transformación de Fowler (extraer método, renombrar, integrar variable). Ejecuta todas las pruebas después de cada paso pequeño; deben seguir pasando.

**Paso 6 — REFACTORIZACIÓN: crea el commit y detente.**
Crea el commit `refactor(<scope>): <descripción>`. Detente cuando el diseño sea suficientemente bueno para el siguiente ciclo, no perfecto.

**Paso 7 — Informa y realiza el traspaso.**
Expresa el comportamiento descubierto en una frase, enumera los tres commits e identifica la siguiente prueba (límite, error o segunda variación) sin implementarla.

Nunca devuelvas `null`, nunca utilices `any` y enmascara el CPF o los importes de prestaciones en cualquier línea de registro. Si el comportamiento no corresponde a un `REQ-ID`, detente y dirígelo a `/update-spec`; no inventes el requisito.

## Ejemplo de invocación

```
/tdd behavior="tasa cero para un pagador exento de impuestos" req=REQ-031 target=FeeService
```
