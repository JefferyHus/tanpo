# CLI

There are multiple CLI bash scripts available to assist you while using the project. These scripts are organized under the `bin` folder.

## `./bin/init.sh`

This script initializes the project for you by creating the network, containers, installing dependencies, building the project, and running the migrations.

To run it, execute the following command:

```bash
./bin/init.sh
```

You can also pass some options to the script:

- `NODE_ENV`: The environment in which to run the project. Defaults to `development`.
- `PORT`: The port on which to run the project. Defaults to `3000`.
- `MIGRATE`: Whether to run the migrations or not. Defaults to `false`.
- `MIGRATE_NAME`: The name of the migration to run. Defaults to an empty string.
- `POSTGRES_PORT`: The port to expose the Postgres container. Defaults to `5432`.

## `./bin/doppler.sh`

This script runs the Doppler CLI tool for you. It defaults to running in the `development` environment. If the CLI tool is not installed, it will be installed.

To run the script, execute the following command:

```bash
./bin/doppler.sh
```

It will prompt you to select the project scope and then run the Doppler CLI tool. Choose the current directory as the project scope.

In the second part, it will ask you to authorize the CLI tool. Do this by opening the provided link in your browser and pasting the token back into the terminal.

## `./bin/generate.sh`

This script generates a new module for you. It creates the module folder, controller, service, repository, and tests, and accepts arguments for module name and attributes.

To run the script, execute the following command:

```bash
./bin/generate.sh -n MODULE_NAME -a ATTRIBUTES
```

For example, to create a module named `module_b` with attributes `id` (integer type) and `name` (string type), you would run:

```bash
./bin/generate.sh -n module_b -a id:int;name:string;
```

**NOTE:** The module name should be in `snake_case` and the attributes should be separated by a semicolon (`;`). The type should be separated from the name by a colon (`:`).