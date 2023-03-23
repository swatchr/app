import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { checkRequestParams } from '../utils';

const profileWhereInputSchema = z.object({
  profileId: z.string().optional(),
  // userName: z.string().optional(),
});

export const profileRouter = createTRPCRouter({
  me: publicProcedure.input(profileWhereInputSchema).query(({ input, ctx }) => {
    checkRequestParams([!!(input.profileId || ctx.session?.user.profileId)]);
    const profile = ctx.prisma.profile.findUnique({
      where: Object.assign(
        {},
        { id: input?.profileId ?? ctx.session?.user.profileId }
      ),
      include: { User: true, Owned: true },
    });

    return profile;
  }),
});
