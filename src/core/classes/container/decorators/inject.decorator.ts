import { PARAMTYPES_METADATA, SELF_DECLARED_DEPS_METADATA } from '@/constants';
import { Constructable } from '@/core/types/generic.types';

export function Inject<T = any>(
  token?: Constructable<T>,
): ParameterDecorator | PropertyDecorator {
  return function (target: object, key: string | symbol, index?: number): void {
    const type = token || Reflect.getMetadata('design:type', target, key);

    // if the type is undefined, then throw an error
    if (type === undefined) {
      throw new Error('Cannot determine type');
    }

    // if the index is undefined, it means that the decorator
    // is used on a property
    if (index === undefined) {
      // check if the property has already been decorated
      const dependencies =
        Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, target) || [];

      // add the dependency to the list of dependencies
      Reflect.defineMetadata(
        SELF_DECLARED_DEPS_METADATA,
        [...dependencies, type],
        target,
      );

      return;
    }

    // check if the property has already been decorated
    const paramtypes =
      Reflect.getMetadata(PARAMTYPES_METADATA, target, key) || [];

    // add the dependency to the list of dependencies
    Reflect.defineMetadata(
      PARAMTYPES_METADATA,
      [...paramtypes, type],
      target,
      key,
    );
  };
}
