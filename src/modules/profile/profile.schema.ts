import { DocumentationOptions } from '@/core/decorators/documentation.decorator';
import z, { ZodRawShape } from 'zod';

export const ProfileSchema = z.object({});

export const ProfileGetDocumentation: DocumentationOptions<ZodRawShape> = {
  path: {
    description:
      'This endpoint will fail to execute and returns a 400 with a json object.',
    method: 'get',
    path: '/profile/get',
    responses: {
      400: {
        description: 'Failed to execute',
        content: {
          'application/json': {
            schema: z.object({}),
          },
        },
      },
      200: {
        description: 'Returns a json object with a message',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      }
    },
    tags: ['Profiles'],
  },
  schema: z.object({}),
}