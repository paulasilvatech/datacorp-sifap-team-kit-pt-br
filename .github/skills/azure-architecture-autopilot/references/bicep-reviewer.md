# Agente revisor de Bicep

Revisa el código Bicep generado y corrige automáticamente los problemas encontrados.

## Orden de revisión

### Paso 1: Compilación de Bicep (ejecutar primero)

Ejecuta una compilación real de Bicep **antes** de la lista de verificación. No declares "aprobado" basándote únicamente en una inspección visual.

```powershell
az bicep build --file main.bicep 2>&1
```

Recopila todas las advertencias (WARNING) y los errores (ERROR) de la compilación. Estos son los datos fundamentales de la revisión.

### Paso 2: Corregir errores y advertencias de compilación

Corrige los problemas encontrados en los resultados de compilación:

- **ERROR** → Corregir obligatoriamente y volver a compilar
- **WARNING** → Tratar según los criterios siguientes

**🚨 Criterios para tratar WARNING: no forzar correcciones innecesarias:**

Las advertencias WARNING no bloquean el despliegue. Intentar resolverlas a menudo introduce errores de despliegue, por lo que debes usar estos criterios:

| Tipo de WARNING | Acción | Motivo |
|---|---|---|
| BCP081 (tipo no definido) | **Dejar sin cambios** (si la versión de API es la más reciente confirmada en MS Docs) | Las definiciones de tipos de la CLI local de Bicep aún no están actualizadas. No afecta al despliegue |
| BCP035 (propiedad ausente) | **Evaluar con cuidado**: consultar MS Docs para verificar si la propiedad es realmente obligatoria; si no lo es, dejar sin cambios | Añadir propiedades puede provocar fallos de despliegue por incompatibilidades (por ejemplo, computeMode) |
| BCP187 (tipo de sku/kind sin verificar) | **Dejar sin cambios** | Los valores confirmados en MS Docs funcionarán correctamente durante el despliegue |
| no-hardcoded-env-urls | **Dejar sin cambios** | Los nombres de zonas DNS requieren inevitablemente valores fijos |

**Nunca hagas lo siguiente:**

- Bajar versiones de API para resolver advertencias WARNING (mantén la estable más reciente)
- Añadir propiedades no confirmadas en MS Docs para resolver advertencias WARNING
- Forzar correcciones con el objetivo de lograr "cero advertencias"

**Principio: documenta las advertencias WARNING en los resultados de revisión, pero no las corrijas si no bloquean el despliegue.**

Problemas habituales y respuestas:

- BCP081 (tipo no definido) → Es probable que la versión de API sea incorrecta. Consulta MS Docs y actualiza a la versión estable más reciente real
- BCP036 (incompatibilidad de tipos) → Comprueba mayúsculas, minúsculas y tipo del valor de la propiedad, y corrígelo
- BCP037 (propiedad no permitida) → Consulta MS Docs para verificar si esa versión de API admite la propiedad
- no-hardcoded-env-urls → Las URL fijas en nombres de zonas DNS, etc. a veces son inevitables en Bicep. Indícalo en los resultados de revisión

### Paso 3: Revisión de la lista de verificación

Revisa los siguientes elementos después de superar la compilación. Consulta todos los aspectos que debes tener en cuenta en `references/service-gotchas.md`.

#### Crítica (corrección obligatoria)

- [ ] Existe la configuración `customSubDomainName` de Microsoft Foundry; **no puede cambiarse después de la creación y, si falta, hay que eliminar y volver a crear el recurso**
- [ ] Al usar Microsoft Foundry, **debe existir un proyecto de Foundry (`accounts/projects`)**; sin él, no se puede acceder desde el portal
- [ ] Microsoft Foundry tiene `identity: { type: 'SystemAssigned' }`; sin ella, falla la creación del proyecto
- [ ] `publicNetworkAccess: 'Disabled'` en todos los servicios que usan PE
- [ ] ADLS Gen2 tiene `isHnsEnabled: true`; sin ella, se convierte en Blob Storage convencional
- [ ] pe-subnet tiene `privateEndpointNetworkPolicies: 'Disabled'`; sin ella, falla la creación del PE
- [ ] Existe un grupo de zonas DNS privadas para cada PE
- [ ] Key Vault `enablePurgeProtection: true`

#### Alta (corrección recomendada)

- [ ] Storage `allowBlobPublicAccess: false`, `minimumTlsVersion: 'TLS1_2'`
- [ ] Enlace VNet de la zona DNS privada con `registrationEnabled: false`
- [ ] Los tipos de recurso y valores kind de cada servicio coinciden con `references/ai-data.md` o MS Docs
- [ ] Despliegues de modelos: orden garantizado (`dependsOn`)
- [ ] Ningún valor sensible en archivos de parámetros; **eliminarlo inmediatamente si se encuentra**

#### Media (recomendado)

- [ ] Prevenir colisiones de nombres de recursos con `uniqueString()`
- [ ] Aprovechar dependencias implícitas mediante referencias a recursos

### Paso 4: Comprobación de regresiones de valores fijos (evitar que se fije información dinámica)

Verifica que los siguientes elementos no estén fijados como valores literales en el código Bicep:

#### Parametrización obligatoria (sin valores fijos)

- [ ] `location`: los nombres literales de región (`'eastus'`, `'koreacentral'`, etc.) no se usan directamente; se pasan mediante `param location`
- [ ] Nombre y versión del modelo: no son literales; se usan los valores confirmados en la fase 1 y cuya disponibilidad se validó en el paso 0
- [ ] SKU: usar valores confirmados con la persona

#### Verificar que no se hayan vuelto a fijar valores dinámicos en las referencias

Esto no forma parte directamente del alcance de esta revisión, pero si se fijan versiones de API, listas de SKU o listas de regiones concretas en comentarios del código o descripciones de parámetros, elimínalas y sustitúyelas por la indicación "Consultar MS Docs".

#### Comprobación de incumplimientos de las reglas de decisión

- [ ] Si se usa `kind: 'OpenAI'` en lugar de Foundry → Cambiar a `kind: 'AIServices'`, salvo que la persona lo haya solicitado explícitamente
- [ ] Si se usa Hub (`MachineLearningServices`) para IA/RAG general → Cambiar a Foundry, salvo que la persona lo haya solicitado explícitamente
- [ ] Si se usa un recurso independiente de Azure OpenAI → Sugerir revisar el uso de Foundry, salvo que la persona lo haya solicitado explícitamente o Docs indique que es necesario

### Paso 5: Volver a compilar después de corregir

Si se realizaron cambios en los pasos 2–4, ejecuta de nuevo `az bicep build` para comprobar que no se hayan introducido errores nuevos.

### Limitaciones de `az bicep build`

La compilación solo valida sintaxis y tipos. Los siguientes aspectos no se detectan al compilar y se verifican finalmente con `az deployment group what-if` en la fase 4:

- SKU retiradas o no disponibles
- Disponibilidad de servicios por región
- Validez del nombre del modelo
- Propiedades exclusivas de versiones preliminares
- Cambios en políticas de servicio (cuota, capacidad, etc.)

Indica estas limitaciones en los resultados de la revisión para que la persona comprenda la importancia del paso what-if.

### Paso 6: Informar de los resultados

```markdown
## Resultados de la revisión del código Bicep

**Resultado de compilación**: [PASS/WARNING N elementos]
**Lista de verificación**: ✅ X elementos aprobados / ⚠️ X elementos con advertencias
**Comprobación de valores fijos**: [PASS / N incumplimientos]
**Corregido automáticamente**: X elementos

### Advertencias de compilación (pendientes)
- [Contenido de la advertencia, incluido el motivo por el que no puede corregirse]

### Detalles de las correcciones automáticas
- [Archivo:número de línea] Antes → Después (motivo)

### Incumplimientos por valores fijos (si existen)
- [Archivo:número de línea] [Detalles del incumplimiento] → [Método de corrección]

**Conclusión**: [Listo para desplegar / Se requiere revisión manual]
```

### Paso 7: Transición a la fase 4: mensaje tranquilizador obligatorio

Al preguntar si se desea pasar a la fase 4 después de superar la revisión de código, **incluye siempre un mensaje que tranquilice a la persona**.
La palabra "despliegue" puede generar inquietud, así que explica claramente que what-if es un paso seguro de validación.

```
ask_user({
  question: "¡La revisión de código se superó! ¿Continuamos con el siguiente paso?\n\n⚡ Esto NO despliega inmediatamente:\n  1️⃣ Validación What-if: simula lo que se creará (no es un despliegue, es seguro)\n  2️⃣ Diagrama de vista previa: revisa en un diagrama la arquitectura que se desplegará\n  3️⃣ Confirmación final: el despliegue real solo ocurre después de que revises el diagrama y lo apruebes\n\nNo se desplegará nada sin tu aprobación.",
  choices: [
    "Continuar con el siguiente paso (validación what-if + diagrama de vista previa) (Recomendado)",
    "Solo quiero el código; desplegaré más adelante"
  ]
})
```

**Puntos clave:**

- Indica siempre "Esto NO despliega inmediatamente"
- Explica el proceso de 3 pasos: what-if → diagrama de vista previa → confirmación final
- Tranquiliza con "No se desplegará nada sin tu aprobación"
