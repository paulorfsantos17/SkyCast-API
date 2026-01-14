FROM golang:1.25
# instalar git (necessário para go install)
RUN apt-get update && apt-get install -y git && apt-get clean

WORKDIR /app

# instalar o air (hot reload)
RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./
RUN go mod download

COPY . .

CMD ["air", "-c", ".air.toml"]