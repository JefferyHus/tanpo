# Error Handling

Inside the `/src/core/classes/errors` folder you will find all the error classes that are used in the application. Each error class extends the `BaseError` class, which is a custom error class that extends the native `Error` class.

The `BaseError` class has a `toJSON` method that returns a JSON object with the error's `name`, `message` and `stack` properties. This is useful when you want to send an error response to the client. This should be done your last resort, as you should always try to handle errors in the application and return a proper response to the client.

Error are classified in 3 categories:

- **Entity Errors**: These errors are thrown when an entity is not found or when an entity is not valid. For example, when you try to create a new user with an email that already exists in the database, an `EntityAlreadyExistsError` is thrown. When you try to update a user that does not exist in the database, an `EntityNotFoundError` is thrown. When you try to create a new user with an invalid email, an `InvalidEntityPropertyError` or `InvalidEntityPropertyStateError` is thrown.

- **Session Errors**: These errors are thrown when a session is not valid. For example, when you try to access a protected route without a valid session, a `SessionNotFoundError` is thrown. When you try to access a protected route with an expired session, a `SessionExpiredError` is thrown.

- **HTTP Errors**: These errors are thrown when a request is not valid. For example, when you try to access a route that does not exist, a `HttpNotFoundError` is thrown. When you try to access a route with a method that is not allowed, a `HttpMethodNotAllowedError` is thrown. When you try to access a route with a body that is not valid, a `HttpUnprocessableEntityError` is thrown. This type of erro has also an additional `data` property that contains the error context.

The above error categories can be used in different contexts. The `EntityErrors` are used in the `src/modules/[feature]/[feature].service.ts` files. The `SessionErrors` are used in the `src/core/middlewares/session.middleware.ts` file. The `HttpErrors` are used in the `src/modules/[feature]/[feature].controller.ts` file.

## Error Handling Example

Let's say that you want to create a new user with an email that already exists in the database. The `src/modules/user/user.service.ts` file will throw an `EntityAlreadyExistsError` error.

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

The `src/modules/user/user.controller.ts` file will catch the error and send a response to the client.

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
      if (error instanceof EntityAlreadyExistsError) { // <-- This is the important part, it can be any error class or even just the BaseError class. This part will be taken care of by the error handler.
        return response.status(error.status).json(error.toJSON());
      }
    }
  }
}
```