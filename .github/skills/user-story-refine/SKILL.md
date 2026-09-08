---
name: "user-story-refine"
description: "Úsala para refinar elementos del backlog, dividir épicas o validar los criterios INVEST. Los desencadenantes incluyen \"refinar historia\", \"dividir épica\", \"criterios de aceptación\", \"historia de usuario\" e \"INVEST\"."
---
# Refinamiento de historias de usuario

## Cuándo invocar

- "Esta historia es demasiado grande. Ayúdame a dividirla."
- "Convierte esta descripción de funcionalidad en historias de usuario con criterios de aceptación."
- "Comprueba si estas historias cumplen los criterios INVEST."

## Entradas obligatorias

- Descripción de la funcionalidad o épica
- Persona o tipo de usuario
- Objetivo de negocio al que contribuye la funcionalidad
- Restricciones conocidas (normativas, técnicas o de UX)

## Pasos de refinamiento

1. **Confirma el resultado**. Cada historia debe responder: qué persona, qué resultado y por qué importa.
2. **Aplica INVEST** (independiente, negociable, valiosa, estimable, pequeña y comprobable) a cada borrador.
3. **Divide verticalmente**, nunca horizontalmente. Prefiere divisiones por paso del flujo de trabajo, variación de datos, operación CRUD, flujo exitoso frente a casos límite, regla de negocio o criterio de aceptación.
4. **Escribe los criterios de aceptación en formato Dado/Cuando/Entonces**. Incluye un flujo exitoso, un caso límite y un caso de fallo.
5. **Establece la trazabilidad a un REQ-ID**. Cada historia se enlaza al menos con un requisito.

## Patrones de división

Úsalos cuando una historia sea demasiado grande para completarla en una iteración:

| Patrón | Divide una historia por... | Ejemplo |
|---|---|---|
| Pasos del flujo de trabajo | Cada paso de un flujo de varios pasos | Enviar, revisar y aprobar por separado |
| Regla de negocio | Una regla por historia | Tarifa estándar frente a tarifa exenta |
| Variación de datos | Cada tipo o formato de entrada | Dirección nacional frente a internacional |
| Operación CRUD | Crear, leer, actualizar y eliminar por separado | Añadir un registro antes de editarlo |
| Flujo exitoso frente a casos límite | Primero el flujo principal y después los casos límite | Entrada válida antes de entrada rechazada |
| Investigación acotada (spike) | Separar lo desconocido como una investigación con tiempo limitado | Crear primero un prototipo de la integración |

## Antipatrones

- Historias escritas como tareas ("Añadir un botón").
- Criterios de aceptación que describen la interfaz en lugar del comportamiento.
- Divisiones horizontales ("historia de backend" + "historia de frontend" para la misma funcionalidad).
- Ausencia de un enlace a un REQ-ID.

## Plantilla de salida

```markdown
### US-NNN: <título breve>
**Como** <persona>
**Quiero** <capacidad>
**Para** <resultado de negocio>

**Criterios de aceptación**
- Dado <contexto>, cuando <acción>, entonces <resultado>
- Dado <caso límite>, cuando <acción>, entonces <resultado>

**Trazabilidad a**: REQ-001, REQ-042
**Esfuerzo**: S / M / L
**Dependencias**: US-NNN (si existen)
```

## Puerta de calidad

- [ ] La historia cumple todos los criterios INVEST.
- [ ] Los criterios de aceptación se escriben en formato Dado/Cuando/Entonces y cubren flujos exitosos, casos límite y fallos.
- [ ] La historia se divide verticalmente, no por capa arquitectónica.
- [ ] La historia tiene trazabilidad al menos a un REQ-ID, y cada REQ-ID enlazado incluye una línea `source_legacy:` (exigida por el job de CI `legacy-traceability`).
