import { Prisma, PrismaClient, Role } from '@prisma/client';

import { Factory } from '@/core/classes/database/factory.class';
import { LogLevelsEnum } from '@/core/classes/logger/logger.types';
import { logger } from '@/utils/logger';

export class RoleFactory extends Factory<Role> {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma, 'role');
  }

  protected async attributes(): Promise<Partial<Role>> {
    // name should be unique and one of the following: 'admin', 'user', 'guest'
    return {
      name: this.faker.helpers.arrayElement(['admin', 'user', 'guest']),
    };
  }

  public async beforeCreate(data: Partial<Role>): Promise<void> {
    logger(LogLevelsEnum.INFO, 'Creating role...', { data });
  }

  public async afterCreate(created: number): Promise<void> {
    logger(LogLevelsEnum.INFO, 'Created role!', { created });
  }
}
