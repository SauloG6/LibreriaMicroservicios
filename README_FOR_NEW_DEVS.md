# 👋 README para Nuevos Desarrolladores

## 🎯 **¿Eres nuevo en este proyecto?**

¡Perfecto! Esta guía te llevará desde cero hasta tener el sistema funcionando en **menos de 10 minutos**.

---

## 📋 **¿Qué voy a obtener?**

Al finalizar esta guía tendrás:
- ✅ **Sistema de librería completo** ejecutándose localmente
- ✅ **Frontend React/Next.js** con autenticación
- ✅ **Backend NestJS** con microservicios
- ✅ **Base de datos PostgreSQL** con datos de prueba
- ✅ **Documentación Swagger** de todas las APIs
- ✅ **Usuarios de prueba** listos para usar

---

## 🚀 **OPCIÓN 1: Inicio Ultra Rápido (5 minutos)**

### **Solo necesitas:**
1. **Git** + **Docker Desktop** instalados
2. Ejecutar 3 comandos

```bash
# 1. Descargar proyecto
git clone https://github.com/SauloG6/LibreriaMicroservicios.git
cd LibreriaMicroservicios

# 2. Configurar automáticamente
# Windows: .\setup.ps1
# Mac/Linux: chmod +x setup.sh && ./setup.sh

# 3. Iniciar todo
docker-compose up -d
```

**¡Listo!** Ve a http://localhost:3000

---

## 🛠️ **OPCIÓN 2: Desarrollo Local (Si quieres modificar código)**

### **Requisitos adicionales:**
- Node.js 18+
- npm o yarn

### **Configuración:**
```bash
# 1. Clonar
git clone https://github.com/SauloG6/LibreriaMicroservicios.git
cd LibreriaMicroservicios

# 2. Instalar dependencias
npm install # En cada carpeta de servicio

# 3. Configurar variables de entorno
# (Los scripts de setup lo hacen automáticamente)

# 4. Opción A: Todo con Docker
docker-compose up -d

# 4. Opción B: Desarrollo local
# Terminal 1: 
cd microservices/auth-service && npm run start:dev
# Terminal 2:
cd microservices/product-service && npm run start:dev  
# Terminal 3:
cd frontend && npm run dev
```

---

## 📂 **Estructura del Proyecto (Lo esencial)**

```
LibreriaMicroservicios/
├── frontend/                   # 🎨 Next.js App (Puerto 3000)
│   ├── src/pages/             # Páginas: login, dashboard, catalog
│   ├── src/components/        # Headers, Layout, UI components  
│   ├── src/services/          # Llamadas a APIs
│   └── src/hooks/             # Custom hooks (useAuth)
│
├── microservices/
│   ├── auth-service/          # 🔐 Autenticación (Puerto 3001)
│   │   ├── src/auth/         # Login, register, JWT
│   │   ├── src/users/        # User CRUD, roles
│   │   └── src/database/     # TypeORM, migrations
│   │
│   └── product-service/       # 📚 Gestión de libros (Puerto 3002)
│       ├── src/books/        # CRUD de libros
│       └── src/auth/         # Guards, JWT validation
│
├── docker-compose.yml         # 🐳 Orquestación de servicios
├── QUICK_START.md            # ⚡ Guía de 5 minutos
└── SETUP_COMPLETE_GUIDE.md   # 📖 Guía completa
```

---

## 🌐 **URLs Importantes**

### **Aplicación:**
- **Frontend**: http://localhost:3000
- **Swagger Auth**: http://localhost:3001/api  
- **Swagger Products**: http://localhost:3002/api

### **Usuarios de Prueba:**
```javascript
// Administrador (ve gestión de libros)
{
  email: "admin@libreria.com",
  password: "admin123"
}

// Usuario regular (ve catálogo público)  
{
  email: "user@libreria.com",
  password: "user123"
}
```

---

## 🧪 **¿Cómo Probar que Todo Funciona?**

### **Opción 1: Interfaz Web**
1. Ve a http://localhost:3000
2. Haz clic en "Iniciar Sesión"  
3. Usa `admin@libreria.com` / `admin123`
4. ¡Deberías ver el panel de administrador!

### **Opción 2: Script de Verificación**  
```bash
# Windows:
.\verify-setup.ps1

# Mac/Linux:
chmod +x verify-setup.sh && ./verify-setup.sh
```

### **Opción 3: Manual con curl**
```bash
# Probar login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@libreria.com","password":"admin123"}'

# Deberías recibir un token JWT
```

---

## 💡 **Características del Sistema**

### **Frontend (Next.js)**
- ✅ **Headers dinámicos** según tipo de usuario (public/user/admin)
- ✅ **Rutas protegidas** con middleware
- ✅ **Context de autenticación** con hooks personalizados
- ✅ **Interfaz responsive** con Tailwind CSS
- ✅ **Gestión de estado** con React Context

### **Backend (NestJS)**
- ✅ **Microservicios independientes** con bases de datos separadas
- ✅ **Autenticación JWT** con refresh tokens
- ✅ **Role-based access control** (admin/user)
- ✅ **Validación de DTOs** con class-validator
- ✅ **Documentación Swagger** automática
- ✅ **Guards y decoradores** personalizados

### **Base de Datos**
- ✅ **PostgreSQL** con TypeORM
- ✅ **Migraciones automáticas**
- ✅ **Seeding de datos** de prueba
- ✅ **Relaciones y validaciones**

---

## 🛠️ **Comandos que Usarás Frecuentemente**

```bash
# Ver estado de servicios
docker-compose ps

# Ver logs en tiempo real  
docker-compose logs -f

# Reiniciar un servicio específico
docker-compose restart auth-service

# Detener todo
docker-compose down

# Iniciar solo algunos servicios
docker-compose up -d auth-service auth-db frontend

# Limpiar todo y empezar de nuevo
docker-compose down -v && docker-compose up -d

# Ejecutar comandos dentro de un contenedor
docker-compose exec auth-service npm run migration:run
```

---

## 🔧 **Desarrollo Típico**

### **Agregar una nueva página:**
1. Crear archivo en `frontend/src/pages/`
2. Importar componentes necesarios
3. Usar `useAuth()` hook si necesitas autenticación

### **Agregar un nuevo endpoint:**
1. Crear DTO en `dto/`
2. Agregar método en service  
3. Agregar endpoint en controller
4. Documentar con decoradores Swagger

### **Modificar la base de datos:**
1. Editar entity en `entities/`
2. Generar migración: `npm run migration:generate`
3. Ejecutar migración: `npm run migration:run`

---

## 🆘 **¿Problemas? Aquí están las soluciones**

### **"Docker no funciona"**
1. Asegúrate de que Docker Desktop esté ejecutándose
2. Reinicia Docker Desktop
3. Ejecuta: `docker-compose down && docker-compose up -d`

### **"Puerto ya en uso"**
```bash
# Ver qué está usando el puerto 3000
netstat -tulpn | grep :3000
# Cerrar esa aplicación
```

### **"Servicios no cargan"**
```bash
# Ver logs para identificar el problema
docker-compose logs -f auth-service
```

### **"Frontend no se conecta al backend"**
1. Verifica que `frontend/.env.local` tenga las URLs correctas
2. Asegúrate de que los servicios backend estén ejecutándose

---

## 📚 **¿Quieres Aprender Más?**

### **Documentación:**
- **`QUICK_START.md`** - Inicio en 5 minutos
- **`SETUP_COMPLETE_GUIDE.md`** - Guía completa y detallada  
- **`README.md`** - Documentación técnica completa

### **APIs:**
- **Auth Service Docs**: http://localhost:3001/api
- **Product Service Docs**: http://localhost:3002/api

### **Tecnologías usadas:**
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, JWT, TypeORM
- **Base de datos**: PostgreSQL  
- **DevOps**: Docker, Docker Compose

---

## 🎯 **Tu Primera Tarea**

1. **Ejecuta el sistema** siguiendo la OPCIÓN 1
2. **Verifica que funcione** con el usuario admin  
3. **Explora el código** en `frontend/src/pages/` y `microservices/auth-service/src/`
4. **Haz un pequeño cambio** (como cambiar el título en la página de inicio)
5. **¡Celebra!** Ya estás listo para desarrollar 🎉

---

## ✉️ **¿Dudas?**

Este proyecto está diseñado para ser **fácil de configurar y entender**. Si tienes problemas:

1. **Lee los logs**: `docker-compose logs -f`
2. **Usa el script de verificación**: `./verify-setup.sh`  
3. **Revisa la documentación completa** en los archivos markdown
4. **¡No te rindas!** La configuración inicial puede tomar algunos intentos

**¡Bienvenido al equipo de desarrollo!** 🚀
