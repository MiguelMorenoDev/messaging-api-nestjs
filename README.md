# messaging-api-nestjs

API REST para una aplicación de mensajería en tiempo real tipo Slack/Discord, construida con **NestJS** y **Arquitectura Hexagonal (DDD)**.

## 🏗️ Arquitectura

El proyecto sigue los principios de **Arquitectura Hexagonal** (Ports & Adapters) con **Domain Driven Design (DDD)**:

- **Dominio**: Lógica de negocio pura, sin dependencias externas
- **Aplicación**: Casos de uso que orquestan la lógica
- **Infraestructura**: Adaptadores (TypeORM, controladores HTTP, guards)
```
src/
├── common/
│   └── filters/          # Manejo centralizado de errores
├── modules/
│   ├── auth/
│   │   ├── application/use-cases/   # register, login, logout, refresh
│   │   ├── domain/                  # DTOs de dominio
│   │   └── infrastructure/          # Controlador HTTP, guards JWT
│   └── users/
│       ├── application/use-cases/   # getAll, getById
│       ├── domain/                  # Entidad User, interfaz repositorio
│       └── infrastructure/          # TypeORM, mapper, repositorio
```

## 🚀 Tecnologías

- **NestJS** — Framework backend
- **TypeORM** — ORM para PostgreSQL
- **PostgreSQL** — Base de datos
- **JWT** — Autenticación con access token + refresh token rotation
- **bcrypt** — Hash de contraseñas
- **Winston** — Sistema de logs por niveles
- **Docker** — Contenedor de base de datos

## ⚙️ Instalación
```bash
git clone https://github.com/MiguelMorenoDev/messaging-api-nestjs.git
cd messaging-api-nestjs
npm install
cp .env.example .env
```

## 🔧 Variables de entorno
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=user_dev
DB_PASSWORD=password_dev
DB_NAME=messaging_db
JWT_SECRET=tu_secreto_jwt
JWT_REFRESH_SECRET=tu_secreto_refresh
PORT=3000
```

## 🐳 Base de datos con Docker
```bash
docker-compose up -d
```

## ▶️ Arrancar en desarrollo
```bash
npm run dev
```

## 📡 Endpoints

### Auth
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | /auth/register | Registrar usuario | No |
| POST | /auth/login | Iniciar sesión | No |
| POST | /auth/logout | Cerrar sesión | Sí |
| POST | /auth/refresh | Renovar tokens | No |

### Users
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | /users | Obtener todos los usuarios | No |
| GET | /users/:id | Obtener usuario por ID | No |

## 🔐 Autenticación y Seguridad

El sistema usa **refresh token rotation**:
1. El login devuelve un `accessToken` (15 min) y un `refreshToken` (30 días)
2. Cuando el `accessToken` expira, usa el `refreshToken` para obtener nuevos tokens
3. Cada refresh genera un nuevo `refreshToken`, invalidando el anterior
4. El logout invalida el `refreshToken` en la base de datos

### Decisiones técnicas de seguridad

**Validación de sesión en el guard**: El guard no solo verifica el JWT, también consulta la BD para comprobar que el usuario tiene sesión activa. Si el `refreshToken` es `null` (logout previo), la petición es rechazada con 401.

**Blacklist de accessTokens con Redis** *(en desarrollo)*: JWT es stateless y no tiene invalidación nativa. Para resolver el agujero de seguridad donde un `accessToken` seguía siendo válido tras el logout, se implementará una blacklist en Redis. Al hacer logout, el `accessToken` se añade a Redis con TTL igual a su tiempo restante de expiración.

## 📋 Logs

El sistema registra eventos por niveles con Winston:
- `info` — eventos normales (login, registro, logout exitosos)
- `warn` — eventos sospechosos (intentos fallidos, doble logout, tokens inválidos)
- `error` — errores críticos

Los logs se guardan en:
- `logs/combined.log` — todos los niveles
- `logs/warn.log` — warnings y errores
- `logs/error.log` — solo errores

## 🗺️ Roadmap

- [x] Autenticación JWT con refresh token rotation
- [x] Validación de DTOs con class-validator
- [x] Logs con Winston
- [x] Validación de sesión activa en el guard
- [ ] Blacklist de accessTokens con Redis
- [ ] Módulo Channels
- [ ] Módulo Messages
- [ ] Confirmación por email
- [ ] Gestión de múltiples dispositivos
- [ ] Rate limiting
- [ ] Documentación con Swagger
- [ ] Migraciones TypeORM