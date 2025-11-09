# Docker & local development

This file contains quick instructions to run the service and Postgres locally using Docker Compose.

Prerequisites
- Docker and Docker Compose installed.

Run locally (development)
```powershell
# build and start Postgres + the service
docker compose -f docker-compose.dev.yml up --build

# open Swagger
http://localhost:3000/docs

# health
http://localhost:3000/health/ready
```

Stop and clean
```powershell
# stop and remove containers
docker compose -f docker-compose.dev.yml down

# remove volumes as well (this deletes DB data)
docker compose -f docker-compose.dev.yml down -v
```

Notes
- The Compose file uses a named volume for Postgres (`postgres_data`) to avoid issues with bind-mounts on Windows.
- Use `.env.example` as a template for local `.env` and never commit `.env` with secrets.
