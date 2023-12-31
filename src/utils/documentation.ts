import { ZodArray, ZodObject, ZodRawShape } from 'zod';

import { DocumentationOptions } from '@/core/decorators/documentation.decorator';
import { RouteMethods } from '@/core/types/express.types';
import { ErrorResponse, ResponseSchema } from '@/core/types/response.type';

export function MapKeysToTrue<T extends object>(
  keys: Array<keyof T>,
): { [K in keyof T]: true } {
  return keys.reduce<{ [K in keyof T]: true }>((accumulator, currentKey) => {
    return {
      ...accumulator,
      [currentKey]: true,
    };
  }, {} as { [K in keyof T]: true });
}

export function GenerateResponseSchema<T extends ZodRawShape>(options: {
  name: string;
  schema: ZodObject<T> | ZodArray<ZodObject<T>>;
  filters?: {
    exclude?: Array<keyof T>;
    include?: Array<keyof T>;
  };
}): ResponseSchema<ZodRawShape> {
  if (options.schema instanceof ZodObject) {
    if (options.filters) {
      if (options.filters.include) {
        options.schema = options.schema.pick(
          MapKeysToTrue(options.filters.include),
        );
      }

      if (options.filters.exclude) {
        options.schema = options.schema.omit(
          MapKeysToTrue(options.filters.exclude),
        ) as ZodObject<T>;
      }
    }
  }

  if (options.schema instanceof ZodArray) {
    console.log('This is a zod array element', options.schema.element);
  }

  return {
    200: {
      description: `${options.name} data fetched successfully.`,
      content: {
        'application/json': {
          schema: options.schema,
        },
      },
    },
    201: {
      description: `${options.name} data created successfully.`,
      content: {
        'application/json': {
          schema: options.schema,
        },
      },
    },
    400: {
      description: `Bad request.`,
      content: {
        'application/json': {
          schema: ErrorResponse,
        },
      },
    },
    401: {
      description: `Unauthorized.`,
      content: {
        'application/json': {
          schema: ErrorResponse,
        },
      },
    },
    403: {
      description: `Forbidden.`,
      content: {
        'application/json': {
          schema: ErrorResponse,
        },
      },
    },
    404: {
      description: `Not found.`,
      content: {
        'application/json': {
          schema: ErrorResponse,
        },
      },
    },
    500: {
      description: `Internal server error.`,
      content: {
        'application/json': {
          schema: ErrorResponse,
        },
      },
    },
  };
}

export function GenerateDocumentation<
  T extends ZodRawShape,
  K extends ZodRawShape,
  R extends ZodRawShape,
>(options: {
  description: string;
  name: string;
  schema: ZodObject<T> | ZodArray<ZodObject<T>>;
  path: string;
  method: RouteMethods;
  response?:
    | ZodObject<R>
    | ZodArray<ZodObject<R>>
    | {
        exclude?: Array<keyof T>;
        include?: Array<keyof T>;
      };
  body?:
    | ZodObject<K>
    | ZodArray<ZodObject<K>>
    | {
        exclude?: Array<keyof T>;
        include?: Array<keyof T>;
      };
  security?: [
    {
      [name: string]: string[];
    },
  ];
}): DocumentationOptions<ZodRawShape> {
  // If the method is GET, then the body is not required
  if (options.method === RouteMethods.GET) {
    if (options.body) {
      throw new Error(
        `The body is not required for ${options.method} requests.`,
      );
    }
  }

  // Generate the response schema
  let responses = GenerateResponseSchema({
    name: options.name,
    schema: options.schema,
  });

  if (options.response) {
    // If the response is of type ZodObject or ZodArray, then generate the response schema
    if (
      options.response instanceof ZodObject ||
      options.response instanceof ZodArray
    ) {
      responses = GenerateResponseSchema({
        name: options.name,
        schema: options.response,
      });
    }
  }

  // Initialize the documentation schema
  const documentation: DocumentationOptions<ZodRawShape> = {
    path: {
      description: options.description,
      path: options.path,
      method: options.method,
      responses: responses,
      tags: [options.name],
    },
    schema: options.schema,
  };

  // If the body exists, then add it to the documentation schema
  if (options.body) {
    documentation.path = {
      ...documentation.path,
      request: {
        body: {
          content: {
            'application/json': {
              schema: options.body,
            },
          },
        },
      },
    };
  }

  // If the security exists, then add it to the documentation schema
  if (options.security) {
    documentation.path = {
      ...documentation.path,
      security: options.security,
    };
  }

  return documentation;
}
