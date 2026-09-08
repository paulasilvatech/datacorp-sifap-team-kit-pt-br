# Archivos DDM de Adabas

> **Ruta:** [Kit del equipo](../../../README.md) › [Etapa 1](../../README.md) › [SIFAP heredado](../README.md) › **DDM de Adabas**

**DDM (módulos de definición de datos) de SIFAP, el Sistema de Fiscalización y Administración de Pagos.** Describen la estructura física y lógica de la base de datos Adabas usada por el sistema heredado. Material de referencia para la Pareja 4 (DBA + QA) durante la Etapa 1.

| Campo | Valor |
|---|---|
| **Público** | La Pareja 4 (DBA + QA) lidera; todas las parejas consultan |
| **Prerrequisitos** | Leer [`HOW-TO-READ-NATURAL.md`](../HOW-TO-READ-NATURAL.md), sección 6 (tipos de campos) |
| **Etapa** | Etapa 1 — Arqueología |
| **Resultado esperado** | Mapeo de los campos relevantes para el alcance seleccionado |

---

## Qué es un DDM

Un **DDM (módulo de definición de datos)** es el archivo que describe el esquema de una base de datos Adabas: equivale a un `CREATE TABLE` de SQL. Cada DDM enumera los campos (con tipo, tamaño y atributos como descriptor o valor múltiple) de un archivo Adabas (FNR).

**Por qué importa:** sin leer el DDM, no sabes qué campos existen, qué tipos tienen ni qué estructuras (`MU`, `PE`) deberán convertirse en tablas hijas en PostgreSQL. Los nombres de campos de los programas `.NSN` son abreviaturas que solo tienen sentido al cotejarlas con el DDM.

**Cómo se aplica a SIFAP:** el programa `CALCBENF.NSN` referencia campos como `BN-AMT-INCOME-PC` y `PS-AMT-MAX`. Para entender qué representa cada campo, consulta los miembros DDM `BENEFIC` y `SOCPROG`.

---

## Contenido

| Archivo | Archivo Adabas | Descripción |
|---|---|---|
| `BENEFIC.ddm` | DBID 057 / FNR 150 | Registros de beneficiarios: datos personales, documentos, estado del registro, datos bancarios y dependientes (PE) |
| `PAYMENT.ddm` | DBID 057 / FNR 152 | Registros de pagos: importes, fechas, estado, banco pagador, deducciones (PE) y conciliación |
| `SOCPROG.ddm` | DBID 057 / FNR 151 | Programas sociales: reglas de elegibilidad, tramos de valores y parámetros de cálculo |
| `AUDIT.ddm` | DBID 057 / FNR 153 | Traza de auditoría: acciones de usuarios, modificaciones de registros y contexto batch |
| `FDT-150-BENEFICIARY.txt` | DBID 057 / FNR 150 | **FDT física** del archivo 150 (salida de ADAREP): estructura real, opciones `NU`/`FI`/`DE`/`UQ`, volumen de datos y estimación de la ventana de descarga |

---

## Cómo leer un DDM

Los archivos `.ddm` de este directorio son **listados** generados por la utilidad `LISTDDM` de SYSDDM: es decir, salida de máquina, no código fuente editable. La tabla principal siempre tiene las mismas ocho columnas:

```text
 T L DB Name                     F Leng  S D Remark
 - - -- ------------------------ - ----  - - ---------------------------
   1 AB NUM-CPF                  A   11    U UNFORMATTED CPF
 P 1 DA GRP-DEPEND                        (1:10) PERIODIC GROUP
 S   S2 SUPER-UF-STAT             A    3    S
        /* BG(1-2), CE(1-1)
```

| Columna | Significado | Valores posibles |
|---|---|---|
| **T** | Tipo de entrada | *(vacía)* = campo elemental · `G` = grupo · `M` = multivalor (`MU`) · `P` = grupo periódico (`PE`) · `S` = descriptor derivado |
| **L** | Nivel | `1` = campo raíz · `2` = campo dentro de un grupo o PE. Los descriptores derivados no tienen nivel |
| **DB** | *Nombre corto* | Nombre físico de **2 bytes** en la FDT. Es el único nombre que realmente conoce el archivo Adabas |
| **Name** | Nombre largo | Existe solo en el DDM. Es el nombre que usan los programas Natural en las declaraciones `VIEW OF` |
| **F** | Formato | `A` = alfanumérico · `N` = numérico *no empaquetado* (1 byte por dígito) · `P` = *decimal empaquetado* (2 dígitos por byte) |
| **Leng** | Longitud | Bytes o `digits,decimals` para campos con decimales: **siempre con coma** (`9,2`, nunca `9.2`) |
| **S** | *Opción de almacenamiento* | `N` = *supresión de nulos* (un campo vacío no ocupa espacio ni se añade al índice) · `F` = *almacenamiento fijo* (sin compresión, típico para indicadores de 1 byte) |
| **D** | Descriptor | `D` = descriptor · `U` = descriptor único · `S` = superdescriptor · `H` = hiperdescriptor · `P` = descriptor fonético |
| **Remark** | Comentario | Dominio de valores, valores centinela y fecha de incorporación del campo. Las ocurrencias `MU`/`PE` aparecen aquí como `(1:10)` |

Las líneas que empiezan por `/*` inmediatamente debajo de un descriptor derivado enumeran **los campos que lo componen**. Por ejemplo, `/* BG(1-2), CE(1-1)` significa "bytes 1–2 de `BG` concatenados con el byte 1 de `CE`".

> [!IMPORTANT]
> **`FIND ... WITH <field>` y `READ ... BY <field>` solo son válidos si el campo tiene un valor en la columna `D`.** Buscar por un campo no indexado es un error de ejecución de Adabas, no un error de compilación: el programa "funciona" hasta que se ejecuta. Esta es la primera comprobación al leer un programa `.NSN`.

### DDM × FDT

| | DDM (`.ddm`) | FDT (`FDT-150-BENEFICIARY.txt`) |
|---|---|---|
| Qué es | Vista **lógica** usada por Natural | Estructura **física** del archivo de base de datos |
| Nombres | Nombres largos (`NUM-CPF`) | Solo *nombres cortos* (`AB`) |
| Generado por | `LISTDDM` (SYSDDM) | `ADAREP` / `ADACMP` |
| ¿Incluye el volumen de datos? | Estimaciones en el pie | Sí: `TOP-ISN`, `MAXISN`, relación de compresión, extensiones y estimación de descarga |

Un equipo de migración real recibe **ambos**. El DDM explica qué significan los campos; la FDT muestra cuántos datos existen y cuánto tiempo llevará extraerlos.

### Dificultades conocidas en este conjunto de fuentes

- **Campos alfanuméricos usados como valores numéricos.** Varios campos son `A` en el DDM, pero aparecen como `N` en los programas, incluso en operaciones aritméticas y como índices de arrays. Un registro antiguo con espacios en un campo `A` provoca un error al trasladarlo a `N`.
- **Valores centinela en lugar de null.** `0` para indicar "sin plazo", `00000000000` como CPF provisional y `99999999` como fecha desconocida. Ninguno de ellos es `NULL`.
- **Campos huérfanos.** Algunos campos existen en el esquema desde hace décadas, pero ninguno de los 15 programas los lee ni escribe. Verifica antes de suponer que una columna contiene datos.
- **Los dominios documentados en el comentario pueden estar desactualizados.** El comentario describe el dominio *cuando se creó el campo*, no necesariamente lo que se almacena hoy.

---

## Cómo usar estos archivos durante la Etapa 1

- [ ] **Abre los DDM relevantes para la funcionalidad seleccionada.** No siempre hacen falta los cuatro.
- [ ] **Lee la sección "Cómo leer un DDM" anterior** antes de cotejar un DDM con un programa: la comparación carece de sentido sin las columnas `T`/`S`/`D`.
- [ ] **Identifica los campos `MU` y `PE`** (columna `T` = `M` o `P`). Estos se convierten en tablas hijas en PostgreSQL.
- [ ] **Comprueba la columna `D` antes de aceptar un `FIND`/`READ BY`.** Si el campo no es un descriptor, el acceso no es válido en Adabas.
- [ ] **Compara cada `VIEW OF` con el DDM correspondiente.** Deben coincidir el nombre, el formato y la longitud.
- [ ] **Registra el mapeo** en [`dependency-map.md`](../../dependency-map.md) (sección Aristas Programa → DDM).
- [ ] **Aporta términos** a [`glossary.md`](../../glossary.md): los nombres de campos suelen revelar abreviaturas del dominio.

> [!WARNING]
> Estos archivos son material de referencia de solo lectura. No edites los DDM.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [SIFAP heredado — descripción general](../README.md)<br/><sub>Contexto del sistema e inventario completo.</sub> | [Programas Natural](../natural-programs/README.md)<br/><sub>Los 15 archivos asignados que contienen la lógica de negocio.</sub> |

<sub>[Volver al índice del kit](../../../README.md)</sub>
