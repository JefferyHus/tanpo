import express, { Application } from 'express';
import Container from 'typedi';
import { ZodRawShape } from 'zod';
import { MODULE_METADATA, ROUTER_PATH_METADATA } from './constants';
import { DocumentationOptions } from './core/decorators/documentation.decorator';
import { Identifier, Instance } from './core/types/generic.types';
import { DocumentationFactory } from './documentation.factory';
import { RouterFactory } from './router.factory';

export class AppFactory {
  private static _app: Application;
  private static _instance: AppFactory;
  private static _documentations: {
    identifier: Identifier<any>;
    documentations: DocumentationOptions<ZodRawShape>[];
  }[] = [];

  public static get instance(): AppFactory {
    if (!AppFactory._instance) {
      AppFactory._instance = new AppFactory();
    }

    return AppFactory._instance;
  }

  public static get app(): Application {
    if (!AppFactory._app) {
      AppFactory._app = express();
    }

    return AppFactory._app;
  }

  public static get documentations(): {
    identifier: Identifier<any>;
    documentations: DocumentationOptions<ZodRawShape>[];
  }[] {
    return AppFactory._documentations;
  }

  public create<T>(identifier: Identifier<T>): Instance<T> {
    if (typeof identifier === 'string') {
      throw new Error(`Cannot create an instance of a string`);
    }

    return this.createInstance(identifier);
  }

  private createInstance<T>(identifier: Identifier<T>): Instance<T> {
    if (typeof identifier === 'string') {
      return this.create(identifier);
    }

    if (Container.has(identifier)) {
      return Container.get(identifier) as Instance<T>;
    }

    const dependencies = this.resolveDependencies(identifier);
    const controllers = this.resolveControllers(identifier);

    const instance = new identifier(
      ...dependencies,
      ...controllers,
    ) as Instance<T>;

    // set the instance to the container
    Container.set(identifier, instance);

    return instance;
  }

  private resolveDependencies<T>(identifier: Identifier<T>): Instance<T>[] {
    const { dependencies } = Reflect.getMetadata(MODULE_METADATA, identifier);

    if (!dependencies) {
      return [];
    }

    return dependencies.map((dependency: Identifier) => {
      return this.createInstance(dependency);
    });
  }

  private resolveControllers<T>(identifier: Identifier<T>): Instance<T>[] {
    const { controllers } = Reflect.getMetadata(MODULE_METADATA, identifier);

    if (!controllers) {
      return [];
    }

    return controllers.map((controller: Identifier) => {
      const instance = this.createInstance(controller);

      // resolve the router and bind the controller's methods to the controller
      const router = RouterFactory.create(controller);
      const router_path = Reflect.getMetadata(ROUTER_PATH_METADATA, controller);

      // generate the documentation for the controller
      const documentation =
        DocumentationFactory.createDocumentation(controller);

      // push the documentation to the documentations array
      if (Array.isArray(documentation) && documentation.length > 0) {
        AppFactory._documentations.push({
          identifier: controller,
          documentations: documentation,
        });
      }

      // bind the router to the application
      AppFactory.app.use(router_path, router);

      return instance;
    });
  }
}
