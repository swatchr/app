import type { InnerTRPCContext } from '@/server';
import { validateAndConvertHexColor } from '@/utils';
import { User } from '@prisma/client';

import { shortname } from 'lib/unique-names-generator';

export class Palettes {
  constructor() {}

  private USER_INCLUDES = {
    // Tags: true,
    // Owned: true,
    // Forked: true,
  };

  private PALETTE_INCLUDES = {
    ...this.USER_INCLUDES,
    user: true,
    Colors: true,
    Tags: true,
    Favorites: true,
    Forked: true,
    Owned: true,
  };

  /**
   *
   *
   * @private
   * @param {string[]} palette
   * @memberof Palettes
   */
  private stringifyPalette = (palette: string[]) => {
    return palette.map((hex) => hex.replace('#', '')).join('-');
  };

  /**
   * protectedProcedure
   * Based on whether a palette or a name (palette name) is provided,
   * it returns the appropriate palette for that user
   *
   * @param {{
   *     ctx: InnerTRPCContext;
   *     input: { palette?: string[]; name?: string };
   *     options?: { include?: any };
   *   }} {
   *     ctx,
   *     input,
   *     options = {},
   *   }
   * @return {*}
   * @memberof Palettes
   */
  async getOwnPalette({
    ctx,
    input,
    options = {},
  }: {
    ctx: InnerTRPCContext;
    input: { palette?: string[]; name?: string };
    options?: { include?: any };
  }) {
    if (!input.palette && !input.name) {
      throw new Error('No palette or name provided');
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session?.user.id },
      include: {
        ...this.USER_INCLUDES,
        Palettes: {
          where: input.palette
            ? { serial: this.stringifyPalette(input.palette) }
            : input.name
            ? { name: input.name }
            : undefined,
        },
        ...options.include,
      },
    });
    console.log('🚀 | file: palette.model.ts:80 | Palettes | user:', user);
    return user as User;
  }

  /**
   * publicProcedure
   * Based on whether a palette or a name (palette name) is provided,
   * it returns the appropriate palette
   *
   * @param {{
   *     ctx: InnerTRPCContext;
   *     input: { palette?: string[]; name?: string };
   *   }} {
   *     ctx,
   *     input,
   *   }
   * @return {*}
   * @memberof Palettes
   */
  async get({
    ctx,
    input,
  }: {
    ctx: InnerTRPCContext;
    input: { palette?: string[]; name?: string };
  }) {
    if (input.palette) {
      const palette = await ctx.prisma.palette.findUnique({
        where: Object.assign({
          serial: input.palette.map((hex) => hex.replace('#', '')).join('-'),
        }),
        include: { ...this.PALETTE_INCLUDES, user: true },
      });
      return palette;
    }

    if (input.name) {
      const palette = await ctx.prisma.palette.findUnique({
        where: Object.assign({
          name: input.name,
        }),
        include: { ...this.PALETTE_INCLUDES, user: true },
      });
      return palette;
    }
  }

  /**
   * protectedProcedure
   * Calls getOwnPalette to check if the palette exists and if the user is the owner
   * If the palette exists and the user is the owner, it deletes the palette
   * If the palette exists and the user is not the owner, it throws an error
   * If the palette does not exist, it throws an error
   *
   * @param {{
   *     ctx: InnerTRPCContext;
   *     input: { name: string };
   *   }} {
   *     ctx,
   *     input,
   *   }
   * @return {*}
   * @memberof Palettes
   */
  async delete({
    ctx,
    input,
  }: {
    ctx: InnerTRPCContext;
    input: { name: string };
  }) {
    const user = await this.getOwnPalette({
      ctx,
      input: {
        name: input.name ?? undefined,
      },
    });
    console.log('🚀 | file: palette.model.ts:157 | Palettes | user:', user);

    // if (!user?.) throw new Error('Palette not found');
    // if (user?.userId !== ctx.session?.user.id) {
    //   throw new Error('Not authorized');
    // }

    // const deletedPalette = await ctx.prisma.palette.delete({
    //   where: {
    //     name: input.name,
    //     userId: ctx.session?.user.id,
    //   },
    // });
    // return deletedPalette;
  }

  /**
   * protectedProcedure
   * Calls getOwnPalette to check if the palette exists and if the user is the owner
   * If the palette exists and the user is the owner, it forks the palette
   * If the palette does not exist, it creates a new palette
   *
   * @param {{
   *     ctx: InnerTRPCContext;
   *     input: { palette: string[]; name?: string };
   *   }} {
   *     ctx,
   *     input,
   *   }
   * @return {*}
   * @memberof Palettes
   */
  async create({
    ctx,
    input,
  }: {
    ctx: InnerTRPCContext;
    input: { palette: string[]; private: boolean; name?: string };
  }) {
    const user = await this.getOwnPalette({
      ctx,
      input: {
        palette: input.palette ?? undefined,
        name: input.name ?? undefined,
      },
    });

    if (user?.palettes) {
      console.log(
        '🚀 | file: palette.model.ts:206 | Palettes | palette:',
        user.Palettes
      );

      return await ctx.prisma.forked.create({
        data: {
          Palette: { connect: { id: palette.id } },
          user: { connect: { id: ctx.session?.user.id } },
        },
      });
    } else {
      return await ctx.prisma.palette.create({
        data: {
          name: input.name ?? shortname(),
          serial: input.palette.map((hex) => hex.replace('#', '')).join('-'),
          user: { connect: { id: ctx.session?.user.id } },
          Colors: {
            connect: input.palette.map((hex) => ({
              hex: hex.replace('#', ''),
            })),
          },
        },
      });
    }
  }
}
