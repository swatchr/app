import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

import type { InnerTRPCContext } from '@/server';
import type { Color as PrismaColor, Prisma } from '@prisma/client';

import { stringifyPalette, validateAndConvertHexColor } from '@/utils';
import { shortname } from '../../lib/unique-names-generator';
import { Color } from './color.model';

// type PaletteStatus = 'public' | 'private' | 'unlisted' | 'deleted';
const colorInstance = new Color();

export class Palette {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async paletteExists(palette: string[], status: string = 'public') {
    const color = await this.prisma.palette.findFirst({
      where: { serial: stringifyPalette(palette), status },
    });
    return color;
  }

  async createPalette({
    ctx,
    palette,
    name,
    status = 'private',
  }: {
    ctx: InnerTRPCContext;
    palette: string[];
    name?: string;
    status: string;
  }) {
    if (!palette?.length) throw new Error('Invalid Palette');

    const colors = await Promise.all(
      palette
        .map(async (hex) => {
          const strippedHex = validateAndConvertHexColor(hex);
          if (!strippedHex)
            throw new Error(`Invalid Hex Code ${strippedHex}=${hex}`);

          let colorExists: Prisma.PromiseReturnType<
            typeof colorInstance.hexExists
          > = await colorInstance.hexExists(strippedHex);

          let newColor: Prisma.PromiseReturnType<
            typeof colorInstance.createColor
          > = {} as Prisma.PromiseReturnType<typeof colorInstance.createColor>;
          if (!colorExists) {
            newColor = await colorInstance.createColor({ hex: strippedHex });
          }

          return colorExists ?? newColor;
        })
        .filter(Boolean)
    );

    if (!colors.length || colors.length !== palette.length) {
      throw new Error('Invalid Palette');
    }

    const paletteExists = await this.paletteExists(palette);
    if (paletteExists) {
      // check if current user is the owner, if so return palette otherwise fork palette
      if (paletteExists.userId === ctx.session?.user.id) {
        return paletteExists;
      }
      await this.prisma.palette.update({
        where: { id: paletteExists.id },
        data: {
          Forks: {
            create: { user: { connect: { id: ctx.session?.user.id } } },
          },
        },
      });
    }

    const newPalette = await this.prisma.palette.create({
      data: {
        name: name ?? shortname(),
        serial: stringifyPalette(palette),
        status,
        user: { connect: { id: ctx.session?.user.id } },
        Colors: {
          connect: (colors as PrismaColor[]).map((color) => ({ id: color.id })),
        },
        Owned: { create: { user: { connect: { id: ctx.session?.user.id } } } },
      },
    });

    return newPalette;
  }

  async get({ serial }: { serial: string }) {
    if (!serial) throw new Error('Invalid Palette');
    const palette = await this.prisma.palette.findUnique({
      where: { serial: serial! },
      include: { Colors: true, Owned: true, Forks: true },
    });

    if (!palette?.id) throw new Error('Palette not found');

    return palette;
  }

  async update({
    serial,
    data,
    isAdmin = false,
  }: {
    serial: string;
    data: Prisma.PaletteUpdateInput;
    isAdmin?: boolean;
  }) {
    if (!isAdmin) throw new Error('Not Authorized');
    if (!serial) throw new Error('Invalid Palette');
    const palette = await this.prisma.palette.update({
      where: { serial },
      data,
    });

    if (!palette?.id) throw new Error('Palette not found');

    return palette;
  }

  async delete({
    serial,
    isAdmin = false,
  }: {
    serial: string;
    isAdmin: boolean;
  }) {
    if (!isAdmin) throw new Error('Not Authorized');
    if (!serial) throw new Error('Invalid Palette');
    const palette = await this.prisma.palette.delete({
      where: { serial },
    });

    if (!palette?.id) throw new Error('Palette not found');

    return palette;
  }
}
