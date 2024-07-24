import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import Container from 'typedi';

import { AppFactory } from '@/app.factory';
import { AppModule } from '@/app.module';
import { httpErrorHandler, logger } from '@/utils/logger';

import { LogLevelsEnum } from './core/classes/logger/logger.types';
import { DocumentationFactory } from './documentation.factory';
import { JobFactory } from './job.factory';
import { LoggingFactory } from './logging.factory';
import { RedisFactory } from './redis.factory';

export function bootstrap(prisma: PrismaClient) {
  // register the prisma client in the container
  Container.set(PrismaClient, prisma);

  // initialize the documentation extension
  DocumentationFactory.initialize();

  // get the app instance
  const app = AppFactory.app;

  // create the logger
  LoggingFactory.create();

  // morgan tracing middleware
  app.use(LoggingFactory.morgan());

  // register middlewares
  app.set('trust proxy', 1); // trust first proxy
  app.use(
    cors({
      origin: (origin, callback) => {
        const regex_whitelist = process.env.CORS_ORIGIN?.split(',');

        if (!origin) {
          return callback(null, true);
        }

        if (regex_whitelist) {
          if (
            regex_whitelist.some((pattern) => new RegExp(pattern).test(origin))
          ) {
            return callback(null, true);
          }
        }

        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    }),
  );
  app.use(helmet());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );

  // create the app module
  AppFactory.instance.create(AppModule);

  // create the redis client
  RedisFactory.create();

  // start the server
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });

  // handle unhandled promise rejections
  process.on('unhandledRejection', (error) => {
    logger(LogLevelsEnum.ERROR, 'Unhandled promise rejection', {
      error,
    });

    process.exit(1);
  });

  // handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger(LogLevelsEnum.ERROR, 'Uncaught exception', {
      error,
    });

    process.exit(1);
  });

  // version
  app.get('/', (request, response) => {
    response.send(`version: ${process.env.npm_package_version}`);
  });

  // health check
  app.get('/health', (request, response) => {
    response.send('OK');
  });

  // the error handler must be before any other error middleware and after all controllers
  LoggingFactory.express();

  // the error handler must be after all other error middleware and after the routes
  app.use(httpErrorHandler());

  // bootstrap the job factory
  JobFactory.instance.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    DocumentationFactory.instance.create(app);
  }

  // return the app instance
  return app;
}
