# Portal de documentación trilingüe

Esta es una nueva superficie de distribución del kit, no un cambio en el comportamiento de negocio de SIFAP.

## Requisitos

### REQ-PORTAL-001: Cobertura completa del repositorio

CUANDO una compilación de producción resuelva las ramas de idioma, el portal DEBE inventariar cada archivo versionado y proporcionar un documento, una vista de código o una descarga original para cada archivo.
source_legacy: "[GREENFIELD] El portal de distribución del repositorio no existe en la aplicación Natural/Adabas."

### REQ-PORTAL-002: Tres ediciones completas de idioma

El portal DEBE proporcionar rutas en inglés, español y portugués de Brasil basadas en `main`, `espanol` y `portugues-br`, sin sustituir silenciosamente documentación traducida ausente por inglés.
source_legacy: "[GREENFIELD] La distribución de documentación trilingüe es una nueva capacidad del kit."

### REQ-PORTAL-003: Navegación persistente entre idiomas

CUANDO una persona cambie el idioma de un documento, el portal DEBE abrir la misma ruta lógica de origen en la edición seleccionada.
source_legacy: "[GREENFIELD] La navegación de idiomas del sitio no tiene equivalente legado."

### REQ-PORTAL-004: Enlaces correctos y procedencia de la fuente

CUANDO el portal represente un enlace del repositorio, DEBE resolver el documento o recurso correspondiente en el sitio y conservar un enlace explícito a la fuente Git original y su commit.
source_legacy: "[GREENFIELD] El enrutamiento web y la procedencia de las fuentes pertenecen al nuevo portal."

### REQ-PORTAL-005: Descubrimiento interactivo

CUANDO una persona busque o filtre el catálogo, el portal DEBE mostrar el contenido coincidente en el idioma activo y anunciar de forma accesible los estados de carga, vacío y error.
source_legacy: "[GREENFIELD] La búsqueda de documentación en el navegador es una nueva capacidad."

### REQ-PORTAL-006: Interfaz adaptable y accesible

MIENTRAS la ventana sea estrecha, el portal DEBE mantener visible la navegación de idiomas y los controles accesibles con teclado, sin desbordamiento horizontal de la página.
source_legacy: "[GREENFIELD] La navegación web adaptable es independiente del comportamiento de la aplicación legada."

### REQ-PORTAL-007: Movimiento y preferencias

CUANDO una persona seleccione un tema, marque progreso de lectura o solicite movimiento reducido, el portal DEBE aplicar la preferencia sin ocultar contenido obligatorio ni modificar los datos del repositorio.
source_legacy: "[GREENFIELD] Las preferencias locales de lectura y los controles de animación son nuevos comportamientos del portal."

### REQ-PORTAL-008: Preservar las fuentes técnicas

El portal DEBE preservar los bytes originales de los archivos para descarga, representar el código como texto no ejecutable y evitar recorrer enlaces simbólicos Git fuera del repositorio.
source_legacy: "[GREENFIELD] La distribución segura de archivos fuente es una nueva preocupación de publicación del repositorio."

### REQ-PORTAL-009: Proteger el contenido privado del instructor

SI el repositorio de origen es privado y la visibilidad de Pages es pública o desconocida, ENTONCES el despliegue DEBE detenerse antes de publicar su contenido.
source_legacy: "[GREENFIELD] El control de acceso de Pages privado protege el material del instructor fuera del sistema legado."

### REQ-PORTAL-010: Validación reproducible de la publicación

CUANDO se compile una versión, el portal DEBE registrar los IDs de los commits de origen, la cobertura de idiomas y los resultados de validación de enlaces internos, y DEBE fallar si falla una verificación obligatoria.
source_legacy: "[GREENFIELD] La validación reproducible de la publicación de documentación es un nuevo requisito del kit."
