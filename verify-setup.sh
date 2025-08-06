#!/bin/bash

# Script de verificación para el proyecto Librería Microservicios
# Este script verifica que todos los componentes estén funcionando correctamente

echo "🔍 Verificando configuración del proyecto..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar Docker
echo -e "\n${BLUE}🐳 Verificando Docker...${NC}"
if command -v docker &> /dev/null; then
    print_success "Docker está instalado"
    if docker info &> /dev/null; then
        print_success "Docker está ejecutándose"
    else
        print_error "Docker no está ejecutándose. Inicia Docker Desktop."
        exit 1
    fi
else
    print_error "Docker no está instalado"
    exit 1
fi

# Verificar Docker Compose
if command -v docker-compose &> /dev/null; then
    print_success "Docker Compose está disponible"
else
    print_error "Docker Compose no está disponible"
    exit 1
fi

# Verificar archivos de configuración
echo -e "\n${BLUE}📁 Verificando archivos de configuración...${NC}"

config_files=(
    "frontend/.env.local"
    "microservices/auth-service/.env"
    "microservices/product-service/.env"
    "docker-compose.yml"
)

for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "Archivo $file existe"
    else
        print_warning "Archivo $file no encontrado"
    fi
done

# Verificar estado de servicios
echo -e "\n${BLUE}🚀 Verificando servicios Docker...${NC}"
if docker-compose ps | grep -q "Up"; then
    print_success "Algunos servicios están ejecutándose"
    
    # Verificar servicios específicos
    services=("auth-service" "auth-db" "product-service" "product-db" "frontend")
    
    for service in "${services[@]}"; do
        if docker-compose ps | grep -q "$service.*Up"; then
            print_success "Servicio $service está ejecutándose"
        else
            print_warning "Servicio $service no está ejecutándose"
        fi
    done
else
    print_warning "No hay servicios ejecutándose. Ejecuta: docker-compose up -d"
fi

# Verificar conectividad de servicios
echo -e "\n${BLUE}🌐 Verificando conectividad...${NC}"

services_urls=(
    "http://localhost:3000|Frontend"
    "http://localhost:3001/health|Auth Service"
    "http://localhost:3002/health|Product Service"
)

for service_url in "${services_urls[@]}"; do
    url=$(echo $service_url | cut -d'|' -f1)
    name=$(echo $service_url | cut -d'|' -f2)
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        print_success "$name responde en $url"
    else
        print_warning "$name no responde en $url"
    fi
done

# Verificar APIs con Swagger
echo -e "\n${BLUE}📚 Verificando documentación de APIs...${NC}"

swagger_urls=(
    "http://localhost:3001/api|Auth API Docs"
    "http://localhost:3002/api|Product API Docs"
)

for swagger_url in "${swagger_urls[@]}"; do
    url=$(echo $swagger_url | cut -d'|' -f1)
    name=$(echo $swagger_url | cut -d'|' -f2)
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        print_success "$name disponible en $url"
    else
        print_warning "$name no disponible en $url"
    fi
done

# Verificar base de datos
echo -e "\n${BLUE}🗄️  Verificando bases de datos...${NC}"

db_services=("auth-db" "product-db")

for db in "${db_services[@]}"; do
    if docker-compose exec -T "$db" pg_isready > /dev/null 2>&1; then
        print_success "Base de datos $db está lista"
    else
        print_warning "Base de datos $db no está lista"
    fi
done

# Prueba de autenticación
echo -e "\n${BLUE}🔐 Probando autenticación...${NC}"

# Test de login con usuario admin
login_response=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@libreria.com","password":"admin123"}' 2>/dev/null)

if [[ $login_response == *"access_token"* ]]; then
    print_success "Login de administrador funciona"
    
    # Extraer token para pruebas adicionales
    token=$(echo $login_response | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    
    # Probar endpoint protegido
    profile_response=$(curl -s -H "Authorization: Bearer $token" http://localhost:3001/auth/profile 2>/dev/null)
    
    if [[ $profile_response == *"email"* ]]; then
        print_success "Endpoints protegidos funcionan"
    else
        print_warning "Endpoints protegidos no responden correctamente"
    fi
else
    print_warning "Login no funciona correctamente"
fi

# Resumen final
echo -e "\n${BLUE}📊 RESUMEN DE VERIFICACIÓN${NC}"
echo "================================"

if docker-compose ps | grep -q "Up"; then
    print_info "Estado: Sistema en ejecución"
    print_info "Frontend: http://localhost:3000"
    print_info "Auth API: http://localhost:3001/api"
    print_info "Product API: http://localhost:3002/api"
    print_info ""
    print_info "Usuarios de prueba:"
    print_info "Admin: admin@libreria.com / admin123"
    print_info "Usuario: user@libreria.com / user123"
else
    print_info "Para iniciar el sistema ejecuta: docker-compose up -d"
fi

print_info ""
print_info "Para ver logs: docker-compose logs -f"
print_info "Para detener: docker-compose down"

echo -e "\n${GREEN}🎉 Verificación completada${NC}"
