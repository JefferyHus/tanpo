# Utility Functions Documentation

## Overview
This documentation covers utility functions designed for enhancing response schema generation and API documentation using Zod and custom implementations. These utilities simplify the creation of structured and clear API documentation, ensuring consistency and clarity in the API's interface.

## Functions

### `MapKeysToTrue`
- **Purpose**: Creates an object where each key from the input array is mapped to `true`.
- **Usage Example**:
  ```typescript
  import { MapKeysToTrue } from '@/path/to/utils';

  const keys = ['name', 'email'];
  const result = MapKeysToTrue(keys);
  // Output: { name: true, email: true }
  ```

### `GenerateResponseSchema`
- **Purpose**: Generates a response schema for API endpoints using Zod schemas.
- **Usage Example**:
  ```typescript
  import z from '@/openapi/default';
  import { GenerateResponseSchema } from '@/path/to/utils';

  const UserSchema = z.object({ name: z.string(), email: z.string() });
  const responseSchema = GenerateResponseSchema({
    name: 'User',
    schema: UserSchema,
  });
  ```

### `GenerateDocumentation`
- **Purpose**: Automates the generation of API documentation, including request and response schemas.
- **Usage Example**:
  ```typescript
  import z from '@/openapi/default';
  import { GenerateDocumentation, RouteMethods } from '@/path/to/utils';

  const UserSchema = z.object({ name: z.string(), email: z.string() });
  const documentation = GenerateDocumentation({
    description: 'Create a new user',
    name: 'User',
    schema: UserSchema,
    path: '/users',
    method: RouteMethods.POST,
    body: UserSchema,
  });
  ```

## Best Practices

- Use `MapKeysToTrue` for selectively including or excluding fields in Zod schemas.
- Utilize `GenerateResponseSchema` to standardize API responses, ensuring consistency across different endpoints.
- Leverage `GenerateDocumentation` for comprehensive API documentation, covering all aspects of request and response handling.