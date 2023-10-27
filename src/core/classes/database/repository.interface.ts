export interface IRepository<T> {
  findOne(id: number): Promise<T>;
  findOneByField(field: string, value: string): Promise<T>;
  findAll(): Promise<T[]>;
  findMany(ids: number[]): Promise<T[]>;
  findManyByField(field: string, value: string): Promise<T[]>;
  create(data: T): Promise<T>;
  update(id: number, data: T): Promise<T>;
  delete(id: number): Promise<T>;
}
