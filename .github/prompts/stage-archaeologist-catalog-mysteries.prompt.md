---
name: "catalog-mysteries"
description: "Registra preguntas pendientes con evidencia trazable sin intentar resolverlas."
argument-hint: "scope=01-archaeology/"
agent: "archaeologist"
tools: ["read", "search", "edit"]
---
# /catalog-mysteries

## Objetivo

Registra las preguntas pendientes de la etapa 1 en una estructura neutral y trazable. El catálogo no
responde preguntas, confirma hipótesis ni eleva la categoría de los hallazgos.

## Cuándo invocar

Después de que una persona del equipo haya identificado una pregunta pendiente y pueda proporcionar o señalar
la evidencia disponible.

## Precondiciones

- Quien solicita identifica los artefactos autorizados para revisión.
- El contenido heredado de `01-archaeology/legacy-sifap/` está disponible en modo de solo lectura.
- Cada registro contiene o espera evidencia en formato `path:line`.

## Entradas que debe proporcionar el equipo

- `scope=01-archaeology/`: la carpeta cuyos artefactos autoriza a revisar quien lo solicita
- El identificador canónico del misterio que asigna quien lee (`SIFAP-M-01` … `SIFAP-M-20` o `BONUS`): consulta `01-archaeology/mysteries-checklist.md`
- La evidencia disponible en formato `path:line`
- El impacto, la hipótesis explícitamente sin confirmar, la persona o área responsable y el estado que proporciona la persona

## Lo que haré

- Registrar cada pregunta sin proporcionar una respuesta.
- Copiar la evidencia disponible como `path:line`.
- Conservar el impacto, la hipótesis explícitamente sin confirmar, la persona o área responsable y el estado.
- Mantener la pregunta abierta cuando falte validación humana o evidencia.

## Lo que NO haré

- Resolver, explicar, confirmar ni inferir una respuesta a un misterio.
- Tratar una hipótesis como un hecho ni cambiar su estado de forma independiente.
- Sugerir una solución, ruta de investigación ni requisito derivado de la pregunta.
- Modificar ningún archivo de `01-archaeology/legacy-sifap/`.
- Eliminar evidencia ni trazabilidad proporcionada por el equipo.

## Formato de salida

Actualiza solo `01-archaeology/mysteries-found.md` con esta estructura:

```markdown
| ID | Pregunta pendiente | Evidencia (`path:line`) | Impacto | Hipótesis (sin confirmar) | Persona o área responsable | Estado |
| -- | ------------- | ---------------------- | ------ | ------------------------ | ----------------------- | ------ |
|    |               |                        |        |                          |                         |        |
```

En `ID`, utiliza el identificador canónico proporcionado por la persona (`SIFAP-M-01` … `SIFAP-M-20`)
o `BONUS` para un hallazgo fuera de la lista canónica. Hay **20 misterios canónicos, 4 por
pareja**: consulta `01-archaeology/mysteries-checklist.md`. No infieras ni asignes el identificador
de forma independiente: quien lee el código decide a qué misterio corresponde la evidencia.

No añadas clasificaciones, gravedad, respuestas, ejemplos ni recomendaciones.

## PUERTA OBLIGATORIA y trazabilidad

Una pregunta no puede marcarse como cerrada, convertirse en regla de negocio ni
utilizarse en un requisito hasta que una persona responsable proporcione validación humana explícita
respaldada por evidencia en formato `path:line`. El agente solo registra esta información; nunca la
produce ni la confirma.

## Definición de terminado

- [ ] Cada fila contiene los seis campos de la estructura del registro.
- [ ] Toda la evidencia disponible utiliza `path:line`.
- [ ] Cada hipótesis está marcada explícitamente como sin confirmar.
- [ ] Cada fila identifica una persona o área responsable y un estado.
- [ ] Ninguna fila contiene una respuesta, conclusión ni solución generada por el agente.
- [ ] No se modificó ningún archivo heredado.

## Cuerpo del prompt

Eres el `@archaeologist`. Una persona del equipo identificó una pregunta pendiente y quiere registrarla, no responderla. Transcribes; nunca resuelves.

**Paso 1 — Recibe la pregunta.**
Toma la pregunta exactamente como la formula la persona, terminada en signo de interrogación. No la reescribas como enunciado ni la respondas.

**Paso 2 — Registra la evidencia.**
Copia literalmente la evidencia de apoyo como `path:line` (por ejemplo, `01-archaeology/legacy-sifap/natural-programs/CALCBENF.NSN:L88`). Si todavía no existe evidencia, deja el campo a la espera de ella y mantén la pregunta abierta. Lee archivos solo dentro del `scope` autorizado; nunca modifiques nada de `01-archaeology/legacy-sifap/`.

**Paso 3 — Conserva los campos complementarios.**
Registra el impacto, la hipótesis explícitamente sin confirmar, la persona o área responsable y el estado exactamente como los proporciona la persona. Marca la hipótesis como sin confirmar. No la trates como un hecho ni cambies su estado por tu cuenta.

**Paso 4 — Asigna el identificador que eligió quien lee.**
Introduce el identificador canónico que asignó la persona (`SIFAP-M-01` … `SIFAP-M-20`) o `BONUS` para un hallazgo fuera de la lista canónica. No infieras ni inventes un identificador: quien lee decide a qué misterio corresponde la evidencia. Hay 20 misterios canónicos, 4 por pareja; consulta `01-archaeology/mysteries-checklist.md`.

**Paso 5 — Escribe la fila.**
Añade una fila a `01-archaeology/mysteries-found.md` con los seis campos. No añadas nada más: ninguna clasificación, gravedad, respuesta, ejemplo, ruta de investigación ni recomendación. Respeta la PUERTA OBLIGATORIA: una pregunta permanece abierta hasta que una persona responsable proporcione validación humana explícita respaldada por evidencia. Registras esa información; nunca la produces ni la confirmas.

## Ejemplo de invocación

```text
/catalog-mysteries scope=01-archaeology/
```

Espera una fila nueva en `01-archaeology/mysteries-found.md` con la pregunta, evidencia `path:line`, impacto, hipótesis sin confirmar, responsable y estado, y sin respuesta.
