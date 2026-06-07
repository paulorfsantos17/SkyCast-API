# SkyCast-API

SkyCast-API é uma arquitetura distribuída de previsão do tempo que integra múltiplos serviços (Python, Go, NestJS, React/Vite, RabbitMQ, MongoDB e IA) para coletar, processar e expor dados meteorológicos de forma escalável e observável. 🌤️

---

## 🔖 Badges

![Stack](https://img.shields.io/badge/stack-Full%20Stack%20Distribu%C3%ADda-blue)
![Principal](https://img.shields.io/badge/backend-NestJS%20%7C%20Go%20%7C%20Python-orange)
![Frontend](https://img.shields.io/badge/frontend-React%20%7C%20Vite-61DAFB)
![Mensageria](https://img.shields.io/badge/message%20broker-RabbitMQ-FF6600)
![Status](https://img.shields.io/badge/status-Em%20desenvolvimento-yellow)

---

## 🧩 Sobre o projeto

O SkyCast-API nasceu como um desafio técnico para explorar arquitetura orientada a eventos e integração entre múltiplas linguagens e serviços em um mesmo ecossistema.

O fluxo principal é:

- Um **producer em Python** agenda (cron job) chamadas para uma API de tempo, publica os dados em uma **fila RabbitMQ**.
- Um **worker em Go** consome essa fila, trata/enriquece os dados e envia para a **API principal**.
- A **API em NestJS** recebe, aplica regras de negócio e persiste os dados em **MongoDB**, além de expor endpoints para consumo.
- Um **frontend em React + Vite** consome a API, exibe gráficos, dashboards e até uma **previsão com IA** usando um prompt via Gemini, com cache estratégico em Redis.
- Todo o ecossistema é orquestrado via **Docker Compose**, com suporte a **Kubernetes/Minikube** e estrutura em evolução para **provisionamento com Terraform**.

O foco principal é portfólio para recrutadores, demonstrando:

- Capacidade de modelar uma arquitetura distribuída moderna.
- Integração entre múltiplos serviços e tecnologias.
- Boas práticas de organização, autenticação, cache e consumo de APIs externas e IA.

---

## ✅ Funcionalidades

- ✅ **Coleta de dados meteorológicos** via producer Python com execução agendada.
- ✅ **Mensageria com RabbitMQ** para desacoplar coleta e processamento.
- ✅ **Worker em Go** para consumo, transformação e envio dos dados à API.
- ✅ **API central em NestJS** para:
  - Cadastro e persistência dos dados de clima em MongoDB.
  - Exposição de endpoints para consumo pelo frontend.
  - Autenticação baseada em JWT com tokens de acesso e refresh.
- ✅ **Frontend em React + Vite** para:
  - Visualização de históricos de clima.
  - Geração de gráficos e dashboards.
  - Experiência responsiva de consumo de dados.
- ✅ **Integração com IA (Gemini)** para previsões e análises de tempo baseadas em prompt.
- ✅ **Cache com Redis** para reduzir custo e latência em chamadas de IA e endpoints críticos.
- ✅ **Autenticação segura** com suporte a cookies HTTP-only (lado frontend/backend).
- ✅ **Stack de desenvolvimento containerizada** com Docker Compose.
- ✅ Estrutura em evolução para:
  - **Deploy em Kubernetes (Minikube)**.
  - **Provisionamento de infraestrutura com Terraform**.

---

## 🛠️ Tecnologias utilizadas

**Linguagens & runtimes**

- Python (producer)
- Go (worker)
- TypeScript / Node.js (API NestJS)
- TypeScript / JavaScript (frontend React + Vite)

**Backend**

- NestJS (API principal)
- RabbitMQ (message broker)
- MongoDB (banco de dados)
- Redis (cache)
- JWT (autenticação)

**Frontend**

- React
- Vite
- Integração com APIs REST
- Integração com IA (Google Gemini)

**Infraestrutura & Dev**

- Docker & Docker Compose
- Kubernetes (Minikube)
- Terraform (estrutura em construção)
- PNPM (gerenciador de pacotes para a API)
- Arquivos `.env` para configuração

---

## 📦 Pré-requisitos

Para rodar todo o ecossistema com Docker Compose:

- **Docker** (Engine) instalado
- **Docker Compose** (v2+ ou integrado ao Docker Desktop)
- Recomendado: **WSL2** no Windows para ambiente mais próximo de produção

Para experimentar Kubernetes/Minikube (opcional):

- **Minikube** instalado
- **kubectl** configurado

Para rodar serviços individualmente (sem Docker), você precisará, em geral:

- **Node.js** (para API NestJS e frontend React/Vite)
- **Go** (worker)
- **Python** (producer)
- **MongoDB**, **RabbitMQ** e **Redis** instalados ou provisionados

---

## ⚙️ Configuração de variáveis de ambiente

O projeto utiliza arquivos `.env` / `.env.development` para configurar serviços.  
Abaixo, um resumo das variáveis principais e seus propósitos:

### Mensageria / filas

```env
RABBITMQ_HOST=rabbitmq           # Host do container RabbitMQ
RABBITMQ_USER=guest             # Usuário padrão
RABBITMQ_PASS=guest             # Senha padrão
RABBITMQ_PORT=5672              # Porta de comunicação
QUEUE_NAME=weather_data         # Nome da fila de dados de clima
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/
```

### Configuração do producer / worker

```env
INTERVAL_SECONDS=900            # Intervalo (em segundos) para coleta de dados pelo producer
WEATHER_API_URL=http://nest-dev:3000/weather/log  # Endpoint da API NestJS que recebe os dados tratados
```

### Banco de dados (MongoDB)

```env
MONGO_URI=mongodb://USUARIO-MONGO:SENHA-MONGO@mongo:27017
DATABASE_NAME=NOME-DO-BANCO-MONGO
```

### Autenticação (JWT)

```env
JWT_ACCESS_SECRET=sua-chave-aqui
JWT_REFRESH_SECRET=sua-chave-aqui
JWT_ACCESS_EXPIRES_IN=15m       # Tempo de expiração do access token
JWT_REFRESH_EXPIRES_IN=7d       # Tempo de expiração do refresh token
```

### Frontend / CORS

```env
VITE_API_URL=http://localhost:3000    # Base URL da API para o frontend
FRONTEND_URL=http://localhost:5173    # URL do frontend (para CORS e cookies)
```

### Serviços externos (IA & mapas)

```env
GOOGLE_MAPS_API_KEY=sua-chave-aqui
GEMINI_API_KEY=sua-chave-aqui
```

> Recomendações:
> - Nunca commitar arquivos `.env` com dados sensíveis.
> - Usar valores seguros e específicos para ambiente local/dev/produção.

---

## 🚀 Instalação e configuração (Docker Compose)

### 1. Clonar o repositório

```bash
git clone https://github.com/paulorfsantos17/SkyCast-API.git
cd SkyCast-API
```

### 2. Criar arquivos de ambiente

Use os arquivos de exemplo (caso existam) ou crie manualmente:

```bash
cp .env.example .env            # se existir
cp .env.development.example .env.development   # se existir
```

Em seguida, ajuste:

- Credenciais do MongoDB (`MONGO_URI`, `DATABASE_NAME`).
- Configurações do RabbitMQ (`RABBITMQ_HOST`, `RABBITMQ_URL`).
- Segredos de JWT (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`).
- Chaves de serviços externos (`GOOGLE_MAPS_API_KEY`, `GEMINI_API_KEY`).
- URLs de API/frontend (`VITE_API_URL`, `FRONTEND_URL`).

### 3. Subir o ecossistema com Docker Compose

```bash
docker-compose up --build
```

Este comando irá:

- Construir e iniciar:
  - `python-producer` (producer Python)
  - `worker-go` (worker Go)
  - `nest-dev` (API NestJS)
  - `frontend` (React + Vite)
  - `rabbitmq` (com UI de gerenciamento)
  - `mongo`
  - `redis`

Após a inicialização:

- API: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- RabbitMQ Management: `http://localhost:15672` (user: `guest`, pass: `guest`)
- MongoDB: `mongodb://localhost:27017` (conforme sua configuração)

---

## 🧪 Como rodar o projeto

### Ambiente de desenvolvimento (Docker Compose)

Subir todos os serviços:

```bash
docker-compose up --build
```

Derrubar os serviços:

```bash
docker-compose down
```

### Rodando serviços específicos (exemplos genéricos)

> Os comandos abaixo são ilustrativos; adapte conforme scripts definidos nos `package.json` e demais arquivos do repositório.

#### API NestJS (local, sem Docker)

```bash
cd apps/api
pnpm install
pnpm start:dev
```

#### Frontend React + Vite (local, sem Docker)

```bash
cd apps/frontend
pnpm install
pnpm dev
```

#### Producer Python

```bash
cd apps/producer-python
pip install -r requirements.txt
python main.py   # ou o arquivo principal do producer
```

#### Worker Go

```bash
cd apps/worker_go
go run main.go   # ou arquivo de entrada correspondente
```

> Lembre-se de manter RabbitMQ, MongoDB, Redis e a API NestJS rodando antes de iniciar producer/worker.

---

## ☸️ Kubernetes / Minikube (visão geral)

O projeto também está sendo estruturado para rodar em **Kubernetes** via **Minikube**, com:

- Manifests para deploy dos serviços (API, frontend, RabbitMQ, MongoDB, Redis, producer, worker).
- Configuração de `StatefulSet` para serviços que precisam de identidade estável (como RabbitMQ).
- Uso de `ConfigMap` / `Secret` para variáveis de ambiente sensíveis (equivalentes ao `.env`).

Fluxo típico (genérico):

```bash
# Iniciar cluster
minikube start

# Aplicar manifests (exemplo de pasta)
kubectl apply -f k8s/

# Listar pods
kubectl get pods

# Expor serviço (exemplo)
minikube service skycast-frontend
```

> Ajuste os comandos conforme o layout real dos manifests (por exemplo: `infra/k8s`, `deploy/k8s` etc.).

---

## 🌍 Infraestrutura como código (Terraform)

O projeto está sendo preparado para utilização de **Terraform** para:

- Provisionar infraestrutura de base (clusters, bancos, filas, etc.).
- Padronizar ambientes (dev/stage/prod) de forma reprodutível.
- Integrar com provedores de cloud (quando aplicável).

Exemplo de fluxo genérico (ajuste ao seu setup):

```bash
cd infra/terraform

terraform init
terraform plan
terraform apply
```

> A ideia é que Terraform complemente Docker/Kubernetes, permitindo provisionar recursos de forma declarativa.

---

## 📚 Como usar / Exemplos

### 1. Fluxo básico (end-to-end)

Com `docker-compose` rodando:

1. O **producer Python** chama periodicamente uma API de tempo, publica mensagens na fila `weather_data` do RabbitMQ.
2. O **worker Go** lê essa fila, processa os dados (normalização, agregações, etc.) e envia para o endpoint configurado em `WEATHER_API_URL` (por padrão `http://nest-dev:3000/weather/log`).
3. A **API NestJS** recebe e persiste os dados no MongoDB.
4. O **frontend React + Vite** consome os endpoints da API para:
   - Exibir gráficos de histórico.
   - Mostrar previsões de tempo.
   - Acionar endpoints com IA (Gemini) para análises adicionais.

### 2. Exemplo de consumo de API (frontend)

```ts
// Exemplo genérico em TypeScript
const response = await fetch(`${import.meta.env.VITE_API_URL}/weather`);
const data = await response.json();

// Exibir dados em um gráfico, tabela, etc.
```

### 3. Exemplo de previsão com IA (conceitual)

- Frontend envia contexto (dados de clima) para um endpoint na API.
- API consulta o Gemini usando `GEMINI_API_KEY`.
- Resultado é cacheado no Redis para reduzir custo/latência.
- Frontend exibe resposta enriquecida (texto, insights, previsões).

---

## 🗂️ Estrutura de pastas (simplificada)

```text
SkyCast-API/
├─ apps/
│  ├─ api/                # API principal (NestJS)
│  ├─ frontend/           # Frontend (React + Vite)
│  ├─ producer-python/    # Producer de dados (Python)
│  └─ worker_go/          # Worker de processamento (Go)
├─ docker-compose.yml     # Orquestração de serviços em dev
├─ .env                   # Variáveis de ambiente gerais (não commitar em prod)
├─ .env.development       # Variáveis de ambiente para dev
├─ redis.conf             # Configuração customizada do Redis
└─ infra/ (opcional)      # Terraform / K8s (quando aplicável; adapte conforme repo)
```

> A estrutura acima é ilustrativa com base nos arquivos identificados; ajuste conforme a organização atual do seu repositório.

---

## 🗺️ Roadmap

Alguns possíveis próximos passos para evolução do projeto:

- [ ] Completar automação de deploy com **Terraform** (infraestrutura cloud).
- [ ] Consolidar manifests Kubernetes (incluindo RabbitMQ como StatefulSet).
- [ ] Adicionar observabilidade (logs estruturados, métricas, dashboards).
- [ ] Criar mais visualizações no frontend (mapas, filtros, comparações históricas).
- [ ] Implementar testes automatizados (unitários e e2e) na API e no frontend.
- [ ] Documentar a API (Swagger/OpenAPI) e publicar exemplos de requisições.

---

## 🤝 Contribuição

Sugestões e melhorias são bem-vindas!

Para contribuir:

1. Faça um **fork** do repositório.
2. Crie uma branch para sua feature/fix:

   ```bash
   git checkout -b feature/minha-melhoria
   ```

3. Implemente as mudanças e faça commits claros.
4. Envie um **Pull Request** descrevendo:
   - O problema que está sendo resolvido.
   - O que foi alterado.
   - Como testar a mudança.

Se preferir, você também pode abrir uma **issue** para discutir ideias antes de implementar.

---

## 👨‍💻 Autor

**Paulo Ricardo Santos**

- GitHub: [@paulorfsantos17](https://github.com/paulorfsantos17)
- LinkedIn: [Paulo Santos – Desenvolvedor Full Stack](https://www.linkedin.com/in/paulosantosdesenvolvedor)
- Site pessoal: [devpaulo.com](https://devpaulo.com)

Se este projeto foi útil para você ou ajudou a entender melhor arquiteturas distribuídas, considere deixar uma estrela ⭐ no repositório.