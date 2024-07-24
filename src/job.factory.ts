import { Job, Queue, RepeatableJob, Worker } from 'bullmq';
import Container from 'typedi';

import { JOB_METADATA, MODULE_METADATA } from './constants';
import { BaseJob } from './core/classes/job.class';
import { LogLevelsEnum } from './core/classes/logger/logger.types';
import {
  Constructable,
  Identifier,
  Instance,
} from './core/types/generic.types';
import { logger } from './utils/logger';

export class JobFactory {
  private static _instance: JobFactory;
  private _queue: Queue;
  private _worker: Worker;
  private _jobs: RepeatableJob[] = [];

  private constructor() {
    this._queue = new Queue('jobs', {
      connection: {
        host: String(process.env.REDIS_HOST),
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    });
    this._worker = new Worker(
      'jobs',
      async (job: Job) => {
        try {
          // get the job instance
          const jobInstance = Container.get<BaseJob>(job.name);

          if (!jobInstance) {
            throw new Error(`Job ${job.name} not found`);
          }

          await jobInstance.run();
        } catch (error) {
          // remove the job from the queue
          await job.remove();

          logger(LogLevelsEnum.ERROR, 'Failed to run job', {
            error,
          });
        }
      },
      {
        connection: {
          host: String(process.env.REDIS_HOST),
          port: Number(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD,
        },
      },
    );
  }

  public get queue(): Queue {
    return this._queue;
  }

  public get worker(): Worker {
    return this._worker;
  }

  public static get instance(): JobFactory {
    if (!JobFactory._instance) {
      JobFactory._instance = new JobFactory();
    }

    return JobFactory._instance;
  }

  public get jobs(): RepeatableJob[] {
    return JobFactory.instance._jobs;
  }

  public create<T>(identifier: Identifier<T>): Promise<Instance<T>> {
    if (typeof identifier === 'string') {
      throw new Error(`Cannot create an instance of a string`);
    }

    return this.createInstance(identifier);
  }

  private async createInstance<T>(
    identifier: Constructable<T>,
  ): Promise<Instance<T>> {
    // get repeatable jobs
    this._jobs = await this.queue.getRepeatableJobs();

    const jobs = this.resolveJobs(identifier);

    const instance = new identifier(...jobs) as Instance<T>;

    return instance;
  }

  private resolveJobs<T>(identifier: Identifier<T>): Instance<T>[] {
    // get all jobs from the metadata
    try {
      const { jobs } = Reflect.getMetadata(MODULE_METADATA, identifier);

      if (!jobs) {
        return [];
      }

      return jobs.map(async (job: Constructable<BaseJob>) => {
        const name = Reflect.getMetadata(JOB_METADATA, job);
        const instance = new job();

        // make sure the job has a unique identifier
        if (!name) {
          throw new Error(`Job ${job.name} does not have a unique identifier`);
        }

        // ensure the job key is unique
        instance.options.jobId = name;
        instance.options.repeatJobKey = name;

        // check if the job is already in the queue
        for (const job of this._jobs) {
          if (job.name === name) {
            // check if they have different patterns
            // then remove the old job and add the new one
            await this.queue.removeRepeatableByKey(job.key);
          }
        }

        // if the job context is set to default
        // then add the job to the queue
        if (instance.runtime === 'default') {
          // add the job to the queue
          this.queue
            .add(name, instance.data, instance.options)
            .catch((e) =>
              logger(LogLevelsEnum.ERROR, `CRON JOB Error: ${e.message}`),
            );
        }

        // add the instance to the container
        Container.set(name, instance);

        return instance;
      });
    } catch (error) {
      logger(LogLevelsEnum.ERROR, 'Error resolving jobs', {
        error,
      });
    }

    return [];
  }

  public getJob(name: string): BaseJob {
    // only return the job if it exists
    // and its context is set to render
    if (!Container.has(name)) {
      throw new Error(`Job ${name} not found`);
    }

    const job = Container.get<BaseJob>(name);

    if (job.runtime !== 'render') {
      throw new Error(`Job ${name} is not a render job`);
    }

    return job;
  }
}
