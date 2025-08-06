# ============================================
# Stage 1: Build stage
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias primero (mejor cache de Docker)
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar todas las dependencias (incluyendo devDependencies para build)
RUN npm ci --only=production=false && npm cache clean --force

# Copiar código fuente
COPY src/ ./src/

# Compilar TypeScript
RUN npm run build

# ============================================
# Stage 2: Production stage
# ============================================
FROM node:18-alpine AS production

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Copiar código compilado desde build stage
COPY --from=builder /app/dist ./dist

# Cambiar ownership de archivos al usuario no-root
RUN chown -R nestjs:nodejs /app
USER nestjs

# Exponer el puerto
EXPOSE 3004

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3004/messages', (res) => { process.exit(res.statusCode === 200 || res.statusCode === 404 ? 0 : 1) })"

# Comando para ejecutar la aplicación
CMD ["node", "dist/main.js"]