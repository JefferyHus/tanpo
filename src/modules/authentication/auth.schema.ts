import { Request } from 'express-serve-static-core';
import { z } from 'zod';

import { RouteMethods } from '@/core/types/express.types';
import { GenerateDocumentation } from '@/utils/documentation';

// Auth Schema
export const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const AuthResponseSchema = z.object({
  token: z.string(),
});

// Auth Registration Schema
export const AuthRegisterDocumentation = GenerateDocumentation({
  description: 'Register a new user.',
  name: 'Authentication',
  schema: AuthSchema,
  response: AuthResponseSchema,
  path: '/auth/register',
  method: RouteMethods.POST,
  body: AuthSchema,
});

export type AuthRegisterRequest = Request<
  object,
  object,
  z.infer<typeof AuthSchema>
>;

// Auth Login Schema
export const AuthLoginDocumentation = GenerateDocumentation({
  description: 'Login a user.',
  name: 'Authentication',
  schema: AuthSchema,
  response: AuthResponseSchema,
  path: '/auth/login',
  method: RouteMethods.POST,
  body: AuthSchema,
});

export type AuthLoginRequest = Request<
  object,
  object,
  z.infer<typeof AuthSchema>
>;

// Auth Refresh Token Schema
export const AuthRefreshTokenDocumentation = GenerateDocumentation({
  description: 'Refresh the access token.',
  name: 'Authentication',
  schema: AuthSchema,
  response: AuthResponseSchema,
  path: '/auth/refresh-token',
  method: RouteMethods.POST,
  security: [
    {
      authorization: [],
    },
  ],
});
