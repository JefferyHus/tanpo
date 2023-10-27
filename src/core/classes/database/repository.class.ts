import { Prisma, PrismaClient } from '@prisma/client';
import { Service } from 'typedi';

export type Collection<T> = {
  findUnique: (query: FilterQuery<T>) => Promise<T>;
  findUniqueOrThrow: (query: FilterQuery<T>) => Promise<T>;
  findMany: (query: FilterQuery<T>) => Promise<T[]>;
  create: (data: T) => Promise<T>;
  createMany: (data: T[]) => Promise<T[]>;
  delete: (query: FilterQuery<T>) => Promise<T>;
  update: (query: FilterQuery<T>, data: UpdateQuery<T>) => Promise<T>;
  deleteMany: (query: FilterQuery<T>) => Promise<T>;
  updateMany: (query: FilterQuery<T>, data: UpdateQuery<T>) => Promise<T>;
};

export type FilterQuery<T> = {
  [P in keyof T]?: T[P] | RegExp | { $regex: RegExp };
};

export type UpdateQuery<T> = {
  [P in keyof T]?: T[P] | { $set: T[P] };
};

export type SortQuery<T> = {
  [P in keyof T]?: 1 | -1;
};

export type WhereInput<T> = {
  AND?: Prisma.Enumerable<T>;
  OR?: Prisma.Enumerable<T>;
  NOT?: Prisma.Enumerable<T>;
};

export type Args<T> = {
  take?: number;
  skip?: number;
  where?: WhereInput<T> & FilterQuery<T>;
};

export type Select<T> = Partial<{
  [K in keyof T]: boolean;
}>;

type Include<T> = {
  [key: string]: {
    select?: T | null;
    include?: Include<T> | null;
  };
};

type SortOrderValue = 'asc' | 'desc';

type OrderByWithRelationInput<T> = {
  [K in keyof T]?: SortOrderValue;
};

type ExcludeNull<T> = Exclude<T, null>;

type UniqueInput<T extends Record<keyof T, unknown>> = {
  [K in keyof T]?: ExcludeNull<T[K]> | undefined;
};

export type WhereUniqueInput<T extends Record<keyof T, unknown>> =
  UniqueInput<T>;

export type ManyArgs<T> = {
  select?: Select<T> | null;
  include?: Include<T> | null;
  where?: WhereUniqueInput<T> & WhereInput<T>;
  orderBy?: OrderByWithRelationInput<T>;
  cursor?: WhereUniqueInput<T>;
  take?: number;
  skip?: number;
  distinct?: any;
};

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
  abstract update<K>(query: FilterQuery<T>, data: UpdateQuery<K>): Promise<T>;
}
