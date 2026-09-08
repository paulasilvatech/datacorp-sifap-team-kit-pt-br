---

title: "Plantilla: contextos delimitados"
description: "Estructura para definir contextos delimitados mediante /carve-bounded-contexts"
author: "Paula Silva, ingeniera de software nativo de IA, Global Black Belt para las Américas en Microsoft"
date: "2026-04-29"
version: "1.0.0"
status: "approved"
tags: ["template", "bounded-contexts", "architect", "stage-2"]
---

<!-- Uso: ejecuta /carve-bounded-contexts. Duplica el bloque de contexto para cada contexto. -->

# Mapa de contextos delimitados

![Plantilla de contextos delimitados](https://img.shields.io/badge/Template-bounded--contexts-737373?style=flat-square) ![Copia: no edites el original](https://img.shields.io/badge/Copy-do%20not%20edit%20the%20original-A3A3A3?style=flat-square)

> **Ruta:** [Kit del equipo](../../README.md) › [Etapa 2](../README.md) › Plantillas › **bounded-contexts**

> [!NOTE]
> Este archivo es una PLANTILLA. Cópiala al repositorio de tu equipo y complétala con datos reales. No edites el original.

---

## Concepto: contexto delimitado

Un contexto delimitado es un límite explícito dentro del cual un modelo de dominio es válido y coherente. El término proviene del diseño guiado por el dominio (DDD) y proporciona la base para definir los módulos de un Monolito Modular.

**Por qué importa:** en SIFAP, el módulo de pagos usa el término "beneficiario" de una manera, mientras que el módulo de fiscalización puede usar el mismo término con reglas diferentes. Definir contextos delimitados evita que se distorsione un único modelo para atender todos los contextos a la vez, lo que provoca acoplamiento no deseado y dificulta la evolución.

**Monolito Modular:** arquitectura en la que los contextos delimitados son módulos Java independientes dentro de una única JVM. Cada módulo tiene sus propias capas (`domain/`, `application/`, `infrastructure/`) y se comunica con otros módulos solo mediante interfaces públicas definidas.

**Strangler Fig:** patrón de migración incremental en el que el sistema moderno crece alrededor del sistema heredado y reemplaza las funcionalidades una a una. SIFAP 2.0 no necesita reemplazar todo a la vez. Cada contexto delimitado puede modernizarse de forma independiente.

---

## Evaluaciones de hipótesis

### <!-- placeholder: Nombre --> — <!-- placeholder: ACEPTADA / RECHAZADA -->

| Criterio | Evaluación | Evidencia |
|---|---|---|
| Cohesión | <!-- placeholder --> | <!-- placeholder --> |
| Acoplamiento | <!-- placeholder --> | <!-- placeholder --> |
| Frecuencia de cambios | <!-- placeholder --> | <!-- placeholder --> |

---

## Contextos delimitados finales

### <!-- placeholder: Nombre del contexto -->

| Campo | Valor |
|---|---|
| **Responsabilidad** | <!-- placeholder --> |
| **Datos propios** | <!-- placeholder --> |
| **Interfaz pública** | <!-- placeholder --> |
| **Por qué es un contexto propio** | <!-- placeholder --> |

---

## Comunicación entre contextos

| Origen | Destino | Mecanismo | Datos |
|---|---|---|---|
| <!-- placeholder --> | <!-- placeholder --> | <!-- placeholder --> | <!-- placeholder --> |

```mermaid
%%{init: {'theme':'neutral','themeVariables':{'fontFamily':'ui-sans-serif, system-ui, sans-serif','primaryColor':'#F5F5F5','primaryTextColor':'#171717','primaryBorderColor':'#171717','lineColor':'#525252','secondaryColor':'#FFFFFF','tertiaryColor':'#FAFAFA','background':'#FFFFFF'}}}%%
flowchart LR
    classDef ctx fill:#F5F5F5,stroke:#171717,color:#171717

    CTX1["Contexto 1"]:::ctx -->|"llama a"| CTX2["Contexto 2"]:::ctx
```

---

> [!IMPORTANT]
> Definición de terminado: hipótesis evaluadas, rechazos documentados, de 2 a 5 contextos con nombre y diagrama Mermaid que se renderiza sin errores.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [GUÍA de la Etapa 2](../GUIDE.md)<br/><sub>Instrucciones paso a paso.</sub> | [Plantilla de ADR](ADR.template.md)<br/><sub>Plantilla de ADR.</sub> |

<sub>[Volver al índice del kit](../../README.md)</sub>
