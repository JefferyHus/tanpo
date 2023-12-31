import { z, ZodArray, ZodObject, ZodRawShape } from 'zod';

export const ErrorResponse = z.object({
  code: z.number().or(z.string()),
  cause: z.string().default('unknown'),
  message: z.string().default('something went wrong.'),
});

export type ResponseSchema<T extends ZodRawShape> = {
  [k: number]: {
    description: string;
    content?: {
      [m: string]: {
        schema: ZodObject<T> | ZodArray<ZodObject<T>>;
      };
    };
  };
};
