import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { trpcPrismaErrorHandler } from '@/utils/error';
import { Palettes } from 'prisma/models/palette.model';

const palettesModel = new Palettes();

export const paletteRouter = createTRPCRouter({
  save: protectedProcedure
    .input(
      z.object({
        palette: z.array(z.string()),
        private: z.boolean(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await palettesModel.create({ ctx, input });
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  get: publicProcedure
    .input(
      z.object({
        palette: z.array(z.string()).optional(),
        name: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await palettesModel.get({ ctx, input });
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  delete: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await palettesModel.delete({ ctx, input });
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
});
