import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { trpcPrismaErrorHandler } from '@/utils/error';
import { Palette } from 'prisma/models/palette.model';

const palettesModel = new Palette();

export const paletteRouter = createTRPCRouter({
  save: protectedProcedure
    .input(
      z.object({
        palette: z.array(z.string()),
        name: z.string().optional(),
        status: z.string().default('public'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await palettesModel.createPalette({ ctx, ...input });
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  get: publicProcedure
    .input(
      z.object({ id: z.string().optional(), serial: z.string().optional() })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await palettesModel.get({ serial: input.serial! });
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        serial: z.string(),
        data: z.any(),
        isAdmin: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return palettesModel.update({
          serial: input.serial,
          data: input.data,
          isAdmin: input.isAdmin,
        });
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  delete: protectedProcedure
    .input(z.object({ serial: z.string(), isAdmin: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return palettesModel.delete(input);
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
});
