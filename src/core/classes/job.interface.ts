import { JobsOptions } from 'bullmq';

export interface IJob {
  name: string;
  options: JobsOptions;
  data: {
    [key: string]: unknown;
  };
  runtime: 'default' | 'render';
}
