# Project Scripts Description

This document provides an overview of the various scripts defined in the `package.json` file of the project. These scripts are used for testing, linting, building, and managing the Docker environment.

## Testing Scripts
- `test`: Runs the Jest tests using the configuration specified in `jest.config.js`.
- `test:watch`: Executes Jest in watch mode, re-running tests as files change.
- `test:coverage`: Generates a test coverage report using Jest.

## Linting and Formatting Scripts
- `lint`: Runs ESLint to identify and fix linting issues in TypeScript files within the `src` directory.
- `pretty`: Formats all `.ts` files in the project using Prettier.

## Development and Building Scripts
- `start`: Launches the application using `ts-node`, directly running the TypeScript code.
- `start:local:dev`: Starts the application in development mode with `nodemon`, monitoring for any changes.
- `build`: Compiles TypeScript files to JavaScript using the TypeScript compiler.
- `prisma:generate`: Generates Prisma client files.
- `watch`: Runs the TypeScript compiler in watch mode, automatically recompiling files as they change.

## Database Management Scripts
- `db:seed`: Runs a script to seed the database with initial data.

## Docker Related Scripts
- `docker:network`: Creates a Docker network with specific configurations.
- `docker:compose:dev`: Starts Docker Compose in development mode using the `dev.compose.yml` configuration file.
- `docker:compose:prod`: Starts Docker Compose in production mode using the `prod.compose.yml` configuration file.
- `docker:logs`: Fetches logs from the `tanpo` Docker container.
- `docker:logs:follow`: Continuously streams logs from the `tanpo` Docker container.
- `docker:npm`: Executes `npm install` inside the `tanpo` Docker container.
- `docker:db:generate`: Generates Prisma client files inside the Docker container.
- `docker:db:migrate`: Runs Prisma migrations in development mode inside the Docker container.
- `docker:db:deploy`: Deploys the Prisma database schema to the database.
- `docker:db:migrate:reset`: Resets the database and runs all migrations from scratch inside the Docker container.
- `docker:db:migrate:seed`: Seeds the database using the Prisma seed script inside the Docker container.
