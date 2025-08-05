# Script de configuración para Windows PowerShell

# Colores para output (compatibles con PowerShell)
$GREEN = [ConsoleColor]::Green
$YELLOW = [ConsoleColor]::Yellow
$RED = [ConsoleColor]::Red
$BLUE = [ConsoleColor]::Blue

function Write-ColorMessage {
    param(
        [string]$Message,
        [ConsoleColor]$Color = [ConsoleColor]::White
    )
    Write-Host $Message -ForegroundColor $Color
}

function Print-Message {
    param([string]$Message)
    Write-ColorMessage "[INFO] $Message" $GREEN
}

function Print-Warning {
    param([string]$Message)
    Write-ColorMessage "[WARNING] $Message" $YELLOW
}

function Print-Error {
    param([string]$Message)
    Write-ColorMessage "[ERROR] $Message" $RED
}

Write-ColorMessage "🚀 Configurando Librería Microservicios..." $BLUE

# Verificar si Docker está instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Print-Error "Docker no está instalado. Por favor instala Docker Desktop primero."
    exit 1
}

if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Print-Error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
}

# Función para crear archivos .env
function Create-EnvFiles {
    Print-Message "Creando archivos de configuración..."

    # Auth Service
    if (-not (Test-Path "microservices/auth-service/.env")) {
        Copy-Item "microservices/auth-service/.env.example" "microservices/auth-service/.env"
        Print-Message "Archivo .env creado para Auth Service"
    }

    # Product Service  
    if (-not (Test-Path "microservices/product-service/.env")) {
        @"
DATABASE_URL=postgresql://product_user:product_password@localhost:5434/product_db
NODE_ENV=development
PORT=3002
CORS_ORIGINS=http://localhost:3000,http://localhost:3002
AUTH_SERVICE_URL=http://localhost:3001
"@ | Out-File -FilePath "microservices/product-service/.env" -Encoding UTF8
        Print-Message "Archivo .env creado para Product Service"
    }

    # Invoice Service
    if (-not (Test-Path "microservices/invoice-service/.env")) {
        @"
DATABASE_URL=postgresql://invoice_user:invoice_password@localhost:5435/invoice_db
NODE_ENV=development
PORT=3003
CORS_ORIGINS=http://localhost:3000,http://localhost:3003
AUTH_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
"@ | Out-File -FilePath "microservices/invoice-service/.env" -Encoding UTF8
        Print-Message "Archivo .env creado para Invoice Service"
    }

    # Chat Service
    if (-not (Test-Path "microservices/chat-service/.env")) {
        @"
DATABASE_URL=postgresql://chat_user:chat_password@localhost:5436/chat_db
NODE_ENV=development
PORT=3004
CORS_ORIGINS=http://localhost:3000,http://localhost:3004
AUTH_SERVICE_URL=http://localhost:3001
"@ | Out-File -FilePath "microservices/chat-service/.env" -Encoding UTF8
        Print-Message "Archivo .env creado para Chat Service"
    }

    # Frontend
    if (-not (Test-Path "frontend/.env.local")) {
        @"
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_INVOICE_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_CHAT_SERVICE_URL=http://localhost:3004
"@ | Out-File -FilePath "frontend/.env.local" -Encoding UTF8
        Print-Message "Archivo .env.local creado para Frontend"
    }
}

# Función para mostrar menú
function Show-Menu {
    Write-ColorMessage "`n¿Qué deseas hacer?" $BLUE
    Write-Host "1) Iniciar todos los servicios (Docker)"
    Write-Host "2) Iniciar solo Auth Service (desarrollo)"
    Write-Host "3) Iniciar servicios de monitoreo"
    Write-Host "4) Ver logs de servicios"
    Write-Host "5) Detener todos los servicios"
    Write-Host "6) Limpiar contenedores y volúmenes"
    Write-Host "7) Instalar dependencias localmente"
    Write-Host "8) Ejecutar tests"
    Write-Host "9) Mostrar estado de servicios"
    Write-Host "10) Preparar para GitHub"
    Write-Host "11) Salir"
}

# Función para iniciar todos los servicios
function Start-AllServices {
    Print-Message "Iniciando todos los servicios..."
    docker-compose up -d
    Print-Message "Esperando que los servicios estén listos..."
    Start-Sleep -Seconds 10
    Show-ServicesInfo
}

# Función para iniciar solo Auth Service
function Start-AuthService {
    Print-Message "Iniciando Auth Service para desarrollo..."
    docker-compose up -d auth-service auth-db
    Print-Message "Esperando que Auth Service esté listo..."
    Start-Sleep -Seconds 5
    Print-Message "Auth Service disponible en: http://localhost:3001"
    Print-Message "Swagger API docs: http://localhost:3001/api"
}

# Función para iniciar monitoreo
function Start-Monitoring {
    Print-Message "Iniciando servicios de monitoreo..."
    docker-compose up -d prometheus grafana
    Print-Message "Servicios de monitoreo iniciados:"
    Print-Message "- Prometheus: http://localhost:9090"
    Print-Message "- Grafana: http://localhost:3005 (admin/admin)"
}

# Función para ver logs
function View-Logs {
    Write-ColorMessage "`nSelecciona el servicio para ver logs:" $BLUE
    Write-Host "1) Auth Service"
    Write-Host "2) Frontend"
    Write-Host "3) Todos los servicios"
    Write-Host "4) Prometheus"
    Write-Host "5) Grafana"
    $logOption = Read-Host "Opción"
    
    switch ($logOption) {
        "1" { docker-compose logs -f auth-service }
        "2" { docker-compose logs -f frontend }
        "3" { docker-compose logs -f }
        "4" { docker-compose logs -f prometheus }
        "5" { docker-compose logs -f grafana }
        default { Print-Error "Opción inválida" }
    }
}

# Función para detener servicios
function Stop-Services {
    Print-Message "Deteniendo todos los servicios..."
    docker-compose down
    Print-Message "Servicios detenidos"
}

# Función para limpiar
function Cleanup {
    Print-Warning "Esto eliminará todos los contenedores, volúmenes y datos. ¿Continuar? (y/N)"
    $confirm = Read-Host "Respuesta"
    if ($confirm -eq "y" -or $confirm -eq "Y" -or $confirm -eq "yes") {
        Print-Message "Limpiando contenedores y volúmenes..."
        docker-compose down -v
        docker system prune -f
        Print-Message "Limpieza completada"
    }
}

# Función para instalar dependencias localmente
function Install-LocalDependencies {
    Print-Message "Instalando dependencias locales de Node.js..."
    
    $services = @(
        "microservices/auth-service",
        "microservices/product-service", 
        "microservices/invoice-service",
        "microservices/chat-service",
        "frontend"
    )
    
    foreach ($service in $services) {
        if (Test-Path $service) {
            Print-Message "Instalando dependencias en $service..."
            Set-Location $service
            
            if (Test-Path "package.json") {
                npm install
                if ($LASTEXITCODE -eq 0) {
                    Print-Message "✅ Dependencias instaladas en $service"
                } else {
                    Print-Error "❌ Error instalando dependencias en $service"
                }
            } else {
                Print-Warning "No se encontró package.json en $service"
            }
            
            Set-Location "../.."
        } else {
            Print-Warning "Directorio $service no encontrado"
        }
    }
    
    Print-Message "Instalación de dependencias completada"
}

# Función para preparar proyecto para GitHub
function Prepare-ForGitHub {
    Print-Message "Preparando proyecto para GitHub..."
    
    # Verificar si .gitignore existe
    if (Test-Path ".gitignore") {
        Print-Message "✅ .gitignore ya existe"
    } else {
        Print-Warning ".gitignore no encontrado - se debería crear uno"
    }
    
    # Mostrar archivos que serían ignorados
    Print-Message "Archivos/carpetas que serán ignorados:"
    if (Test-Path "node_modules") { Write-Host "- node_modules/" }
    if (Test-Path ".env") { Write-Host "- .env files" }
    if (Test-Path "dist") { Write-Host "- dist/" }
    if (Test-Path ".next") { Write-Host "- .next/" }
    if (Test-Path "coverage") { Write-Host "- coverage/" }
    
    Write-ColorMessage "`nComandos sugeridos para GitHub:" $BLUE
    Write-Host "git init"
    Write-Host "git add ."
    Write-Host "git commit -m 'Initial commit: Librería Microservicios'"
    Write-Host "git branch -M main"
    Write-Host "git remote add origin <your-repo-url>"
    Write-Host "git push -u origin main"
    
    Write-ColorMessage "`n⚠️  IMPORTANTE: Antes de hacer push:" $YELLOW
    Write-Host "1. Asegúrate de que no hay archivos .env con datos sensibles"
    Write-Host "2. Revisa que node_modules/ no se suba"
    Write-Host "3. Configura las variables de entorno en tu servidor"
}

# Función para mostrar estado
function Show-ServicesInfo {
    Print-Message "Estado de los servicios:"
    Write-ColorMessage "`nServicios principales:" $GREEN
    Write-Host "- Frontend: http://localhost:3000"
    Write-Host "- Auth Service: http://localhost:3001 (API docs: /api)"
    Write-Host "- Product Service: http://localhost:3002 (API docs: /api)"
    Write-Host "- Invoice Service: http://localhost:3003 (API docs: /api)"
    Write-Host "- Chat Service: http://localhost:3004 (API docs: /api)"
    
    Write-ColorMessage "`nMonitoreo:" $GREEN
    Write-Host "- Prometheus: http://localhost:9090"
    Write-Host "- Grafana: http://localhost:3005 (admin/admin)"
    
    Write-ColorMessage "`nBases de datos PostgreSQL:" $GREEN
    Write-Host "- Auth DB: localhost:5433"
    Write-Host "- Product DB: localhost:5434"
    Write-Host "- Invoice DB: localhost:5435"
    Write-Host "- Chat DB: localhost:5436"
    
    Write-ColorMessage "`nEstado de contenedores:" $BLUE
    docker-compose ps
}

# Crear archivos .env
Create-EnvFiles

# Menú principal
while ($true) {
    Show-Menu
    $choice = Read-Host "Selecciona una opción (1-11)"
    
    switch ($choice) {
        "1" { Start-AllServices }
        "2" { Start-AuthService }
        "3" { Start-Monitoring }
        "4" { View-Logs }
        "5" { Stop-Services }
        "6" { Cleanup }
        "7" { Install-LocalDependencies }
        "8" { Run-Tests }
        "9" { Show-ServicesInfo }
        "10" { Prepare-ForGitHub }
        "11" { 
            Print-Message "¡Hasta luego!"
            exit 0
        }
        default {
            Print-Error "Opción inválida. Por favor selecciona 1-11."
        }
    }
    
    Write-Host "`nPresiona Enter para continuar..."
    Read-Host
}
