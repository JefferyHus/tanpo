# API

Boilerplate API

## Stack

- TypeScript
- Node.js
- Prisma 2
- PostgreSQL
- Express

## Installation

To setup this repository you have first to make sure that you have these softwares installed in your pc:

- Docker (>= 20.*)
- Node.js (>= 16.*)
- NPM (>= 8.*.*)

After installing all the above softwares, move then to prepare your local environment. First, copy the `.env.example` to `.env` and replace the dummy values with the appropriate ones _(connect with @jefferyhus to get the keys)_

You can activate debug mode on/off or only for some setups, by setting up `DEBUG_MODE` inside your `.env` file to one of these values

```bash
- 'sentry:*',
- 'server:*',
- '*',
```

The second step will be by running the `npm install` installation, once npm has finished installing all the packages, it is then time to build the project for docker to pick it up locally, to do so just run one of the following commands _(optional)_:

```bash
-> ~ npm run build
-> ~ npm run watch _(this one will build and watch the edits)_
```

Finally, you then will have to make the bash script located in the root path of the project `/.init.sh`, executable by running this command line **(The script builds the project for you and installs all packages)**

```bash
-> ~ chmod +x .init.sh
```

Once done, you can then just run the script and it will take care of the rest `./.init.sh`.

## Init (options)

The `.init.sh` script can be used to also run migrations as part of the setup, all you have to do is by passing these options like this:

```bash
-> ~ ./.init.sh MIGRATE=true MIGRATE_NAME=init PORT=3000
```

### Script options

```text
- NODE_ENV: the application environment (default: development)
- MIGRATE: this value is of type boolean, set tri if you want to run migrations (default: false)
- MIGRATE_NAME: this is the migration file name that prisma will generate upon migrating the database
- PORT: this the application port (default: 3000)
```

## Contributing

The main folder you should be contributing to is `/modules/`, inside the folder you will have to create these files:

- `[module_name].module.ts`
- `[module_name].repository.ts`
- `[module_name].service.ts`
- `[module_name].controller.ts`

### Syntax

**`[module_name].module.ts`**

```typescript
@Injector({
  dependencies: ['Services'],
  controllers: ['Controllers'],
})
export class YourModule {}
```

**`[module_name].repository.ts`**

```typescript
@Service()
export class YourRepository extends Repository<YourEntity> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'table_name');
  }
}
```

**`[module_name].service.ts`**

```typescript
@Service()
export class YourService {
  constructor(private readonly your: YourRepository) {}
}
```

**`[module_name].controller.ts`**

```typescript
@Service()
@Controller('/path')
export class YourController {
  constructor(private readonly yourService: YourService) {}
}
