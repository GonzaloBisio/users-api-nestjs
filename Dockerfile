# Etapa de construcción
FROM node:20-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY src/ ./src/
COPY test/ ./test/

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm install --only=production

# Copiar los archivos construidos desde la etapa de construcción
COPY --from=builder /app/dist ./dist

# Puerto expuesto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main.js"]
