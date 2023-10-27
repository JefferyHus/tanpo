import { BaseJob } from '@/core/classes/job.class';
import { IJob } from '@/core/classes/job.interface';
import { Job } from '@/core/decorators/job.decorator';

@Job('demo')
export class DemoJob extends BaseJob {
  constructor(data: IJob['data'] = {}) {
    super(
      'demo',
      {
        repeat: {
          pattern: '* * * * *',
        },
      },
      data,
    );
  }

  public async run(): Promise<void> {
    console.log('Hello World!');
  }
}
