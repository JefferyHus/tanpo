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

- Controllers should be as thin as possible. They should only be responsible for handling the requests and responses of a resource.
- Controllers should not have any business logic. They should only call the service methods.
- Controllers should not have any database logic. They should only call the service methods.
- Controllers should not have any validation logic. They should only call the service methods.
- Controllers should always be decorated with the `@Service` decorator. This will allow the controller to be injected with the service instance.
- Controllers methods should always throw an error if something goes wrong. This will allow the error handler to catch the error and send the appropriate response.
- Controllers methods should use the http status codes to send the appropriate response.