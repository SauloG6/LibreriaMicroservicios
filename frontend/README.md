# Frontend - Librería

Aplicación frontend desarrollada con Next.js y React para la plataforma de librería.

## Características

- ✅ Interfaz moderna con Next.js y React
- ✅ Estilos con Tailwind CSS
- ✅ Autenticación JWT integrada
- ✅ Manejo de estado con Context API
- ✅ Formularios con react-hook-form
- ✅ Notificaciones con react-hot-toast
- ✅ Diseño responsive y accesible
- ✅ TypeScript para type safety

## Instalación y configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Editar el archivo `.env.local`:
```env
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_INVOICE_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_CHAT_SERVICE_URL=http://localhost:3004
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

### 4. Ejecutar con Docker
```bash
# Desde el directorio raíz del proyecto
docker-compose up frontend
```

## Estructura del proyecto

```
src/
├── components/         # Componentes reutilizables
│   ├── layout/        # Componentes de layout (Header, Footer, Layout)
│   └── ui/            # Componentes de UI (LoadingSpinner, etc.)
├── hooks/             # Custom hooks (useAuth)
├── pages/             # Páginas de Next.js
│   ├── auth/          # Páginas de autenticación
│   ├── _app.tsx       # App principal
│   └── index.tsx      # Página de inicio
├── services/          # Servicios API
├── styles/            # Estilos globales
├── types/             # Tipos TypeScript
└── utils/             # Utilidades
```

## Páginas implementadas

### Autenticación
- `/auth/login` - Inicio de sesión
- `/auth/register` - Registro de usuarios
- `/auth/forgot-password` - Recuperación de contraseña

### Principales
- `/` - Página de inicio
- `/dashboard` - Dashboard del usuario (próximo)
- `/admin/dashboard` - Panel de administración (próximo)

## Componentes principales

### Layout
- **Header**: Navegación principal con menú dinámico según rol
- **Footer**: Información de la empresa y links útiles
- **Layout**: Wrapper principal que incluye Header y Footer

### Autenticación
- **useAuth Hook**: Manejo de estado de autenticación
- **AuthProvider**: Context provider para autenticación

### UI
- **LoadingSpinner**: Indicador de carga
- **Forms**: Formularios con validación

## Estilos

### Tailwind CSS
El proyecto usa Tailwind CSS con configuración personalizada:

- **Colores primarios**: azul (primary-600, etc.)
- **Tipografía**: Inter font
- **Componentes**: clases utility personalizadas

### Componentes de estilo
```css
.btn-primary      # Botón principal
.btn-secondary    # Botón secundario
.btn-outline      # Botón con borde
.input            # Input estándar
.card             # Tarjeta
.alert-*          # Alertas de diferentes tipos
```

## Autenticación

### Flujo de autenticación
1. Usuario ingresa credenciales
2. Frontend envía request al Auth Service
3. Recibe JWT token y datos del usuario
4. Guarda token en cookies seguras
5. Interceptor automático incluye token en requests

### Roles y permisos
- **ADMINISTRADOR**: Acceso completo
- **CLIENTE**: Acceso limitado según funcionalidades

### Rutas protegidas
- Redirección automática si no está autenticado
- Navegación dinámica según rol del usuario

## Scripts disponibles

```bash
npm run dev         # Servidor de desarrollo
npm run build       # Build para producción
npm run start       # Servidor de producción
npm run lint        # Linter ESLint
npm run type-check  # Verificación de tipos TypeScript
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_AUTH_SERVICE_URL` | URL del Auth Service | `http://localhost:3001` |
| `NEXT_PUBLIC_PRODUCT_SERVICE_URL` | URL del Product Service | `http://localhost:3002` |
| `NEXT_PUBLIC_INVOICE_SERVICE_URL` | URL del Invoice Service | `http://localhost:3003` |
| `NEXT_PUBLIC_CHAT_SERVICE_URL` | URL del Chat Service | `http://localhost:3004` |

## Funcionalidades implementadas

### ✅ Completadas
- [x] Sistema de autenticación completo
- [x] Registro e inicio de sesión
- [x] Recuperación de contraseña
- [x] Layout responsive
- [x] Navegación dinámica por roles
- [x] Manejo de errores y notificaciones

### 🚧 En desarrollo
- [ ] Dashboard del usuario
- [ ] Panel de administración
- [ ] Gestión de productos
- [ ] Sistema de facturación
- [ ] Chat en tiempo real

## Testing

Para probar la aplicación:

1. Inicia los servicios backend:
```bash
docker-compose up auth-service auth-db
```

2. Inicia el frontend:
```bash
npm run dev
```

3. Navega a `http://localhost:3000`

4. Prueba el registro de usuarios y login

## Próximos pasos

1. **Dashboard**: Implementar dashboard personalizado por rol
2. **Productos**: Integrar con Product Service
3. **Facturas**: Integrar con Invoice Service  
4. **Chat**: Implementar chat en tiempo real
5. **PWA**: Convertir a Progressive Web App
6. **Testing**: Agregar tests unitarios y e2e
