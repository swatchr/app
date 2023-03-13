import type { InnerTRPCContext } from '@/server';

import { shortname } from 'lib/unique-names-generator';

export class Palettes {
  constructor() {}

  private DEFAULT_INCLUDES = {
    colors: true,
    user: true,
    Palettes: true,
    Tags: true,
    Owned: true,
    Forked: true,
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

    const palette = await ctx.prisma.user.findUnique({
      where: { id: ctx.session?.user.id },
      include: {
        ...this.DEFAULT_INCLUDES,
        Palettes: {
          where: input.palette
            ? { serial: this.stringifyPalette(input.palette) }
            : input.name
            ? { name: input.name }
            : {},
        },
        ...options.include,
      },
    });
    return palette;
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
        include: this.DEFAULT_INCLUDES,
      });
      return palette;
    }

    if (input.name) {
      const palette = await ctx.prisma.palette.findUnique({
        where: Object.assign({
          name: input.name,
        }),
        include: this.DEFAULT_INCLUDES,
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
    const userPalette = await this.getOwnPalette({
      ctx,
      input: {
        name: input.name ?? undefined,
      },
    });

    if (!userPalette) throw new Error('Palette not found');
    if (userPalette.userId !== ctx.session?.user.id) {
      throw new Error('Not authorized');
    }

    const deletedPalette = await ctx.prisma.palette.delete({
      where: {
        name: input.name,
      },
    });
    return deletedPalette;
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
    input: { palette: string[]; name?: string };
  }) {
    const palette = await this.getOwnPalette({
      ctx,
      input: {
        palette: input.palette ?? undefined,
        name: input.name ?? undefined,
      },
    });

    if (palette) {
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
        },
      });
    }
  }
}
