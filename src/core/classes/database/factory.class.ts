import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { Service } from 'typedi';

@Service()
export abstract class Factory<T> {
  // TODO: implement a way to return the created instances
  private returning: Awaited<T>[] = [];
  protected readonly faker = faker;

  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly collection: string,
  ) {}

  protected abstract attributes(): Promise<Partial<T>>;
  protected abstract beforeCreate(data: Partial<T>): Promise<void>;
  protected abstract afterCreate(data: number): Promise<void>;

  public async create(count = 1): Promise<void> {
    for (let i = 0; i < count; i++) {
      const data = await this.attributes();

      // call the beforeCreate hook
      await this.beforeCreate(data);

      const columns = Prisma.join(
        Object.keys(data).map((column) => Prisma.raw(`${column}`)),
      );
      const values = Prisma.join(
        Object.values(data).map((value) => {
          if (typeof value === 'string') {
            return Prisma.raw(`'${value}'`);
          }

          return Prisma.raw(`${value}`);
        }),
      );

      const query = Prisma.sql`INSERT INTO ${Prisma.raw(
        this.collection,
      )} (${columns}) VALUES (${values})`;

      const created = await this.prisma.$executeRaw<T>(query);

      // call the afterCreate hook
      await this.afterCreate(created);
    }
  }
}
