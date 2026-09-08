# Referencia de estilos de draw.io

Referencia completa del atributo `style` de los elementos `<mxCell>`. Los estilos son pares `key=value` delimitados por puntos y comas.

---

## Formato de estilo

```text
style="key1=value1;key2=value2;key3=value3;"
```

- Las claves y los valores distinguen mayúsculas y minúsculas
- El punto y coma final es opcional, pero se recomienda
- Las claves desconocidas se ignoran silenciosamente
- Las claves ausentes usan los valores predeterminados de draw.io

---

## Claves de estilo universales

Se aplican a todas las formas y aristas.

| Clave | Valores | Valor predeterminado | Descripción |
| ----- | -------- | --------- | ------------- |
| `fillColor` | `#hex` / `none` | `#FFFFFF` | Color de relleno de la forma (predeterminado de draw.io; usar la paleta semántica en diagramas del proyecto) |
| `strokeColor` | `#hex` / `none` | `#000000` | Color del borde o línea (predeterminado de draw.io; usar la paleta semántica en diagramas del proyecto) |
| `fontColor` | `#hex` | `#000000` | Color del texto |
| `fontSize` | integer | `11` | Tamaño de fuente en puntos |
| `fontStyle` | Máscara de bits (véase abajo) | `0` | Negrita/cursiva/subrayado |
| `fontFamily` | string | `Helvetica` | Nombre de la familia tipográfica |
| `align` | `left`/`center`/`right` | `center` | Alineación horizontal del texto |
| `verticalAlign` | `top`/`middle`/`bottom` | `middle` | Alineación vertical del texto |
| `opacity` | 0–100 | `100` | Opacidad de la forma (%) |
| `shadow` | `0`/`1` | `0` | Sombra proyectada |
| `dashed` | `0`/`1` | `0` | Borde discontinuo |
| `dashPattern` | Por ejemplo, `8 8` | — | Patrón personalizado de guiones y espacios (píxeles) |
| `strokeWidth` | float | `2` | Ancho del borde o línea en píxeles |
| `spacing` | integer | `2` | Margen alrededor del texto (píxeles) |
| `spacingTop` | integer | `0` | Margen superior del texto |
| `spacingBottom` | integer | `0` | Margen inferior del texto |
| `spacingLeft` | integer | `4` | Margen izquierdo del texto |
| `spacingRight` | integer | `4` | Margen derecho del texto |
| `html` | `0`/`1` | `0` | Permitir HTML en la etiqueta |
| `whiteSpace` | `wrap`/`nowrap` | `nowrap` | Ajuste de líneas del texto |
| `overflow` | `visible`/`hidden`/`fill` | `visible` | Comportamiento del desbordamiento de texto |
| `rotatable` | `0`/`1` | `1` | Permitir rotación en el editor |
| `movable` | `0`/`1` | `1` | Permitir movimiento en el editor |
| `resizable` | `0`/`1` | `1` | Permitir cambiar el tamaño en el editor |
| `deletable` | `0`/`1` | `1` | Permitir eliminación en el editor |
| `editable` | `0`/`1` | `1` | Permitir editar la etiqueta en el editor |
| `locked` | `0`/`1` | `0` | Bloquear toda edición |
| `nolabel` | `0`/`1` | `0` | Ocultar completamente la etiqueta |
| `noLabel` | `0`/`1` | `0` | Alias de `nolabel` |
| `labelPosition` | `left`/`center`/`right` | `center` | Anclaje horizontal de la etiqueta |
| `verticalLabelPosition` | `top`/`middle`/`bottom` | `middle` | Anclaje vertical de la etiqueta |
| `imageAlign` | `left`/`center`/`right` | `center` | Alineación de imagen |

### Valores de máscara de bits de `fontStyle`

| Valor | Efecto |
| ------- | -------- |
| `0` | Normal |
| `1` | Negrita |
| `2` | Cursiva |
| `4` | Subrayado |
| `8` | Tachado |

Combina sumando: `3` = negrita + cursiva, `5` = negrita + subrayado, `7` = negrita + cursiva + subrayado.

---

## Claves de formas (solo vértices)

| Clave | Valores | Descripción |
| ----- | -------- | ------------- |
| `shape` | Véase Catálogo de formas | Sobrescribir la forma rectangular predeterminada |
| `rounded` | `0`/`1` | Esquinas redondeadas del rectángulo |
| `arcSize` | 0–50 | Porcentaje de radio de esquina (cuando `rounded=1`) |
| `perimeter` | Nombre de función | Tipo de perímetro de conexión |
| `aspect` | `fixed` | Bloquear la proporción al cambiar el tamaño |
| `rotation` | float | Rotación en grados |
| `fixedSize` | `0`/`1` | Impedir el tamaño automático al editar la etiqueta |
| `container` | `0`/`1` | Tratar la forma como contenedor de elementos secundarios |
| `collapsible` | `0`/`1` | Permitir alternar entre plegado y desplegado |
| `startSize` | integer | Tamaño del encabezado del carril o contenedor (píxeles) |
| `swimlaneHead` | `0`/`1` | Mostrar el encabezado del carril |
| `swimlaneBody` | `0`/`1` | Mostrar el cuerpo del carril |
| `fillOpacity` | 0–100 | Opacidad solo del relleno (independiente de `opacity`) |
| `strokeOpacity` | 0–100 | Opacidad solo del trazo |
| `gradientColor` | `#hex` / `none` | Color final del degradado |
| `gradientDirection` | `north`/`south`/`east`/`west` | Dirección del degradado |
| `sketch` | `0`/`1` | Estilo de boceto dibujado a mano |
| `comic` | `0`/`1` | Estilo de línea de cómic o caricatura |
| `glass` | `0`/`1` | Efecto de reflejo de cristal |

---

## Catálogo de formas

### Formas básicas

| Forma | Cadena de estilo | Aspecto |
| ------- | ------------- | -------- |
| Rectángulo (predeterminado) | *(no necesita clave shape)* | □ |
| Rectángulo redondeado | `rounded=1;` | ▢ |
| Elipse / Círculo | `ellipse;` | ○ |
| Rombo | `rhombus;` | ◇ |
| Triángulo | `triangle;` | △ |
| Hexágono | `shape=hexagon;` | ⬡ |
| Pentágono | `shape=mxgraph.basic.pentagon;` | ⬠ |
| Estrella | `shape=mxgraph.basic.star;` | ★ |
| Cruz | `shape=mxgraph.basic.x;` | ✕ |
| Nube | `shape=cloud;` | ☁ |
| Nota / Llamada | `shape=note;folded=1;` | 📝 |
| Documento | `shape=document;` | 📄 |
| Cilindro (base de datos) | `shape=cylinder3;` | 🗄 |
| Cinta | `shape=tape;` | — |
| Paralelogramo | `shape=parallelogram;perimeter=parallelogramPerimeter;` | ▱ |

### Formas de diagramas de flujo (`mxgraph.flowchart.*`)

| Forma | Cadena de estilo | Uso |
| ------- | ------------- | ---------- |
| Proceso | `shape=mxgraph.flowchart.process;` | Proceso estándar |
| Inicio/Fin (terminal) | `ellipse;` o `shape=mxgraph.flowchart.terminate;` | Inicio o fin del flujo |
| Decisión | `rhombus;` | Bifurcación Sí/No |
| Datos (E/S) | `shape=mxgraph.flowchart.io;` | Entrada/Salida |
| Proceso predefinido | `shape=mxgraph.flowchart.predefined_process;` | Subrutina |
| Entrada manual | `shape=mxgraph.flowchart.manual_input;` | Introducción manual |
| Operación manual | `shape=mxgraph.flowchart.manual_operation;` | Paso manual |
| Base de datos | `shape=mxgraph.flowchart.database;` | Almacén de datos |
| Almacenamiento interno | `shape=mxgraph.flowchart.internal_storage;` | Datos internos |
| Datos directos | `shape=mxgraph.flowchart.direct_data;` | Almacenamiento en tambor |
| Documento | `shape=mxgraph.flowchart.document;` | Documento |
| Varios documentos | `shape=mxgraph.flowchart.multi-document;` | Varios documentos |
| Conector en la página | `ellipse;` (pequeño) | Conector de página |
| Conector fuera de la página | `shape=mxgraph.flowchart.off_page_connector;` | Referencia fuera de la página |
| Preparación | `shape=mxgraph.flowchart.preparation;` | Inicialización |
| Retardo | `shape=mxgraph.flowchart.delay;` | Estado de espera |
| Pantalla | `shape=mxgraph.flowchart.display;` | Visualización de salida |
| Ordenación | `shape=mxgraph.flowchart.sort;` | Operación de ordenación |
| Extracción | `shape=mxgraph.flowchart.extract;` | Operación de extracción |
| Fusión | `shape=mxgraph.flowchart.merge;` | Fusión de rutas |
| O | `shape=mxgraph.flowchart.or;` | Puerta OR |
| Y | `shape=mxgraph.flowchart.and;` | Puerta AND |
| Anotación | `shape=mxgraph.flowchart.annotation;` | Comentario o nota |

### Formas UML (`mxgraph.uml.*`)

| Forma | Cadena de estilo | Uso |
| ------- | ------------- | ---------- |
| Actor | `shape=mxgraph.uml.actor;` | Actor de caso de uso |
| Límite | `shape=mxgraph.uml.boundary;` | Límite del sistema |
| Control | `shape=mxgraph.uml.control;` | Objeto controlador |
| Entidad | `shape=mxgraph.uml.entity;` | Objeto entidad |
| Componente | `shape=component;` | Recuadro de componente |
| Paquete | `shape=mxgraph.uml.package;` | Paquete |
| Nota | `shape=note;` | Nota UML |
| Línea de vida | `shape=umlLifeline;startSize=40;` | Línea de vida de secuencia |
| Activación | `shape=umlActivation;` | Recuadro de activación |
| Destrucción | `shape=mxgraph.uml.destroy;` | Marcador de destrucción |
| Estado | `ellipse;` | Nodo de estado |
| Estado inicial | `ellipse;fillColor=#000000;` | Estado inicial UML |
| Estado final | `shape=doubleEllipse;fillColor=#000000;` | Estado final UML |
| Bifurcación/unión | `shape=mxgraph.uml.fork_or_join;` | Barra de bifurcación o unión |

### Formas de red (`mxgraph.network.*`)

| Forma | Cadena de estilo |
| ------- | ------------- |
| Servidor | `shape=server;` |
| Servidor de base de datos | `shape=mxgraph.network.database;` |
| Firewall | `shape=mxgraph.cisco.firewalls.firewall;` |
| Enrutador | `shape=mxgraph.cisco.routers.router;` |
| Switch | `shape=mxgraph.cisco.switches.workgroup_switch;` |
| Nube | `shape=cloud;` |
| Internet | `shape=mxgraph.network.internet;` |
| Portátil | `shape=mxgraph.network.laptop;` |
| Equipo de escritorio | `shape=mxgraph.network.desktop;` |
| Móvil | `shape=mxgraph.network.mobile;` |

### Formas de AWS (`mxgraph.aws4.*`)

Usa la biblioteca AWS4. Formas habituales:

| Forma | Cadena de estilo |
| ------- | ------------- |
| EC2 | `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.ec2;` |
| Lambda | `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda;` |
| S3 | `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.s3;` |
| RDS | `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.rds;` |
| API Gateway | `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.api_gateway;` |
| CloudFront | `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.cloudfront;` |
| Load Balancer | `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.elb;` |
| SQS | `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.sqs;` |
| SNS | `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.sns;` |
| DynamoDB | `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.dynamodb;` |
| ECS | `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.ecs;` |
| EKS | `shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.eks;` |
| VPC | `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_vpc;` |
| Región | `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_region;` |

### Formas de Azure (`mxgraph.azure.*`)

| Forma | Cadena de estilo |
| ------- | ------------- |
| App Service | `shape=mxgraph.azure.app_service;` |
| Function App | `shape=mxgraph.azure.function_apps;` |
| SQL Database | `shape=mxgraph.azure.sql_database;` |
| Blob Storage | `shape=mxgraph.azure.blob_storage;` |
| API Management | `shape=mxgraph.azure.api_management;` |
| Service Bus | `shape=mxgraph.azure.service_bus;` |
| AKS | `shape=mxgraph.azure.aks;` |
| Container Registry | `shape=mxgraph.azure.container_registry_registries;` |

### Formas de GCP (`mxgraph.gcp2.*`)

| Forma | Cadena de estilo |
| ------- | ------------- |
| Cloud Run | `shape=mxgraph.gcp2.cloud_run;` |
| Cloud Functions | `shape=mxgraph.gcp2.cloud_functions;` |
| Cloud SQL | `shape=mxgraph.gcp2.cloud_sql;` |
| Cloud Storage | `shape=mxgraph.gcp2.cloud_storage;` |
| GKE | `shape=mxgraph.gcp2.container_engine;` |
| Pub/Sub | `shape=mxgraph.gcp2.cloud_pubsub;` |
| BigQuery | `shape=mxgraph.gcp2.bigquery;` |

---

## Claves de estilo de aristas

| Clave | Valores | Descripción |
| ----- | -------- | ------------- |
| `edgeStyle` | Véase abajo | Algoritmo de recorrido de conexiones |
| `rounded` | `0`/`1` | Esquinas redondeadas en aristas ortogonales |
| `curved` | `0`/`1` | Segmentos de línea curvos |
| `orthogonal` | `0`/`1` | Forzar recorrido ortogonal |
| `jettySize` | `auto`/integer | Tamaño del tramo de salida o entrada |
| `exitX` | 0.0–1.0 | Coordenada X del punto de salida (0=izquierda, 0.5=centro, 1=derecha) |
| `exitY` | 0.0–1.0 | Coordenada Y del punto de salida (0=arriba, 0.5=centro, 1=abajo) |
| `exitDx` | float | Desplazamiento X de salida en el origen (píxeles) |
| `exitDy` | float | Desplazamiento Y de salida en el origen (píxeles) |
| `entryX` | 0.0–1.0 | Coordenada X del punto de entrada en el destino |
| `entryY` | 0.0–1.0 | Coordenada Y del punto de entrada en el destino |
| `entryDx` | float | Desplazamiento X de entrada en el destino (píxeles) |
| `entryDy` | float | Desplazamiento Y de entrada en el destino (píxeles) |
| `endArrow` | Véase Tipos de flecha | Punta de flecha en el destino |
| `startArrow` | Véase Tipos de flecha | Extremo de flecha en el origen |
| `endFill` | `0`/`1` | Punta de flecha final rellena |
| `startFill` | `0`/`1` | Punta de flecha inicial rellena |
| `endSize` | integer | Tamaño de la punta de flecha final (píxeles) |
| `startSize` | integer | Tamaño de la punta de flecha inicial (píxeles) |
| `labelBackgroundColor` | `#hex`/`none` | Relleno de fondo de la etiqueta |
| `labelBorderColor` | `#hex`/`none` | Color de borde de la etiqueta |

### Valores de `edgeStyle`

| Valor | Recorrido | Uso |
| ------- | --------- | ---------- |
| `none` | Línea recta | Conexiones directas sencillas |
| `orthogonalEdgeStyle` | Giros en ángulo recto | Diagramas de flujo y arquitectura |
| `elbowEdgeStyle` | Un solo codo | Diagramas direccionales claros |
| `entityRelationEdgeStyle` | Recorrido de estilo ER | Diagramas ER |
| `segmentEdgeStyle` | Segmentado con controles | Recorridos ajustados con precisión |
| `isometricEdgeStyle` | Cuadrícula isométrica | Diagramas isométricos |

### Tipos de flecha (`endArrow` / `startArrow`)

| Valor | Forma | Uso |
| ------- | ------- | --------- |
| `block` | Triángulo relleno | Flecha dirigida estándar |
| `open` | Punta abierta → | Flecha abierta o ligera |
| `classic` | Flecha clásica | Flecha predeterminada de draw.io |
| `classicThin` | Clásica fina | Diagramas compactos |
| `none` | Sin punta de flecha | Líneas sin dirección |
| `oval` | Punto circular | Inicio de agregación |
| `diamond` | Rombo hueco | Agregación |
| `diamondThin` | Rombo fino | Diagramas estilizados |
| `ERone` | Barra `\|` | Cardinalidad ER "uno" |
| `ERmany` | Pata de cuervo | Cardinalidad ER "muchos" |
| `ERmandOne` | `\|\|` | Uno obligatorio en ER |
| `ERzeroToOne` | `o\|` | Cero o uno en ER |
| `ERzeroToMany` | `o<` | Cero o muchos en ER |
| `ERoneToMany` | `\|<` | Uno o muchos en ER |

---

## Paleta de colores

### Colores semánticos (recomendados para diagramas coherentes)

| Significado | Relleno | Trazo | Uso |
| --------- | ------ | -------- | ------- |
| Usuario / Cliente | `#dae8fc` | `#6c8ebf` | Navegador y aplicaciones cliente |
| Servicio / Proceso | `#d5e8d4` | `#82b366` | Servicios backend |
| Base de datos / Almacenamiento | `#f5f5f5` | `#666666` | Bases de datos y archivos |
| Decisión / Advertencia | `#fff2cc` | `#d6b656` | Nodos de decisión y alertas |
| Error / Crítico | `#f8cecc` | `#b85450` | Rutas de error y críticas |
| Externo / Socio | `#e1d5e7` | `#9673a6` | Terceros y sistemas externos |
| Cola / Asíncrono | `#ffe6cc` | `#d79b00` | Colas de mensajes |
| Puerta de enlace / Proxy | `#dae8fc` | `#0050ef` | Puertas de enlace de API y proxies |

### Formas de fondo oscuro

Para diagramas de tema oscuro, cambia a:

- Relleno: `#1e4d78` (azul oscuro), `#1a4731` (verde oscuro)
- Trazo: `#4aa3df`, `#67ab9f`
- Fuente: `#ffffff`

---

## Ejemplos completos de estilos

### Recuadro azul redondeado

```text
rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;
```

### Paso de proceso verde

```text
rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;
```

### Rombo de decisión amarillo

```text
rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;
```

### Recuadro de error rojo

```text
rounded=1;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;
```

### Cilindro de base de datos

```text
shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;fillColor=#f5f5f5;strokeColor=#666666;
```

### Contenedor de carriles

```text
shape=pool;startSize=30;horizontal=1;fillColor=#f5f5f5;strokeColor=#999999;
```

### Carril

```text
swimlane;startSize=30;fillColor=#ffffff;strokeColor=#999999;
```

### Conector ortogonal

```text
edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;
```

### Flecha dirigida (gruesa)

```text
edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=block;endFill=1;strokeWidth=2;
```

### Línea de dependencia discontinua

```text
edgeStyle=orthogonalEdgeStyle;dashed=1;endArrow=open;endFill=0;strokeColor=#666666;
```

### Línea de relación ER (uno a muchos)

```text
edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERmany;startArrow=ERmandOne;endFill=1;startFill=1;
```

### Flecha de herencia UML (triángulo hueco)

```text
edgeStyle=orthogonalEdgeStyle;html=1;endArrow=block;endFill=0;
```

### Composición UML (rombo relleno)

```text
edgeStyle=orthogonalEdgeStyle;html=1;startArrow=diamond;startFill=1;endArrow=none;
```

### Agregación UML (rombo abierto)

```text
edgeStyle=orthogonalEdgeStyle;html=1;startArrow=diamond;startFill=0;endArrow=none;
```

### Dependencia UML (flecha discontinua)

```text
edgeStyle=orthogonalEdgeStyle;dashed=1;html=1;endArrow=open;endFill=0;
```

### Conector invisible (para alineación)

```text
edgeStyle=none;strokeColor=none;endArrow=none;
```
