# Sistema heredado compartido — Acceso al visor

> **Ruta:** [Kit del equipo](../README.md) › [Documentación](README.md) › **Visor del legado**

La inmersión proporciona un entorno Natural/Adabas compartido con datos sintéticos de SIFAP. Los participantes usan un rol de observador restringido; la persona facilitadora opera el entorno por separado.

## Iniciar sesión

| Campo | Valor |
|---|---|
| URL | <https://sifap-lab-438k30.eastus2.cloudapp.azure.com/terminal/> |
| Nombre de usuario | `viewer` |
| Contraseña | La persona facilitadora la comparte en privado |

## Permisos del observador

El terminal del visor abre el programa Natural generado `VIEWBENF`.

- Puede consultar datos de beneficiarios e historial de pagos.
- No tiene ninguna vía de escritura en Adabas.
- No puede abrir la consola de administración de Adabas.
- No puede acceder a la línea de comandos de Natural.
- No puede ejecutar programas de registro ni batch.
- No puede desplegar, iniciar, detener ni configurar recursos de Azure.

El visor proporciona acceso de solo lectura a nivel de aplicación a un entorno de ejecución compartido. No es un tenant separado ni una copia privada de la base de datos.

## Si falla el acceso

1. Confirma que usaste la URL exacta `/terminal/`.
2. Confirma que el nombre de usuario sea `viewer`.
3. Pide a la persona facilitadora que verifique la contraseña actual y el estado del entorno.

No intentes aprovisionar, reparar ni administrar el laboratorio compartido desde este repositorio.

---

<sub>[Volver al índice del kit](../README.md)</sub>
