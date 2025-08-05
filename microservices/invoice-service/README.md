# Invoice Service

Servicio de facturación (estructura base preparada para implementación).

## Estado actual

🏗️ **En desarrollo** - Estructura base creada, listo para implementar funcionalidades.

## Funcionalidades planificadas

- [ ] Generación de facturas
- [ ] Gestión de pagos
- [ ] Historial de transacciones
- [ ] Reportes financieros
- [ ] Integración con Auth Service
- [ ] Integración con Product Service

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
docker-compose up invoice-service invoice-db
```

### Desarrollo local
```bash
npm run start:dev
```

## Documentación API

Una vez ejecutándose:
```
http://localhost:3003/api
```

## Próximos pasos para implementación

1. Crear entidad Invoice
2. Crear entidad InvoiceItem
3. Implementar DTOs
4. Crear InvoicesService
5. Implementar InvoicesController
6. Agregar autenticación JWT
7. Implementar tests
