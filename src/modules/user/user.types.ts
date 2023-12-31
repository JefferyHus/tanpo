import { Prisma } from '@prisma/client';

export type UserWithRelations<Relations extends keyof Prisma.UserInclude> =
  Prisma.UserGetPayload<{
    include: Pick<Prisma.UserInclude, Relations>;
  }>;
