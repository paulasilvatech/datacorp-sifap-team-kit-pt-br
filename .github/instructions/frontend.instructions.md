---
description: "Utiliza al construir componentes de interfaz de frontend, páginas, interacciones del cliente, estado de componentes, accesibilidad y flujos de uso."
applyTo: "frontend/app/**,frontend/components/**,frontend/src/app/**,frontend/src/components/**"
---

# Convenciones de frontend — Construcción de componentes e interacción

Este archivo se activa al construir interfaces en `frontend/app/**` o `frontend/components/**`. Se centra en la construcción de componentes, la interacción en el cliente, el estado de los componentes, la aplicación de accesibilidad y los flujos de uso. Define cómo se comportan los componentes para las personas usuarias; [`frontend-spec.instructions.md`](frontend-spec.instructions.md) define el contrato de plataforma de Next.js 15 App Router, TypeScript estricto, estilos Tailwind/shadcn, componentes de servidor y acciones de servidor. Sigue ese archivo para esos temas y no los repitas aquí.

> [!NOTE]
> `frontend/` todavía no existe; el equipo crea su estructura inicial en la etapa 3. Estas son las convenciones que deben seguir los componentes a medida que se escriben.

## Construcción de componentes

Construye componentes pequeños, de responsabilidad única, con exportaciones con nombre y propiedades tipadas. Prioriza la composición frente a una lista creciente de propiedades y mantén los componentes de presentación libres de obtención de datos.

```tsx
import type { ResourceDto } from '@/types/resource';

export function ResourceCard({ resource }: { resource: ResourceDto }) {
  return (
    <article className="rounded-lg border p-4">
      <h3 className="font-semibold">{resource.label}</h3>
      <p className="text-muted-foreground">{formatBRL(resource.amount)}</p>
    </article>
  );
}
```

Mantén la superficie de `'use client'` lo más pequeña posible: un componente de servidor obtiene los datos y los pasa a un pequeño componente de cliente que gestiona la interacción (consulta [`frontend-spec.instructions.md`](frontend-spec.instructions.md)).

## Estado de los componentes

Utiliza `useState` local de forma predeterminada. Eleva el estado al padre común más cercano cuando deban compartirlo componentes hermanos. Recurre a Context **solo** para estado de cliente realmente compartido y añade una biblioteca de gestión de estado únicamente con un ADR que justifique la dependencia.

```tsx
'use client';

import { useState } from 'react';

export function ResourceFilter({ onFilter }: { onFilter: (term: string) => void }) {
  const [term, setTerm] = useState('');
  return (
    <label className="flex flex-col gap-1">
      <span>Filter resources</span>
      <input
        value={term}
        onChange={(event) => { setTerm(event.target.value); onFilter(event.target.value); }}
      />
    </label>
  );
}
```

Las entradas son controladas (`value` + `onChange`). Deriva los valores durante la renderización en lugar de duplicar las propiedades en el estado.

## Interacción en el cliente y flujos asíncronos

Las mutaciones pasan por acciones de servidor, no por `fetch` del cliente (consulta [`frontend-spec.instructions.md`](frontend-spec.instructions.md)). Envuelve la llamada en `useTransition` para controlar un estado deshabilitado o pendiente y refléjalo con `aria-busy`.

```tsx
'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';

export function ArchiveButton({ id, onArchive }: { id: string; onArchive: (id: string) => Promise<void> }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      disabled={isPending}
      aria-busy={isPending}
      onClick={() => startTransition(() => onArchive(id))}
    >
      {isPending ? 'Archiving…' : 'Archive'}
    </Button>
  );
}
```

## Flujos de uso

Cada vista asíncrona representa tres estados explícitos, **cargando**, **vacío** y **error**, nunca una pantalla en blanco. Confirma las acciones destructivas y da formato a importes y fechas con una configuración regional explícita para que la salida sea determinista.

```tsx
if (isLoading) return <Spinner aria-label="Loading resources" />;
if (resources.length === 0) return <EmptyState message="No resources yet" />;
if (error) return <ErrorState onRetry={refetch} />;
```

## Accesibilidad (WCAG 2.1 AA)

| Requisito | Cómo cumplirlo |
|---|---|
| Etiquetas | Cada entrada tiene un `<label htmlFor>` o `aria-label` |
| Teclado | Todos los elementos interactivos son accesibles y manejables mediante Tab/Enter/Espacio |
| Foco | Mueve el foco al diálogo al abrirlo; devuélvelo al activador al cerrarlo |
| Contraste | Texto ≥ 4.5:1, texto grande ≥ 3:1 |
| Estructura | Un `<h1>` por página, orden lógico de encabezados y regiones de referencia |
| Color | Nunca es la única señal; acompáñalo de texto o de un icono |

Utiliza elementos semánticos (`<button>`, `<nav>`, `<table>`) antes de recurrir a ARIA; añade ARIA solo cuando falte la semántica nativa.

## Convenciones

| Regla | Justificación |
|---|---|
| Exportaciones con nombre para componentes | Importaciones coherentes; permite eliminar código no utilizado |
| Propiedades tipadas, sin `any` | Los fallos aparecen durante la compilación |
| `useState` local, Context solo para estado compartido | Grafo de estado mínimo y predecible |
| Colocar la prueba junto al componente | El comportamiento y la cobertura permanecen juntos |
| Estados explícitos de carga, vacío y error | Sin callejones sin salida en la interfaz |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Situar `'use client'` en el componente hoja más pequeño | Marcar una página completa con `'use client'` |
| Realizar mutaciones mediante una acción de servidor | Ejecutar con `fetch` una mutación desde el cliente |
| Etiquetar cada control | Depender del texto de marcador de posición como etiqueta |
| Dar formato a importes y fechas con una configuración regional | Mostrar a las personas números sin formato o cadenas ISO |

## Lista de verificación antes de abrir una PR

- [ ] Los componentes utilizan exportaciones con nombre y propiedades completamente tipadas
- [ ] `'use client'` se limita al componente interactivo más pequeño
- [ ] El estado compartido utiliza Context solo cuando se justifica; no hay bibliotecas de estado sin aprobar
- [ ] Las vistas asíncronas representan los estados de carga, vacío y error
- [ ] Las entradas tienen etiquetas, se manejan con teclado y cumplen el contraste AA
- [ ] Una prueba de Testing Library ubicada junto al componente cubre la interacción (consulta [`tests.instructions.md`](tests.instructions.md))
