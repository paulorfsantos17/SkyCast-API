FROM node:22-alpine

# Diretório de trabalho
WORKDIR /app

# Fix de permissões (evita "EACCES mkdir /app")
RUN mkdir -p /app && chmod -R 777 /app

# Instalar PNPM globalmente
RUN npm install -g pnpm

# Criar store local (evita usar /root/.local/share/pnpm)
RUN mkdir -p /app/.pnpm-store && chmod -R 777 /app/.pnpm-store
ENV PNPM_HOME=/app/.pnpm-store
ENV PATH=$PNPM_HOME:$PATH

# Copia arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instala dependências
RUN pnpm install

# Copia resto do projeto
COPY . .

EXPOSE 3000

RUN ln -s /app/node_modules /app/node_modules || true

CMD ["pnpm", "start:dev"]