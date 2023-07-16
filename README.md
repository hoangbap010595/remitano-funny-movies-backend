## Backend Setup

### 1. Clone Repository and Install Dependencies

Clone repository from Github:

```bash
# git
git clone https://github.com/hoangbap010595/remitano-funny-movies-backend.git
cd remitano-funny-movies-backend
```

Install the dependencies for the Backend application:

```bash
# npm
npm install
# yarn
yarn install
```

### 2. Install MySQL and Redis with Docker

Setup a development MySQL with Docker. Open file `.env` - which sets the required environments for MySQL such as `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DB`, `MYSQL_PORT`, and `MYSQL_HOST`. Update the variables as you wish and select a strong password. For Redis, sets the required environments `REDIS_HOST` and `REDIS_PORT`

Start the MySQL database

```bash
docker run --name mysql -e MYSQL_ROOT_PASSWORD=znyhCTVg8tneMdAu -e MYSQL_DATABASE=remitano_funny_videos -e MYSQL_USER=remitano_funny_videos -e MYSQL_PASSWORD=znyhCTVg8tneMdAu -p 3306:3306  -d mysql
```

Start the Redis

```bash
docker run --name redis -p 6379:6379  -d redis
```

### 3. Prisma Migrate

[Prisma Migrate](https://github.com/prisma/prisma2/tree/master/docs/prisma-migrate) is used to manage the schema and migration of the database. Prisma datasource requires an environment variable `DATABASE_URL` for the connection to the PostgreSQL database. Prisma reads the `DATABASE_URL` from the root [.env](./.env) file.

Use Prisma Migrate in your [development environment](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#evolving-the-schema-in-development) to

1. Creates `migration.sql` file
2. Updates Database Schema
3. Generates Prisma Client

```bash
npx prisma migrate dev
# or
npm run migrate:dev
```

If you like to customize your `migration.sql` file run the following command. After making your customizations run `npx prisma migrate dev` to apply it.

```bash
npx prisma migrate dev --create-only
# or
npm run migrate:dev:create
```

If you are happy with your database changes you want to deploy those changes to your [production database](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#applying-migrations-in-production-and-other-environments). Use `prisma migrate deploy` to apply all pending migrations, can also be used in CI/CD pipelines as it works without prompts.

```bash
npx prisma migrate deploy
# or
npm run migrate:deploy
```

### 4. Prisma: Prisma Client JS

[Prisma Client JS](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/api) is a type-safe database client auto-generated based on the data model.

Generate Prisma Client JS by running

> **Note**: Every time you update [schema.prisma](prisma/schema.prisma) re-generate Prisma Client JS

```bash
npx prisma generate
# or
npm run prisma:generate
```

### 5. Seed the database data with this script

Execute the script with this command:

```bash
npm run seed
```

### 6. Start Backend Server

Run Backend Server in Development mode:

```bash
npm run start

# watch mode
npm run start:dev
```

Run Backend Server in Production mode:

```bash
npm run start:prod
```

GraphQL Playground for the Backend Server is available here: http://localhost:3000/graphql

**[⬆ back to top](#overview)**

### GraphQL Playground

Open up the [example GraphQL queries](graphql/auth.graphql) and copy them to the GraphQL Playground. Some queries and mutations are secured by an auth guard. You have to acquire a JWT token from `signup` or `login`. Add the `accessToken`as followed to **HTTP HEADERS** in the playground and replace `YOURTOKEN` here:

```json
{
  "Authorization": "Bearer YOURTOKEN"
}
```