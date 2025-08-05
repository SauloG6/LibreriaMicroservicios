# Monitoreo y Observabilidad

Configuración de monitoreo para la aplicación de librería usando Prometheus y Grafana.

## Componentes

- **Prometheus**: Recolección de métricas de todos los servicios
- **Grafana**: Visualización de métricas y dashboards

## Servicios monitoreados

### Microservicios
- Auth Service (puerto 3001)
- Product Service (puerto 3002)
- Invoice Service (puerto 3003)
- Chat Service (puerto 3004)
- Frontend (puerto 3000)

### Bases de datos
- PostgreSQL Auth DB (puerto 5433)
- PostgreSQL Product DB (puerto 5434)
- PostgreSQL Invoice DB (puerto 5435)
- PostgreSQL Chat DB (puerto 5436)

## Acceso a servicios

### Prometheus
- URL: http://localhost:9090
- Interfaz web para consultas de métricas
- Configuración en `prometheus.yml`

### Grafana
- URL: http://localhost:3005
- Usuario: `admin`
- Contraseña: `admin`

## Métricas disponibles

### Métricas de aplicación
- Requests HTTP por segundo
- Tiempo de respuesta de endpoints
- Errores 4xx y 5xx
- Usuarios autenticados
- Operaciones de base de datos

### Métricas de sistema
- Uso de CPU y memoria
- Conexiones de red
- Espacio en disco
- Estado de contenedores Docker

### Métricas de base de datos
- Conexiones activas
- Consultas por segundo
- Bloqueos de tablas
- Tamaño de base de datos

## Configuración

### Prometheus
El archivo `prometheus.yml` define:
- Intervalos de scraping (15s por defecto)
- Targets de cada servicio
- Jobs específicos por componente

### Dashboards de Grafana

#### Dashboard Principal
- Overview de todos los servicios
- Métricas de salud general
- Alertas críticas

#### Dashboard por Servicio
- Métricas específicas de cada microservicio
- Logs estructurados
- Performance y latencia

#### Dashboard de Base de Datos
- Estado de PostgreSQL
- Consultas lentas
- Uso de recursos

## Alertas configuradas

### Críticas
- Servicio no disponible (>5 minutos)
- Error rate >5%
- Tiempo de respuesta >2 segundos
- Uso de memoria >90%

### Advertencias
- Error rate >1%
- Tiempo de respuesta >1 segundo
- Uso de CPU >80%
- Conexiones DB >80% del límite

## Comandos útiles

### Iniciar monitoreo
```bash
docker-compose up prometheus grafana -d
```

### Ver logs de Prometheus
```bash
docker-compose logs -f prometheus
```

### Ver logs de Grafana
```bash
docker-compose logs -f grafana
```

### Reiniciar servicios de monitoreo
```bash
docker-compose restart prometheus grafana
```

## Consultas Prometheus útiles

### Requests por segundo
```promql
rate(http_requests_total[5m])
```

### Tiempo de respuesta promedio
```promql
avg(http_request_duration_seconds)
```

### Error rate por servicio
```promql
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])
```

### Memoria usada por contenedor
```promql
container_memory_usage_bytes{container_label_com_docker_compose_service!=""}
```

## Próximas mejoras

- [ ] Configurar ELK Stack para logs centralizados
- [ ] Agregar alertas por email/Slack
- [ ] Implementar tracing distribuido con Jaeger
- [ ] Configurar backups automáticos de métricas
- [ ] Dashboards personalizados por rol de usuario

## Troubleshooting

### Prometheus no encuentra targets
1. Verificar que los servicios estén corriendo
2. Revisar la configuración de red Docker
3. Confirmar que los endpoints `/metrics` respondan

### Grafana no muestra datos
1. Verificar conexión a Prometheus
2. Confirmar que las consultas PromQL sean correctas
3. Revisar el rango de tiempo seleccionado

### Contenedores de monitoreo fallan
1. Verificar puertos disponibles (9090, 3005)
2. Revisar logs de Docker Compose
3. Confirmar permisos de archivos de configuración
