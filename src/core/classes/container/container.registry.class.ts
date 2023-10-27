import { PARAMTYPES_METADATA } from '@/constants';
import { Constructable } from '@/core/types/generic.types';
import { Container } from './container.class';
import { ContainerIdentifier } from './types/container.identifier';

export class ContainerRegistry {
  private static _instance: ContainerRegistry;
  private static _container_map: Map<ContainerIdentifier, Container>;

  private constructor() {
    ContainerRegistry._container_map = new Map();

    // set the default container
    ContainerRegistry._container_map.set('default', new Container());
  }

  public static get instance(): ContainerRegistry {
    if (!ContainerRegistry._instance) {
      ContainerRegistry._instance = new ContainerRegistry();
    }

    return ContainerRegistry._instance;
  }

  public get container(): Container {
    const container = ContainerRegistry._container_map.get('default');

    if (!container) {
      throw new Error('Container not found');
    }

    return container;
  }

  public set container(container: Container) {
    ContainerRegistry._container_map.set('default', container);
  }

  public getContainer<T>(target: Constructable<T> | string): Container {
    const name = typeof target === 'string' ? target : target.name;

    const container = ContainerRegistry._container_map.get(name);

    if (!container) {
      throw new Error('Container not found');
    }

    return container;
  }

  public setContainer(name: string, container: Container): void {
    // check if the default container is already set
    if (name === 'default' && ContainerRegistry._container_map.has('default')) {
      throw new Error('Default container already set');
    }

    if (ContainerRegistry._container_map.has(name)) {
      throw new Error('Container already set');
    }

    ContainerRegistry._container_map.set(name, container);
  }

  public hasContainer(name: string): boolean {
    return ContainerRegistry._container_map.has(name);
  }

  public removeContainer(name: string): void {
    const container = ContainerRegistry._container_map.get(name);

    if (!container) {
      throw new Error('Container not found');
    }

    ContainerRegistry._container_map.delete(name);

    // clear the container
    container.clear();
  }

  public resolve<T>(target: Constructable<T>): T {
    const instance = this.container.get(target);

    if (instance) {
      return instance;
    }

    const dependencies = Reflect.getMetadata(PARAMTYPES_METADATA, target) || [];

    const params = dependencies.map(
      (dependency: { key: string; type: Constructable<any> }) => {
        return this.resolve(dependency.type);
      },
    );

    const new_instance = new target(...params);

    this.container.set(target, new_instance);

    return new_instance;
  }
}
