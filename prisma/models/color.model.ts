import { PrismaClient } from '@prisma/client';

import type { Color as PrismaColor, Prisma } from '@prisma/client';

import { checkRequestParams } from '@/server';
import { colorApiSchema, fetchTheColorApi } from '@/server/api/routers/color';
import { throwBadRequestError } from '@/server/api/utils/error/trpc';
import { validateAndConvertHexColor } from '@/utils';
import ColorLab from 'lib/color';

export class Color {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async hexExists(hex: string) {
    const color = await this.prisma.color.findUnique({
      where: { hex: hex },
    });
    return color;
  }

  async fetchColor({ hex }: { hex: string }) {
    const strippedHex = validateAndConvertHexColor(hex);
    if (!strippedHex) return null;

    const colorExists = await this.hexExists(strippedHex);

    if (colorExists) return colorExists as PrismaColor;

    const res = await fetchTheColorApi(hex, 'id');
    if (!res) return null;
    const data = colorApiSchema.parse(res);
    if (!data.hex.clean) return null;

    const color = new ColorLab(data.hex.clean);

    return data.hex.clean
      ? this.prisma.color.create({
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
      : null;
  }

  async get({ hex, include }: { hex: string; include?: boolean }) {
    const strippedHex = validateAndConvertHexColor(hex);
    checkRequestParams([!!strippedHex]);

    const color = await this.prisma.color.findUnique({
      where: { hex: strippedHex! },
      include: include
        ? { Palettes: true, Tags: true, Favorited: true }
        : undefined,
    });

    if (!color?.id) {
      const newColor = await this.fetchColor({ hex: strippedHex! });
      return newColor;
    }
    return color;
  }

  async getAll({
    palette,
    include = false,
  }: {
    palette: string[];
    include?: boolean;
  }) {
    checkRequestParams([!!palette]);
    const strippedPalette = palette.map((hex) => {
      const strippedHex = validateAndConvertHexColor(hex);
      if (!strippedHex) throw throwBadRequestError();
      return strippedHex;
    });

    return Promise.all(
      strippedPalette.map(async (hex) => await this.get({ hex, include }))
    );
  }

  async updateHex({
    hex,
    data,
  }: {
    hex: string;
    data: Prisma.ColorUpdateInput;
  }) {
    checkRequestParams([!!data, !!data.hex]);
    const strippedHex = validateAndConvertHexColor(hex);
    if (!strippedHex) throw throwBadRequestError();
    const hexExists = await this.hexExists(strippedHex);
    if (!hexExists) throw throwBadRequestError();

    return this.prisma.color.update({
      where: { hex: strippedHex },
      data,
    });
  }

  async deleteHex({ hex }: { hex: string }) {
    checkRequestParams([!!hex]);
    const strippedHex = validateAndConvertHexColor(hex);
    if (!strippedHex) throw throwBadRequestError();
    const hexExists = await this.hexExists(strippedHex);
    if (!hexExists) throw throwBadRequestError();

    return this.prisma.color.delete({
      where: { hex: strippedHex },
    });
  }

  async deleteAll({ isAdmin = false }: { isAdmin?: boolean }) {
    if (!isAdmin) throw throwBadRequestError();
    return this.prisma.color.deleteMany();
  }
}
