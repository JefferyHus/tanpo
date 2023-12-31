import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { ZodArray, ZodObject, ZodRawShape } from 'zod';

import { OPENAPI_METADATA } from '@/constants';

export type DocumentationOptions<T extends ZodRawShape> = {
  path: RouteConfig;
  schema: ZodObject<T> | ZodArray<ZodObject<T>>;
  name?: string;
  descriptor?: PropertyDescriptor;
};

export function Documentation<T extends ZodRawShape>(
  options: DocumentationOptions<T>,
): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    // fetch all the documentation options from the metadata
    const metadata: DocumentationOptions<T>[] =
      Reflect.getMetadata(OPENAPI_METADATA, target.constructor) ?? [];

    // push the new documentation options
    metadata.push({
      ...options,
      descriptor,
      name: options.name ?? String(propertyKey),
    });

    Reflect.defineMetadata(OPENAPI_METADATA, metadata, target.constructor);

    return descriptor;
  };
}
