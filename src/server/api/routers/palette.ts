import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { trpcPrismaErrorHandler } from '@/utils/error';
import { Palettes } from 'prisma/models/palette.model';

export const paletteRouter = createTRPCRouter({
  save: protectedProcedure
    .input(
      z.object({
        palette: z.array(z.string()),
        private: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const palettes = new Palettes();
        const palette = await palettes.create({ ctx, input });
        return palette;
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
        const palettes = new Palettes();
        const palette = await palettes.get({ ctx, input });
        return palette;
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  delete: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const palettes = new Palettes();
        const palette = await palettes.delete({ ctx, input });
        return palette;
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
});
