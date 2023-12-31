# Error Handling

## Overview
Inside the `/src/core/classes/errors` folder, you'll find all the error classes used in the application. Each error class extends `BaseError`, which itself extends the native `Error` class. The `BaseError` class includes a `toJSON` method that returns a JSON object with the error's `name`, `message`, and `stack` properties, useful for sending error responses to the client.

## Error Categories
Errors are classified into three categories:

- **Entity Errors**: Thrown for issues related to entities, such as `EntityAlreadyExistsError`, `EntityNotFoundError`, and `InvalidEntityPropertyError`.
- **Session Errors**: Thrown for session-related issues, such as `SessionNotFoundError` and `SessionExpiredError`.
- **HTTP Errors**: Thrown for HTTP request issues, such as `HttpNotFoundError`, `HttpMethodNotAllowedError`, and `HttpUnprocessableEntityError`. These errors also include an additional `data` property for error context.

## Usage Contexts
- `EntityErrors` are used in service files (`src/modules/[feature]/[feature].service.ts`).
- `SessionErrors` are used in middleware files (`src/core/middlewares/session.middleware.ts`).
- `HttpErrors` are used in controller files (`src/modules/[feature]/[feature].controller.ts`).

## Error Handling Example
### Service Layer (User Creation Example)
```ts
// src/modules/user/user.service.ts
import { EntityAlreadyExistsError } from '@/core/classes/errors/entity.error';
import { UserRepository } from './user.repository';

@Service()
class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ email: data.email });

    if (user) {
      throw new EntityAlreadyExistsError('User already exists', this.constructor.name);
    }

    return this.userRepository.create(data);
  }
}
```

### Controller Layer (Error Handling)
```ts
// src/modules/user/user.controller.ts
import { EntityAlreadyExistsError } from '@/core/classes/errors';
import { HttpConflictError } from '@/core/classes/errors/http.error';

@Controller('users')
class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(request: Request): Promise<User> {
    try {
      return await this.userService.create(request.body);
    } catch (error) {
      if (error instanceof EntityAlreadyExistsError) {
        return response.status(error.status).json(error.toJSON());
      }
    }
  }
}
```

### Global Error Handler Workflow
The boilerplate includes a global error handler, which is the recommended default unless a custom formatted error response is required. This handler maintains a consistent response schema and proper formatting.

1. The handler catches any thrown error within the application.
2. It logs the error details, including request query, params, body, and headers.
3. If the error is an instance of `BaseError`, it responds with the corresponding status code and error details.
4. Prisma errors (identified by an error code starting with 'P') are handled with a `BAD_REQUEST` response.
5. Other instances of `Error` result in a `BAD_REQUEST` response with detailed information.
6. If the error doesn't fit the above categories, an `INTERNAL_SERVER_ERROR` response is sent.

This global error handler ensures that all errors are processed uniformly, providing clear and informative feedback to the client.