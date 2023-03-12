import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { trpcPrismaErrorHandler } from '@/utils/error';
import { shortname } from 'lib/unique-names-generator';
import { z } from 'zod';

import { handleServerError } from '../utils';

export const paletteRouter = createTRPCRouter({
  save: publicProcedure
    .input(z.object({ palette: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const palette = await ctx.prisma.palette.create({
          data: {
            name: input.palette.map((hex) => hex.replace('#', '')).join('-'),
            colors: {
              connect: input.palette.map((hex) => ({ hex })),
            },
          },
        });
        return palette;
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  get: publicProcedure
    .input(z.object({ palette: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      try {
        const palette = await ctx.prisma.palette.findUnique({
          where: {
            name: input.palette.map((hex) => hex.replace('#', '')).join('-'),
          },
          include: { colors: true },
        });
        return palette;
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  delete: publicProcedure
    .input(z.object({ palette: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const palette = await ctx.prisma.palette.delete({
          where: {
            name: input.palette.map((hex) => hex.replace('#', '')).join('-'),
          },
        });
        return palette;
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
});
