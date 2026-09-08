---
name: "spec-sync"
description: "Detecta divergencias entre spec.md y la implementación y propone una actualización de la especificación para sincronizarlas."
argument-hint: "feature=NNN-feature-name"
agent: "requirements-engineer"
tools: ["read", "search", "execute"]
---
# /spec-sync

## Objetivo

Detecta divergencias entre `specs/<NNN>-<feature>/spec.md` y el código, clasifica cada REQ-ID y propone un parche de especificación que cierre la brecha. El entregable es un informe de divergencias junto con un parche propuesto, no una edición aplicada ni una suposición de que el código sea correcto.

## Cuándo invocar

A mediados o finales de la etapa 3, o en la etapa 4, cuando el código se ha adelantado a la especificación (o se ha quedado atrás) y el equipo necesita conciliarlos.

## Precondiciones

- Existe `specs/<NNN>-<feature>/spec.md` con REQ-ID
- Existen código y pruebas de la funcionalidad
- El equipo puede confirmar las fuentes de cualquier comportamiento recién descubierto

## Entradas que debe proporcionar el equipo

- `feature=<NNN>-<feature>`
- Alcance opcional: un subconjunto de REQ-ID o paquetes
- Para cualquier comportamiento sin documentar que el equipo decida conservar, su `source_legacy:`
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Analizar los REQ-ID de `spec.md`
- Buscar en la base de código referencias REQ-ID en comentarios, nombres de pruebas y mensajes de commit
- Clasificar cada REQ-ID: Implementado (código y prueba), Parcial (solo código), Huérfano (sin código), Sin documentar (el código cita un REQ-ID desconocido)
- Seleccionar tres flujos representativos y comparar la especificación con la ruta real del código
- Proponer adiciones a la especificación para elementos sin documentar, cada una con un REQ-ID propuesto, un enunciado EARS y un marcador de posición obligatorio `source_legacy:`
- Ordenar las tres divergencias principales por riesgo

## Lo que NO haré

- Escribir automáticamente la especificación: propongo un parche; el responsable del producto lo aprueba
- Crear un requisito para código sin documentar sin exigir su `source_legacy:` (protección contra invenciones y puerta de CI)
- Suponer que el código es correcto porque existe: una divergencia puede significar que está mal el código, no la especificación
- Inventar una fuente heredada para el comportamiento descubierto: la proporciona el equipo
- Clasificar algo sin una cita `file:line`

## Formato de salida

Una tabla de divergencias, un parche propuesto y una lista ordenada de riesgos, presentados al equipo.

Tabla de divergencias:

```markdown
## Informe de sincronización — 001-pagamento-beneficio

| REQ-ID | Estado | Evidencia (file:line) | Acción |
|---|---|---|---|
| REQ-PAY-014 | Implementado | PaymentBatchService.java:132; PaymentBatchServiceTest.java:88 | Ninguna |
| REQ-PAY-021 | Parcial | BenefitAmount.java:57 | Añadir una prueba que referencie REQ-PAY-021 |
| REQ-PAY-030 | Huérfano | — | Implementar o aplazar |
| REQ-PAY-041 | Sin documentar | DuplicateFilter.java:24 | Añadir REQ a la especificación (source_legacy obligatorio) |
```

Parche propuesto para cada elemento sin documentar:

```diff
+ ### REQ-PAY-041 (unwanted)
+ If una línea de pago duplica una línea ya importada, then el sistema shall ignorar el duplicado.
+ source_legacy: 01-archaeology/legacy-sifap/natural-programs/<PROGRAM>.NSP#L<start>-L<end>
```

Después, una lista de «Las 3 divergencias principales por riesgo», ordenada por impacto de negocio y probabilidad de incidente.

## Definición de terminado

- [ ] Cada REQ-ID de la especificación está clasificado con evidencia `file:line`
- [ ] Cada hallazgo sin documentar tiene un REQ-ID propuesto, un enunciado EARS y un marcador de posición `source_legacy:` que debe completar el equipo
- [ ] El parche propuesto se aplica sin conflictos a la estructura actual de `spec.md`
- [ ] La divergencia de comportamiento se comprobó en al menos tres flujos representativos
- [ ] Las tres divergencias principales están ordenadas por riesgo
- [ ] No se modificó ningún archivo de especificación

## Cuerpo del prompt

Eres el `@requirements-engineer` que concilia la especificación escrita con lo que realmente hace el código.

**Paso 1 — Analiza los REQ-ID.**
Lee `spec.md` y enumera cada REQ-ID declarado.

**Paso 2 — Busca referencias.**
Busca cada REQ-ID en comentarios, nombres de pruebas y mensajes de commit de la base de código. Registra `file:line` para cada coincidencia.

**Paso 3 — Clasifica cada REQ-ID.**
Implementado (código y prueba), Parcial (solo código), Huérfano (sin código) o Sin documentar (el código referencia un REQ-ID que la especificación no declara).

**Paso 4 — Examina una muestra de divergencia de comportamiento.**
Selecciona tres flujos representativos y compara el comportamiento especificado con la ruta real del código. Anota las discrepancias.

**Paso 5 — Propón el parche.**
Para cada elemento sin documentar, redacta un REQ nuevo con un enunciado EARS y un marcador de posición `source_legacy:` que debe completar el equipo. No inventes la fuente.

**Paso 6 — Ordena los tres principales por riesgo.**
Ordena por impacto de negocio y probabilidad de incidente.

Propón, no apliques. Cada REQ propuesto necesita una línea `source_legacy:` que complete el equipo, y la divergencia plantea cuál de las dos partes es correcta; nunca supone que prevalece el código.

## Ejemplo de invocación

```
/spec-sync feature=001-pagamento-beneficio
```
