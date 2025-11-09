# ⚖️ Sistema Legal

Backend del sistema de gestión documental para abogados, desarrollado con **NestJS**, **PostgreSQL** y **Docker**.

---

## 🚀 Requisitos

Antes de comenzar asegúrate de tener instalado:

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker y Docker Compose](https://www.docker.com/)

---

## ⚙️ Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/DiegoIgles/sw2-sistema-legal.git
   cd sw2-sistema-legal


npm install

.env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=legal_user
DB_PASSWORD=legal_pass
DB_NAME=legal_db
PORT=3000
JWT_CLIENT_SECRET=
JWT_SECRET=

docker-compose up -d

docker ps

npm start

---

## 🐳 Ejecutar como microservicio (desarrollo)

Estas instrucciones levantan la aplicación y una base de datos PostgreSQL en contenedores Docker para que puedas probar el servicio como un microservicio y, posteriormente, conectarlo a un API Gateway.

Archivos incluidos para desarrollo:
- `Dockerfile` — imagen multi-stage para build y runtime.
- `docker-compose.dev.yml` — Compose para Postgres (volumen nombrado) y el servicio.
- `.env.example` — plantilla de variables de entorno.

Pasos rápidos (PowerShell):

1) Construir y levantar (Postgres + la app):

```powershell
docker compose -f docker-compose.dev.yml up --build
```

2) Ver logs del servicio:

```powershell
docker compose -f docker-compose.dev.yml logs -f expedientes
```

3) Probar endpoints:

```powershell
# Swagger
start http://localhost:3000/docs

# Health (readiness)
curl http://localhost:3000/health/ready

# Crear cliente (ejemplo)
Invoke-RestMethod -Method Post -Uri http://localhost:3000/clientes -ContentType 'application/json' -Body (@{ nombre_completo='Prueba'; contacto_email='p@ej.com' } | ConvertTo-Json)

# Listar clientes
Invoke-RestMethod -Method Get -Uri http://localhost:3000/clientes
```

4) Detener y limpiar:

```powershell
docker compose -f docker-compose.dev.yml down
# borrar volúmenes (opcional, borra datos)
docker compose -f docker-compose.dev.yml down -v
```

Notas:
- `docker-compose.dev.yml` usa un volumen nombrado `postgres_data` para evitar problemas con bind-mounts en Windows.
- Mantén un `.env` local con las credenciales; no lo subas al repo. Usa `.env.example` como plantilla.

---

## ¿Y luego el Gateway?

Para integrar con un API Gateway (GraphQL) puedes levantar el gateway en la misma red (mismo `docker-compose`) y hacer que el gateway llame a este servicio por su nombre de servicio (`http://expedientes:3000`) o, si el gateway corre fuera de Docker, por `http://localhost:3000`.

Recomendaciones al integrar:
- Gateway: implementar timeouts, retries y circuit-breaker; usar cache (Redis) para fallback cuando este servicio no responda.
- Producción: usar migraciones (no `synchronize: true`), readiness/liveness probes, y escalar pods/instancias.
