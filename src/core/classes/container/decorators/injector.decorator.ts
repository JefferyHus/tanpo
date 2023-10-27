import { MODULE_METADATA } from '@/constants';
import { ModuleOptions } from '@/core/types/generic.types';

export function Injector(options?: ModuleOptions): ClassDecorator {
  return function (target: any) {
    Reflect.defineMetadata(MODULE_METADATA, options, target);
  };
}
