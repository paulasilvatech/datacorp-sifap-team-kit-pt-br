# Bibliotecas de formas de draw.io

Guía de referencia de todas las bibliotecas de formas integradas. Habilítalas mediante `View > Shapes` en el editor de draw.io (o en el panel de formas de la extensión de VS Code).

---

## Catálogo de bibliotecas

### General

**Habilitar**: siempre activa de forma predeterminada

Formas habituales para cualquier tipo de diagrama.

| Forma | Clave de estilo | Uso |
| ------- | ----------- | --------- |
| Rectángulo | *(predeterminado)* | Recuadros, pasos y componentes |
| Rectángulo redondeado | `rounded=1;` | Recuadros de proceso de contorno suave |
| Elipse | `ellipse;` | Estados, inicio y fin |
| Triángulo | `triangle;` | Flechas y puertas |
| Rombo | `rhombus;` | Decisiones |
| Hexágono | `shape=hexagon;` | Etiquetas e iconos tecnológicos |
| Nube | `shape=cloud;` | Servicios en la nube |
| Cilindro | `shape=cylinder3;` | Bases de datos |
| Nota | `shape=note;` | Anotaciones |
| Documento | `shape=document;` | Archivos |
| Formas de flecha | Variantes de `mxgraph.arrows2.*` | Direcciones de flujo |
| Llamadas | `shape=callout;` | Bocadillos de diálogo |

---

### Diagramas de flujo

**Habilitar**: `View > Shapes > Flowchart`
**Prefijo de formas**: `mxgraph.flowchart.`

Símbolos estándar ANSI/ISO de diagramas de flujo.

| Símbolo | Cadena de estilo | Nombre ANSI |
| -------- | ------------- | ----------- |
| Inicio / Fin | `ellipse;` | Terminal |
| Proceso (rectángulo) | `rounded=1;` | Proceso |
| Decisión | `rhombus;` | Decisión |
| E/S (paralelogramo) | `shape=mxgraph.flowchart.io;` | Datos |
| Proceso predefinido | `shape=mxgraph.flowchart.predefined_process;` | Proceso predefinido |
| Operación manual | `shape=mxgraph.flowchart.manual_operation;` | Operación manual |
| Entrada manual | `shape=mxgraph.flowchart.manual_input;` | Entrada manual |
| Base de datos | `shape=mxgraph.flowchart.database;` | Almacenamiento de acceso directo |
| Documento | `shape=mxgraph.flowchart.document;` | Documento |
| Varios documentos | `shape=mxgraph.flowchart.multi-document;` | Varios documentos |
| Conector en la página | `ellipse;` (pequeño, 30×30) | Conector |
| Conector fuera de la página | `shape=mxgraph.flowchart.off_page_connector;` | Conector fuera de la página |
| Preparación | `shape=mxgraph.flowchart.preparation;` | Preparación |
| Retardo | `shape=mxgraph.flowchart.delay;` | Retardo |
| Pantalla | `shape=mxgraph.flowchart.display;` | Pantalla |
| Almacenamiento interno | `shape=mxgraph.flowchart.internal_storage;` | Almacenamiento interno |
| Ordenación | `shape=mxgraph.flowchart.sort;` | Ordenación |
| Extracción | `shape=mxgraph.flowchart.extract;` | Extracción |
| Fusión | `shape=mxgraph.flowchart.merge;` | Fusión |
| O | `shape=mxgraph.flowchart.or;` | O |
| Anotación | `shape=mxgraph.flowchart.annotation;` | Anotación |
| Tarjeta | `shape=mxgraph.flowchart.card;` | Tarjeta perforada |

**Cadenas de estilo completas de ejemplo para diagramas de flujo:**

```text
Proceso:          rounded=1;whiteSpace=wrap;html=1;
Decisión:         rhombus;whiteSpace=wrap;html=1;
Inicio/Fin:       ellipse;whiteSpace=wrap;html=1;
Base de datos:    shape=mxgraph.flowchart.database;whiteSpace=wrap;html=1;
Documento:        shape=mxgraph.flowchart.document;whiteSpace=wrap;html=1;
E/S (Datos):      shape=mxgraph.flowchart.io;whiteSpace=wrap;html=1;
```

---

### UML

**Habilitar**: `View > Shapes > UML`

#### Diagramas de casos de uso

| Forma | Cadena de estilo |
| ------- | ------------- |
| Actor | `shape=mxgraph.uml.actor;whiteSpace=wrap;html=1;` |
| Caso de uso (elipse) | `ellipse;whiteSpace=wrap;html=1;` |
| Límite del sistema | `swimlane;startSize=30;whiteSpace=wrap;html=1;` |

#### Diagramas de clases

Usa contenedores de carriles para los recuadros de clases:

```xml
<!-- Contenedor de clase -->
<mxCell value="«interface»&#xa;IOrderService"
        style="swimlane;fontStyle=1;align=center;startSize=30;whiteSpace=wrap;html=1;"
        vertex="1" parent="1">
  <mxGeometry x="200" y="100" width="200" height="160" as="geometry" />
</mxCell>

<!-- Atributos (secundarios de la clase) -->
<mxCell value="+ id: string&#xa;+ status: string"
        style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;overflow=hidden;html=1;"
        vertex="1" parent="classId">
  <mxGeometry y="30" width="200" height="60" as="geometry" />
</mxCell>

<!-- Línea separadora de métodos -->
<mxCell value="" style="line;strokeWidth=1;fillColor=none;" vertex="1" parent="classId">
  <mxGeometry y="90" width="200" height="10" as="geometry" />
</mxCell>

<!-- Métodos (secundarios de la clase) -->
<mxCell value="+ create(): Order&#xa;+ cancel(): void"
        style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;overflow=hidden;html=1;"
        vertex="1" parent="classId">
  <mxGeometry y="100" width="200" height="60" as="geometry" />
</mxCell>
```

#### Flechas de relaciones UML

| Relación | Cadena de estilo |
| ------------- | ------------- |
| Herencia (extends) | `edgeStyle=orthogonalEdgeStyle;html=1;endArrow=block;endFill=0;` |
| Implementación (implements) | `edgeStyle=orthogonalEdgeStyle;dashed=1;html=1;endArrow=block;endFill=0;` |
| Asociación | `edgeStyle=orthogonalEdgeStyle;html=1;endArrow=open;endFill=0;` |
| Dependencia | `edgeStyle=orthogonalEdgeStyle;dashed=1;html=1;endArrow=open;endFill=0;` |
| Agregación | `edgeStyle=orthogonalEdgeStyle;html=1;startArrow=diamond;startFill=0;endArrow=none;` |
| Composición | `edgeStyle=orthogonalEdgeStyle;html=1;startArrow=diamond;startFill=1;endArrow=none;` |

#### Diagrama de componentes

| Forma | Cadena de estilo |
| ------- | ------------- |
| Componente | `shape=component;align=left;spacingLeft=36;whiteSpace=wrap;html=1;` |
| Interfaz (piruleta) | `ellipse;whiteSpace=wrap;html=1;aspect=fixed;` (círculo pequeño) |
| Puerto | `shape=mxgraph.uml.port;` |
| Nodo | `shape=mxgraph.uml.node;whiteSpace=wrap;html=1;` |
| Artefacto | `shape=mxgraph.uml.artifact;whiteSpace=wrap;html=1;` |

#### Diagramas de secuencia

| Forma | Cadena de estilo |
| ------- | ------------- |
| Actor | `shape=mxgraph.uml.actor;whiteSpace=wrap;html=1;` |
| Línea de vida (objeto) | `shape=umlLifeline;startSize=40;whiteSpace=wrap;html=1;` |
| Recuadro de activación | `shape=umlActivation;whiteSpace=wrap;html=1;` |
| Mensaje síncrono | `edgeStyle=elbowEdgeStyle;elbow=vertical;html=1;endArrow=block;endFill=1;` |
| Mensaje asíncrono | `edgeStyle=elbowEdgeStyle;elbow=vertical;html=1;endArrow=open;endFill=0;` |
| Retorno | `edgeStyle=elbowEdgeStyle;elbow=vertical;dashed=1;html=1;endArrow=open;endFill=0;` |
| Llamada a sí mismo | `edgeStyle=elbowEdgeStyle;elbow=vertical;exitX=1;exitY=0.3;entryX=1;entryY=0.5;html=1;` |

#### Diagramas de estados

| Forma | Cadena de estilo |
| ------- | ------------- |
| Estado inicial (círculo sólido) | `ellipse;html=1;aspect=fixed;fillColor=#000000;strokeColor=#000000;` |
| Estado | `rounded=1;whiteSpace=wrap;html=1;arcSize=50;` |
| Estado final | `shape=doubleEllipse;fillColor=#000000;strokeColor=#000000;` |
| Transición | `edgeStyle=orthogonalEdgeStyle;html=1;endArrow=block;endFill=1;` |
| Bifurcación/unión | `shape=mxgraph.uml.fork_or_join;html=1;fillColor=#000000;` |

---

### Entidad-relación (diagramas ER)

**Habilitar**: `View > Shapes > Entity Relation`

#### Tablas ER modernas (notación de pata de cuervo)

```xml
<!-- Contenedor de tabla -->
<mxCell id="tbl-orders" value="orders"
        style="shape=table;startSize=30;container=1;collapsible=1;childLayout=tableLayout;fillColor=#dae8fc;strokeColor=#6c8ebf;fontStyle=1;"
        vertex="1" parent="1">
  <mxGeometry x="80" y="80" width="240" height="210" as="geometry" />
</mxCell>

<!-- Fila de columna -->
<mxCell id="col-id" value=""
        style="shape=tableRow;horizontal=0;startSize=0;swimmilaneHead=0;swimlaneBody=0;fillColor=none;collapsible=0;dropTarget=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;"
        vertex="1" parent="tbl-orders">
  <mxGeometry y="30" width="240" height="30" as="geometry" />
</mxCell>

<!-- Celda del marcador PK -->
<mxCell value="PK" style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;fontStyle=1;overflow=hidden;"
        vertex="1" parent="col-id">
  <mxGeometry width="40" height="30" as="geometry" />
</mxCell>

<!-- Celda del nombre de columna -->
<mxCell value="id" style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;"
        vertex="1" parent="col-id">
  <mxGeometry x="40" width="140" height="30" as="geometry" />
</mxCell>

<!-- Celda del tipo de dato -->
<mxCell value="UUID" style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;fontStyle=2;"
        vertex="1" parent="col-id">
  <mxGeometry x="180" width="60" height="30" as="geometry" />
</mxCell>
```

#### Conectores de relaciones ER (pata de cuervo)

| Cardinalidad | Cadena de estilo |
| ------------- | ------------- |
| Uno a uno | `edgeStyle=entityRelationEdgeStyle;html=1;startArrow=ERmandOne;endArrow=ERmandOne;startFill=1;endFill=1;` |
| Uno a muchos | `edgeStyle=entityRelationEdgeStyle;html=1;startArrow=ERmandOne;endArrow=ERmany;startFill=1;endFill=1;` |
| Cero a muchos | `edgeStyle=entityRelationEdgeStyle;html=1;startArrow=ERmandOne;endArrow=ERzeroToMany;startFill=1;endFill=0;` |
| Cero a uno | `edgeStyle=entityRelationEdgeStyle;html=1;startArrow=ERmandOne;endArrow=ERzeroToOne;startFill=1;endFill=0;` |
| Muchos a muchos | `edgeStyle=entityRelationEdgeStyle;html=1;startArrow=ERmany;endArrow=ERmany;startFill=1;endFill=1;` |

---

### Red e infraestructura

**Habilitar**: `View > Shapes > Networking`

| Forma | Cadena de estilo |
| ------- | ------------- |
| Servidor genérico | `shape=server;html=1;whiteSpace=wrap;` |
| Servidor web | `shape=mxgraph.network.web_server;` |
| Servidor de base de datos | `shape=mxgraph.network.database;` |
| Portátil | `shape=mxgraph.network.laptop;` |
| Equipo de escritorio | `shape=mxgraph.network.desktop;` |
| Teléfono móvil | `shape=mxgraph.network.mobile;` |
| Enrutador | `shape=mxgraph.cisco.routers.router;` |
| Switch | `shape=mxgraph.cisco.switches.workgroup_switch;` |
| Firewall | `shape=mxgraph.cisco.firewalls.firewall;` |
| Nube (genérica) | `shape=cloud;` |
| Internet | `shape=mxgraph.network.internet;` |
| Equilibrador de carga | `shape=mxgraph.network.load_balancer;` |

---

### BPMN 2.0

**Habilitar**: `View > Shapes > BPMN`
**Prefijo de formas**: `shape=mxgraph.bpmn.*`

| Forma | Cadena de estilo |
| ------- | ------------- |
| Evento de inicio | `shape=mxgraph.bpmn.shape;perimeter=mxPerimeter.ellipsePerimeter;symbol=general;verticalLabelPosition=bottom;` |
| Evento de fin | `shape=mxgraph.bpmn.shape;perimeter=mxPerimeter.ellipsePerimeter;symbol=terminate;verticalLabelPosition=bottom;` |
| Tarea | `shape=mxgraph.bpmn.shape;perimeter=mxPerimeter.rectanglePerimeter;symbol=task;` |
| Compuerta exclusiva | `shape=mxgraph.bpmn.shape;perimeter=mxPerimeter.rhombusPerimeter;symbol=exclusiveGw;` |
| Compuerta paralela | `shape=mxgraph.bpmn.shape;perimeter=mxPerimeter.rhombusPerimeter;symbol=parallelGw;` |
| Subproceso | `shape=mxgraph.bpmn.shape;perimeter=mxPerimeter.rectanglePerimeter;symbol=subProcess;` |
| Flujo de secuencia | `edgeStyle=orthogonalEdgeStyle;html=1;endArrow=block;endFill=1;` |
| Flujo de mensajes | `edgeStyle=orthogonalEdgeStyle;dashed=1;html=1;endArrow=block;endFill=0;` |
| Participante (pool) | `shape=pool;startSize=30;horizontal=1;` |
| Carril | `swimlane;startSize=30;` |

---

### Maquetas y esquemas de interfaz

**Habilitar**: `View > Shapes > Mockup`

| Forma | Cadena de estilo |
| ------- | ------------- |
| Botón | `shape=mxgraph.mockup.forms.button;` |
| Campo de entrada | `shape=mxgraph.mockup.forms.text1;` |
| Casilla de verificación | `shape=mxgraph.mockup.forms.checkbox;` |
| Lista desplegable | `shape=mxgraph.mockup.forms.comboBox;` |
| Ventana de navegador | `shape=mxgraph.mockup.containers.browser;` |
| Pantalla móvil | `shape=mxgraph.mockup.containers.smartphone;` |
| Lista | `shape=mxgraph.mockup.containers.list;` |
| Tabla | `shape=mxgraph.mockup.containers.table;` |

---

### Kubernetes

**Habilitar**: `View > Shapes > Kubernetes`

| Recurso | Cadena de estilo |
| ---------- | ------------- |
| Pod | `shape=mxgraph.kubernetes.pod;` |
| Deployment | `shape=mxgraph.kubernetes.deploy;` |
| Service | `shape=mxgraph.kubernetes.svc;` |
| Ingress | `shape=mxgraph.kubernetes.ing;` |
| ConfigMap | `shape=mxgraph.kubernetes.cm;` |
| Secret | `shape=mxgraph.kubernetes.secret;` |
| PersistentVolume | `shape=mxgraph.kubernetes.pv;` |
| Namespace | `shape=mxgraph.kubernetes.ns;` |
| Node | `shape=mxgraph.kubernetes.node;` |

---

## Habilitar bibliotecas en VS Code

Las bibliotecas se habilitan dentro del editor de draw.io integrado en VS Code:

1. Abre cualquier archivo `.drawio` o `.drawio.svg` en VS Code
2. Haz clic en el icono `+` del panel de formas (barra lateral izquierda) → `Search Shapes` o `More Shapes`
3. Marca la biblioteca que quieras activar
4. Las formas aparecen en el panel para arrastrarlas y soltarlas

Las bibliotecas se guardan por usuario en la configuración de draw.io, no por proyecto.

---

## Creación de bibliotecas de formas personalizadas

Una biblioteca personalizada es un archivo XML con extensión `.xml` que se carga mediante `File > Open Library`:

```xml
<mxlibrary>
  [
    {
      "xml": "&lt;mxCell value=\"Componente\" style=\"rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;\" vertex=\"1\"&gt;&lt;mxGeometry width=\"120\" height=\"60\" as=\"geometry\" /&gt;&lt;/mxCell&gt;",
      "w": 120,
      "h": 60,
      "aspect": "fixed",
      "title": "Mi componente"
    }
  ]
</mxlibrary>
```

Cada entrada de forma contiene:

- `xml`: definición de celda escapada para XML
- `w` / `h`: ancho y alto predeterminados
- `aspect`: `"fixed"` para bloquear la proporción
- `title`: nombre mostrado en el panel

    }
  ]
</mxlibrary>

```
