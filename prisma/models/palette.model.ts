import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

import type { InnerTRPCContext } from '@/server';
import type { Color as PrismaColor, Prisma } from '@prisma/client';

import { stringifyPalette, validateAndConvertHexColor } from '@/utils';
import { isOwner } from 'lib/next-auth/services/permissions';
import { shortname } from '../../lib/unique-names-generator';
import { Color } from './color.model';

// type PaletteStatus = 'public' | 'private' | 'unlisted' | 'deleted';
const colorInstance = new Color();

export class Palette {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient({
      errorFormat: 'pretty',
    });
  }

  async validatePaletteColors(palette: string[]) {
    if (!palette?.length) throw new Error('Invalid Palette');

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

    // make sure all colors still exist
    if (!colors.length || colors.length !== palette.length) {
      throw new Error('Invalid Palette');
    }

    return colors;
  }

  async serialPaletteExists(palette: string) {
    const p = await this.prisma.palette.findFirst({
      where: { serial: palette },
      include: { Owned: true, Forks: true },
    });
    return p;
  }
  async paletteExists(palette: string[], status: string = 'public') {
    const p = await this.prisma.palette.findFirst({
      where: { serial: stringifyPalette(palette), status },
      include: { Owned: true, Forks: true },
    });
    return p;
  }

  async validateSerialPalette(palette: string) {
    if (!palette || typeof palette !== 'string') {
      throw new Error('Invalid Palette');
    }

    const paletteExists = await this.serialPaletteExists(palette);
    if (paletteExists)
      return {
        result: true,
        message: 'palette-exists',
        palette: paletteExists,
      };

    const validPalette = palette.split('-').map((hex) => '#' + hex);
    const colors = await this.validatePaletteColors(validPalette);

    if (!colors.length || colors.length !== validPalette.length) {
      return { result: false, message: 'invalid-colors' };
    }
    return {
      result: true,
      message: 'colors-validated',
      length: colors.length,
    };
  }

  async validatePaletteOwner({
    session,
    id,
    serial,
  }: {
    session: InnerTRPCContext['session'];
    id?: string;
    serial?: string;
  }) {
    if (!id && !serial) throw new Error('Invalid Palette');
    const palette = await this.prisma.palette.findFirst({
      where: Object.assign({}, id ? { id } : { serial }),
      include: { Owned: true, Forks: true },
    });

    if (!palette?.id) throw new Error('Palette not found');
    if (!isOwner(palette.Owned[0]!.profileId, session)) {
      throw new Error('Not Authorized');
    }
    return palette;
  }

  async createPalette({
    session,
    palette,
    data,
  }: {
    session: InnerTRPCContext['session'];
    palette: string[];
    data: Prisma.PaletteCreateInput;
  }) {
    if (!palette?.length) throw new Error('Invalid Palette');

    // make sure all colors exist if not they are created or errors thrown
    const colors = await this.validatePaletteColors(palette);

    // if all colors exist then create the new palette and make user the owner
    let newPalette = await this.prisma.palette.create({
      data: Object.assign(
        {},
        // { ...data },
        data ?? { status: 'public', name: shortname() },
        {
          Colors: {
            connect: (colors as PrismaColor[]).map((color) => ({
              id: color.id,
            })),
          },
          Owned: {
            create: {
              profileId: session?.user.profileId,
            },
          },
        }
      ),
    });

    if (!newPalette?.id) throw new Error('Invalid Palette');

    return {
      status: 'success',
      message: 'Palette Created',
      palette: newPalette,
    };
  }

  async get({ id, serial }: { id?: string; serial?: string }) {
    if (!id && !serial) throw new Error('Invalid Palette');
    const palette = await this.prisma.palette.findUnique({
      where: Object.assign({}, id ? { id } : { serial }),
      include: { Colors: true, Owned: true, Forks: true },
    });

    if (!palette?.id) throw new Error('Palette not found');

    return palette;
  }

  async update({
    serial,
    data,
  }: {
    serial?: string;
    data: Prisma.PaletteUpdateInput;
  }) {
    console.log('starting prisma update', data);
    if (!serial) throw new Error('Invalid Palette');
    if (!data) throw new Error('Invalid Palette');
    // update palette
    const palette = await this.prisma.palette.update({
      where: { serial },
      data,
    });

    if (!palette?.id) throw new Error('Palette not found');

    return {
      status: 'success',
      message: 'Palette Updated',
      palette,
    };
  }

  async delete({ serial }: { serial?: string }) {
    if (!serial) throw new Error('Invalid Palette');
    const palette = await this.prisma.palette.delete({
      where: { serial },
    });

    if (!palette?.id) throw new Error('Palette not found');

    return {
      status: 'success',
      message: 'Palette Deleted',
      palette,
    };
  }
}
