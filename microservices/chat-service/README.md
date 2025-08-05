# Chat Service

Servicio de chat en tiempo real (estructura base preparada para implementación).

## Estado actual

🏗️ **En desarrollo** - Estructura base creada, listo para implementar funcionalidades.

## Funcionalidades planificadas

- [ ] Chat en tiempo real con Socket.IO
- [ ] Salas de chat
- [ ] Historial de mensajes
- [ ] Notificaciones push
- [ ] Integración con Auth Service
- [ ] Moderación de chat

## Instalación

```bash
npm install
```

## Configuración

```bash
cp .env.example .env
# Editar variables de entorno
```

## Ejecución

### Con Docker (recomendado)
```bash
# Desde el directorio raíz
docker-compose up chat-service chat-db
```

### Desarrollo local
```bash
npm run start:dev
```

## Documentación API

Una vez ejecutándose:
```
http://localhost:3004/api
```

## WebSocket

El servicio WebSocket estará disponible en:
```
ws://localhost:3004
```

## Próximos pasos para implementación

1. Crear entidad Message
2. Crear entidad ChatRoom
3. Implementar WebSocket Gateway
4. Crear ChatService
5. Implementar ChatController
6. Agregar autenticación JWT para WebSocket
7. Implementar tests
