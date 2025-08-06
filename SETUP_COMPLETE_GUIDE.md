# 🚀 Guía Completa de Configuración - Librería Microservicios

## 📋 Para Desarrolladores que No Conocen el Proyecto

Esta guía te permitirá configurar y ejecutar el proyecto completo desde cero en **cualquier computadora**.

---

## 🛠️ **Requisitos del Sistema (OBLIGATORIO)**

### **Antes de comenzar, DEBES tener instalado:**

1. **Git** - Para clonar el repositorio
   - Windows: [Descargar Git](https://git-scm.com/download/win)
   - Mac: `brew install git` o [Descargar Git](https://git-scm.com/download/mac)
   - Linux: `sudo apt install git` (Ubuntu) o `sudo yum install git` (CentOS)

2. **Docker Desktop** - Para ejecutar los servicios
   - [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - **IMPORTANTE**: Después de instalar, asegúrate de que Docker esté ejecutándose

3. **Node.js 18+** - Para desarrollo local
   - [Descargar Node.js](https://nodejs.org/en/download/)
   - Verificar: `node --version` (debe ser v18 o superior)

---

## 📁 **Estructura del Proyecto**

```
LibreriaMicroservicios/
├── frontend/                    # Aplicación Next.js (Puerto 3000)
├── microservices/
│   ├── auth-service/           # Servicio de autenticación (Puerto 3001)
│   └── product-service/        # Servicio de productos (Puerto 3002)
├── docker-compose.yml          # Configuración de todos los servicios
├── .env files                  # Variables de configuración (NO se suben a Git)
└── README.md                   # Documentación principal
```

---

## 🚀 **OPCIÓN 1: Configuración Automática (RECOMENDADA)**

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/SauloG6/LibreriaMicroservicios.git
cd LibreriaMicroservicios
```

### **2. Ejecutar Setup Automático**

**En Windows (PowerShell como Administrador):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

**En Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### **3. Iniciar Todos los Servicios**
```bash
docker-compose up -d
```

### **4. Verificar que Todo Funcione**
```bash
docker-compose ps
```

**Deberías ver algo así:**
```
NAME                    COMMAND                  SERVICE             STATUS              PORTS
auth-db                 "docker-entrypoint.s…"   auth-db             running             5433:5432/tcp
auth-service            "docker-entrypoint.s…"   auth-service        running             3001:3001/tcp
product-db              "docker-entrypoint.s…"   product-db          running             5434:5432/tcp
product-service         "docker-entrypoint.s…"   product-service     running             3002:3002/tcp
frontend                "docker-entrypoint.s…"   frontend            running             3000:3000/tcp
```

---

## 🛠️ **OPCIÓN 2: Configuración Manual (Paso a Paso)**

### **Paso 1: Clonar y Navegar**
```bash
git clone https://github.com/SauloG6/LibreriaMicroservicios.git
cd LibreriaMicroservicios
```

### **Paso 2: Crear Archivos de Configuración**

#### **2.1 Frontend (.env.local)**
```bash
# Crear archivo de configuración del frontend
echo "NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_INVOICE_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_CHAT_SERVICE_URL=http://localhost:3004" > frontend/.env.local
```

#### **2.2 Auth Service (.env)**
```bash
# Crear archivo de configuración del servicio de autenticación
echo "# Variables de entorno para Auth Service
DATABASE_URL=postgresql://auth_user:auth_password@localhost:5433/auth_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production-with-at-least-32-characters
JWT_EXPIRES_IN=24h
NODE_ENV=development
PORT=3001
CORS_ORIGINS=http://localhost:3000,http://localhost:3001" > microservices/auth-service/.env
```

#### **2.3 Product Service (.env)**
```bash
# Crear archivo de configuración del servicio de productos
echo "# Variables de entorno para Product Service
DATABASE_URL=postgresql://product_user:product_password@localhost:5434/product_db
NODE_ENV=development
PORT=3002
CORS_ORIGINS=http://localhost:3000,http://localhost:3002
AUTH_SERVICE_URL=http://localhost:3001
JWT_SECRET=your_jwt_secret_key_64_characters_long_change_in_production
JWT_EXPIRES_IN=7d" > microservices/product-service/.env
```

### **Paso 3: Instalar Dependencias (Solo para Desarrollo Local)**
```bash
# Frontend
cd frontend
npm install
cd ..

# Auth Service
cd microservices/auth-service
npm install
cd ../..

# Product Service
cd microservices/product-service
npm install
cd ../..
```

### **Paso 4: Iniciar Servicios con Docker**
```bash
# Verificar que Docker esté ejecutándose
docker --version

# Iniciar todos los servicios
docker-compose up -d

# Ver logs en tiempo real (opcional)
docker-compose logs -f
```

---

## 🌐 **URLs de Acceso (Una vez que esté ejecutándose)**

### **Aplicación Principal**
- **Frontend**: http://localhost:3000 (Página principal)

### **APIs y Documentación**
- **Auth Service**: http://localhost:3001
  - **Swagger Docs**: http://localhost:3001/api
- **Product Service**: http://localhost:3002
  - **Swagger Docs**: http://localhost:3002/api

### **Bases de Datos** (si necesitas acceso directo)
- **Auth DB**: localhost:5433 (usuario: `auth_user`, contraseña: `auth_password`)
- **Product DB**: localhost:5434 (usuario: `product_user`, contraseña: `product_password`)

---

## 👤 **Usuarios de Prueba**

### **Administrador**
```json
{
  "email": "admin@libreria.com",
  "password": "admin123"
}
```

### **Usuario Regular**
```json
{
  "email": "user@libreria.com", 
  "password": "user123"
}
```

---

## ✅ **Verificar que Todo Funciona**

### **1. Verificar Estado de Servicios**
```bash
docker-compose ps
```
**Todos los servicios deben mostrar STATUS: "running"**

### **2. Probar Frontend**
1. Ve a http://localhost:3000
2. Haz clic en "Iniciar Sesión"
3. Usa las credenciales de admin o usuario de prueba

### **3. Probar API (Opcional)**
```bash
# Test de salud del Auth Service
curl http://localhost:3001/health

# Test de login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@libreria.com","password":"admin123"}'
```

---

## 🚨 **Solución de Problemas Comunes**

### **Problem: "Docker no está ejecutándose"**
**Solución:**
1. Abrir Docker Desktop
2. Esperar a que aparezca "Docker is running"
3. Reintentar el comando

### **Problem: "Puerto ya en uso"**
**Solución:**
```bash
# Ver qué está usando el puerto
netstat -tulpn | grep :3000

# Detener todo y reiniciar
docker-compose down
docker-compose up -d
```

### **Problem: "Servicios no responden"**
**Solución:**
```bash
# Ver logs para identificar errores
docker-compose logs auth-service
docker-compose logs frontend

# Reiniciar servicio específico
docker-compose restart auth-service
```

### **Problem: "No se puede conectar a la base de datos"**
**Solución:**
```bash
# Verificar que las DB estén ejecutándose
docker-compose ps | grep db

# Reiniciar bases de datos
docker-compose restart auth-db product-db
```

---

## 🔄 **Comandos Útiles para el Día a Día**

### **Iniciar/Detener Servicios**
```bash
# Iniciar todos
docker-compose up -d

# Detener todos
docker-compose down

# Reiniciar un servicio específico
docker-compose restart auth-service
```

### **Ver Logs**
```bash
# Logs de todos los servicios
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f auth-service
```

### **Desarrollo Local (Sin Docker)**
```bash
# Terminal 1: Auth Service
cd microservices/auth-service
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Product Service
cd microservices/product-service
npm run start:dev
```

---

## 📝 **Notas Importantes**

### **Archivos que NO se suben a Git:**
- `*.env` - Variables de entorno con credenciales
- `node_modules/` - Dependencias instaladas
- `.next/` - Build del frontend
- Archivos de base de datos

### **Primera vez ejecutando el proyecto:**
1. Los servicios pueden tardar 2-3 minutos en inicializar completamente
2. El frontend se conecta automáticamente a los servicios backend
3. Las bases de datos se crean automáticamente con datos de prueba

### **Características del Sistema:**
- ✅ **Autenticación JWT** con roles (admin/usuario)
- ✅ **Gestión de libros** CRUD completo
- ✅ **Interfaz separada** para admin y usuarios
- ✅ **Base de datos PostgreSQL** independiente por servicio
- ✅ **Documentación Swagger** automática
- ✅ **Headers dinámicos** según el tipo de usuario

---

## 🆘 **¿Necesitas Ayuda?**

### **Si algo no funciona:**
1. **Verifica requisitos**: Git, Docker, Node.js instalados
2. **Revisa logs**: `docker-compose logs -f`
3. **Reinicia servicios**: `docker-compose down && docker-compose up -d`
4. **Verifica puertos**: Asegúrate de que 3000, 3001, 3002 estén libres

### **Comandos de Emergencia:**
```bash
# Limpiar todo y empezar de nuevo
docker-compose down -v
docker system prune -f
docker-compose up -d
```

---

## 🎯 **¡Listo para Desarrollar!**

Una vez que veas todos los servicios ejecutándose:
1. **Frontend**: http://localhost:3000 - Tu aplicación principal
2. **Auth API**: http://localhost:3001/api - Documentación de autenticación  
3. **Product API**: http://localhost:3002/api - Documentación de productos

**¡El sistema está completamente funcional y listo para usar!** 🚀
