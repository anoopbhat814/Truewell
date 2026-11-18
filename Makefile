.PHONY: dev up down migrate seed test lint api worker notifier check-env openapi

dev:
	npm run dev --workspace apps/web

api:
	cd services/api && uvicorn app.main:app --reload --port 8000

worker:
	npm run dev --workspace apps/worker

notifier:
	cd services/notifier && go run ./cmd/notifierd

up:
	docker compose -f deploy/docker-compose.yml up -d --build

down:
	docker compose -f deploy/docker-compose.yml down

migrate:
	npx prisma migrate deploy

seed:
	npx tsx prisma/seed.ts

check-env:
	node scripts/check-env.js

openapi:
	node scripts/gen-openapi.js

test:
	npm test --workspaces --if-present
	cd services/api && python -m pytest
	cd services/notifier && go test ./...

lint:
	npm run lint --workspaces --if-present
	cd services/api && ruff check .
	cd services/notifier && go vet ./...
