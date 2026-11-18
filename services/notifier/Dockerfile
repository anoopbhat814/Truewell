FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod ./
COPY . .
RUN CGO_ENABLED=0 go build -ldflags "-s -w" -o /out/notifierd ./cmd/notifierd

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/notifierd /notifierd
EXPOSE 8090
ENTRYPOINT ["/notifierd"]
