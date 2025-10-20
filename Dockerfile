# Estágio de build
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Estágio final com nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Limpa arquivos padrão
RUN rm -rf ./*

# Copia arquivos do build
COPY --from=build /app/dist .

# Copia configuração customizada para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
