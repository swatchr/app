import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import {
  throwAuthorizationError,
  throwBadRequestError,
  trpcPrismaErrorHandler,
} from '@/server/api/utils/error';
import { stringifyPalette } from '@/utils';
import { shortname } from 'lib/unique-names-generator';
import { Palette } from 'prisma/models/palette.model';

const paletteGetInputSchema = z.object({
  id: z.string().optional(),
  serial: z.string().optional(),
  name: z.string().optional(),
});

const paletteSaveInputSchema = z.object({
  palette: z.array(z.string()),
  data: z
    .object({
      name: z.string().optional(),
      status: z.string().default('public').optional(),
    })
    .optional(),
});

const paletteUpdateInputSchema = z.object({
  serial: z.string(),
  data: z.object({
    name: z.string().optional(),
    status: z.string().optional(),
  }),
});

const paletteDeleteInputSchema = z.object({ serial: z.string() });

const paletteModel = new Palette();

export const paletteRouter = createTRPCRouter({
  get: publicProcedure.input(paletteGetInputSchema).query(async ({ input }) => {
    try {
      return await paletteModel.get(input);
    } catch (error) {
      trpcPrismaErrorHandler(error);
    }
  }),
  save: protectedProcedure
    .input(paletteSaveInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await paletteModel.createOrUpdate({
          palette: input.palette,
          profileId: ctx?.session.user.profileId!,
          data: {
            name: input.data?.name || shortname(),
            status: input.data?.status || 'public',
            serial: stringifyPalette(input.palette),
          },
        });
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  update: protectedProcedure
    .input(paletteUpdateInputSchema)
    .mutation(async ({ ctx, input: { serial, data } }) => {
      try {
        const palette = serial.split('-').map((c) => `#${c}`);
        await paletteModel.validatePaletteColors(palette);
        return await paletteModel.update({
          serial,
          profileId: ctx.session?.user.profileId!,
          data,
        });
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  delete: protectedProcedure
    .input(paletteDeleteInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await paletteModel.delete({
          serial: input.serial,
          profileId: ctx.session?.user.profileId!,
        });
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  // test: publicProcedure
  //   .input(z.object({ palette: z.array(z.string()) }))
  //   .query(async ({ ctx, input }) => {
  //     try {
  //       return palettesModel.validatePaletteColors(input.palette);
  //     } catch (error) {
  //       trpcPrismaErrorHandler(error);
  //     }
  //   }),
});
