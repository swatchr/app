import { trpcPrismaErrorHandler } from '@/utils/error';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

export const dbRouter = createTRPCRouter({
  // seedRoles: adminProcedure.mutation(async ({ ctx }) => {
  seedRoles: adminProcedure.mutation(async ({ ctx }) => {
    const roles = [
      { type: 'ADMIN', level: 101 },
      { type: 'USER', level: 2 },
      { type: 'UNVERIFIED', level: 1 },
      { type: 'ANON', level: 0 },
    ];

    try {
      const update = Promise.all(
        await ctx.prisma.$transaction(
          roles.map((role) =>
            ctx.prisma.role.upsert({
              where: { type: role.type },
              update: {},
              create: role,
            })
          )
        )
      );
      return {
        status: 'success',
        ...update,
      };
    } catch (error) {
      trpcPrismaErrorHandler(error);
    }
  }),
});
