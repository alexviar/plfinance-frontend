# Usar una imagen base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de React
RUN npm install --production

# Copiar el resto de los archivos del proyecto
COPY . .

# Crear la build de producción
RUN npm run build

# Usar Nginx para servir los archivos estáticos de React
FROM nginx:alpine

# Copiar los archivos construidos por React al contenedor de Nginx
COPY --from=0 /app/dist /usr/share/nginx/html

# Exponer el puerto de Nginx
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
