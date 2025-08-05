#!/bin/bash

# Script para configurar y ejecutar la aplicación de librería

set -e

echo "🚀 Configurando Librería Microservicios..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Crear archivos .env si no existen
print_message "Creando archivos de configuración..."

# Auth Service
if [ ! -f "microservices/auth-service/.env" ]; then
    cp microservices/auth-service/.env.example microservices/auth-service/.env
    print_message "Archivo .env creado para Auth Service"
fi

# Product Service  
if [ ! -f "microservices/product-service/.env" ]; then
    echo "DATABASE_URL=postgresql://product_user:product_password@localhost:5434/product_db
NODE_ENV=development
PORT=3002
CORS_ORIGINS=http://localhost:3000,http://localhost:3002
AUTH_SERVICE_URL=http://localhost:3001" > microservices/product-service/.env
    print_message "Archivo .env creado para Product Service"
fi

# Invoice Service
if [ ! -f "microservices/invoice-service/.env" ]; then
    echo "DATABASE_URL=postgresql://invoice_user:invoice_password@localhost:5435/invoice_db
NODE_ENV=development
PORT=3003
CORS_ORIGINS=http://localhost:3000,http://localhost:3003
AUTH_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002" > microservices/invoice-service/.env
    print_message "Archivo .env creado para Invoice Service"
fi

# Chat Service
if [ ! -f "microservices/chat-service/.env" ]; then
    echo "DATABASE_URL=postgresql://chat_user:chat_password@localhost:5436/chat_db
NODE_ENV=development
PORT=3004
CORS_ORIGINS=http://localhost:3000,http://localhost:3004
AUTH_SERVICE_URL=http://localhost:3001" > microservices/chat-service/.env
    print_message "Archivo .env creado para Chat Service"
fi

# Frontend
if [ ! -f "frontend/.env.local" ]; then
    echo "NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_INVOICE_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_CHAT_SERVICE_URL=http://localhost:3004" > frontend/.env.local
    print_message "Archivo .env.local creado para Frontend"
fi

# Función para mostrar menú
show_menu() {
    echo -e "\n${BLUE}¿Qué deseas hacer?${NC}"
    echo "1) Iniciar todos los servicios"
    echo "2) Iniciar solo Auth Service (desarrollo)"
    echo "3) Iniciar servicios de monitoreo"
    echo "4) Ver logs de servicios"
    echo "5) Detener todos los servicios"
    echo "6) Limpiar contenedores y volúmenes"
    echo "7) Ejecutar tests"
    echo "8) Mostrar estado de servicios"
    echo "9) Salir"
}

# Función para iniciar todos los servicios
start_all_services() {
    print_message "Iniciando todos los servicios..."
    docker-compose up -d
    print_message "Esperando que los servicios estén listos..."
    sleep 10
    show_services_info
}

# Función para iniciar solo Auth Service
start_auth_service() {
    print_message "Iniciando Auth Service para desarrollo..."
    docker-compose up -d auth-service auth-db
    print_message "Esperando que Auth Service esté listo..."
    sleep 5
    print_message "Auth Service disponible en: http://localhost:3001"
    print_message "Swagger API docs: http://localhost:3001/api"
}

# Función para iniciar monitoreo
start_monitoring() {
    print_message "Iniciando servicios de monitoreo..."
    docker-compose up -d prometheus grafana
    print_message "Servicios de monitoreo iniciados:"
    print_message "- Prometheus: http://localhost:9090"
    print_message "- Grafana: http://localhost:3005 (admin/admin)"
}

# Función para ver logs
view_logs() {
    echo -e "\n${BLUE}Selecciona el servicio para ver logs:${NC}"
    echo "1) Auth Service"
    echo "2) Frontend"
    echo "3) Todos los servicios"
    echo "4) Prometheus"
    echo "5) Grafana"
    read -p "Opción: " log_option
    
    case $log_option in
        1) docker-compose logs -f auth-service ;;
        2) docker-compose logs -f frontend ;;
        3) docker-compose logs -f ;;
        4) docker-compose logs -f prometheus ;;
        5) docker-compose logs -f grafana ;;
        *) print_error "Opción inválida" ;;
    esac
}

# Función para detener servicios
stop_services() {
    print_message "Deteniendo todos los servicios..."
    docker-compose down
    print_message "Servicios detenidos"
}

# Función para limpiar
cleanup() {
    print_warning "Esto eliminará todos los contenedores, volúmenes y datos. ¿Continuar? (y/N)"
    read -p "Respuesta: " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        print_message "Limpiando contenedores y volúmenes..."
        docker-compose down -v
        docker system prune -f
        print_message "Limpieza completada"
    fi
}

# Función para ejecutar tests
run_tests() {
    print_message "Ejecutando tests del Auth Service..."
    cd microservices/auth-service
    if [ ! -d "node_modules" ]; then
        print_message "Instalando dependencias..."
        npm install
    fi
    npm test
    cd ../..
}

# Función para mostrar estado
show_services_info() {
    print_message "Estado de los servicios:"
    echo -e "\n${GREEN}Servicios principales:${NC}"
    echo "- Frontend: http://localhost:3000"
    echo "- Auth Service: http://localhost:3001 (API docs: /api)"
    echo "- Product Service: http://localhost:3002 (API docs: /api)"
    echo "- Invoice Service: http://localhost:3003 (API docs: /api)"
    echo "- Chat Service: http://localhost:3004 (API docs: /api)"
    
    echo -e "\n${GREEN}Monitoreo:${NC}"
    echo "- Prometheus: http://localhost:9090"
    echo "- Grafana: http://localhost:3005 (admin/admin)"
    
    echo -e "\n${GREEN}Bases de datos PostgreSQL:${NC}"
    echo "- Auth DB: localhost:5433"
    echo "- Product DB: localhost:5434"
    echo "- Invoice DB: localhost:5435"
    echo "- Chat DB: localhost:5436"
    
    echo -e "\n${BLUE}Estado de contenedores:${NC}"
    docker-compose ps
}

# Menú principal
while true; do
    show_menu
    read -p "Selecciona una opción (1-9): " choice
    
    case $choice in
        1) start_all_services ;;
        2) start_auth_service ;;
        3) start_monitoring ;;
        4) view_logs ;;
        5) stop_services ;;
        6) cleanup ;;
        7) run_tests ;;
        8) show_services_info ;;
        9) 
            print_message "¡Hasta luego!"
            exit 0
            ;;
        *)
            print_error "Opción inválida. Por favor selecciona 1-9."
            ;;
    esac
    
    echo -e "\nPresiona Enter para continuar..."
    read
done
