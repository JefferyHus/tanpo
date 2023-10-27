import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// extend the zod schema with the openapi schema
extendZodWithOpenApi(z);

// Authorization schemas
export const AuthorizationSchema = z.string().openapi({
  param: {
    in: 'header',
    name: 'Authorization',
    description: 'Identity authorization token',
    required: true,
    example: 'Bearer <token>',
  },
});
