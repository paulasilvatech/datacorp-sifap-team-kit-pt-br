# ADR-0002: Publicar un portal de documentación trilingüe e interactivo con Astro

> **Ruta:** [Kit del equipo](../../README.md) > [Documentación](../README.md) > [ADRs](README.md)

| Campo | Valor |
|---|---|
| Estado | accepted |
| Fecha | 2026-09-07 |
| Alcance | Distribución de documentación, no el frontend de la aplicación SIFAP |
| Origen de la decisión | Solicitud de ediciones completas EN, ES y PT-BR del repositorio y GitHub Pages |

## Contexto

Las personas necesitan seguir el mismo material en GitHub o mediante un sitio accesible.
El portal debe exponer cada archivo versionado, no un subconjunto seleccionado manualmente.
Las ediciones en inglés, español y portugués de Brasil usan `main`, `espanol` y `portugues-br`.
El desarrollo de la aplicación sigue la arquitectura existente de Java 21 y Next.js 15.

La referencia visual es [Agentic DevOps Hub](https://agenticdevopsplatform.ai/en/).
Su diseño medido utiliza superficies en blanco cálido, una sección principal oscura, tipografía Inter, etiquetas monoespaciadas, líneas finas y cuatro colores de acento.
La implementación utiliza un diseño e ilustraciones propios de SIFAP, no la marca, fotografía o textos del sitio de referencia.

## Decisión

Crear una aplicación Astro independiente en `site/`, con generación estática e islas React 19 centradas en las interacciones del navegador, según la solicitud explícita.
GitHub Pages sirve archivos estáticos; la búsqueda, los filtros, la selección de tema, el progreso de lectura y las animaciones siguen siendo interactivos en el navegador.
El selector de idiomas permanece visible en escritorio y móvil y enlaza al mismo documento lógico.

Durante la compilación, resolver las tres ramas Git a commits inmutables e inventariar sus archivos versionados.
Representar Markdown como documentación sanitizada, ofrecer vistas de código y descargas originales para los demás archivos y preservar los bytes de las fuentes técnicas.
Registrar las rutas de origen, los IDs de commit y la cobertura en el catálogo generado.
Las compilaciones de producción rechazan ediciones de idioma o documentos ausentes y rutas internas rotas, en lugar de sustituirlos silenciosamente por inglés.

Usar despliegues separados para repositorios públicos y privados.
Un repositorio privado solo puede desplegarse cuando la API de GitHub Pages confirme `public: false`.
Verificarlo antes de publicar artefactos en Pages y de nuevo inmediatamente antes del despliegue.
Una configuración de privacidad no disponible o ambigua detiene la publicación; nunca habilita acceso público como alternativa.

## Justificación de dependencias

| Dependencia | Finalidad |
|---|---|
| Astro | Rutas estáticas y plantillas de componentes tipadas sin exigir un framework de cliente |
| `@astrojs/react`, React 19, React DOM y sus tipos | Búsqueda, filtros, tema y controles de lectura hidratados, manteniendo la documentación renderizada en el servidor |
| `@storybook/icons` | Iconos de contorno suministrados con la referencia Hub Editorial, sin adoptar la marca Storybook |
| `@astrojs/markdown-remark` | Renderizado Markdown compatible con Astro, bloques de código y metadatos de encabezados |
| `rehype-raw`, `rehype-sanitize` | Preservar el HTML compatible con Markdown y eliminar marcado ejecutable o inseguro |
| Mermaid | Representar los diagramas existentes con una configuración de seguridad estricta |
| Pagefind | Búsqueda local por idioma sin un servicio externo de indexación |
| `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono` | Fuentes autoalojadas con licencia abierta que corresponden a la tipografía de referencia |
| `@astrojs/check`, TypeScript 5 y tipos de Node.js | Validación estricta de plantillas y TypeScript |
| Runner de pruebas integrado de Node.js | Probar la ingestión Git, rutas, cobertura de idiomas y protecciones de despliegue sin otro framework de pruebas |
| Playwright | Verificar en un navegador el sitio adaptable e interactivo, la navegación de idiomas, la búsqueda y el contraste |
| `parse5` | Auditar nodos HTML reales sin confundir ejemplos escapados de Markdown/código con enlaces o IDs activos |

Fijar las versiones resueltas en el lockfile.
Usar Node.js 24 para el portal; no modificar los requisitos de runtime de la aplicación.
Los diccionarios de localización de la interfaz son recursos de la aplicación, no documentación traducida duplicada en `main`.

## Alternativas consideradas

| Alternativa | Motivo para no seleccionarla |
|---|---|
| Markdown renderizado únicamente por GitHub | No ofrece el diseño solicitado, el catálogo completo, la búsqueda ni la lectura interactiva |
| Exportación estática de Next.js | Es viable, pero se solapa con el frontend independiente de SIFAP; Astro limita la hidratación a las islas interactivas |
| Copia incrustada del sitio de referencia | Copiaría marca y contenido ajenos y no resolvería la cobertura basada en Git |
| Servicios externos de traducción o búsqueda | Añadirían servicios recurrentes y podrían exponer material privado del instructor |

## Consecuencias

- Cada documento fuente permanece versionado en su rama de idioma y se puede utilizar sin el sitio.
- El mismo motor sirve a ambos públicos sin mezclar contenido.
- GitHub Pages requiere un workflow explícito y una URL base correcta, incluido el hostname independiente de Pages privado.
- Las traducciones y la compatibilidad de anclas son criterios de publicación, no alternativas silenciosas.
- Las interacciones respetan el teclado, las pantallas pequeñas y la preferencia de movimiento reducido.

## Requisitos relacionados

Consulta los [requisitos del portal](../../specs/trilingual-portal.md).

## Referencias

- [Documentación de Astro](https://docs.astro.build/en/getting-started/)
- [Control de acceso de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)
- [Workflows personalizados de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Referencia visual](https://agenticdevopsplatform.ai/en/)
