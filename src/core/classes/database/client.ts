import { PrismaClient } from '@prisma/client';

export function database() {
  // return the database
  return new PrismaClient();
}

export const prisma = database();
