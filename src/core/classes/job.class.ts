import { IJob } from './job.interface';

export abstract class BaseJob implements IJob {
  public name: string;
  public options: IJob['options'];
  public data: IJob['data'];
  public runtime: IJob['runtime'];

  constructor(
    name: string,
    options: IJob['options'],
    data: IJob['data'] = {},
    runtime: IJob['runtime'] = 'default',
  ) {
    this.name = name;
    this.options = options;
    this.data = data;
    this.runtime = runtime;
  }

  public abstract run(): Promise<void>;
}
