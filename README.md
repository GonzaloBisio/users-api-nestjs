<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
  
  # 🔥 Users API - NestJS
  
  <p align="center">
    <strong>API robusta para la gestión de usuarios con autenticación JWT y autorización por roles</strong>
  </p>
  
  <p align="center">
    <a href="https://www.npmjs.com/~nestjscore" target="_blank">
      <img src="https://img.shields.io/npm/v/@nestjs/core.svg?style=for-the-badge&logo=nestjs&color=E0234E&label=NestJS" alt="NestJS Version" />
    </a>
    <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank">
      <img src="https://img.shields.io/npm/l/@nestjs/core?style=for-the-badge&color=blue" alt="License" />
    </a>
    <a href="https://github.com/GonzaloBisio/users-api-nestjs" target="_blank">
      <img src="https://img.shields.io/badge/Repo-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
    </a>
    <a href="https://hub.docker.com/" target="_blank">
      <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" alt="Docker Ready" />
    </a>
  </p>


## 🌟 Características Principales

<div align="center">

| Característica | Descripción |
|---------------|-------------|
| 🔐 **Autenticación Segura** | JWT con refresh tokens para máxima seguridad |
| 🛡️ **Control de Acceso** | Roles jerárquicos (ADMIN, MODERATOR, SUPPORT, USER) |
| 📚 **Documentación** | Swagger UI integrado |
| 🧪 **Testing** | Suite de pruebas unitarias |
| 🐳 **Docker** | Configuración lista para producción |
| ⚡ **Rendimiento** | Optimizado para alta concurrencia |

</div>

## 🚀 Empezando Rápido

¡Comienza en menos de 5 minutos! Sigue estos pasos:

```bash
# 1. Clonar repositorio
git clone https://github.com/GonzaloBisio/users-api-nestjs.git
cd users-api-nestjs

# 2. Iniciar con Docker
docker build -t usuarios-api .
docker run -p 3000:3000 --env-file .env usuarios-api

# 3. Acceder a la documentación
# Abre http://localhost:3000/api/docs en tu navegador
```

🔹 **Credenciales por defecto:**
```
📧 Email: admin@admin.com
🔑 Contraseña: admin123
```

## 📦 Requisitos Previos

- Node.js v16+
- npm o yarn
- Docker (opcional para despliegue)
- Git

## 🚀 Empezando Rápido con Docker (Recomendado)

### 1. Clonar el repositorio
```bash
git clone https://github.com/GonzaloBisio/users-api-nestjs.git
cd users-api-nestjs
```

### 2. Configuración de variables de entorno
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus valores:
```env
PORT=3000
JWT_SECRET=tu_clave_secreta_segura
JWT_EXPIRATION=1h
REFRESH_SECRET=tu_clave_secreta_refresh
REFRESH_EXPIRATION=7d
```

### 3. Construir y ejecutar con Docker
```bash
# Construir la imagen
docker build -t usuarios-api .

# Ejecutar el contenedor
docker run -p 3000:3000 --env-file .env usuarios-api
```

La aplicación estará disponible en: `http://localhost:3000`

## 🛠 Instalación Manual

### 1. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 2. Configuración
```bash
cp .env.example .env
# Editar el archivo .env con tus valores
```

### 3. Iniciar la aplicación
```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## 📚 Documentación de la API

<div align="center">
  <h3>📖 Documentación Interactiva</h3>
  <p>Explora todos los endpoints con nuestra documentación Swagger interactiva</p>
  
  <a href="http://localhost:3000/api/docs" target="_blank">
    <img src="https://img.shields.io/badge/Explorar_Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger UI" />
  </a>
  
  <p>O accede directamente al esquema OpenAPI:</p>
  <code>http://localhost:3000/api/docs-json</code>
  
  <h4>📋 Endpoints Disponibles</h4>
  
  | Módulo | Método | Ruta | Acceso |
  |--------|--------|------|--------|
  | 🔐 Auth | POST | `/api/auth/login` | Público |
  | 🔄 Auth | POST | `/api/auth/refresh` | Usuarios autenticados |
  | 👥 Usuarios | GET | `/api/users` | ADMIN, MODERATOR, SUPPORT |
  | 👤 Usuarios | POST | `/api/users` | ADMIN |
  | 👤 Usuarios | GET | `/api/users/:id` | Usuario propietario o roles superiores |
  | ✏️ Usuarios | PATCH | `/api/users/:id` | Usuario propietario o ADMIN |
  | 🗑️ Usuarios | DELETE | `/api/users/:id` | ADMIN |
</div>

## 🧪 Ejecutando las Pruebas

```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas con cobertura
npm run test:cov
```

## 🛡️ Autenticación y Roles

### Roles disponibles

| Rol       | Descripción                                          |
|-----------|------------------------------------------------------|
| ADMIN     | Acceso completo a todos los recursos                 |
| MODERATOR | Lectura y actualización de usuarios                  |
| SUPPORT   | Solo lectura de usuarios                            |
| USER      | Acceso limitado a su propia información              |


## 🔑 Usuario por defecto

```
Email: admin@admin.com
Contraseña: admin123
Rol: ADMIN
```

## 📚 Guía de Uso de la API

### 1. Autenticación

#### Iniciar sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

Respuesta exitosa (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Refrescar token
```http
POST /api/auth/refresh
Authorization: Bearer <refresh_token>
```

### 2. Gestión de Usuarios

#### Crear usuario (ADMIN)
```http
POST /api/users
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "email": "nuevo@usuario.com",
  "password": "contraseñaSegura123",
  "profile": {
    "firstName": "Nombre",
    "lastName": "Apellido",
    "role": "USER",
    "phone": "+541112345678",
    "address": "Dirección del usuario"
  }
}
```

#### Obtener todos los usuarios (ADMIN/MODERATOR/SUPPORT)
```http
GET /api/users
Authorization: Bearer <access_token>
```

#### Obtener usuario por ID
```http
GET /api/users/1
Authorization: Bearer <access_token>
```

#### Actualizar usuario
```http
PATCH /api/users/1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "email": "nuevo-email@ejemplo.com",
  "profile": {
    "firstName": "Nuevo Nombre"
  }
}
```

#### Eliminar usuario (ADMIN)
```http
DELETE /api/users/1
Authorization: Bearer <access_token>
```

## 🐳 Despliegue con Docker

<div align="center">
  <h3>🚀 Despliegue en un solo paso</h3>
  
  ```bash
  # 1. Construir la imagen
  docker build -t usuarios-api .
  
  # 2. Ejecutar el contenedor
  docker run -p 3000:3000 --env-file .env usuarios-api
  ```
  
  <h4>⚙️ Variables de Entorno Requeridas</h4>
  
  | Variable | Valor por defecto | Descripción |
  |----------|-----------------|-------------|
  | `PORT` | 3000 | Puerto de la aplicación |
  | `JWT_SECRET` | - | Clave secreta para JWT (requerido) |
  | `JWT_EXPIRATION` | 1h | Expiración del token JWT |
  | `REFRESH_SECRET` | - | Clave para refresh tokens (requerido) |
  | `REFRESH_EXPIRATION` | 7d | Expiración del refresh token |
  
  <h4>🛠 Ejemplos de Comandos</h4>
  
  ```bash
  # Ejecutar en segundo plano
  docker run -d --name usuarios-api -p 3000:3000 --env-file .env usuarios-api
  
  # Ver logs en tiempo real
  docker logs -f usuarios-api
  
  # Detener el contenedor
  docker stop usuarios-api
  
  # Iniciar el contenedor nuevamente
  docker start usuarios-api
  ```

