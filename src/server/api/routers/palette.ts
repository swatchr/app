import { z } from 'zod';

import type { Prisma } from '@prisma/client';
import type { Session } from 'next-auth';

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { stringifyPalette } from '@/utils';
import { trpcPrismaErrorHandler } from '@/utils/error';
import { isOwner } from 'lib/next-auth/services/permissions';
import { Palette } from 'prisma/models/palette.model';
import { shortname } from '../../../../lib/unique-names-generator';
import { handleServerError } from '../utils/index';

const palettesModel = new Palette();

export const paletteRouter = createTRPCRouter({
  save: protectedProcedure
    .input(
      z.object({
        palette: z.array(z.string()),
        data: z
          .object({
            name: z.string().optional(),
            status: z.string().default('public').optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.profileId) throw new Error('Not Authorized');
        if (!input.palette?.length) throw new Error('Invalid Palette');
      } catch (error) {
        handleServerError(error);
      }
      try {
        const validation = await palettesModel.validateSerialPalette(
          stringifyPalette(input.palette)
        );

        if (!validation.result) throw new Error(validation.message);
        if (validation.result && validation.message === 'palette-exists') {
          const palette = await palettesModel.update({
            serial: stringifyPalette(input.palette),
            data: (input.data as Prisma.PaletteUpdateInput) ?? {},
          });
          return {
            message: 'Palette Updated',
            palette,
            status: 'success',
          };
        }

        return await palettesModel.createPalette({
          session: ctx.session,
          palette: input.palette,
          data: {
            ...input.data,
            serial: stringifyPalette(input.palette),
            name: input.data?.name || shortname(),
          },
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
    .input(
      z.object({
        serial: z.string(),
        data: z.unknown(),
      })
    )
    .mutation(async ({ ctx, input: { serial, data } }) => {
      try {
        console.log('starting mutation checks');
        if (!ctx.session.user.profileId) throw new Error('Not Authorized');
        if (!serial) throw new Error('Invalid Palette');
        console.log('completed mutation checks');
      } catch (error) {
        handleServerError(error);
      }
      try {
        console.log('validating palette owner');
        await palettesModel.validatePaletteOwner({
          session: ctx.session,
          serial,
        });
        console.log('updating palette');
        return palettesModel.update({
          serial,
          data: data as Prisma.PaletteUpdateInput,
        });
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  delete: protectedProcedure
    .input(z.object({ serial: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.profileId) throw new Error('Not Authorized');
        if (!input.serial) throw new Error('Invalid Palette');
      } catch (error) {
        handleServerError(error);
      }
      try {
        await palettesModel.validatePaletteOwner({
          session: ctx.session,
          serial: input.serial,
        });
        return palettesModel.delete({ serial: input.serial! });
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
