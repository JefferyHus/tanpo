# CLI

There are multiple CLI bash scripts available to assist you while using the project.

## `./init.sh`

This script initializes the project for you by creating the network, containers, installing dependencies, building the project, and running the migrations.

To run it, simply execute the following command:

```bash
./init.sh
```

You can also pass some options to the script:

- `NODE_ENV`: The environment in which to run the project. Defaults to `development`.
- `PORT`: The port on which to run the project. Defaults to `3000`.
- `MIGRATE`: Whether to run the migrations or not. Defaults to `false`.
- `MIGRATE_NAME`: The name of the migration to run. Defaults to an empty string.
- `POSTGRES_PORT`: The port to expose the Postgres container. Defaults to `5432`.

## `./doppler.sh`

This script runs the Doppler CLI tool for you. By default, it runs in the `development` environment. If the CLI tool is not already installed, it will be installed.

To run the script, simply execute the following command:

```bash
./doppler.sh
```

It will prompt you to select the project scope and then run the Doppler CLI tool. Make sure to choose the current directory as the project scope.

In the second part, it will ask you to authorize the CLI tool. You can do this by opening the provided link in your browser and then pasting the token back in the terminal.

## `./generate.sh`

This script generates a new module for you. It creates the module folder, controller, service, repository, and tests.

To run the script, simply execute the following command:

```bash
./generate.sh
```

It will prompt you to enter the name of the module. Make sure to enter it in singular form. For example, if you want to create a `users` module, you should enter `user`.

```bash
./generate.sh MODULE=user
```