# --- Fase 1: Build ---
# Usamos la versión de Node que tienes (v20) para construir el proyecto
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json ./
COPY package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# IMPORTANTE: Variable de entorno para el build
# Le decimos a React dónde estará la API cuando corra en Docker
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Construir la aplicación para producción
RUN npm run build

# --- Fase 2: Producción ---
# Usamos una imagen oficial y ligera de Nginx para servir los archivos
FROM nginx:1.25-alpine

# Copiamos los archivos estáticos generados en la fase de 'build'
# al directorio por defecto de Nginx para servir contenido HTML
COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Le decimos a Nginx que escuche en el puerto 80
EXPOSE 80

# El comando por defecto de Nginx ya inicia el servidor, no necesitamos CMD.