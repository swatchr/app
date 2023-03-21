import { PrismaClient } from '@prisma/client';

import type { Color as PrismaColor, Prisma } from '@prisma/client';

import { checkRequestParams } from '@/server';
import { throwBadRequestError } from '@/server/api/utils/error/trpc';
import { stringifyPalette, validateAndConvertHexColor } from '@/utils';
import { Color } from './color.model';

const colorInstance = new Color();

export class Palette {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient({
      errorFormat: 'pretty',
    });
  }

  async validatePaletteColors(palette: string[]) {
    if (!palette?.length) throw throwBadRequestError();

    const colors = await Promise.all(
      palette
        .map(async (hex) => {
          const strippedHex = validateAndConvertHexColor(hex);
          if (!strippedHex) {
            throw new Error(`Invalid Hex Code ${strippedHex}=${hex}`);
          }

          let colorExists: Prisma.PromiseReturnType<
            typeof colorInstance.hexExists
          > = await colorInstance.hexExists(strippedHex);

          if (!colorExists) {
            return await colorInstance.fetchColor({ hex: strippedHex });
          }

          return colorExists as PrismaColor;
        })
        .filter(Boolean)
    );

    // make sure all colors still exist
    if (!colors.length || colors.length !== palette.length) {
      // throw new Error('Invalid Palette');
      throw throwBadRequestError();
    }
    return colors;
  }

  async get({
    id,
    serial,
    name,
  }: {
    id?: string;
    serial?: string;
    name?: string;
  }) {
    checkRequestParams([!id && !serial && !name]);

    const palette = await this.prisma.palette.findUnique({
      where: Object.assign(
        {},
        id ? { id: id } : serial ? { serial: serial } : { name: name }
      ),
      include: { Colors: true, Owned: true, Forks: true },
    });

    if (!palette) throw throwBadRequestError();

    return palette;
  }

  async createOrUpdate({
    palette,
    data,
    profileId,
  }: {
    palette: string[];
    data: {
      name: string;
      serial: string;
      status: string;
    };
    profileId: string;
  }) {
    checkRequestParams([
      !profileId,
      !palette?.length,
      !data,
      !data.name && !data.status && !data.serial,
    ]);

    const colors = await this.validatePaletteColors(palette);

    return await this.prisma.palette.upsert({
      where: { serial: stringifyPalette(palette) },
      create: {
        serial: stringifyPalette(palette),
        name: data.name,
        status: data.status,
        Colors: {
          connect: colors.map((c) => ({
            id: (c as PrismaColor).id,
          })),
        },
        Owned: {
          create: {
            profileId,
          },
        },
      },
      update: {
        ...data,
        Colors: {
          connect: (colors as PrismaColor[]).map((color) => ({
            id: color.id,
          })),
        },
      },
    });
  }

  async update({
    serial,
    data,
    profileId,
  }: {
    serial: string;
    data: {
      name?: string;
      status?: string;
    };
    profileId: string;
  }) {
    checkRequestParams([
      !serial,
      !profileId,
      !data,
      !data.name && !data.status,
    ]);

    return await this.prisma.owned.update({
      where: {
        profileId_serial: {
          profileId: profileId,
          serial,
        },
      },
      data: {
        Palette: {
          update: data, // currently we're not allowing serial to be updated
        },
      },
      include: { Palette: true },
    });
  }

  async delete({ serial, profileId }: { serial: string; profileId: string }) {
    checkRequestParams([!serial, !profileId]);

    return await this.prisma.owned.delete({
      where: {
        profileId_serial: {
          profileId: profileId,
          serial,
        },
      },
      include: { Palette: true },
    });
  }
}
