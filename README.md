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
- **Docker** — Contenedor de base de datos

## ⚙️ Instalación
```bash
# Clonar el repositorio
git clone https://github.com/MiguelMorenoDev/messaging-api-nestjs.git
cd messaging-api-nestjs

# Instalar dependencias
npm install

# Copiar variables de entorno
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
PORT=4000
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

## 🔐 Autenticación

El sistema usa **refresh token rotation**:
1. El login devuelve un `accessToken` (15 min) y un `refreshToken` (30 días)
2. Cuando el `accessToken` expira, usa el `refreshToken` para obtener nuevos tokens
3. Cada refresh genera un nuevo `refreshToken`, invalidando el anterior
4. El logout invalida el `refreshToken` en la base de datos

## 🗺️ Roadmap

- [ ] Validación de DTOs con class-validator
- [ ] Logs con Winston
- [ ] Módulo Channels
- [ ] Módulo Messages
- [ ] Confirmación por email
- [ ] Gestión de múltiples dispositivos
- [ ] Rate limiting
- [ ] Documentación con Swagger
- [ ] Migraciones TypeORM