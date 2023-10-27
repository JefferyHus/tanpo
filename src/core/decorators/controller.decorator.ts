import { ROUTER_PATH_METADATA } from '@/constants';

export function Controller(path: string): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(ROUTER_PATH_METADATA, path, target);
  };
}
