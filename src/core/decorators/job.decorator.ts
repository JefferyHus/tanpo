import { JOB_METADATA } from '@/constants';

export function Job(name: string): ClassDecorator {
  return (target: any) => {
    // set the new jobs
    Reflect.defineMetadata(JOB_METADATA, name, target);

    // return the target
    return target;
  };
}
