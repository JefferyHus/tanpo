<p align="center">
  <img src="/documentation/images/logo.png" alt="Tanpo Boilerplate Logo" width="200" height="200"/>
</p>

# API

**Introducing "Tanpo" Boilerplate: The Bedrock of Secure and Stable Development**

The "Tanpo" boilerplate, inspired by the Japanese word 担保 (Tanpo) meaning security and collateral, is engineered to offer a robust foundation for building reliable applications.

## Additional Documentation

For more detailed information on specific aspects of the "Tanpo" boilerplate, refer to the following documentation:

- [CLI](/documentation/CLI.md): Detailed instructions on using the command-line interface scripts.
- [Controller](/documentation/CONTROLLER.md): Guidelines and best practices for controller implementation.
- [Error Handling](/documentation/ERRORS.md): Guidelines and best practices for error handling.
- [SCRIPTS](/documentation/SCRIPTS.md): Detailed information on the scripts available in the `package.json` file.
- [UTILS](/documentation/UTILS.md): Detailed information on the utility functions available in the `utils` folder.

## Stack

- TypeScript
- Node.js
- Prisma 2
- PostgreSQL
- Express

## Installation

Ensure the following software is installed on your PC:

- Docker (>= 20.*)
- Node.js (>= 16.*)
- NPM (>= 8.*.*)

First, copy `.env.example` to `.env` and update values (contact @jefferyhus for keys). Set `DEBUG_MODE` in `.env` to:

```bash
- 'sentry'
- 'server'
- '*'
```

Then, run `npm install`. To build the project for Docker, use:

```bash
-> ~ npm run build
-> ~ npm run watch  # Builds and watches edits
```

Make the script `./bin/init.sh` executable:

```bash
-> ~ chmod +x ./bin/init.sh
```

Run `./bin/init.sh` to complete the setup.

## Init (Options)

`./bin/init.sh` can run migrations:

```bash
-> ~ ./bin/init.sh MIGRATE=true MIGRATE_NAME=init PORT=3000
```

### Script Options

- `NODE_ENV`: Application environment (default: development)
- `MIGRATE`: Boolean for running migrations (default: false)
- `MIGRATE_NAME`: Migration file name for Prisma
- `PORT`: Application port (default: 3000)

## Development

Work mainly in `/modules/` with the following files:

- `[module_name].module.ts`
- `[module_name].repository.ts`
- `[module_name].service.ts`
- `[module_name].controller.ts`

For detailed guidelines on module development, refer to the [CONTROLLER documentation](/documentation/CONTROLLER.md).

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
  constructor(private readonly yourService: Your Service) {}
}
```

## To-Do List

### Documentation

- [ ] Add documentation for the core features (classes, decorators, and types)
- [ ] Add service documentation
- [ ] Add repository documentation
- [ ] Add seeding scripts documentation
- [ ] Add job scheduler documentation

### Implementation

- [ ] Implement the interceptor logic
- [ ] Implement WebSocket logic
- [ ] Implement RPC logic
- [ ] Implement testing logic (add a few examples)

### Maintenance

- [ ] Clean the core folder
