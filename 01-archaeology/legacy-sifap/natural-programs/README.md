# Programas Natural

> **Ruta:** [Kit del equipo](../../../README.md) › [Etapa 1](../../README.md) › [SIFAP heredado](../README.md) › **Programas Natural**

**Los 15 miembros Natural asignados de SIFAP, el Sistema de Fiscalización y Administración de Pagos, más los nueve miembros de biblioteca de apoyo.** Los programas implementan la lógica de negocio del sistema heredado. Cada pareja lee tres programas durante la Etapa 1.

| Campo | Valor |
|---|---|
| **Público** | Todas las parejas: cada una lee sus tres programas asignados |
| **Prerrequisitos** | Leer [`HOW-TO-READ-NATURAL.md`](../HOW-TO-READ-NATURAL.md) |
| **Etapa** | Etapa 1 — Arqueología |
| **Resultado esperado** | Reglas catalogadas con evidencia `file.NSN#L<start>-L<end>` y un mapa de dependencias iniciado |

> [!NOTE]
> Estos archivos son material de referencia de solo lectura. Durante la Etapa 1, las parejas analizan los programas para extraer reglas de negocio y mapearlas al sistema moderno (Java 21 + Spring Boot).

---

## Qué contiene esta carpeta

| Grupo | Cantidad | Extensiones | Qué hacer con ellos |
|---|---|---|---|
| **Miembros asignados** | 15 | `.NSP` (12 programas), `.NSN` (3 subprogramas) | **Lectura asignada.** Tres por pareja |
| **Miembros de apoyo** | 9 | `.NSA`, `.NSL`, `.NSC`, `.NSN`, `.jcl` | **Consultar según sea necesario.** Infraestructura compartida |

> [!IMPORTANT]
> **Tu carga de lectura no ha cambiado: siguen siendo tres programas por pareja.**
> Los nueve miembros de apoyo son infraestructura de la biblioteca: áreas de datos, copycodes, dos subprogramas de validación y dos JCL. Abre uno cuando alguno de *tus* programas use `USING`, `INCLUDE` o `CALLNAT` y necesites comprender qué significa ese nombre. **No** son programas adicionales, **no** pertenecen a ninguna pareja y **no** cuentan entre las tres lecturas asignadas.

Todo se mantiene en un único directorio porque una biblioteca Natural es **plana**: `CALLNAT`, `INCLUDE` y `USING` resuelven los miembros **por nombre**, nunca por ruta. Consulta [`HOW-TO-READ-NATURAL.md`, sección 2](../HOW-TO-READ-NATURAL.md#2-miembros-de-una-biblioteca-natural).

---

## 1. Los 15 programas asignados: distribución por pareja

| Pareja | Programa | Autor | Año | Descripción |
|---|---|---|---|---|
| **1 · Visión** (PO + RE) — registro | `CADBENEF.NSP` | Roberto Meirelles | 1997 | Registro de beneficiarios: creación, actualización y baja |
| | `CADDEPEN.NSP` | José A. Lima | 1998 | Registro de un dependiente vinculado al beneficiario titular |
| | `CADPROG.NSP` | Fernanda C. Oliveira | 1997 | Registro de programas sociales: parámetros y tramos de valores |
| **2 · Arquitectura** (EA + SA) — batch | `BATCHPGT.NSP` | José A. Lima | 1999 | Pago batch: genera ciclos mensuales de pagos |
| | `BATCHREL.NSP` | José A. Lima | 1999 | Informe batch: produce informes de gestión |
| | `BATCHCON.NSP` | Patrícia H. Moura | 2002 | Conciliación batch: concilia pagos con SIAFI |
| **3 · Implementación** (TL + Dev) — cálculo | `CALCBENF.NSN` | Roberto Meirelles | 1998 | Calcula el importe del beneficio por programa y tramo |
| | `CALCCORR.NSP` | Patricia Gomes de Souza | 2001 | Calcula correcciones retroactivas de pagos mediante índices IPCA |
| | `CALCDSCT.NSP` | Roberto Mendes Junior | 1999 | Calcula deducciones obligatorias y topes de descuentos |
| **4 · Calidad** (DBA + QA) — validación | `VALBENEF.NSN` | Roberto Meirelles | 1997 | Valida datos de registro (CPF, NIS) |
| | `VALDOCS.NSP` | Ana Lucia Pereira | 1998 | Valida CPF, NIS/PIS, RG, CTPS y documentos justificativos |
| | `VALELEG.NSN` | Fernanda C. Oliveira | 1999 | Valida la elegibilidad según las reglas del programa |
| **5 · Operaciones** (DevOps + TW) — consultas e informes | `CONSBENF.NSP` | Marcia Helena Oliveira | 1998 | Consulta datos de beneficiarios por CPF o NIS (pantalla 3270) |
| | `RELPGT.NSP` | Ana Lucia Pereira | 1999 | Informe detallado de pagos por período y programa |
| | `RELAUDIT.NSP` | Roberto Mendes Junior | 2002 | Informe de trazas de auditoría con filtros de período/acción |

---

## 2. Los nueve miembros de apoyo: infraestructura compartida

Ninguno de estos miembros pertenece a una pareja ni cuenta como lectura asignada.

| Miembro | Tipo | Cómo aparece en el código | Propósito |
|---|---|---|---|
| `PDAVALID.NSA` | PDA | `PARAMETER USING PDAVALID` / `LOCAL USING PDAVALID` | Contrato de parámetros de la familia de validación de documentos: CPF y NIS son entradas; código de retorno y mensaje son salidas |
| `PDACALC.NSA` | PDA | `PARAMETER USING PDACALC` / `LOCAL USING PDACALC` | Contrato de parámetros de la cadena de pagos: la clave del beneficiario y el contexto son entradas; los importes calculados son salidas |
| `LDASIFAP.NSL` | LDA | `LOCAL USING LDASIFAP` | Tablas de parámetros compartidas: factor regional, tramos de ingresos, tasas, UF, fechas y ventana de siglo (Y2K) |
| `CCVALCPF.NSC` | Copycode | `INCLUDE CCVALCPF` + `PERFORM VALID-CPF-STANDARD` | Rutina CPF módulo 11 insertada durante la compilación: la vía de validación **antigua** |
| `CCAUDIT.NSC` | Copycode | `INCLUDE CCAUDIT` + `PERFORM GRAVA-AUDIT` | Bloque estándar para escribir la traza de auditoría en el archivo 153 |
| `SUBVALCP.NSN` | Subprograma | `CALLNAT 'SUBVALCP' ...` | Validación invocable de CPF (módulo 11): la vía de validación **nueva** |
| `SUBVALNI.NSN` | Subprograma | `CALLNAT 'SUBVALNI' ...` | Validación invocable de NIS/PIS/PASEP (módulo 11) |
| `SIFAPJ01.jcl` | JCL z/OS | Fuera de Natural | Trabajo de **nómina mensual**: ejecuta `BATCHPGT` mediante `NATBATCH` |
| `SIFAPJ02.jcl` | JCL z/OS | Fuera de Natural | Trabajo de **informes mensuales**: ejecuta `BATCHREL` y `RELPGT` |

> [!NOTE]
> `SUBVALCP.NSN` y `SUBVALNI.NSN` tienen la extensión `.NSN`, como otros miembros asignados, pero son **subprogramas**: existen solo para ser llamados por `CALLNAT` y no ejecutan `INPUT` ni `WRITE`. No forman parte de los 15 miembros asignados.

---

## 3. Del JCL al programa: el flujo batch de producción

Los dos JCL hacen trazable el flujo mensual de extremo a extremo:

| Trabajo | Cuándo se ejecuta | Qué ejecuta | Salida |
|---|---|---|---|
| `SIFAPJ01.jcl` | Mensualmente: primer día hábil | `BATCHPGT` | Nómina mensual y archivo de remesa bancaria |
| `SIFAPJ02.jcl` | Mensualmente: segundo día hábil, después de `SIFAPJ01` | `BATCHREL` y `RELPGT` | Informe consolidado e informe analítico por programa |

Cada JCL documenta en comentarios la planificación (Control-M), los archivos asignados y el procedimiento de reinicio. Es la mejor fuente para responder "¿qué sucede cada mes y en qué orden?"

---

## 4. Mapa de dependencias: cómo construirlo

Los miembros de esta carpeta se referencian entre sí. Descubrir **quién llama a quién** es el ejercicio de mapeo de dependencias de la Etapa 1: el resultado pertenece a [`dependency-map.md`](../../dependency-map.md) y no se publica aquí.

**Los cuatro tipos de aristas y cómo encontrarlos:**

```bash
cd 01-archaeology/legacy-sifap/natural-programs

grep -n "CALLNAT" *.NSP *.NSN   # llamada a subprograma   (arista entre módulos)
grep -n "INCLUDE" *.NSP *.NSN   # copycode insertado      (arista a .NSC)
grep -n "USING"   *.NSP *.NSN   # PDA y LDA en uso        (arista a .NSA/.NSL)
grep -n -A 8 "CMSYNIN" *.jcl     # programa que ejecuta cada trabajo
```

En VS Code, el equivalente es Ctrl+Shift+F con la expresión regular `CALLNAT|INCLUDE|USING` y el filtro de archivos `*.NSP,*.NSN`.

**Qué registrar para cada arista encontrada:**

| Campo | Ejemplo |
|---|---|
| Origen | `BATCHPGT` |
| Tipo | `CALLNAT` · `INCLUDE` · `USING` · `JCL runs` |
| Destino | Nombre del miembro llamado |
| Evidencia | `file.NSN#L<line>` |

> [!TIP]
> Tres orientaciones para ahorrar tiempo:
>
> 1. **Confirma cada arista en el código.** Un comentario de cabecera es una pista, no una prueba: puede mencionar una dependencia ausente del cuerpo del programa u omitir una que sí está presente.
> 2. **Algunas aristas cruzan parejas.** Si uno de tus programas llama a un programa asignado a otra pareja, coordina la lectura con ella antes de finalizar el mapa: así es como emerge el diseño del sistema.
> 3. **Empieza por los miembros de apoyo.** Buscar `SUBVALCP`, `SUBVALNI`, `CCVALCPF`, `CCAUDIT`, `PDAVALID`, `PDACALC` y `LDASIFAP` en todo el directorio revela la estructura básica del grafo en minutos.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [SIFAP heredado — descripción general](../README.md)<br/><sub>Contexto e historia del sistema.</sub> | [DDM de Adabas](../adabas-ddms/README.md)<br/><sub>Estructuras de datos de Adabas.</sub> |

<sub>[Volver al índice del kit](../../../README.md)</sub>
