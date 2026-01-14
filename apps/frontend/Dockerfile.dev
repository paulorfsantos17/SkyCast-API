FROM node:20-alpine

RUN mkdir -p /app && chmod -R 777 /app

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Limpar cache e instalar
RUN npm cache clean --force && \
  npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
