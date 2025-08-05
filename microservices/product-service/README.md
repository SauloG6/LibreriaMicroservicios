# Product Service

Servicio de productos (estructura base preparada para implementación).

## Estado actual

🏗️ **En desarrollo** - Estructura base creada, listo para implementar funcionalidades.

## Funcionalidades planificadas

- [ ] CRUD de productos
- [ ] Categorización de productos
- [ ] Búsqueda y filtros
- [ ] Gestión de inventario
- [ ] Imágenes de productos
- [ ] Integración con Auth Service

## Instalación

```bash
npm install
```

## Configuración

```bash
cp .env.example .env
# Editar variables de entorno
```

## Ejecución

### Con Docker (recomendado)
```bash
# Desde el directorio raíz
docker-compose up product-service product-db
```

### Desarrollo local
```bash
npm run start:dev
```

## Documentación API

Una vez ejecutándose:
```
http://localhost:3002/api
```

## Próximos pasos para implementación

1. Crear entidad Product
2. Implementar DTOs
3. Crear ProductsService
4. Implementar ProductsController
5. Agregar autenticación JWT
6. Implementar tests
