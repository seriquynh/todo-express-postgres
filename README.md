Todo REST API by Express & PostgreSQL

## Installation

```bash
docker compose -f docker/docker-compose.yml up -d --build

npm install

DATABASE_URL=postgres://postgres:postgres@localhost:5432/todo_db

npm run migrate up

npm run dev
```
