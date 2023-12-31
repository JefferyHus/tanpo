import { Request } from 'express-serve-static-core';
import z from 'zod';

import { RouteMethods } from '@/core/types/express.types';
import { GenerateDocumentation } from '@/utils/documentation';

export const ProfileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export const ProfileResponseSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Profile Get Documentation
export const ProfileGetDocumentation = GenerateDocumentation({
  description: 'Get the current user profile.',
  name: 'Profile',
  schema: ProfileSchema,
  response: ProfileResponseSchema,
  path: '/profile/get',
  method: RouteMethods.GET,
  security: [
    {
      authorization: [],
    },
  ],
});

// Profile Update Documentation
export const ProfileUpdateDocumentation = GenerateDocumentation({
  description: 'Update the current user profile.',
  name: 'Profile',
  schema: ProfileSchema,
  response: ProfileResponseSchema,
  path: '/profile/update',
  method: RouteMethods.PUT,
  security: [
    {
      authorization: [],
    },
  ],
});

export type ProfileUpdateRequest = Request<
  object,
  object,
  z.infer<typeof ProfileSchema>
>;
