---
description: "Utiliza al implementar o revisar autenticación, autorización, criptografía, configuración segura, gestión de secretos y código sensible para la seguridad."
applyTo: "backend/src/main/java/**/auth/**,backend/src/main/java/**/security/**,backend/src/main/java/**/config/**,backend/src/main/resources/**,frontend/**/auth/**,frontend/**/middleware.ts"
---

# Convenciones de seguridad — Autenticación, autorización, secretos e inyección

Este archivo se activa para código sensible para la seguridad: paquetes `auth/`, `security/` y `config/`, todo el contenido de `backend/src/main/resources/`, además de `frontend/**/auth/**` y `frontend/middleware.ts`. Enseña autenticación, autorización, validación de entradas, CORS, gestión de secretos y protección de datos sensibles según las reglas OWASP Top 10 del repositorio. La estructura REST general se encuentra en [`backend.instructions.md`](backend.instructions.md); el almacenamiento de secretos con Terraform, en [`infrastructure.instructions.md`](infrastructure.instructions.md).

## Autenticación (OAuth2 / JWT)

El backend es un servidor de recursos OAuth2 sin estado que valida JWT mediante Spring Security. Nunca implementes manualmente el análisis de tokens ni la criptografía.

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()))
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable()); // API de tokens sin estado; sin cookie de sesión
        return http.build();
    }
}
```

Si se almacenan contraseñas, aplica hash con argon2 o bcrypt (nunca un digest simple), limita la frecuencia de los inicios de sesión y exige MFA para administradores.

## Autorización

Autoriza cada solicitud, deniega de forma predeterminada y exige el privilegio mínimo. Utiliza seguridad a nivel de método para comprobar roles y verifica explícitamente la propiedad de los recursos.

```java
@PreAuthorize("hasRole('AUDITOR')")
public AuditReport generate(UUID resourceId, Authentication principal) {
    Resource resource = resourceService.getOwned(resourceId, principal.getName());
    // La propiedad se comprueba en el servicio; un rol por sí solo no basta
    return AuditReport.of(resource);
}
```

## Validación de entradas e inyección

Valida en cada límite con `@Valid` (consulta [`backend.instructions.md`](backend.instructions.md)). Construye consultas únicamente con parámetros vinculados de JPA/JPQL, escapa el HTML en la salida y valida los archivos cargados por tipo y tamaño.

> [!WARNING]
> Nunca concatentes entradas de usuario en una consulta, un comando de shell ni código de marcado. El SQL construido con cadenas es el vector clásico de inyección; la vinculación de parámetros no es opcional.

## CORS

Configura explícitamente los orígenes permitidos. El comodín `*` está prohibido en producción.

```java
@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("https://app.example.gov.br")); // Nunca "*" en producción
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", config);
    return source;
}
```

## Secretos y configuración segura

No se incorpora ningún secreto directamente en el código, los commits ni los registros. Lee los secretos del entorno o de Key Vault; autentica los servicios de Azure entre sí mediante identidades administradas (Managed Identity). En el frontend, solo los valores que no son secretos pueden utilizar el prefijo `NEXT_PUBLIC_`: todo valor con ese prefijo se envía al navegador.

## Datos sensibles (CPF, importes)

> [!IMPORTANT]
> Enmascara los campos regulados (CPF, importes de prestaciones) en registros, respuestas de error y URL. Nunca los incluyas en cadenas de consulta ni en almacenamiento sin cifrar y transmítelos siempre mediante TLS.

```java
// Conserva los primeros 3 y los últimos 2 dígitos de un CPF de 11 dígitos
String masked = cpf.replaceAll("(\\d{3})\\d{6}(\\d{2})", "$1******$2");
```

## Límite de autenticación del frontend (`middleware.ts`)

Controla las rutas protegidas en el middleware; nunca confíes en el cliente para exigir el control de acceso. Mantén los tokens y los secretos en el servidor.

```ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  if (!session) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };
```

## Límites de automatización y agentes

Un agente de IA o una automatización nunca se concede nuevos permisos ni toca una base de datos de producción sin aprobación humana explícita. Los cambios en autenticación, autorización, roles o gestión de secretos requieren revisión por pares antes de integrarse.

## Convenciones

| Regla | Justificación |
|---|---|
| OAuth2/JWT mediante Spring Security | Sin código de autenticación propio propenso a errores |
| Autorizar cada solicitud y denegar de forma predeterminada | Privilegio mínimo en cada límite |
| Solo parámetros vinculados de JPA/JPQL | Elimina la inyección SQL |
| Orígenes CORS explícitos, sin `*` en producción | Bloquea abusos entre orígenes |
| Secretos desde el entorno/Key Vault, identidades administradas | Sin credenciales en el código ni en los registros |
| Enmascarar CPF e importes en todas partes | Protege los datos regulados |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Aplicar hash a las contraseñas con argon2/bcrypt | Almacenar o registrar texto plano o un digest simple |
| Comprobar el rol **y** la propiedad del recurso | Considerar que un rol basta como autorización |
| Mantener los secretos en el servidor | Añadir el prefijo `NEXT_PUBLIC_` a un secreto |
| Enmascarar los campos sensibles antes de registrarlos | Poner CPF o importes en registros o cadenas de consulta |

## Lista de verificación antes de abrir una PR

- [ ] Los puntos de conexión autentican mediante Spring Security; no hay análisis de tokens propio
- [ ] Cada solicitud se autoriza, se deniega de forma predeterminada y se comprueba la propiedad cuando corresponde
- [ ] Todas las consultas utilizan parámetros vinculados; las cargas de archivos y las entradas se validan
- [ ] CORS enumera orígenes explícitos; no hay `*` en la configuración de producción
- [ ] No hay secretos incorporados directamente en el código, los commits ni los registros; la autenticación de Azure utiliza identidades administradas
- [ ] CPF, importes y tokens están enmascarados en registros, errores y URL
