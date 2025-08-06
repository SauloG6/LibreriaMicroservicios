# Script de verificación para Windows PowerShell
# Verifica que todos los componentes del proyecto estén funcionando correctamente

param(
    [switch]$Detailed = $false
)

# Colores para output
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

function Print-Success {
    param([string]$Message)
    Write-ColorMessage "✅ $Message" $GREEN
}

function Print-Warning {
    param([string]$Message)
    Write-ColorMessage "⚠️  $Message" $YELLOW
}

function Print-Error {
    param([string]$Message)
    Write-ColorMessage "❌ $Message" $RED
}

function Print-Info {
    param([string]$Message)
    Write-ColorMessage "ℹ️  $Message" $BLUE
}

Write-ColorMessage "🔍 Verificando configuración del proyecto..." $BLUE

# Verificar Docker
Write-ColorMessage "`n🐳 Verificando Docker..." $BLUE

if (Get-Command docker -ErrorAction SilentlyContinue) {
    Print-Success "Docker está instalado"
    
    try {
        $dockerInfo = docker info 2>$null
        if ($dockerInfo) {
            Print-Success "Docker está ejecutándose"
        } else {
            Print-Error "Docker no está ejecutándose. Inicia Docker Desktop."
            exit 1
        }
    } catch {
        Print-Error "Error verificando Docker"
        exit 1
    }
} else {
    Print-Error "Docker no está instalado"
    exit 1
}

# Verificar Docker Compose
if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    Print-Success "Docker Compose está disponible"
} else {
    Print-Error "Docker Compose no está disponible"
    exit 1
}

# Verificar archivos de configuración
Write-ColorMessage "`n📁 Verificando archivos de configuración..." $BLUE

$configFiles = @(
    "frontend\.env.local",
    "microservices\auth-service\.env",
    "microservices\product-service\.env",
    "docker-compose.yml"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Print-Success "Archivo $file existe"
    } else {
        Print-Warning "Archivo $file no encontrado"
    }
}

# Verificar estado de servicios Docker
Write-ColorMessage "`n🚀 Verificando servicios Docker..." $BLUE

try {
    $dockerPS = docker-compose ps 2>$null
    if ($dockerPS -and ($dockerPS -match "Up")) {
        Print-Success "Algunos servicios están ejecutándose"
        
        # Verificar servicios específicos
        $services = @("auth-service", "auth-db", "product-service", "product-db", "frontend")
        
        foreach ($service in $services) {
            if ($dockerPS -match "$service.*Up") {
                Print-Success "Servicio $service está ejecutándose"
            } else {
                Print-Warning "Servicio $service no está ejecutándose"
            }
        }
    } else {
        Print-Warning "No hay servicios ejecutándose. Ejecuta: docker-compose up -d"
    }
} catch {
    Print-Warning "Error verificando servicios Docker"
}

# Verificar conectividad de servicios
Write-ColorMessage "`n🌐 Verificando conectividad..." $BLUE

$servicesUrls = @{
    "http://localhost:3000" = "Frontend"
    "http://localhost:3001/health" = "Auth Service" 
    "http://localhost:3002/health" = "Product Service"
}

foreach ($url in $servicesUrls.Keys) {
    $serviceName = $servicesUrls[$url]
    
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Print-Success "$serviceName responde en $url"
        } else {
            Print-Warning "$serviceName responde con código $($response.StatusCode) en $url"
        }
    } catch {
        Print-Warning "$serviceName no responde en $url"
    }
}

# Verificar APIs con Swagger
Write-ColorMessage "`n📚 Verificando documentación de APIs..." $BLUE

$swaggerUrls = @{
    "http://localhost:3001/api" = "Auth API Docs"
    "http://localhost:3002/api" = "Product API Docs"
}

foreach ($url in $swaggerUrls.Keys) {
    $serviceName = $swaggerUrls[$url]
    
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Print-Success "$serviceName disponible en $url"
        }
    } catch {
        Print-Warning "$serviceName no disponible en $url"
    }
}

# Verificar bases de datos
Write-ColorMessage "`n🗄️  Verificando bases de datos..." $BLUE

$dbServices = @("auth-db", "product-db")

foreach ($db in $dbServices) {
    try {
        $result = docker-compose exec -T $db pg_isready 2>$null
        if ($result -match "accepting connections") {
            Print-Success "Base de datos $db está lista"
        } else {
            Print-Warning "Base de datos $db no está lista"
        }
    } catch {
        Print-Warning "Error verificando base de datos $db"
    }
}

# Prueba de autenticación
Write-ColorMessage "`n🔐 Probando autenticación..." $BLUE

try {
    $loginBody = @{
        email = "admin@libreria.com"
        password = "admin123"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/auth/login" -Method Post -Body $loginBody -Headers $headers -TimeoutSec 10
    
    if ($loginResponse.access_token) {
        Print-Success "Login de administrador funciona"
        
        # Probar endpoint protegido
        $authHeaders = @{
            "Authorization" = "Bearer $($loginResponse.access_token)"
        }
        
        try {
            $profileResponse = Invoke-RestMethod -Uri "http://localhost:3001/auth/profile" -Headers $authHeaders -TimeoutSec 5
            if ($profileResponse.email) {
                Print-Success "Endpoints protegidos funcionan"
            }
        } catch {
            Print-Warning "Endpoints protegidos no responden correctamente"
        }
    }
} catch {
    Print-Warning "Login no funciona correctamente"
    if ($Detailed) {
        Print-Info "Error: $($_.Exception.Message)"
    }
}

# Verificar recursos del sistema
if ($Detailed) {
    Write-ColorMessage "`n💻 Información del sistema..." $BLUE
    
    # Memoria disponible
    $totalMemory = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB
    Print-Info "Memoria total del sistema: $([math]::Round($totalMemory, 2)) GB"
    
    # Espacio en disco
    $disk = Get-CimInstance -ClassName Win32_LogicalDisk | Where-Object { $_.DriveType -eq 3 } | Select-Object -First 1
    $freeSpaceGB = $disk.FreeSpace / 1GB
    Print-Info "Espacio libre en disco: $([math]::Round($freeSpaceGB, 2)) GB"
    
    # Versiones
    try {
        $dockerVersion = docker --version
        Print-Info "Versión de Docker: $dockerVersion"
        
        $composeVersion = docker-compose --version  
        Print-Info "Versión de Docker Compose: $composeVersion"
    } catch {
        Print-Warning "No se pudieron obtener las versiones"
    }
}

# Resumen final
Write-ColorMessage "`n📊 RESUMEN DE VERIFICACIÓN" $BLUE
Write-Host "================================" -ForegroundColor $BLUE

try {
    $dockerPS = docker-compose ps 2>$null
    if ($dockerPS -and ($dockerPS -match "Up")) {
        Print-Info "Estado: Sistema en ejecución"
        Print-Info "Frontend: http://localhost:3000"
        Print-Info "Auth API: http://localhost:3001/api"
        Print-Info "Product API: http://localhost:3002/api"
        Print-Info ""
        Print-Info "Usuarios de prueba:"
        Print-Info "Admin: admin@libreria.com / admin123"
        Print-Info "Usuario: user@libreria.com / user123"
    } else {
        Print-Info "Para iniciar el sistema ejecuta: docker-compose up -d"
    }
} catch {
    Print-Info "Para iniciar el sistema ejecuta: docker-compose up -d"
}

Print-Info ""
Print-Info "Para ver logs: docker-compose logs -f"
Print-Info "Para detener: docker-compose down"
Print-Info "Para verificación detallada: .\verify-setup.ps1 -Detailed"

Write-ColorMessage "`n🎉 Verificación completada" $GREEN

# Mostrar tiempo de ejecución
$endTime = Get-Date
if ($startTime) {
    $duration = $endTime - $startTime
    Print-Info "Tiempo de verificación: $([math]::Round($duration.TotalSeconds, 2)) segundos"
}
