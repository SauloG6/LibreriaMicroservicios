# ⚡ INICIO RÁPIDO - 5 MINUTOS

## 🎯 **Para alguien que NUNCA ha visto este proyecto**

### **¿Qué es esto?**
- Sistema completo de librería con microservicios
- Frontend con Next.js + Backend con NestJS  
- Autenticación JWT + Base de datos PostgreSQL
- Todo se ejecuta con Docker (no necesitas instalar nada más)

---

## 🚀 **CONFIGURACIÓN EN 4 PASOS**

### **PASO 1: Requisitos (2 minutos)**
**Instala SOLO estos 2 programas:**

1. **Git**: [Descargar aquí](https://git-scm.com/downloads)
2. **Docker Desktop**: [Descargar aquí](https://www.docker.com/products/docker-desktop/)

**Verificar instalación:**
```bash
git --version
docker --version
```

### **PASO 2: Descargar Proyecto (1 minuto)**
```bash
git clone https://github.com/SauloG6/LibreriaMicroservicios.git
cd LibreriaMicroservicios
```

### **PASO 3: Configurar (1 minuto)**
```bash
# En Windows PowerShell:
.\setup.ps1

# En Mac/Linux:
chmod +x setup.sh && ./setup.sh
```

### **PASO 4: Ejecutar (1 minuto)**
```bash
docker-compose up -d
```

---

## 🌐 **LISTO! Ahora ve a estas URLs:**

- **📱 Aplicación**: http://localhost:3000
- **🔐 API Auth**: http://localhost:3001/api  
- **📚 API Libros**: http://localhost:3002/api

---

## 👤 **Usuarios de Prueba**

**Administrador:**
- Email: `admin@libreria.com`
- Password: `admin123`

**Usuario Normal:**
- Email: `user@libreria.com`  
- Password: `user123`

---

## ✅ **¿Funciona Todo?**

Ejecuta esto para verificar:
```bash
docker-compose ps
```

**Deberías ver todos los servicios con STATUS "running"**

---

## 🆘 **Si Algo No Funciona**

### **Problema Común 1: "Docker no responde"**
```bash
# Reiniciar Docker Desktop y ejecutar:
docker-compose down && docker-compose up -d
```

### **Problema Común 2: "Puerto ocupado"**
```bash
# Ver qué usa el puerto 3000:
netstat -tulpn | grep :3000
# Cerrar esa aplicación y reintentar
```

### **Problema Común 3: "Servicios no cargan"**
```bash
# Ver logs para identificar error:
docker-compose logs -f
```

---

## 🛠️ **Comandos Útiles**

```bash
# Iniciar todo
docker-compose up -d

# Ver estado
docker-compose ps  

# Ver logs
docker-compose logs -f

# Detener todo
docker-compose down

# Limpiar todo y empezar de nuevo
docker-compose down -v && docker-compose up -d
```

---

## 📁 **¿Qué Hace Cada Servicio?**

- **Frontend** (3000): Interfaz web - login, catálogo, admin
- **Auth Service** (3001): Login, registro, JWT, usuarios
- **Product Service** (3002): CRUD de libros, categorías
- **PostgreSQL**: Base de datos (automática)

---

## 🎯 **Primera Vez Usando el Sistema:**

1. Ve a http://localhost:3000
2. Haz clic en "Iniciar Sesión"
3. Usa `admin@libreria.com` / `admin123`
4. ¡Explora la interfaz de administrador!

**O**

1. Usa `user@libreria.com` / `user123`  
2. ¡Explora la interfaz de usuario!

---

## 📖 **¿Quieres Saber Más?**

- **Documentación completa**: Ver `SETUP_COMPLETE_GUIDE.md`
- **README principal**: Ver `README.md`
- **APIs**: Cada servicio tiene Swagger en `/api`

---

## 🏆 **¡Felicidades!**

**En solo 5 minutos tienes:**
- ✅ Sistema completo ejecutándose
- ✅ Frontend con autenticación
- ✅ Backend con APIs REST  
- ✅ Base de datos funcionando
- ✅ Usuarios de prueba listos

**¡Ahora puedes explorar y desarrollar!** 🚀
