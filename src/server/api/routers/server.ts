import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const serverRouter = createTRPCRouter({
  ip: publicProcedure.query(({ ctx }) => {
    return (
      ctx.req.headers['x-real-ip'] || ctx.req.headers['x-forwarded-for'] || null
    );
  }),
});
