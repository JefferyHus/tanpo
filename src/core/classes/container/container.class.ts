import {
  Constructable,
  Identifier,
  Instance,
} from '@/core/types/generic.types';

import { IContainer } from './container.interface';

export class Container implements IContainer {
  private readonly _container: Map<Identifier, Instance<unknown>>;

  constructor() {
    this._container = new Map();
  }

  get<T>(identifier: Constructable<T> | string): T {
    return this._container.get(identifier) as T;
  }

  set<T>(identifier: Constructable<T> | string, value: T): void {
    this._container.set(identifier, value);
  }

  has<T>(identifier: Constructable<T> | string): boolean {
    return this._container.has(identifier);
  }

  remove<T>(identifier: Constructable<T> | string): void {
    this._container.delete(identifier);
  }

  clear(): void {
    this._container.clear();
  }
}
