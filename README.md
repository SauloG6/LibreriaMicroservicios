# Librería Microservicios

Sistema completo de microservicios para gestión de librería desarrollado con NestJS, Next.js, PostgreSQL y Docker. Incluye autenticación JWT, monitoreo con Prometheus/Grafana y CI/CD con GitHub Actions.

## 🏗️ Arquitectura

El sistema está diseñado con una arquitectura de microservicios que incluye:

- **Auth Service** (Puerto 3001): Autenticación y autorización con JWT, gestión de usuarios y roles
- **Product Service** (Puerto 3002): Gestión de libros, catálogo e inventario
- **Invoice Service** (Puerto 3003): Facturación, órdenes y pagos
- **Chat Service** (Puerto 3004): Sistema de chat en tiempo real y notificaciones
- **Frontend** (Puerto 3000): Interfaz de usuario responsiva con Next.js

### Características Principales
- ✅ **Auth Service completamente funcional** con registro, login, JWT, roles y guards
- ✅ **Frontend Next.js** con páginas de autenticación, layout responsivo y hooks personalizados
- ✅ **Base de datos PostgreSQL** independiente por servicio
- ✅ **Documentación Swagger** para todas las APIs
- ✅ **Monitoreo y métricas** con Prometheus y Grafana
- ✅ **CI/CD Pipeline** completo con GitHub Actions
- ✅ **Docker y Docker Compose** para desarrollo y producción
- ✅ **Testing** unitario e integración configurado
- ✅ **Scripts de automatización** para setup y gestión

## 🚀 Tecnologías

### Backend
- **NestJS 10**: Framework empresarial de Node.js con decoradores y DI
- **TypeScript**: Desarrollo completamente tipado
- **PostgreSQL**: Base de datos relacional (una independiente por servicio)
- **JWT + Passport**: Autenticación y autorización segura
- **TypeORM**: ORM robusto con migraciones y relaciones
- **Swagger/OpenAPI**: Documentación automática e interactiva
- **Class Validator**: Validación de DTOs
- **BCrypt**: Hashing seguro de contraseñas
- **Helmet**: Seguridad HTTP

### Frontend
- **Next.js 14**: Framework React con App Router y SSR/SSG
- **React 18**: Última versión con Concurrent Features
- **TypeScript**: Desarrollo type-safe
- **Tailwind CSS**: Framework CSS utility-first responsivo
- **React Hook Form**: Gestión performante de formularios
- **React Hot Toast**: Sistema de notificaciones elegante
- **Context API**: Estado global de autenticación
- **Axios**: Cliente HTTP con interceptors

### DevOps e Infraestructura
- **Docker**: Contenedorización multi-stage para desarrollo y producción
- **Docker Compose**: Orquestación completa de servicios
- **Prometheus**: Monitoreo y métricas en tiempo real
- **Grafana**: Dashboards y visualización de datos
- **GitHub Actions**: CI/CD con testing, build, security y deploy
- **PostgreSQL**: Múltiples instancias con persistencia
- **Nginx**: Reverse proxy y load balancing (futuro)

### Testing y Calidad
- **Jest**: Testing framework con cobertura
- **Supertest**: Testing de APIs REST
- **React Testing Library**: Testing de componentes
- **ESLint + Prettier**: Linting y formateo automático
- **Husky**: Git hooks para calidad de código
- **Artillery**: Performance testing
- **OWASP**: Security testing

## 📁 Estructura del Proyecto

```
LibreriaMicroservicios/
├── frontend/                    # 🎨 Aplicación Next.js
│   ├── src/
│   │   ├── components/         # Componentes React reutilizables
│   │   │   ├── layout/        # Header, Footer, Layout
│   │   │   └── ui/            # LoadingSpinner, Button, etc.
│   │   ├── pages/             # Páginas de Next.js
│   │   │   ├── auth/          # Login, registro, reset password
│   │   │   └── _app.tsx       # App wrapper con Context
│   │   ├── services/          # API clients y servicios
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utilidades y helpers
│   │   ├── types/             # Tipos TypeScript
│   │   └── styles/            # Estilos globales CSS
│   ├── public/                # Assets estáticos
│   └── Dockerfile             # Contenedor para producción
│
├── microservices/              # 🔧 Servicios de backend
│   ├── auth-service/          # 🔐 Servicio de autenticación
│   │   ├── src/
│   │   │   ├── auth/          # Módulo de autenticación
│   │   │   │   ├── dto/       # Data Transfer Objects
│   │   │   │   ├── guards/    # Guards de autorización
│   │   │   │   ├── strategies/# Passport strategies
│   │   │   │   └── decorators/# Decoradores personalizados
│   │   │   ├── users/         # Módulo de usuarios
│   │   │   │   ├── entities/  # User entity
│   │   │   │   ├── dto/       # User DTOs
│   │   │   │   └── enums/     # User roles enum
│   │   │   └── config/        # Configuración DB
│   │   ├── test/              # Tests de integración
│   │   └── Dockerfile         # Contenedor del servicio
│   │
│   ├── product-service/       # 📚 Servicio de productos
│   ├── invoice-service/       # 🧾 Servicio de facturación
│   └── chat-service/          # 💬 Servicio de chat
│
├── monitoring/                 # 📊 Configuración de monitoreo
│   ├── prometheus.yml         # Configuración de Prometheus
│   └── grafana/              # Dashboards de Grafana
│
├── config/                    # ⚙️ Configuración global
│   ├── global.env            # Variables globales
│   └── development.env       # Configuración de desarrollo
│
├── docs/                      # 📖 Documentación
│   ├── auth-service-api.md   # Documentación de Auth API
│   └── testing-guide.md      # Guía de testing
│
├── .github/workflows/         # 🚀 CI/CD Pipeline
│   └── ci-cd.yml             # GitHub Actions workflow
│
├── setup.ps1                  # 🪟 Script PowerShell setup
├── setup.sh                   # 🐧 Script Bash setup
├── Makefile                   # 🛠️ Comandos de automatización
└── docker-compose.yml        # 🐳 Orquestación completa
```

## 🚀 Inicio Rápido

### Opción 1: Usando Scripts de Automatización (Recomendado)

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Con Makefile:**
```bash
make setup    # Configuración inicial
make up       # Iniciar todos los servicios
make status   # Ver estado de servicios
make logs     # Ver logs en tiempo real
```

### Opción 2: Manual con Docker

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd LibreriaMicroservicios

# 2. Configurar variables de entorno
cp microservices/auth-service/.env.example microservices/auth-service/.env

# 3. Iniciar todos los servicios
docker-compose up -d

# 4. Verificar que todo esté funcionando
docker-compose ps
```

### Opción 3: Desarrollo Local (Auth Service)

```bash
# Iniciar solo Auth Service para desarrollo
docker-compose up -d auth-service auth-db

# Verificar en el navegador
# - API: http://localhost:3001
# - Swagger: http://localhost:3001/api
```

## 🌐 URLs de Acceso

### Servicios Principales
- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:3001 ([API Docs](http://localhost:3001/api))
- **Product Service**: http://localhost:3002 ([API Docs](http://localhost:3002/api))
- **Invoice Service**: http://localhost:3003 ([API Docs](http://localhost:3003/api))
- **Chat Service**: http://localhost:3004 ([API Docs](http://localhost:3004/api))

### Monitoreo y Métricas
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3005 (admin/admin)

### Bases de Datos PostgreSQL
- **Auth DB**: localhost:5433 (auth_user/auth_password)
- **Product DB**: localhost:5434 (product_user/product_password)
- **Invoice DB**: localhost:5435 (invoice_user/invoice_password)
- **Chat DB**: localhost:5436 (chat_user/chat_password)

## 🔐 Autenticación

### Usuarios de Prueba
```javascript
// Administrador
{
  "email": "admin@libreria.com",
  "password": "admin123"
}

// Usuario regular
{
  "email": "user@libreria.com", 
  "password": "user123"
}
```

### Flujo de Autenticación
1. **Registro**: `POST /auth/register` - Crear nueva cuenta
2. **Login**: `POST /auth/login` - Obtener JWT tokens
3. **Perfil**: `GET /auth/profile` - Datos del usuario (requiere token)
4. **Refresh**: `POST /auth/refresh` - Renovar access token
5. **Logout**: `POST /auth/logout` - Invalidar tokens

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests del Auth Service
cd microservices/auth-service
npm test

# Tests con cobertura
npm run test:cov

# Tests de integración
npm run test:e2e

# Tests del Frontend
cd frontend
npm test
```

### Testing Manual con curl
```bash
# Registro
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📊 Monitoreo

### Métricas Disponibles
- **Prometheus**: Métricas de sistema y aplicación
- **Grafana**: Dashboards visuales con alertas
- **Health Checks**: Endpoints `/health` en cada servicio
- **Logs**: Centralizados con niveles configurables

### Dashboards Pre-configurados
- Sistema general (CPU, memoria, red)
- Métricas de aplicación (requests, errores, latencia)
- Base de datos (conexiones, queries, performance)
- Alertas automáticas por email/Slack

## 🚀 Despliegue

### Desarrollo Local
```bash
# Todos los servicios
docker-compose up -d

# Solo servicios esenciales
docker-compose up -d auth-service auth-db frontend
```

### Producción
```bash
# Con variables de producción
docker-compose -f docker-compose.prod.yml up -d

# Con orquestador (Kubernetes)
kubectl apply -f k8s/
```

### CI/CD Pipeline
El pipeline de GitHub Actions incluye:
- ✅ **Linting y formateo** automático
- ✅ **Tests unitarios e integración**
- ✅ **Build de contenedores Docker**
- ✅ **Security scanning** (npm audit, OWASP)
- ✅ **Performance testing** con Artillery  
- ✅ **Deploy automático** en merge a main
- ✅ **Rollback automático** en caso de fallos

## 🛠️ Comandos Útiles

### Docker
```bash
# Ver logs de un servicio específico
docker-compose logs -f auth-service

# Reiniciar un servicio
docker-compose restart auth-service

# Ejecutar comando en contenedor
docker-compose exec auth-service npm test

# Limpiar todo
docker-compose down -v && docker system prune -f
```

### Base de Datos
```bash
# Conectar a base de datos
docker-compose exec auth-db psql -U auth_user -d auth_db

# Ejecutar migraciones
docker-compose exec auth-service npm run migration:run

# Crear nueva migración
docker-compose exec auth-service npm run migration:generate -- --name=NewMigration
```

### Desarrollo
```bash
# Instalar dependencias de todos los servicios
make install

# Formatear código
make format

# Ejecutar linting
make lint

# Pipeline completo CI
make ci
```

## 📚 Documentación

### APIs
- [**Auth Service API**](docs/auth-service-api.md) - Endpoints de autenticación
- [**Testing Guide**](docs/testing-guide.md) - Guía completa de testing
- **Swagger UI**: Disponible en `/api` de cada servicio

### Arquitectura
- **Database per Service**: Cada microservicio tiene su propia DB
- **JWT Authentication**: Tokens seguros con refresh
- **Role-Based Access**: Control granular de permisos
- **Event-Driven**: Comunicación asíncrona entre servicios (futuro)

## 🔧 Configuración

### Variables de Entorno Importantes
```env
# JWT
JWT_SECRET=your_super_secret_jwt_key_64_characters_long
JWT_EXPIRES_IN=7d

# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5433/database

# Email (para reset password)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_password

# Monitoreo
PROMETHEUS_PORT=9090
GRAFANA_PORT=3005
```

### Puertos Utilizados
- **3000**: Frontend Next.js
- **3001**: Auth Service
- **3002**: Product Service  
- **3003**: Invoice Service
- **3004**: Chat Service
- **5433-5436**: PostgreSQL databases
- **9090**: Prometheus
- **3005**: Grafana

## 🔮 Próximas Características

### Fase 2 - Servicios Adicionales
- [ ] **Product Service**: CRUD completo de libros, categorías, stock
- [ ] **Invoice Service**: Órdenes, pagos, facturación
- [ ] **Chat Service**: WebSocket, notificaciones push

### Fase 3 - Características Avanzadas
- [ ] **Message Queue**: RabbitMQ/Redis para eventos
- [ ] **API Gateway**: Kong/Nginx para proxy y rate limiting
- [ ] **Service Mesh**: Istio para comunicación entre servicios
- [ ] **Caching**: Redis para performance
- [ ] **CDN**: Para assets estáticos
- [ ] **Backup automático**: Scheduled backups
- [ ] **Logging centralizado**: ELK Stack
- [ ] **Tracing distribuido**: Jaeger

### Fase 4 - Cloud Native
- [ ] **Kubernetes**: Orquestación en producción
- [ ] **Helm Charts**: Gestión de despliegues
- [ ] **Terraform**: Infrastructure as Code
- [ ] **Multi-cloud**: AWS/GCP/Azure compatibility

## 🤝 Contribución

### Flujo de Desarrollo
1. Fork del repositorio
2. Crear feature branch: `git checkout -b feature/nueva-caracteristica`
3. Commit cambios: `git commit -m 'Add nueva caracteristica'`
4. Push al branch: `git push origin feature/nueva-caracteristica`
5. Crear Pull Request

### Standards de Código
- **TypeScript**: Tipado estricto requerido
- **ESLint + Prettier**: Formatting automático
- **Conventional Commits**: Para mensajes de commit
- **Tests**: Cobertura mínima 80%
- **Documentation**: README actualizado

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## ✨ Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuGitHub](https://github.com/tuusuario)

## 🙏 Agradecimientos

- NestJS team por el excelente framework
- Next.js team por React Server Components
- Docker por la contenedorización
- Prometheus/Grafana por el monitoreo
- Community por feedback y contribuciones


