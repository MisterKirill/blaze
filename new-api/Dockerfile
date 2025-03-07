FROM golang:1.24 AS builder

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -v -o api

FROM alpine:latest

WORKDIR /root

COPY --from=builder /usr/src/app/api .
COPY --from=builder /usr/src/app/database.sql .
COPY --from=builder /usr/src/app/config.docker.json ./config.json

EXPOSE 8080

CMD ["./api"]
