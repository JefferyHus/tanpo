import { Prisma, PrismaClient, Role } from '@prisma/client';
import { Service } from 'typedi';

import { Repository } from '@/core/classes/database/repository.class';
import { ManyArgs } from '@/core/classes/database/types';

@Service()
export class RoleRepository extends Repository<Role> {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma, 'role');
  }

  public async create(data: Prisma.RoleUncheckedCreateInput): Promise<Role> {
    return this.prisma.role.create({ data });
  }

  public async update(
    where: Prisma.RoleWhereUniqueInput,
    data: Prisma.RoleUpdateInput,
  ): Promise<Role> {
    return this.prisma.role.update({ where, data });
  }

  public async delete(query: { id: any }): Promise<Role> {
    return this.prisma.role.delete({ where: query });
  }

  public async findMany(args?: ManyArgs<Role>): Promise<Role[]> {
    return this.prisma.role.findMany(args);
  }

  public async findUnique(query: { id: any }): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: query,
    });
  }

  public async findUniqueOrThrow(query: { id: any }): Promise<Role> {
    return this.prisma.role.findUniqueOrThrow({
      where: query,
    });
  }
}
