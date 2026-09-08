---
name: "api-validate"
description: "Valida una implementación de API frente a su contrato OpenAPI/AsyncAPI e informa de cada divergencia con una ubicación explícita para corregirla."
argument-hint: "contract=<openapi.yaml|asyncapi.yaml> impl=<ruta de controladores>"
agent: "software-architect"
tools: ["read", "search"]
---
# /api-validate

## Objetivo

Compara una implementación de API con su contrato OpenAPI/AsyncAPI y expón todas
las divergencias. El entregable es un informe de divergencias clasificadas como incompatibles,
aditivas o de metadatos, con una ubicación explícita de corrección (contrato o código) para cada hallazgo.
La exigencia es cobertura completa: se comprueban todas las operaciones del contrato y todos
los puntos de conexión de la implementación.

## Cuándo invocar

Después de cambiar un controlador o manejador, antes de integrar o durante la revisión cuando
la implementación y su contrato publicado puedan discrepar.

## Precondiciones

- Existe un archivo de contrato (`openapi.yaml` o `asyncapi.yaml`)
- Existe la implementación (controladores o manejadores de mensajes creados por el equipo)
- Las convenciones REST de [`../instructions/backend.instructions.md`](../instructions/backend.instructions.md) son la referencia para rutas y códigos de estado

## Entradas que debe proporcionar el equipo

- La ruta del archivo de contrato
- La ruta de la implementación (controladores, manejadores)
- Ejemplos de cuerpos de solicitud y respuesta, si están disponibles

Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Cargar el contrato y enumerar cada operación
- Para cada operación, comprobar frente al código la ruta, el método, el esquema de solicitud, el esquema de respuesta, los códigos de error y el esquema de autenticación
- Para cada punto de conexión implementado, comprobar si el contrato lo documenta (encontrar los no documentados)
- Validar los esquemas de solicitud y respuesta frente a ejemplos reales cuando se proporcionen
- Clasificar cada divergencia como incompatible, aditiva o de metadatos e identificar dónde corregirla

## Lo que NO haré

- Editar el contrato ni el código: informo de divergencias y propongo correcciones; las aplica la persona responsable
- Inventar operaciones, campos ni códigos de estado que ninguna de las dos partes declare
- Tratar un campo opcional añadido como incompatible: clasifico según el impacto real
- Decidir un cambio irreversible de contrato más allá de identificar la parte más económica y segura que cambiar: eso se redirige a la habilidad [`../skills/adr-draft/SKILL.md`](../skills/adr-draft/SKILL.md)

## Formato de salida

Una tabla Markdown presentada para revisión. Ejemplo (ilustrativo):

```markdown
## Divergencias de API — orders-service

| Punto de conexión | Tipo de divergencia | Gravedad | Ubicación de corrección |
|----------|-----------|----------|--------------|
| GET /api/v1/orders/{id} | Campo de respuesta `status` ausente en el código | Incompatible | código |
| POST /api/v1/orders | El código devuelve un 409 no documentado | Aditiva | contrato |
| GET /api/v1/orders | Descripción discrepante | Metadatos | contrato |
```

## Definición de terminado

- [ ] Se han comprobado todas las operaciones del contrato (100% de cobertura)
- [ ] Se ha comprobado cada punto de conexión implementado frente al contrato
- [ ] Las divergencias incompatibles se enumeran por separado de las aditivas
- [ ] La ubicación de corrección (contrato o código) es explícita para cada elemento
- [ ] Se informa de los puntos de conexión no documentados

## Cuerpo del prompt

Eres el `@software-architect`. El equipo quiere saber si una API y su
contrato siguen coincidiendo.

**Paso 1 — Carga ambas partes.**
Lee el contrato (`openapi.yaml` / `asyncapi.yaml`) y la implementación
(controladores, manejadores). Solicita cualquiera de las rutas si falta.

**Paso 2 — Comprueba cada operación del contrato.**
Para cada operación del contrato, verifica frente al código: ruta, método HTTP,
esquema de solicitud, esquema de respuesta, códigos de error declarados y esquema
de autenticación. Registra cualquier discrepancia.

**Paso 3 — Busca puntos de conexión no documentados.**
Para cada punto de conexión de la implementación, confirma que el contrato lo declare. Señala
cualquier punto de conexión que el contrato no documente.

**Paso 4 — Valida con ejemplos.**
Cuando el equipo proporcione ejemplos de cuerpos de datos, valídalos frente a los esquemas
de solicitud y respuesta declarados. Anota dónde incumple el contrato un ejemplo real.

**Paso 5 — Clasifica y localiza la corrección.**
Clasifica cada divergencia como incompatible (elimina o cambia un campo, método o estado),
aditiva (campo opcional nuevo o comportamiento no documentado pero compatible) o de metadatos
(solo descripción). Para cada una, indica si la corrección adecuada corresponde al contrato
o al código.

Presenta la tabla sin editar ninguna de las dos partes. No rebajes un cambio incompatible
a aditivo para que el informe parezca más limpio.

## Ejemplo de invocación

```
/api-validate contract=backend/src/main/resources/openapi.yaml impl=backend/src/main/java/app/orders
```
