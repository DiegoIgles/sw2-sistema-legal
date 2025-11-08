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