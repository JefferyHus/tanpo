export abstract class Factory {
  private static _instances: Map<string, any> = new Map<string, any>();

  constructor() {
    this.init();
  }

  init() {
    // Override this method to initialize the instance
  }

  public static get<T>(type: { new (...args: any[]): T }): T {
    if (!this._instances.has(type.name)) {
      this._instances.set(type.name, new type());
    }

    return this._instances.get(type.name);
  }

  public static set<T>(type: { new (...args: any[]): T }, instance: T): void {
    this._instances.set(type.name, instance);
  }

  public static save<T>(type: { new (...args: any[]): T }, instance: T): void {
    this._instances.set(type.name, instance);
  }

  public static reset(): void {
    this._instances.clear();
  }
}
