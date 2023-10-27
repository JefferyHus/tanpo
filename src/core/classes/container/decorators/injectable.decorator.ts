import { INJECTABLE_METADATA } from '@/constants';

export function Injectable(): ClassDecorator {
  return function (target: object): void {
    Reflect.defineMetadata(INJECTABLE_METADATA, true, target);
  };
}
