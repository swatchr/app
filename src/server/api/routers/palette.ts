import { z } from 'zod';

import type { Prisma } from '@prisma/client';

import {
  adminProcedure,
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
        return await palettesModel.createPalette({
          session: ctx.session,
          ...input,
        });
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
        return await palettesModel.get(
          Object.assign(
            {},
            input?.id ? { id: input.id! } : { serial: input.serial! }
          )
        );
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  update: protectedProcedure
    .input(z.object({ serial: z.string(), data: z.unknown() }))
    .mutation(async ({ ctx, input: { serial, data } }) => {
      try {
        return palettesModel.update({
          serial,
          data: data as Prisma.PaletteUpdateInput,
        });
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  delete: adminProcedure
    .input(
      z.object({ id: z.string().optional(), serial: z.string().optional() })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return palettesModel.delete(
          Object.assign(
            {},
            input?.id ? { id: input.id! } : { serial: input.serial! }
          )
        );
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
});
