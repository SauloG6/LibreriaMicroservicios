# 📚 Product Service - Gestión de Libros

Microservicio para la gestión completa del catálogo de libros y categorías de la librería.

## 🚀 Características

### 📖 Gestión de Libros
- ✅ CRUD completo de libros
- ✅ Búsqueda y filtrado avanzado
- ✅ Gestión de stock e inventario
- ✅ Sistema de ratings y reviews
- ✅ Libros destacados y recomendados
- ✅ Búsqueda por ISBN
- ✅ Filtros por precio, autor, editorial, idioma

### 🏷️ Gestión de Categorías
- ✅ CRUD de categorías
- ✅ Slugs SEO-friendly
- ✅ Estado activo/inactivo
- ✅ Ordenación personalizada
- ✅ Libros por categoría

### 🔐 Seguridad
- ✅ Autenticación JWT
- ✅ Autorización por roles
- ✅ Validación de datos con class-validator
- ✅ Guards para proteger endpoints administrativos

## 🛠️ Tecnologías

- **NestJS** - Framework backend
- **TypeORM** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Swagger** - Documentación API
- **class-validator** - Validación de datos

## ⚙️ Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
# El archivo .env ya está configurado, pero verifica estos valores:
DATABASE_URL=postgresql://product_user:product_password@localhost:5434/product_db
JWT_SECRET=your_jwt_secret_key_64_characters_long_change_in_production
PORT=3002
```

### 3. Insertar datos de ejemplo (opcional)
```bash
# Conectar a la base de datos y ejecutar init-data.sql
psql -h localhost -p 5434 -U product_user -d product_db -f init-data.sql
```

## 🚀 Ejecución

### Con Docker (recomendado)
```bash
# Desde el directorio raíz del proyecto
docker-compose up product-service product-db
```

### Desarrollo local
```bash
npm run start:dev
```

## 📖 Documentación API

Una vez ejecutándose, accede a:
- **Swagger UI**: http://localhost:3002/api

## 🔗 Endpoints Principales

### Libros (`/api/books`)
- `GET /api/books` - Lista paginada con filtros
- `GET /api/books/search?q=query` - Búsqueda de libros
- `GET /api/books/featured` - Libros destacados
- `GET /api/books/:id` - Obtener libro por ID
- `POST /api/books` - Crear libro (Admin)
- `PATCH /api/books/:id` - Actualizar libro (Admin)
- `DELETE /api/books/:id` - Eliminar libro (Admin)

### Categorías (`/api/categories`)
- `GET /api/categories` - Todas las categorías
- `GET /api/categories/active` - Categorías activas
- `GET /api/categories/:id` - Obtener por ID
- `POST /api/categories` - Crear categoría (Admin)
- `PATCH /api/categories/:id` - Actualizar categoría (Admin)
- `DELETE /api/categories/:id` - Eliminar categoría (Admin)

## 🔍 Filtros de Búsqueda

Parámetros disponibles para `/api/books`:
- `search` - Búsqueda por título, autor o descripción
- `categoryId` - Filtrar por categoría
- `minPrice` / `maxPrice` - Rango de precios
- `author` - Filtrar por autor
- `publisher` - Filtrar por editorial
- `language` - Filtrar por idioma
- `minRating` - Rating mínimo
- `inStock` - Solo libros con stock
- `page` - Página (default: 1)
- `limit` - Elementos por página (default: 10)
- `sortBy` - Ordenar por (title, author, price, rating)
- `sortOrder` - Orden (ASC, DESC)

## 🔐 Autenticación

Para endpoints protegidos, incluir en headers:
```
Authorization: Bearer <jwt_token>
```

## 📁 Estructura Implementada

```
src/
├── auth/                 # Módulo de autenticación
│   ├── decorators/      # Decoradores de roles
│   ├── guards/          # Guards JWT y roles
│   └── strategies/      # Estrategia JWT
├── books/               # Módulo principal
│   ├── controllers/     # REST Controllers
│   ├── dto/            # DTOs de validación
│   ├── entities/       # Entidades TypeORM
│   └── services/       # Lógica de negocio
├── app.module.ts       # Módulo principal
└── main.ts            # Punto de entrada
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```
