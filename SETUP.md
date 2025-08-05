# 🚀 Instrucciones de Configuración Post-Clonación

Este archivo contiene las instrucciones para configurar el proyecto después de clonarlo desde GitHub.

## 📋 Prerrequisitos

- **Docker Desktop** instalado y funcionando
- **Node.js 18+** (opcional, para desarrollo local)
- **Git** instalado

## ⚙️ Configuración Inicial

### 1. Clonar el repositorio
```bash
git clone <your-repo-url>
cd LibreriaMicroservicios
```

### 2. Configurar variables de entorno

#### 2.1 Configuración global
```bash
# Copiar archivo de configuración global
cp config/global.env.example config/global.env
```

#### 2.2 Configuración de desarrollo
```bash
# Copiar archivo de configuración de desarrollo  
cp config/development.env.example config/development.env
```

#### 2.3 Configurar Auth Service
```bash
# Copiar archivo de configuración del servicio de autenticación
cp microservices/auth-service/.env.example microservices/auth-service/.env
```

### 3. Personalizar las configuraciones

#### 3.1 Editar `config/development.env`
- Cambiar las contraseñas de base de datos
- Configurar JWT_SECRET (64 caracteres)
- Configurar REFRESH_TOKEN_SECRET (64 caracteres)
- Configurar credenciales de email si es necesario

#### 3.2 Editar `microservices/auth-service/.env`
- Configurar la URL de la base de datos
- Configurar JWT_SECRET (mismo que en development.env)

### 4. Generar secretos seguros

#### Para JWT_SECRET y REFRESH_TOKEN_SECRET, usa:
```bash
# En Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# O en PowerShell
[System.Web.Security.Membership]::GeneratePassword(64, 10)
```

## 🐳 Ejecutar con Docker

### Opción 1: Script automatizado (Recomendado)
```bash
# Windows
.\setup.ps1

# Linux/Mac
./setup.sh
```

### Opción 2: Docker Compose directo
```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 🌐 Acceder a los Servicios

Una vez que los servicios estén ejecutándose:

- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Auth API Docs**: http://localhost:3001/api
- **Product Service**: http://localhost:3002  
- **Invoice Service**: http://localhost:3003
- **Chat Service**: http://localhost:3004
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3005 (admin/admin)

## 👤 Usuario Administrador

Después de que los servicios estén funcionando, necesitarás crear un usuario administrador:

1. **Registrar un usuario normal:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@libreria.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "Principal"
  }'
```

2. **Cambiar el role a ADMINISTRADOR en la base de datos:**
```bash
# Conectar a la base de datos
docker exec -it <auth-db-container-name> psql -U auth_user -d auth_db

# Cambiar el role del usuario
UPDATE users SET role = 'ADMINISTRADOR'::users_role_enum WHERE email = 'admin@libreria.com';
```

## 🔧 Desarrollo Local (Sin Docker)

Si prefieres ejecutar los servicios localmente:

### 1. Instalar dependencias
```bash
# Usar el script
.\setup.ps1  # Opción 7: Instalar dependencias localmente

# O manualmente
cd microservices/auth-service && npm install
cd ../../frontend && npm install
```

### 2. Ejecutar servicios individualmente
```bash
# Auth Service
cd microservices/auth-service
npm run start:dev

# Frontend
cd frontend  
npm run dev
```

## 🔍 Troubleshooting

### Problemas comunes:

1. **Puerto ya en uso:**
   - Verificar que no hay otros servicios ejecutándose en los puertos 3000-3005
   - Usar `docker-compose down` para detener servicios previos

2. **Permisos de Docker:**
   - Asegurarse de que Docker Desktop esté ejecutándose
   - En Linux, agregar usuario al grupo docker: `sudo usermod -aG docker $USER`

3. **Variables de entorno:**
   - Verificar que todos los archivos .env están configurados
   - Verificar que los secretos JWT tienen 64 caracteres

4. **Conectividad de base de datos:**
   - Esperar unos segundos después de `docker-compose up` para que las DB inicialicen
   - Verificar logs: `docker-compose logs auth-db`

## 📚 Recursos Adicionales

- [Documentación API](./docs/auth-service-api.md)
- [Guía de Testing](./docs/testing-guide.md)
- [README Principal](./README.md)

## 🆘 Soporte

Si encuentras problemas:
1. Revisar los logs: `docker-compose logs -f`
2. Verificar el estado: `docker-compose ps`
3. Reiniciar servicios: `docker-compose restart`
4. Limpiar y reiniciar: `docker-compose down -v && docker-compose up -d`
