import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';

import { FilterQuery, ManyArgs, UpdateQuery } from './types';

@Service()
export abstract class Repository<T> {
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly collection: string,
  ) {}

  abstract findUnique(query: FilterQuery<T>): Promise<T | null>;
  abstract findUniqueOrThrow(query: FilterQuery<T>): Promise<T>;
  abstract findMany(args?: ManyArgs<T>): Promise<T[]>;
  abstract create(data: T): Promise<T>;
  abstract delete(query: FilterQuery<T>): Promise<T>;
  abstract update(query: FilterQuery<T>, data: UpdateQuery<T>): Promise<T>;
}
