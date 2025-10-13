# Usa la versión de Node.js que tienes instalada
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

# Instala solo las dependencias de producción (ignora nodemon)
RUN npm install --production

COPY . .

# Expone el puerto que definiste en tu .env (4000)
EXPOSE 4000

# El comando para iniciar tu servidor (basado en tu package.json)
CMD [ "node", "index.js" ]