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

  async paletteExists(palette: string[], status: string = 'public') {
    const color = await this.prisma.palette.findFirst({
      where: { serial: stringifyPalette(palette), status },
      include: { Owned: true, Forks: true },
    });
    return color;
  }

  async createPalette({
    session,
    palette,
    name,
    status = 'private',
  }: {
    session: InnerTRPCContext['session'];
    palette: string[];
    name?: string;
    status: string;
  }) {
    if (!palette?.length) throw new Error('Invalid Palette');

    // check if the palette already exists
    const paletteExists = await this.paletteExists(palette);
    if (paletteExists) {
      if (
        // check if current user is the owner, if so return palette otherwise fork palette
        paletteExists.Owned.filter(({ profileId }) =>
          isOwner(profileId, session)
        )
      ) {
        return paletteExists;
      }

      // if palette exists and user is not the owner then fork the palette
      return await this.prisma.palette.update({
        where: { id: paletteExists.id },
        data: {
          Forks: {
            create: { Profile: { connect: { id: session?.user.profileId } } },
          },
        },
      });
    }

    // make sure each of the colors in the palette exist, if not create them
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

    // make sure all colors still exist
    if (!colors.length || colors.length !== palette.length) {
      throw new Error('Invalid Palette');
    }

    // if all colors exist then create the new palette and make user the owner
    let newPalette = await this.prisma.palette.create({
      data: {
        name: name ?? shortname(),
        serial: stringifyPalette(palette),
        status,
        Colors: {
          connect: (colors as PrismaColor[]).map((color) => ({ id: color.id })),
        },
        Owned: {
          create: {
            profileId: session?.user.profileId,
          },
        },
      },
    });

    if (!newPalette?.id) throw new Error('Invalid Palette');

    return newPalette;
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
    id,
    serial,
    data,
    session,
  }: {
    id?: string;
    serial?: string;
    data: Prisma.PaletteUpdateInput;
    session: InnerTRPCContext['session'];
  }) {
    if (!id && !serial) throw new Error('Invalid Palette');
    if (!data) throw new Error('Invalid Palette');
    const palette = await this.prisma.palette.update({
      where: Object.assign({}, id ? { id } : { serial }),
      data,
    });

    if (!palette?.id) throw new Error('Palette not found');

    return palette;
  }

  async delete({ id, serial }: { id?: string; serial?: string }) {
    if (!serial) throw new Error('Invalid Palette');
    const palette = await this.prisma.palette.delete({
      where: Object.assign({}, id ? { id } : { serial }),
    });

    if (!palette?.id) throw new Error('Palette not found');

    return palette;
  }
}
