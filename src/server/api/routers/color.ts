import { z } from 'zod';

import {
  createTRPCRouter,
  publicProcedure,
} from '@/server/api/trpc';
import { handleServerError } from '../utils';

export const colorRouter = createTRPCRouter({
  scheme: publicProcedure
    .input(z.object({ hex: z.string() }))
    .query(async ({ input }) => {
      const mode = 'analogic-complement';
      const count = 10;
      try {
        const res = await fetch(
          `https://www.thecolorapi.com/scheme?hex=${input.hex}&mode=${mode}&count=${count}`,
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
    }),
});
