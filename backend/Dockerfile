# Dockerfile — Optimizado para Render
FROM node:20-alpine AS base
WORKDIR /app

# Instalar dependencias primero (capa cacheable)
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar código fuente
COPY . .

# No copiar serviceAccountKey.json (usar variable de entorno en producción)
# Asegúrate de agregar serviceAccountKey.json a .dockerignore

EXPOSE 3000

CMD ["node", "server.js"]
