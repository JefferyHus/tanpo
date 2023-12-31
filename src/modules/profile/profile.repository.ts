import { Prisma, PrismaClient, Profile } from '@prisma/client';
import { Service } from 'typedi';

import { Repository } from '@/core/classes/database/repository.class';
import { ManyArgs } from '@/core/classes/database/types';

@Service()
export class ProfileRepository extends Repository<Profile> {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma, 'profile');
  }

  public async create(
    data: Prisma.ProfileUncheckedCreateInput,
  ): Promise<Profile> {
    return this.prisma.profile.create({ data });
  }

  public async update(
    where: Prisma.ProfileWhereUniqueInput,
    data: Prisma.ProfileUpdateInput,
  ): Promise<Profile> {
    return this.prisma.profile.update({
      where: {
        id: where.id,
        userId: where.userId,
      },
      data,
    });
  }

  public async delete(query: { id: string }): Promise<Profile> {
    return this.prisma.profile.delete({ where: query });
  }

  public async findMany(args?: ManyArgs<Profile>): Promise<Profile[]> {
    return this.prisma.profile.findMany(args);
  }

  public async findUnique(query: { id: string }): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: query,
    });
  }

  public async findUniqueOrThrow(query: { id: string }): Promise<Profile> {
    return this.prisma.profile.findUniqueOrThrow({
      where: query,
    });
  }

  public async findOneByUserId(userId: string): Promise<Profile | null> {
    return this.prisma.profile.findFirst({
      where: {
        userId,
      },
    });
  }
}
