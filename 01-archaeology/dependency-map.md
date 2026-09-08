# Mapa de dependencias — SIFAP heredado

> **Ruta:** [Kit del equipo](../README.md) › [Etapa 1](README.md) › **Mapa de dependencias**

**Artefacto que completa el equipo durante el Paso 3 de la Etapa 1.** Registra las dependencias entre programas Natural y DDM de Adabas que sustentan el alcance seleccionado.

| Campo | Valor |
|---|---|
| **Público objetivo** | Todas las parejas, bajo el liderazgo de la Pareja 2 (Arquitectura) |
| **Prerrequisitos** | Catálogo de reglas con fuentes identificadas |
| **Etapa** | Etapa 1 — Arqueología |
| **Resultado esperado** | Diagrama Mermaid y tablas de aristas con evidencia `file:line` |

> [!IMPORTANT]
> Mapea solo las dependencias que explican el alcance seleccionado: programas `.NSN` que llaman a otros programas (`CALLNAT`, `FETCH`) y programas que acceden a DDM (`READ`, `FIND`, `STORE`, `UPDATE`, `DELETE`). Cada arista debe estar respaldada por `file:line`: no hagas inferencias sin evidencia. Este mapa sirve de base para las hipótesis de delimitación de [`discovery-report.md`](discovery-report.md).

> [!NOTE]
> Guía paso a paso: [`GUIDE.md`](GUIDE.md).

**Equipo**: <!-- completar -->
**Alcance**: programas y DDM que sustentan la funcionalidad seleccionada

---

## Diagrama Mermaid

```mermaid
%%{init: {'theme':'neutral','themeVariables':{'fontFamily':'ui-sans-serif, system-ui, sans-serif','primaryColor':'#F5F5F5','primaryTextColor':'#171717','primaryBorderColor':'#171717','lineColor':'#525252','secondaryColor':'#FFFFFF','tertiaryColor':'#FAFAFA','background':'#FFFFFF'}}}%%
flowchart TD
    classDef step fill:#F5F5F5,stroke:#171717,color:#171717
    classDef alt fill:#FFFFFF,stroke:#525252,color:#171717
    classDef muted fill:#FAFAFA,stroke:#A3A3A3,color:#404040
    classDef result fill:#FFFFFF,stroke:#171717,color:#171717,stroke-width:2px

    %% completar: nodos = programas y DDM; aristas = llamadas y acceso a datos
    %% ejemplo de sintaxis:
    %% PROGRAMA1 -->|"CALLNAT"| PROGRAMA2
    %% PROGRAMA1 -->|"READ"| DDM1[("DDM1")]
```

---

## Aristas Programa → Programa

| # | Origen | Destino | Tipo (`CALLNAT`/`FETCH`) | Evidencia (`file:line`) |
|---|---|---|---|---|
| 1 | <!-- completar --> | <!-- completar --> | <!-- completar --> | <!-- completar --> |

---

## Aristas Programa → DDM

| # | Programa | DDM | Operación (`READ`/`FIND`/`STORE`/`UPDATE`/`DELETE`) | Evidencia (`file:line`) |
|---|---|---|---|---|
| 1 | <!-- completar --> | <!-- completar --> | <!-- completar --> | <!-- completar --> |

---

## Observaciones

- **Programas con más conexiones (nodos centrales):** <!-- completar -->
- **Programas aislados o código muerto:** <!-- completar -->
- **Orden de dependencias batch:** <!-- completar -->

---

## Definición de terminado

- [ ] Cada arista relevante para el alcance cita `file:line`.
- [ ] Diagrama Mermaid generado con el encabezado `%%{init:...}%%` y una paleta neutral.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Catálogo de reglas](business-rules-catalog.md)<br/><sub>Paso 2 — extracción de reglas.</sub> | [Preguntas abiertas](mysteries-found.md)<br/><sub>Paso 4 — registro de incertidumbres.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
