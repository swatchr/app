import { z } from 'zod';

import type { TRPCContext } from '@/server/api/trpc';

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { validateAndConvertHexColor } from '@/utils';
import { trpcPrismaErrorHandler } from '@/utils/error';
import ColorLab from 'lib/color';
import { Color } from 'prisma/models/color.model';
import { handleServerError } from '../utils';

export const baseApiSchema = z.object({
  rgb: z.object({
    value: z.string(),
  }),
  hsl: z.object({
    value: z.string(),
  }),
  hsv: z.object({
    value: z.string(),
  }),
  name: z.object({
    value: z.string(),
  }),
  cmyk: z.object({
    value: z.string(),
  }),
  // image: z.object({
  //   bare: z.string(),
  //   named: z.string(),
  // }),
  contrast: z.object({
    value: z.string(),
  }),
});

const fullHexSchema = z.object({
  clean: z.string(),
  value: z.string(),
});
const cleanHexSchema = z.object({
  clean: z.string(),
});

export const colorApiSchema = baseApiSchema.merge(
  z.object({ hex: fullHexSchema })
);
export type ColorApiSchema = z.infer<typeof colorApiSchema>;

export const cleanColorApiSchema = baseApiSchema.merge(
  z.object({ hex: cleanHexSchema })
);
export type CleanColorApiSchema = z.infer<typeof cleanColorApiSchema>;

export async function createColor(ctx: TRPCContext, hex: string) {
  const res = await fetchTheColorApi(hex, 'id');
  const data = colorApiSchema.parse(res);
  if (!data.hex.clean) throw new Error('there was an issue');
  const color = new ColorLab(data.hex.clean);
  return (
    data.hex.clean &&
    ctx.prisma.color.create({
      data: {
        hex: data.hex.clean,
        rgb: data.rgb.value,
        hsl: data.hsl.value,
        hsv: data.hsv.value,
        cmyk: data.cmyk.value,
        name: data.name.value,
        contrast: data.contrast.value,
        complement: color.complement,
        text: color.contrast === 'light' ? '#000' : '#fff',
      },
    })
  );
}

export type ColorApiReturn = ReturnType<typeof createColor>;

export const fetchTheColorApi = async (hex: string, endpoint = 'scheme') => {
  const mode = 'analogic-complement';
  const count = 10;
  try {
    const res = await fetch(
      `https://www.thecolorapi.com/${endpoint}?hex=${hex}&mode=${mode}&count=${count}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

    return res.json();
  } catch (e) {
    return handleServerError(e, 'There was an issue with fetching data');
  }
};

// @TODO: throw errors instead foe each query
export const colorRouter = createTRPCRouter({
  schemeAPI: publicProcedure
    .input(z.object({ hex: z.string() }))
    .query(async ({ input }) => {
      const hex = validateAndConvertHexColor(input.hex);
      try {
        if (!hex) throw new Error(`not valid hex | input: ${input.hex}`);
        const res = await fetchTheColorApi(hex);
        return res;
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  colorAPI: publicProcedure
    .input(z.object({ hex: z.string(), endpoint: z.string().optional() }))
    .query(async ({ input }) => {
      const hex = validateAndConvertHexColor(input.hex);
      try {
        if (!hex) throw new Error(`not valid hex | input: ${input.hex}`);
        const res = await fetchTheColorApi(hex, input.endpoint ?? 'id');
        return res;
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  get: publicProcedure
    .input(z.object({ hex: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const client = new Color();
        const color = await client.get({ hex: input.hex! });
        return color;
      } catch (error) {
        trpcPrismaErrorHandler(error);
        return;
      }
    }),
  getAll: publicProcedure
    .input(z.object({ palette: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      try {
        const client = new Color();
        const palette = await client.getAll({ palette: input.palette });
        return palette;
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  save: publicProcedure
    .input(z.object({ hex: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const client = new Color();
        const color = await client.createColor({ hex: input.hex });
        return color;
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  update: adminProcedure
    .input(
      z.object({
        hex: z.string(),
        data: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const client = new Color();
        const color = await client.updateHex({
          hex: input?.hex,
          data: input?.data,
        });
        return color;
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
  delete: adminProcedure
    .input(z.object({ hex: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const client = new Color();
        const color = await client.deleteHex(input);
        return color;
      } catch (error) {
        trpcPrismaErrorHandler(error);
      }
    }),
});
