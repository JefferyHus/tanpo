export interface IContainer {
  get<T>(identifier: string): T;
  set<T>(identifier: string, value: T): void;

  has(identifier: string): boolean;
  remove(identifier: string): void;

  clear(): void;
}
