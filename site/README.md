# Portal de documentación SIFAP

Esta aplicación Astro + React publica el repositorio completo en inglés, español y portugués de Brasil. Es independiente del frontend Next.js de la aplicación SIFAP.

## Lee en el sitio o en GitHub

Las ediciones de idioma son `main` (EN), `espanol` (ES) y `portugues-br` (PT-BR).
El selector de idiomas permanente del sitio abre el mismo documento fuente en otra edición.
Cada documento Markdown se representa íntegramente, incluidas las instrucciones de Copilot, los prompts, las skills, las personas y las guías de etapa.
Cada documento también ofrece su Markdown original completo, una descarga que preserva los bytes y un enlace al commit inmutable de origen.
Los demás archivos versionados tienen una vista de código, una vista previa de imagen o una descarga original.

## Ejecuta localmente

Requisitos: Node.js 24, npm, Git y referencias de seguimiento remoto locales para las tres ediciones.

```bash
git fetch origin
cd site
npm ci
npm run content:status
npm test
npm run build
npm run preview
```

La URL predeterminada procede de [`repository.json`](repository.json). Para compilar y visualizar en la raíz de una dirección local, establece `SITE_URL=http://127.0.0.1:4321/` en ambos comandos.
Nunca copies datos ficticios de vista previa a una publicación de producción.

## Valida

```bash
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

La compilación de producción resuelve todas las ramas de idioma a commits inmutables. Falla si falta una edición o un archivo, si hay Markdown o prosa sin traducir, código del portal desactualizado, un enlace sin resolver, un ancla inválida o una descarga original alterada.
Mantén idénticos en las tres ramas los archivos de `site/` que no sean Markdown al actualizar el motor compartido del portal.
Los informes se generan en `.generated/coverage.json` y `.generated/site-audit.json`.
`npm run content:status` informa de cada archivo ausente o sin traducir sin generar un catálogo sustituto. El informe distingue la preparación de una compilación o un despliegue completados.
Las pruebas de navegador verifican el cambio de idioma, el acceso al Markdown íntegro, la búsqueda, el diseño adaptable, el contraste, el estado de lectura y el movimiento reducido.
Las pruebas de navegador utilizan un servidor local nuevo de forma predeterminada. Establece `PLAYWRIGHT_PORT` en otro puerto libre si hace falta; `PLAYWRIGHT_REUSE_SERVER=1` es una opción explícita solo para uso local. Usa `PORTAL_TEST_URL` para validar un sitio ya publicado.

## Contenido y diseño

- Los documentos fuente permanecen en las ramas de idioma; el portal no mantiene resúmenes separados.
- [`src/lib/i18n.ts`](src/lib/i18n.ts) contiene traducciones de la interfaz, no la documentación del repositorio.
- [`src/styles/hub-editorial.css`](src/styles/hub-editorial.css) reutiliza la hoja de componentes Hub Editorial proporcionada.
- [`src/styles/tokens.css`](src/styles/tokens.css) define tipografía, colores y espaciado; los estilos del portal preservan un contraste legible en ambos temas.
- Las islas React proporcionan búsqueda, filtros, navegación de etapas y preferencias de lectura. El texto de los documentos sigue disponible sin JavaScript.
- Las fuentes tipográficas y la búsqueda se alojan localmente. Las fuentes técnicas originales y las licencias no se modifican.
- Los avisos originales de distribución están en [`public/licenses/`](public/licenses/) y en el catálogo de licencias del sitio.

## GitHub Pages y privacidad

El [workflow de Pages](../.github/workflows/pages.yml) compila las tres ediciones y valida el sitio antes del despliegue.
[`scripts/pages-guard.mjs`](scripts/pages-guard.mjs) consulta la visibilidad real del repositorio y de Pages mediante la API de GitHub.
Un repositorio privado no puede publicarse en Pages público ni con visibilidad sin verificar.
La protección se ejecuta antes de la compilación, antes de publicar el artefacto e inmediatamente antes del despliegue.
El kit público del equipo y el kit privado del instructor nunca deben compartir contenido generado.

## Arquitectura y requisitos

- [ADR-0002](../docs/adr/0002-trilingual-documentation-portal.md)
- [REQ-PORTAL-001 a REQ-PORTAL-010](../specs/trilingual-portal.md)
