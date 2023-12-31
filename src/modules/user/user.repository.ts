import { Prisma, PrismaClient, User } from '@prisma/client';
import { Service } from 'typedi';

import { Repository } from '@/core/classes/database/repository.class';
import { ManyArgs } from '@/core/classes/database/types';

import { UserWithRelations } from './user.types';

@Service()
export class UserRepository extends Repository<User> {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma, 'user');
  }

  public async create(
    data: Prisma.UserUncheckedCreateInput,
  ): Promise<UserWithRelations<'role'>> {
    return this.prisma.user.create({ data, include: { role: true } });
  }

  public async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({ where, data });
  }

  public async delete(query: { id: string }): Promise<User> {
    return this.prisma.user.delete({ where: query });
  }

  public async findMany(args?: ManyArgs<User>): Promise<User[]> {
    return this.prisma.user.findMany(args);
  }

  public async findUnique(query: { id: string }): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: query,
    });
  }

  public async findUniqueWithRole(query: {
    id: string;
  }): Promise<UserWithRelations<'role'> | null> {
    return this.prisma.user.findUnique({
      where: {
        id: query.id,
      },
      include: {
        role: true,
      },
    });
  }

  public async findUniqueOrThrow(query: { id: string }): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({
      where: query,
    });
  }

  public async findOneByEmail(query: { email: string }): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email: query.email },
    });
  }

  public async findOneWithRoleByEmail(query: {
    email: string;
  }): Promise<UserWithRelations<'role'>> {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        email: query.email,
      },
      include: {
        role: true,
      },
    });
  }
}
