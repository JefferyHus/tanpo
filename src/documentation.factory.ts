import {
  extendZodWithOpenApi,
  OpenApiGeneratorV31,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import { Application } from 'express';
import { InfoObject, OpenAPIObject } from 'openapi3-ts/dist/model/openapi31';
import SwaggerUI from 'swagger-ui-express';
import { z, ZodRawShape } from 'zod';

import schema from '@/openapi/json-schema.json';

import { AppFactory } from './app.factory';
import {
  OPENAPI_METADATA,
  OPENAPI_METHOD_RESPONSES_METADATA,
} from './constants';
import { DocumentationOptions } from './core/decorators/documentation.decorator';
import { Identifier } from './core/types/generic.types';

export class DocumentationFactory {
  private static _instance: DocumentationFactory;
  private _openapi_registry: OpenAPIRegistry | undefined;

  public static get instance(): DocumentationFactory {
    if (!DocumentationFactory._instance) {
      DocumentationFactory._instance = new DocumentationFactory();
    }

    return DocumentationFactory._instance;
  }

  public static initialize(): void {
    // extend the zod schema with the openapi schema
    extendZodWithOpenApi(z);
  }

  public create(app: Application): void {
    // initialize the openapi registry
    this.initializeOpenAPIRegistry();
    // fetch all the documentations
    const documentations = AppFactory.documentations;

    // create the openapi object
    const openapi: OpenAPIObject = DocumentationFactory.createOpenAPIObject(
      {
        summary: 'Booilerplate API',
        description:
          'The Booilerplate API documentation for our links application.',
      },
      documentations,
    );

    // initialize the documentation
    app.use('/api/docs', SwaggerUI.serve, SwaggerUI.setup(openapi));
  }

  private initializeOpenAPIRegistry() {
    this._openapi_registry = new OpenAPIRegistry();
  }

  public static createDocumentation<T>(
    identifier: Identifier<T>,
  ): DocumentationOptions<ZodRawShape>[] {
    // fetch all the documentation options from the metadata
    const documentations: DocumentationOptions<ZodRawShape>[] =
      Reflect.getMetadata(OPENAPI_METADATA, identifier);

    if (!documentations) {
      return [];
    }

    // create the openapi object for the controller
    documentations.forEach((documentation) => {
      if (!documentation.descriptor) {
        return;
      }

      // get the responses from the metadata
      const responses = Reflect.getMetadata(
        OPENAPI_METHOD_RESPONSES_METADATA,
        documentation.descriptor,
      );

      // inject the responses into the documentation
      if (responses) {
        documentation.path.responses = responses;
      }

      if (!documentation.name) {
        return;
      }
    });

    return documentations;
  }

  public static createOpenAPIObject(
    metadata: {
      summary: string;
      description: string;
    },
    options: {
      identifier: Identifier<any>;
      documentations: DocumentationOptions<ZodRawShape>[];
    }[],
  ): OpenAPIObject {
    for (const { documentations } of options) {
      // push the path into the paths object
      for (const documentation of documentations) {
        if (!documentation.path) {
          continue;
        }

        // register the path
        DocumentationFactory.instance._openapi_registry?.registerPath(
          documentation.path,
        );

        // register the definitions
        if (documentation.schema) {
          DocumentationFactory.instance._openapi_registry?.register(
            String(documentation.name),
            documentation.schema,
          );
        }
      }
    }

    if (!DocumentationFactory.instance._openapi_registry) {
      throw new Error('OpenAPI registry is not initialized');
    }

    // add the security components
    DocumentationFactory.instance._openapi_registry.registerComponent(
      'securitySchemes',
      'authorization',
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    );

    // create the openapi generator
    const generator = new OpenApiGeneratorV31(
      DocumentationFactory.instance._openapi_registry.definitions,
    );

    const docu = generator.generateDocument({
      openapi: '3.0.0',
      info: this.createInfoObject(metadata),
      servers: [
        {
          url: `${process.env.SCHEME}://${process.env.DOMAIN_NAME}`,
        },
      ],
    });

    // if the schema is defined, parse it and replace the #/definitions
    // to #/components/schemas
    if (schema) {
      // stringify the schema
      const schemaString = JSON.stringify(schema);

      // replace the definitions with components/schemas
      const replacedSchemaString = schemaString.replace(
        /#\/definitions/g,
        '#/components/schemas',
      );

      // parse the schema
      const parsedSchema = JSON.parse(replacedSchemaString);

      // add the json schema
      if (docu.components) {
        docu.components.schemas = parsedSchema.definitions;
      }
    }

    return docu;
  }

  public static createInfoObject(metadata: {
    summary: string;
    description: string;
  }): InfoObject {
    return {
      title: String(metadata.summary),
      description: metadata.description,
      version: process.env.npm_package_version ?? String(process.env.VERSION),
    };
  }
}
