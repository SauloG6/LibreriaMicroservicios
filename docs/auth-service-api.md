# API Documentation - Auth Service

## Descripción
El Auth Service es el servicio de autenticación y autorización del sistema de microservicios. Maneja el registro, login, gestión de usuarios y control de acceso basado en roles.

## Base URL
- **Desarrollo**: `http://localhost:3001`
- **Swagger UI**: `http://localhost:3001/api`

## Autenticación
El servicio utiliza JWT (JSON Web Tokens) para la autenticación. Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Registro de Usuario
**POST** `/auth/register`

Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "USER" // Opcional, por defecto USER
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "email": "usuario@ejemplo.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "USER",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Response (400):**
```json
{
  "statusCode": 400,
  "message": ["email must be a valid email"],
  "error": "Bad Request"
}
```

### 2. Login
**POST** `/auth/login`

Autentica un usuario y devuelve tokens JWT.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "USER"
  }
}
```

**Response (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 3. Perfil de Usuario
**GET** `/auth/profile`

Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "usuario@ejemplo.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "USER",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### 4. Actualizar Perfil
**PATCH** `/auth/profile`

Actualiza el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "Juan Carlos",
  "lastName": "Pérez García"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "usuario@ejemplo.com",
  "firstName": "Juan Carlos",
  "lastName": "Pérez García",
  "role": "USER",
  "updatedAt": "2024-01-15T11:30:00Z"
}
```

### 5. Refresh Token
**POST** `/auth/refresh`

Renueva el access token usando el refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 6. Logout
**POST** `/auth/logout`

Cierra la sesión del usuario (invalida tokens).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

### 7. Forgot Password
**POST** `/auth/forgot-password`

Solicita el reset de contraseña (envía email).

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

### 8. Reset Password
**POST** `/auth/reset-password`

Resetea la contraseña usando el token recibido por email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

### 9. Listar Usuarios (Admin)
**GET** `/users`

Lista todos los usuarios (solo administradores).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)
- `role` (opcional): Filtrar por rol

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "usuario@ejemplo.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### 10. Obtener Usuario por ID (Admin)
**GET** `/users/:id`

Obtiene un usuario específico por ID (solo administradores).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "usuario@ejemplo.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "USER",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### 11. Actualizar Usuario (Admin)
**PATCH** `/users/:id`

Actualiza un usuario (solo administradores).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "role": "ADMIN",
  "firstName": "Juan Carlos"
}
```

### 12. Eliminar Usuario (Admin)
**DELETE** `/users/:id`

Elimina un usuario (solo administradores).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

## Health Check

### Health
**GET** `/health`

Verifica el estado del servicio.

**Response (200):**
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    }
  }
}
```

## Roles de Usuario

### USER
- Puede ver y actualizar su propio perfil
- Puede cambiar su contraseña
- Acceso a funcionalidades básicas

### ADMIN
- Todos los permisos de USER
- Puede gestionar todos los usuarios
- Puede ver métricas y logs
- Acceso a funcionalidades administrativas

### SUPER_ADMIN
- Todos los permisos de ADMIN
- Puede gestionar otros administradores
- Acceso completo al sistema

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos de entrada inválidos |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - Sin permisos para acceder al recurso |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Recurso ya existe (ej: email duplicado) |
| 422 | Unprocessable Entity - Error de validación |
| 500 | Internal Server Error - Error interno del servidor |

## Ejemplos de Uso

### Flujo de Registro y Login
```javascript
// 1. Registro
const registerResponse = await fetch('http://localhost:3001/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@ejemplo.com',
    password: 'password123',
    firstName: 'Juan',
    lastName: 'Pérez'
  })
});

// 2. Login
const loginResponse = await fetch('http://localhost:3001/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@ejemplo.com',
    password: 'password123'
  })
});

const { access_token, user } = await loginResponse.json();

// 3. Usar token para acceder a recursos protegidos
const profileResponse = await fetch('http://localhost:3001/auth/profile', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
```

### Testing con curl
```bash
# Registro
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Perfil (reemplazar TOKEN con el token obtenido)
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## Configuración de Desarrollo

### Variables de Entorno Requeridas
```env
# Base de datos
DATABASE_URL=postgresql://auth_user:auth_password@localhost:5433/auth_db

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=30d

# Email (para reset password)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_password
EMAIL_FROM=noreply@libreria.com

# Configuración general
NODE_ENV=development
PORT=3001
CORS_ORIGINS=http://localhost:3000
```

### Comandos Útiles
```bash
# Iniciar en modo desarrollo
npm run start:dev

# Ejecutar tests
npm test

# Tests con cobertura
npm run test:cov

# Linting
npm run lint

# Formatear código
npm run format

# Build para producción
npm run build

# Ejecutar migraciones
npm run migration:run

# Generar migración
npm run migration:generate -- --name=MigrationName
```
