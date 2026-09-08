---
description: "Utiliza al implementar o revisar Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui y componentes de servidor en frontend/."
applyTo: "frontend/app/**,frontend/components/**,frontend/src/app/**,frontend/src/components/**,frontend/**/*.ts,frontend/**/*.tsx"
---

# Especificación de frontend — Next.js 15 + TypeScript

Este archivo se activa al trabajar con TypeScript, TSX, rutas de App Router o componentes reutilizables en `frontend/`. Enseña el contrato de plataforma del SIFAP modernizado (Sistema de Fiscalización y Administración de Pagos): Next.js 15 App Router, componentes de servidor (Server Components), acciones de servidor (Server Actions), TypeScript estricto, Tailwind CSS, shadcn/ui, requisitos básicos de accesibilidad e integración con Vitest. Define las reglas del marco, el tipado, los estilos y los límites entre servidor y cliente; [`frontend.instructions.md`](frontend.instructions.md) define la construcción de componentes, los detalles de interacción en el cliente, la coordinación del estado, la aplicación de accesibilidad y los flujos de uso.

## Resumen de tecnologías

| Capa | Tecnología | Versión |
|-------|-----------|---------|
| Marco | Next.js (App Router) | 15 |
| Lenguaje | TypeScript (modo estricto) | 5+ |
| Estilos | Tailwind CSS | 3.4+ |
| Componentes | shadcn/ui | Más reciente |
| Estado (cliente) | React `useState` y Context cuando sea necesario | Nativo |
| Datos del servidor | Componentes de servidor y acciones de servidor | Nativo |
| Pruebas | Vitest + Testing Library | Más reciente |

## Patrones de App Router

### Componentes de servidor (predeterminados)

Cada componente es un componente de servidor salvo que se indique explícitamente lo contrario. Los componentes de servidor:

- Se ejecutan en el servidor y nunca envían JS al cliente
- Pueden utilizar `await` directamente para obtener datos
- No pueden utilizar hooks, controladores de eventos ni API del navegador

```tsx
// app/<resource>/page.tsx — Componente de servidor (predeterminado)
export default async function ResourcePage() {
  const response = await fetch('/api/v1/<resource>');
  if (!response.ok) throw new Error('Resource loading failed');
  const resources = await response.json();
  return <ResourceList resources={resources} />;
}
```

### Componentes de cliente

Añade `'use client'` solo cuando se requiera interactividad:

```tsx
'use client';

import { useState } from 'react';

export function ResourceFilter({ onFilter }: { onFilter: (term: string) => void }) {
  const [term, setTerm] = useState('');
  return (
    <input
      value={term}
      onChange={e => { setTerm(e.target.value); onFilter(e.target.value); }}
      placeholder="Filter resources..."
    />
  );
}
```

Reglas:

- **Minimiza la superficie de `'use client'`**: sitúa la interactividad en el componente más pequeño posible. Una página que obtiene datos DEBE ser un componente de servidor; solo el filtro o formulario interactivo que contiene DEBE ser un componente de cliente.
- **NUNCA expongas secretos en componentes de cliente**: las claves de API, los tokens y las URL internas DEBEN permanecer en el servidor.
- **Evita las dependencias de gestión de estado de forma predeterminada**: utiliza `useState` local y Context para el estado compartido del cliente. Añade una biblioteca de estado o caché solo con un ADR que justifique la dependencia.

### Acciones de servidor para mutaciones

Utiliza acciones de servidor en lugar de controladores de rutas de API para enviar formularios:

```tsx
// app/<resource>/actions.ts
'use server';

export async function createResource(formData: FormData) {
  const value = formData.get('value');
  // Valida y llama a la API del backend
  const res = await fetch(`${process.env.API_URL}/api/v1/<resource>`, {
    method: 'POST',
    body: JSON.stringify({ value }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Resource creation failed');
}
```

## Convenciones de TypeScript

- **`strict: true`** en `tsconfig.json`: sin excepciones ni `// @ts-ignore`
- **Sin `any`**: utiliza `unknown` y acótalo con guardas de tipo
- **Solo exportaciones con nombre en componentes reutilizables**: `export function ResourceCard()`. Los archivos de rutas de App Router pueden utilizar el `export default` que exige Next.js.
- **Interface en lugar de type** para estructuras de objetos que puedan ampliarse
- **Tipos de utilidad**: utiliza `Pick`, `Omit` y `Partial` en lugar de duplicar interfaces

```tsx
// Correcto: exportación con nombre y propiedades tipadas
export function ResourceCard({ resource }: { resource: ResourceDto }) {
  return <div>{resource.label}</div>;
}

// Incorrecto: exportación predeterminada y tipo any
export default function ResourceCard({ resource }: { resource: any }) { ... }
```

## Tailwind CSS + shadcn/ui

- Utiliza directamente las clases de utilidad de Tailwind; no crees archivos CSS separados salvo que sea absolutamente necesario
- Utiliza componentes shadcn/ui para los elementos estándar de la interfaz (Button, Card, Table, Dialog, etc.)
- Cuando el equipo defina tokens del sistema de diseño, utilízalos para los colores y el espaciado
- Diseño adaptable de forma predeterminada: primero móvil, con puntos de interrupción `sm:`, `md:` y `lg:`

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ResourceSummary({ total }: { total: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
      </CardContent>
    </Card>
  );
}
```

## Requisitos básicos de accesibilidad

Cada página y componente DEBE cumplir estos requisitos mínimos:

- Todas las imágenes tienen texto `alt`
- Las entradas de formularios tienen elementos `<label>` asociados
- Los elementos interactivos permiten navegar con el teclado
- El color no es el único medio para transmitir información
- La página tiene un único `<h1>` y los encabezados siguen un orden lógico

## Pruebas con Vitest

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResourceCard } from './ResourceCard';

describe('ResourceCard', () => {
  it('displays the resource label when a resource is provided', () => {
    render(<ResourceCard resource={{ label: 'Example' }} />);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });
});
```

Nombre de la prueba: `should_[expected behavior]_when_[condition]` o `displays [what] when [condition]`.

## Convenciones

| Regla | Justificación |
|---|---|
| Next.js 15 App Router con componentes de servidor de forma predeterminada | Minimiza el JavaScript del cliente y mantiene el acceso a los datos en el servidor |
| `strict: true`, sin `any` ni `// @ts-ignore` | Los errores de tipo aparecen antes de la ejecución |
| Exportaciones con nombre para componentes reutilizables | Las importaciones son coherentes; los archivos de rutas de App Router pueden conservar las exportaciones predeterminadas obligatorias |
| Acciones de servidor para mutaciones | Los formularios realizan mutaciones a través de un límite de servidor, en lugar de llamadas a API desde el cliente |
| Tailwind CSS y shadcn/ui para la interfaz | Evita conjuntos de estilos ad hoc y mantiene coherentes los componentes |
| Vitest + Testing Library con nombres centrados en el comportamiento | Las pruebas describen el comportamiento visible y las condiciones esperadas |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Utilizar exportaciones con nombre en archivos de componentes | Utilizar `export default` para componentes reutilizables |
| Utilizar `unknown` con guardas de tipo | Utilizar `any` o desactivar el modo estricto de TypeScript |
| Utilizar `async`/`await` para flujos asíncronos | Encadenar llamadas a `.then()` |
| Aplicar estilos con Tailwind y shadcn/ui | Añadir módulos CSS o styled-components |
| Obtener datos directamente con `await` en componentes de servidor | Añadir obtención de datos del lado del cliente a componentes de servidor |
| Mantener los secretos en el servidor | Poner secretos en archivos `'use client'` o variables `NEXT_PUBLIC_` |

## Lista de verificación antes de abrir una PR

- [ ] `tsconfig.json` mantiene el modo estricto; no se ha añadido `any` ni `// @ts-ignore`
- [ ] Los componentes de servidor siguen siendo los predeterminados y `'use client'` aparece solo donde la interacción lo requiere
- [ ] Las mutaciones utilizan acciones de servidor y validan los datos antes de llamar a la API del backend
- [ ] Los componentes reutilizables utilizan exportaciones con nombre; los archivos de rutas de App Router utilizan exportaciones predeterminadas solo cuando Next.js las exige
- [ ] Los estilos utilizan utilidades de Tailwind y componentes shadcn/ui sin añadir dependencias de estilos
- [ ] Se cubren los fundamentos de accesibilidad: etiquetas, manejo con teclado, orden de encabezados y señales que no dependen del color
- [ ] Las pruebas Vitest + Testing Library cubren el comportamiento modificado con el patrón de nombres de pruebas acordado
