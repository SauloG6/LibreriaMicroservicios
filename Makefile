# Makefile para gestión del proyecto Librería Microservicios

# Variables
PROJECT_NAME := libreria-microservicios
DOCKER_COMPOSE := docker-compose
NODE_VERSION := 18
COVERAGE_THRESHOLD := 80

# Colores para output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
BLUE := \033[0;34m
NC := \033[0m # No Color

# Ayuda por defecto
.DEFAULT_GOAL := help

# Mostrar ayuda
help: ## Mostrar este mensaje de ayuda
	@echo "$(BLUE)Librería Microservicios - Comandos disponibles:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# Configuración inicial
setup: ## Configuración inicial del proyecto
	@echo "$(BLUE)🚀 Configurando proyecto...$(NC)"
	@cp microservices/auth-service/.env.example microservices/auth-service/.env 2>/dev/null || true
	@echo "$(GREEN)✅ Configuración completada$(NC)"

# Verificar requisitos
check-requirements: ## Verificar que Docker y Node.js estén instalados
	@echo "$(BLUE)🔍 Verificando requisitos...$(NC)"
	@command -v docker >/dev/null 2>&1 || { echo "$(RED)❌ Docker no está instalado$(NC)"; exit 1; }
	@command -v docker-compose >/dev/null 2>&1 || { echo "$(RED)❌ Docker Compose no está instalado$(NC)"; exit 1; }
	@command -v node >/dev/null 2>&1 || { echo "$(RED)❌ Node.js no está instalado$(NC)"; exit 1; }
	@echo "$(GREEN)✅ Todos los requisitos están instalados$(NC)"

# Instalación de dependencias
install: ## Instalar dependencias de todos los servicios
	@echo "$(BLUE)📦 Instalando dependencias...$(NC)"
	@cd microservices/auth-service && npm install
	@cd microservices/product-service && npm install
	@cd microservices/invoice-service && npm install
	@cd microservices/chat-service && npm install
	@cd frontend && npm install
	@echo "$(GREEN)✅ Dependencias instaladas$(NC)"

# Construcción de servicios
build: ## Construir todos los contenedores Docker
	@echo "$(BLUE)🏗️  Construyendo contenedores...$(NC)"
	@$(DOCKER_COMPOSE) build
	@echo "$(GREEN)✅ Construcción completada$(NC)"

# Inicio de servicios
up: ## Iniciar todos los servicios
	@echo "$(BLUE)🚀 Iniciando servicios...$(NC)"
	@$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Servicios iniciados$(NC)"
	@make status

# Inicio en modo desarrollo
dev: ## Iniciar servicios en modo desarrollo (solo Auth Service)
	@echo "$(BLUE)🛠️  Iniciando en modo desarrollo...$(NC)"
	@$(DOCKER_COMPOSE) up -d auth-service auth-db
	@echo "$(GREEN)✅ Auth Service iniciado en modo desarrollo$(NC)"
	@echo "$(YELLOW)📖 Swagger disponible en: http://localhost:3001/api$(NC)"

# Detener servicios
down: ## Detener todos los servicios
	@echo "$(BLUE)🛑 Deteniendo servicios...$(NC)"
	@$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✅ Servicios detenidos$(NC)"

# Reiniciar servicios
restart: ## Reiniciar todos los servicios
	@make down
	@make up

# Ver logs
logs: ## Ver logs de todos los servicios
	@$(DOCKER_COMPOSE) logs -f

# Ver logs del Auth Service
logs-auth: ## Ver logs del Auth Service
	@$(DOCKER_COMPOSE) logs -f auth-service

# Ver logs del Frontend
logs-frontend: ## Ver logs del Frontend
	@$(DOCKER_COMPOSE) logs -f frontend

# Estado de servicios
status: ## Mostrar estado de los servicios
	@echo "$(BLUE)📊 Estado de servicios:$(NC)"
	@$(DOCKER_COMPOSE) ps
	@echo ""
	@echo "$(GREEN)🌐 URLs disponibles:$(NC)"
	@echo "  - Frontend: http://localhost:3000"
	@echo "  - Auth Service: http://localhost:3001 (API: /api)"
	@echo "  - Product Service: http://localhost:3002 (API: /api)"
	@echo "  - Invoice Service: http://localhost:3003 (API: /api)"
	@echo "  - Chat Service: http://localhost:3004 (API: /api)"
	@echo "  - Prometheus: http://localhost:9090"
	@echo "  - Grafana: http://localhost:3005 (admin/admin)"

# Ejecutar tests
test: ## Ejecutar tests del Auth Service
	@echo "$(BLUE)🧪 Ejecutando tests...$(NC)"
	@cd microservices/auth-service && npm test
	@echo "$(GREEN)✅ Tests completados$(NC)"

# Ejecutar tests con cobertura
test-coverage: ## Ejecutar tests con reporte de cobertura
	@echo "$(BLUE)🧪 Ejecutando tests con cobertura...$(NC)"
	@cd microservices/auth-service && npm run test:cov
	@echo "$(GREEN)✅ Tests con cobertura completados$(NC)"

# Linting
lint: ## Ejecutar linting en todos los servicios
	@echo "$(BLUE)🔍 Ejecutando linting...$(NC)"
	@cd microservices/auth-service && npm run lint
	@cd microservices/product-service && npm run lint
	@cd microservices/invoice-service && npm run lint
	@cd microservices/chat-service && npm run lint
	@cd frontend && npm run lint
	@echo "$(GREEN)✅ Linting completado$(NC)"

# Formatear código
format: ## Formatear código de todos los servicios
	@echo "$(BLUE)💅 Formateando código...$(NC)"
	@cd microservices/auth-service && npm run format
	@cd microservices/product-service && npm run format
	@cd microservices/invoice-service && npm run format
	@cd microservices/chat-service && npm run format
	@cd frontend && npm run format || npm run prettier || true
	@echo "$(GREEN)✅ Código formateado$(NC)"

# Limpieza
clean: ## Limpiar contenedores, volúmenes e imágenes
	@echo "$(YELLOW)⚠️  Limpiando recursos Docker...$(NC)"
	@$(DOCKER_COMPOSE) down -v
	@docker system prune -f
	@echo "$(GREEN)✅ Limpieza completada$(NC)"

# Limpieza completa
clean-all: ## Limpieza completa incluyendo node_modules
	@echo "$(YELLOW)⚠️  Limpieza completa...$(NC)"
	@make clean
	@find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
	@echo "$(GREEN)✅ Limpieza completa terminada$(NC)"

# Migrar base de datos
migrate: ## Ejecutar migraciones de base de datos
	@echo "$(BLUE)🗃️  Ejecutando migraciones...$(NC)"
	@$(DOCKER_COMPOSE) exec auth-service npm run migration:run
	@echo "$(GREEN)✅ Migraciones completadas$(NC)"

# Generar migración
migration-generate: ## Generar nueva migración (usar: make migration-generate name=MigrationName)
	@echo "$(BLUE)📝 Generando migración: $(name)$(NC)"
	@cd microservices/auth-service && npm run migration:generate -- --name=$(name)
	@echo "$(GREEN)✅ Migración generada$(NC)"

# Revertir migración
migration-revert: ## Revertir última migración
	@echo "$(YELLOW)⏪ Revirtiendo migración...$(NC)"
	@$(DOCKER_COMPOSE) exec auth-service npm run migration:revert
	@echo "$(GREEN)✅ Migración revertida$(NC)"

# Seed de datos
seed: ## Ejecutar seeds de base de datos
	@echo "$(BLUE)🌱 Ejecutando seeds...$(NC)"
	@$(DOCKER_COMPOSE) exec auth-service npm run seed
	@echo "$(GREEN)✅ Seeds completados$(NC)"

# Backup de base de datos
backup: ## Crear backup de las bases de datos
	@echo "$(BLUE)💾 Creando backup...$(NC)"
	@mkdir -p backups
	@docker exec $$(docker-compose ps -q auth-db) pg_dump -U auth_user auth_db > backups/auth_db_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✅ Backup creado en directorio backups/$(NC)"

# Monitoreo
monitor: ## Iniciar servicios de monitoreo
	@echo "$(BLUE)📊 Iniciando monitoreo...$(NC)"
	@$(DOCKER_COMPOSE) up -d prometheus grafana
	@echo "$(GREEN)✅ Servicios de monitoreo iniciados$(NC)"
	@echo "  - Prometheus: http://localhost:9090"
	@echo "  - Grafana: http://localhost:3005 (admin/admin)"

# Salud de servicios
health: ## Verificar salud de todos los servicios
	@echo "$(BLUE)🏥 Verificando salud de servicios...$(NC)"
	@echo "Auth Service:"
	@curl -s http://localhost:3001/health || echo "$(RED)❌ Auth Service no responde$(NC)"
	@echo "Frontend:"
	@curl -s http://localhost:3000 >/dev/null && echo "$(GREEN)✅ Frontend OK$(NC)" || echo "$(RED)❌ Frontend no responde$(NC)"

# Desarrollo frontend
dev-frontend: ## Iniciar frontend en modo desarrollo
	@echo "$(BLUE)🎨 Iniciando frontend en modo desarrollo...$(NC)"
	@cd frontend && npm run dev

# Desarrollo auth service
dev-auth: ## Iniciar Auth Service en modo desarrollo
	@echo "$(BLUE)🔐 Iniciando Auth Service en modo desarrollo...$(NC)"
	@cd microservices/auth-service && npm run start:dev

# Documentación API
docs: ## Abrir documentación de APIs
	@echo "$(BLUE)📖 Abriendo documentación...$(NC)"
	@echo "  - Auth Service: http://localhost:3001/api"
	@open http://localhost:3001/api 2>/dev/null || xdg-open http://localhost:3001/api 2>/dev/null || echo "Abrir manualmente: http://localhost:3001/api"

# CI/CD local
ci: check-requirements lint test ## Ejecutar pipeline CI/CD local
	@echo "$(GREEN)✅ Pipeline CI/CD completado$(NC)"

# Actualizar dependencias
update: ## Actualizar dependencias de todos los servicios
	@echo "$(BLUE)📦 Actualizando dependencias...$(NC)"
	@cd microservices/auth-service && npm update
	@cd microservices/product-service && npm update
	@cd microservices/invoice-service && npm update
	@cd microservices/chat-service && npm update
	@cd frontend && npm update
	@echo "$(GREEN)✅ Dependencias actualizadas$(NC)"

# Auditoria de seguridad
audit: ## Ejecutar auditoria de seguridad
	@echo "$(BLUE)🔒 Ejecutando auditoria de seguridad...$(NC)"
	@cd microservices/auth-service && npm audit
	@cd microservices/product-service && npm audit
	@cd microservices/invoice-service && npm audit
	@cd microservices/chat-service && npm audit
	@cd frontend && npm audit
	@echo "$(GREEN)✅ Auditoria completada$(NC)"

.PHONY: help setup check-requirements install build up dev down restart logs logs-auth logs-frontend status test test-coverage lint format clean clean-all migrate migration-generate migration-revert seed backup monitor health dev-frontend dev-auth docs ci update audit
