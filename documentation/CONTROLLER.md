# Controllers

A controller is the representation of a resource. It is responsible for handling the requests and responses of a resource.

Each controller should be placed in the `src/modules/[feature]/` directory. It should also be named with the suffix `Controller` and implements the `@Controller` decorator.

```ts
import { Controller } from '@core/decorators/controller.decorator';

@Controller('users')
export class UsersController {}
```

## Methods

A controller can have multiple methods. Each method should be decorated with the `@Method` decorator.

```ts
import { Controller } from '@core/decorators/controller.decorator';
import { Get } from '@core/decorators/routers/get.decorator';

@Controller('users')
export class UsersController {
  @Get('/')
  public async index() {}
}
```

## Middlewares

A controller can have multiple middlewares. Each middleware should be decorated with the `@Middleware` decorator.

```ts
import { Controller } from '@core/decorators/controller.decorator';
import { Get } from '@core/decorators/routers/get.decorator';
import { Middleware } from '@core/decorators/middleware.decorator';
import { Authenticated } from '@/middlewares/authenticated';

@Controller('users')
export class UsersController {
  @Get('/')
  @Middleware(Authenticated())
  public async index() {}
}
```

## Schema Validation

A controller can have multiple schema validations. Each schema validation should be decorated with the `@Middleware` decorator.

```ts
import { Controller } from '@core/decorators/controller.decorator';
import { Get } from '@core/decorators/routers/get.decorator';
import { Middleware } from '@core/decorators/middleware.decorator';
import { Authenticated } from '@/middlewares/authenticated';
import { SchemaValidation } from '@core/middlewares/schema.validation';
import { UserSchema } from '@/schemas/user.schema';

@Controller('users')
export class UsersController {
  @Get('/')
  @Middleware(Authenticated(), SchemaValidation(UserSchema))
  public async index() {}
}
```

## Request

The request object is an instance of the `Request` class from the `express` package.

```ts
import { Controller } from '@core/decorators/controller.decorator';
import { Get } from '@core/decorators/routers/get.decorator';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  @Get('/')
  public async index(request: Request) {}
}
```

## Response

The response object is an instance of the `Response` class from the `express` package.

```ts
import { Controller } from '@core/decorators/controller.decorator';
import { Get } from '@core/decorators/routers/get.decorator';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  @Get('/')
  public async index(request: Request, response: Response) {}
}
```

## Documentation

The controller methods can be documented using the `@Documetation` decorator.

```ts
import { Controller } from '@core/decorators/controller.decorator';
import { Get } from '@core/decorators/routers/get.decorator';
import { Request, Response } from 'express';
import { Documentation } from '@core/decorators/documentation.decorator';
import { UserSchema } from '@/schemas/user.schema';

@Controller('users')
export class UsersController {
  @Get('/')
  @Documentation({
    path: {
      method: 'get',
      path: '/user/',
      responses: {
        200: {
          description: 'User',
          content: {
            'application/json': {
              schema: UserSchema,
            },
          },
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },
    schema: UserSchema,
  })
  public async index(request: Request, response: Response) {}
}
```

## Best Practices

1. **Controllers Should Be Thin**: Controllers should be as thin as possible, focusing primarily on handling the requests and responses for a resource. They should delegate business and database logic to other layers, such as services.

2. **No Business Logic in Controllers**: Controllers should not contain business logic. Instead, they should call methods from the service layer, where business logic is handled.

3. **No Database Logic in Controllers**: Controllers should not include database logic. Database interactions should be managed by the service layer or data access layers.

4. **Limited Validation Logic in Controllers**: Controllers should handle basic request validation, such as checking the presence of required fields. More complex validation should be delegated to the service layer or specialized middleware.

5. **Appropriate Use of Decorators**: Controllers should be decorated with `@Service` decorator which is generally used for dependency injection.

6. **Error Handling in Controller Methods**: Controllers should handle errors gracefully. While they can throw errors, they should do so in a manner consistent with the application's overall error handling strategy, allowing global error handlers to catch and process these errors effectively.

7. **Use HTTP Status Codes Appropriately**: Controller methods should use HTTP status codes effectively to indicate the outcome of a request, such as `200 OK` for successful requests, `404 Not Found` for missing resources, and `500 Internal Server Error` for server errors.