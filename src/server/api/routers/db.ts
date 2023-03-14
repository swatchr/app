import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const dbRouter = createTRPCRouter({
  seedRoles: protectedProcedure.mutation(async ({ ctx }) => {
    const roles = [
      { type: 'ADMIN', value: 101 },
      { type: 'USER', value: 2 },
      { type: 'UNVERIFIED', value: 1 },
      { type: 'ANON', value: 0 },
    ];

    const update = await ctx.prisma.$transaction(
      roles.map((role) =>
        ctx.prisma.role.upsert({
          where: { type: role.type },
          update: {},
          create: role,
        })
      )
    );
    return {
      status: 'success',
      ...update,
    };
  }),
});
