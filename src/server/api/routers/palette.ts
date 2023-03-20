import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import type { Color as PrismaColor, Prisma } from '@prisma/client';
import type { Session } from 'next-auth';

import { colorApiSchema, fetchTheColorApi } from '@/server/api/routers/color';
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { stringifyPalette } from '@/utils';
import {
  throwAuthorizationError,
  throwBadRequestError,
  trpcPrismaErrorHandler,
  trpcPrismaErrorHandler1,
} from '@/utils/error';
import ColorLab from 'lib/color';
import { isOwner } from 'lib/next-auth/services/permissions';
import { shortname } from 'lib/unique-names-generator';
import { Palette } from 'prisma/models/palette.model';
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
      if (!ctx?.session.user.profileId) throw throwAuthorizationError();
      if (!input.palette?.length) throw throwBadRequestError();

      try {
        if (!input?.palette?.length) throw throwBadRequestError();

        const colors = await palettesModel.validatePaletteColors(input.palette);
        if (!colors?.length || colors.length !== input.palette.length) {
          throw throwBadRequestError('Invalid colors');
        }

        const existingPalette = await ctx.prisma.palette.findUnique({
          where: { serial: stringifyPalette(input.palette) },
          include: { Colors: true, Owned: true },
        });

        if (existingPalette) {
          if (!isOwner(existingPalette.Owned[0]!.profileId!, ctx.session)) {
            throw throwAuthorizationError();
          }

          return await ctx.prisma.palette.update({
            where: { id: existingPalette.id },
            data: {
              ...input.data,
              Colors: {
                connect: (colors as PrismaColor[]).map((color) => ({
                  id: color.id,
                })),
              },
            },
          });
        }

        return await ctx.prisma.palette.create({
          data: {
            serial: stringifyPalette(input.palette),
            name: input.data?.name || shortname(),
            status: input.data?.status || 'public',
            Colors: {
              connect: (colors as PrismaColor[]).map((color) => ({
                id: color.id,
              })),
            },
            Owned: {
              create: {
                profileId: ctx.session?.user.profileId,
              },
            },
          },
        });

        // return await ctx.prisma.palette.upsert({
        //   where: { serial: stringifyPalette(input.palette) },
        //   create: {
        //     serial: stringifyPalette(input.palette),
        //     name: input.data?.name || shortname(),
        //     status: input.data?.status || 'public',
        //     Colors: {
        //       connect: (colors as PrismaColor[]).map((color) => ({
        //         id: color.id,
        //       })),
        //     },
        //     Owned: {
        //       create: {
        //         profileId: ctx.session?.user.profileId,
        //       },
        //     },
        //   },
        //   update: {
        //     ...input.data,
        //     Colors: {
        //       connect: (colors as PrismaColor[]).map((color) => ({
        //         id: color.id,
        //       })),
        //     },
        //   },
        // });
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  get: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        serial: z.string().optional(),
        name: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input?.id && !input?.serial && !input?.name) {
        throw throwBadRequestError();
      }
      try {
        return await palettesModel.get(
          Object.assign(
            {},
            input?.id
              ? { id: input.id! }
              : input?.serial
              ? { serial: input.serial! }
              : { name: input.name }
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
      if (!ctx.session.user.profileId) throw throwAuthorizationError();
      if (!serial) throw throwBadRequestError();

      try {
        await palettesModel.validatePaletteOwner({
          session: ctx.session,
          serial,
        });
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
      if (!ctx.session.user.profileId) throw throwAuthorizationError();
      if (!input.serial) throw throwBadRequestError();

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
