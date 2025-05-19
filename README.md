
<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
  <h1>Users API - NestJS</h1>
  <p>
    API robusta para la gestión de usuarios con autenticación JWT y autorización por roles.
  </p>
  <p>
    <a href="https://www.npmjs.com/~nestjscore" target="_blank">
      <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
    </a>
    <a href="https://www.npmjs.com/~nestjscore" target="_blank">
      <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
    </a>
    <a href="https://github.com/GonzaloBisio/users-api-nestjs" target="_blank">
      <img src="https://img.shields.io/badge/Repo-GitHub-success" alt="GitHub Repository" />
    </a>
  </p>
</div>

## 📋 Descripción

API de usuarios desarrollada con [NestJS](https://nestjs.com/). Brinda autenticación basada en JWT, autorización con control de roles, validación de datos y documentación generada con Swagger.

## 🚀 Características

- 🔐 Autenticación JWT y refresh token
- 🛡️ Autorización basada en roles (ADMIN, MODERATOR, SUPPORT, USER)
- 🧾 CRUD de usuarios
- ⚙️ Validación de datos con pipes
- 📚 Documentación interactiva (Swagger)
- 🔄 Módulo de refresco de tokens
- 🧪 Soporte para testing unitario y e2e
- 📦 Docker-ready

## 📦 Requisitos Previos

- Node.js v16+
- npm o yarn
- Git

## ⚙️ Instalación y Puesta en Marcha

```bash
# 1. Clonar el repositorio
git clone https://github.com/GonzaloBisio/users-api-nestjs.git
cd users-api-nestjs

# 2. Instalar dependencias
npm install
# o
yarn install

# 3. Crear el archivo de variables de entorno
cp .env.example .env
```

Ejemplo de `.env`:
```env
PORT=3000
JWT_SECRET=secretKeyExample
JWT_EXPIRATION=1h
REFRESH_SECRET=refreshSecretExample
REFRESH_EXPIRATION=7d
```

```bash
# 4. Ejecutar en modo desarrollo
npm run start:dev

# Producción
npm run start:prod
```

Visita `http://localhost:3000/api/docs` para explorar la documentación Swagger.

## 🧪 Testing

```bash
# Pruebas unitarias
npm run test


## 🛡️ Autenticación y Roles

### Roles disponibles

| Rol       | Permisos                                             |
|-----------|------------------------------------------------------|
| ADMIN     | Acceso completo a todos los recursos                 |
| MODERATOR | Lectura y actualización de usuarios                  |
| SUPPORT   | Solo lectura                                          |
| USER      | Acceso limitado a su propia información              |

## 🔑 Usuario por defecto

```bash
email: admin@admin.com
contraseña: admin123
```

## 📚 Endpoints Principales

### 🔐 Autenticación

**Iniciar sesión**
como admin para consumir endpoints de la api

```http
POST /api/auth/login
```
```json
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

**Refresh token**
```http
POST /api/auth/refresh
Authorization: Bearer <refresh_token>
```

### 👤 Usuarios

**Crear usuario (solo ADMIN)**
```http
POST /api/users
Authorization: Bearer <token_jwt>
```

**Obtener todos los usuarios**
```http
GET /api/users
Authorization: Bearer <token_jwt>
```

**Obtener usuario por ID**
```http
GET /api/users/:id
Authorization: Bearer <token_jwt>
```

**Actualizar usuario**
```http
PATCH /api/users/:id
Authorization: Bearer <token_jwt>
```

**Eliminar usuario (solo ADMIN)**
```http
DELETE /api/users/:id
Authorization: Bearer <token_jwt>
```

## 🐳 Uso con Docker

```bash
# Construcción de la imagen
docker build -t users-api .

# Ejecución
docker run -p 3000:3000 users-api
```

---

