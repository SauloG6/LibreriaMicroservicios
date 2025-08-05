# Auth Service

Servicio de autenticación desarrollado con NestJS, JWT, PostgreSQL y BCrypt.

## Características

- ✅ Registro de usuarios con validación
- ✅ Login con JWT
- ✅ Reset de contraseña
- ✅ Roles de usuario (ADMINISTRADOR, CLIENTE)
- ✅ Guards para protección de rutas
- ✅ Validación de datos con class-validator
- ✅ Hash de contraseñas con BCrypt
- ✅ Documentación Swagger
- ✅ Base de datos PostgreSQL con TypeORM

## Instalación y configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
DATABASE_URL=postgresql://auth_user:auth_password@localhost:5433/auth_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=development
PORT=3001
```

### 3. Ejecutar con Docker (recomendado)
```bash
# Desde el directorio raíz del proyecto
docker-compose up auth-service auth-db
```

### 4. Ejecutar en desarrollo local
```bash
# Asegúrate de que PostgreSQL esté corriendo
npm run start:dev
```

## Endpoints principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/forgot-password` - Solicitar reset de contraseña
- `POST /api/auth/reset-password` - Resetear contraseña

### Perfil
- `GET /api/auth/profile` - Obtener perfil (requiere JWT)
- `GET /api/auth/user-info` - Información del usuario (requiere JWT)

### Administrador
- `GET /api/auth/admin-only` - Endpoint solo para administradores

## Documentación API

Una vez ejecutando el servicio, visita:
```
http://localhost:3001/api
```

## Roles y permisos

### ADMINISTRADOR
- Acceso total a todas las funcionalidades
- Puede acceder a endpoints protegidos con `@Roles(UserRole.ADMIN)`

### CLIENTE
- Acceso limitado según las reglas de negocio
- Rol por defecto para nuevos usuarios

## Estructura del proyecto

```
src/
├── auth/                   # Módulo de autenticación
│   ├── decorators/        # Decoradores personalizados
│   ├── dto/               # Data Transfer Objects
│   ├── guards/            # Guards para protección
│   ├── strategies/        # Estrategias de Passport
│   ├── auth.controller.ts # Controlador de auth
│   ├── auth.module.ts     # Módulo de auth
│   └── auth.service.ts    # Servicio de auth
├── users/                 # Módulo de usuarios
│   ├── dto/               # DTOs de usuarios
│   ├── entities/          # Entidades de TypeORM
│   ├── enums/             # Enumeraciones
│   ├── users.module.ts    # Módulo de usuarios
│   └── users.service.ts   # Servicio de usuarios
├── config/                # Configuraciones
│   └── database.config.ts # Configuración de DB
├── app.module.ts          # Módulo principal
└── main.ts                # Punto de entrada
```

## Scripts disponibles

```bash
# Desarrollo
npm run start:dev       # Modo desarrollo con hot reload
npm run start:debug     # Modo debug

# Producción
npm run build           # Construir para producción
npm run start:prod      # Ejecutar en producción

# Testing
npm run test            # Tests unitarios
npm run test:e2e        # Tests end-to-end
npm run test:cov        # Coverage de tests

# Utilidades
npm run lint            # Linter ESLint
npm run format          # Formatear código con Prettier
```

## Testing

### Ejemplo de registro
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ejemplo.com",
    "firstName": "Admin",
    "lastName": "User",
    "password": "password123"
  }'
```

### Ejemplo de login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ejemplo.com",
    "password": "password123"
  }'
```

### Acceso a perfil (con JWT)
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Clave secreta para JWT | `your-secret-key` |
| `JWT_EXPIRES_IN` | Tiempo de expiración JWT | `24h` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servicio | `3001` |
| `CORS_ORIGINS` | Orígenes permitidos para CORS | `http://localhost:3000` |

## Notas importantes

1. **Seguridad**: Cambia `JWT_SECRET` en producción por una clave segura
2. **Base de datos**: El servicio usa su propia base de datos PostgreSQL independiente
3. **CORS**: Configurado para permitir requests desde el frontend (puerto 3000)
4. **Validaciones**: Todas las entradas son validadas con class-validator
5. **Hash**: Las contraseñas se hashean automáticamente con BCrypt (saltRounds: 12)

## Próximos pasos

- [ ] Implementar OAuth 2.0 / OpenID Connect
- [ ] Agregar rate limiting más avanzado
- [ ] Implementar refresh tokens
- [ ] Agregar logging estructurado
- [ ] Implementar notificaciones por email
