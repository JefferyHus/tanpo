import { prisma } from '@/core/classes/database/client';
import { RoleFactory } from '@/modules/role/role.factory';

export async function main() {
  // factories
  const factories = [new RoleFactory(prisma)];

  // create the factories
  for (const factory of factories) {
    await factory.create();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
