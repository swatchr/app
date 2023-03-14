import type ColorLab from 'lib/color';

import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*                              CLIENT SIDE TYPES                             */
/* -------------------------------------------------------------------------- */

export const ColorApiInfoSchema = z.object({
  value: z.string().optional(),
});

export const ColorApiAppInfoSchema = z.object({
  hex: ColorApiInfoSchema,
  rgb: ColorApiInfoSchema,
  hsl: ColorApiInfoSchema,
  cmyk: ColorApiInfoSchema,
  hsv: ColorApiInfoSchema,
  name: z
    .object({
      value: z.string(),
      closest_named_hex: z.string(),
      exact_match_name: z.boolean(),
      distance: z.number(),
    })
    .optional(),
  contrast: ColorApiInfoSchema.optional(),
  complement: z.string().optional(),
  text: z.string().optional(),
});

//
const ColorApiClientInfoSchema = z.object({
  hex: z.string().optional(),
  rgb: z.string().optional(),
  hsl: z.string().optional(),
  cmyk: z.string().optional(),
  hsv: z.string().optional(),
  name: z
    .object({
      value: z.string(),
      closest_named_hex: z.string(),
      exact_match_name: z.boolean(),
      distance: z.number(),
    })
    .optional(),
  contrast: z.string().optional(),
  complement: z.string().optional(),
  text: z.string().optional(),
});

export type ColorApiClientInfo = z.infer<typeof ColorApiClientInfoSchema>;
export type ColorApiAppInfo = z.infer<typeof ColorApiAppInfoSchema>;

/* -------------------------------------------------------------------------- */
/*                             COLOR INFO FACTORY                             */
/* -------------------------------------------------------------------------- */

export function createColorInfo(
  info: ColorApiAppInfo | undefined,
  instance: ColorLab
): ColorApiClientInfo {
  return {
    hex: info?.hex?.value,
    rgb: info?.rgb?.value,
    hsl: info?.hsl?.value,
    cmyk: info?.cmyk?.value,
    hsv: info?.hsv?.value,
    name: info?.name,
    contrast: info?.contrast?.value,
    complement: instance.complement,
    text: instance.getContrastColors()[1] || '',
  };
}

/* -------------------------------------------------------------------------- */
/*                             EXTERNAL DATA TYPES                            */
/* -------------------------------------------------------------------------- */

const ColorAPIModeSchema = z.object({
  value: z.string().optional(),
  clean: z.string().optional(),
});

export const ColorAPIColorModesSchema = z.object({
  hex: ColorAPIModeSchema,
  rgb: ColorAPIModeSchema,
  hsl: ColorAPIModeSchema,
  hsv: ColorAPIModeSchema,
  cmyk: ColorAPIModeSchema,
  XYZ: ColorAPIModeSchema,
  name: z
    .object({
      value: z.string(),
      closest_named_hex: z.string(),
      exact_match_name: z.boolean(),
      distance: z.number(),
    })
    .optional(),
  image: z
    .object({
      bare: z.string(),
      named: z.string(),
    })
    .optional(),
  contrast: z
    .object({
      value: z.string(),
    })
    .optional(),
  _links: z
    .object({
      self: z
        .object({
          href: z.string(),
        })
        .optional(),
    })
    .optional(),
});

export const ColorAPISchemeSchema = z.object({
  mode: z.string(),
  count: z.string(),
  colors: z.array(ColorAPIColorModesSchema),
  seed: ColorAPIColorModesSchema,
});

export type Modes =
  | 'analogic-complement'
  | 'monochrome'
  | 'monochrome-dark'
  | 'triad'
  | 'analogic'
  | 'complement'
  | 'quad';

export type ColorApiScheme = z.infer<typeof ColorAPISchemeSchema>;
