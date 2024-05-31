FROM golang:1.22.1-alpine

WORKDIR .

COPY go.mod .

COPY go.sum .

RUN go mod download

COPY . .



CMD ["go", "run", "main.go"]



