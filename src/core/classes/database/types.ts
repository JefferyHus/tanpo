// Basic building blocks
export type SortOrderValue = 'asc' | 'desc';

export type ExcludeNull<T> = Exclude<T, null>;

export type NonNullableProperties<T> = {
  [K in keyof T]: ExcludeNull<T[K]>;
};

// Query-related types
export type WhereUniqueInput<T> = NonNullableProperties<T>;

export type WhereInput<T> = {
  AND?: WhereInput<T> | WhereInput<T>[];
  OR?: WhereInput<T>[];
  NOT?: WhereInput<T> | WhereInput<T>[];
};

export type FilterQuery<T> = WhereUniqueInput<T> & WhereInput<T>;

export type UpdateQuery<T> = {
  [P in keyof T]?: T[P];
};

export type SortQuery<T> = {
  [P in keyof T]?: 1 | -1;
};

export type OrderByWithRelationInput<T> = {
  [K in keyof T]?: SortOrderValue;
};

// Selection and inclusion types
export type Select<T> = Partial<{
  [K in keyof T]: boolean;
}>;

export type Include<T> = {
  [key: string]: {
    select?: T | null;
    include?: Include<T> | null;
  };
};

// Argument types for operations
export type Args<T> = {
  take?: number;
  skip?: number;
  where?: FilterQuery<T>;
};

export type ManyArgs<T> = {
  select?: Select<T> | null;
  include?: Include<T> | null;
  where?: WhereInput<T>;
  orderBy?: OrderByWithRelationInput<T>;
  cursor?: WhereInput<T> & WhereUniqueInput<T>;
  take?: number;
  skip?: number;
  distinct?: any;
};
