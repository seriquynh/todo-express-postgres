Todo REST API by Express & PostgreSQL

## Installation

Clone the repository and navigate into the project directory:

```bash
git clone https://github.com/seriquynh/todo-express-postgres.git
cd todo-express-postgres
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Start postgres database using Docker:

```bash
docker compose -f docker/docker-compose.yml up -d --build
```

Install NPM packages

```bash
npm install
```

Run database migrations

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/todo_db

npm run migrate up
```

Start the server

```bash
npm run dev
```

## Testing

Create a `.env.testing` file with the following content:

> I use different database container for testing to avoid conflicts with the development environment.

```bash
APP_PORT=3000

DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=todo_db_test
```

```bash
cp .env.example .env
```

Prepare the test database

```bash
NODE_ENV=test
DATABASE_URL=postgres://postgres:postgres@localhost:5433/todo_db_test
npm run migrate up
```

Run the NPM test script

```bash
npm run test
```
