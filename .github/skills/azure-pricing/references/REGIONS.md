# Referencia de nombres de regiones de Azure

La API Azure Retail Prices requiere valores `armRegionName` en minúsculas y sin espacios. Usa esta tabla para relacionar los nombres habituales de regiones con sus valores en la API.

## Correspondencias de regiones

| Nombre mostrado | armRegionName |
|-------------|---------------|
| East US | `eastus` |
| East US 2 | `eastus2` |
| Central US | `centralus` |
| North Central US | `northcentralus` |
| South Central US | `southcentralus` |
| West Central US | `westcentralus` |
| West US | `westus` |
| West US 2 | `westus2` |
| West US 3 | `westus3` |
| Canada Central | `canadacentral` |
| Canada East | `canadaeast` |
| Brazil South | `brazilsouth` |
| North Europe | `northeurope` |
| West Europe | `westeurope` |
| UK South | `uksouth` |
| UK West | `ukwest` |
| France Central | `francecentral` |
| France South | `francesouth` |
| Germany West Central | `germanywestcentral` |
| Germany North | `germanynorth` |
| Switzerland North | `switzerlandnorth` |
| Switzerland West | `switzerlandwest` |
| Norway East | `norwayeast` |
| Norway West | `norwaywest` |
| Sweden Central | `swedencentral` |
| Italy North | `italynorth` |
| Poland Central | `polandcentral` |
| Spain Central | `spaincentral` |
| East Asia | `eastasia` |
| Southeast Asia | `southeastasia` |
| Japan East | `japaneast` |
| Japan West | `japanwest` |
| Australia East | `australiaeast` |
| Australia Southeast | `australiasoutheast` |
| Australia Central | `australiacentral` |
| Korea Central | `koreacentral` |
| Korea South | `koreasouth` |
| Central India | `centralindia` |
| South India | `southindia` |
| West India | `westindia` |
| UAE North | `uaenorth` |
| UAE Central | `uaecentral` |
| South Africa North | `southafricanorth` |
| South Africa West | `southafricawest` |
| Qatar Central | `qatarcentral` |

## Reglas de conversión

1. Eliminar todos los espacios
2. Convertir a minúsculas
3. Ejemplos:
   - "East US" → `eastus`
   - "West Europe" → `westeurope`
   - "Southeast Asia" → `southeastasia`
   - "South Central US" → `southcentralus`

## Alias habituales

Las personas pueden referirse a regiones de manera informal. Asocia esos nombres con el `armRegionName` correcto:

| La persona dice | Se corresponde con |
|-----------|---------|
| "US East", "Virginia" | `eastus` |
| "US West", "California" | `westus` |
| "Europe", "EU" | `westeurope` (predeterminado) |
| "UK", "London" | `uksouth` |
| "Asia", "Singapore" | `southeastasia` |
| "Japan", "Tokyo" | `japaneast` |
| "Australia", "Sydney" | `australiaeast` |
| "India", "Mumbai" | `centralindia` |
| "Korea", "Seoul" | `koreacentral` |
| "Brazil", "São Paulo" | `brazilsouth` |
| "Canada", "Toronto" | `canadacentral` |
| "Germany", "Frankfurt" | `germanywestcentral` |
| "France", "Paris" | `francecentral` |
| "Sweden", "Stockholm" | `swedencentral` |
