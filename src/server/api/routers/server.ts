import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { encodeQueryParams, parsePalette } from '@/utils';
import { shortname } from 'lib/unique-names-generator';
import { trpcPrismaErrorHandler } from '../utils/error/server';

export const serverRouter = createTRPCRouter({
  ip: publicProcedure.query(({ ctx }) => {
    return (
      ctx.req.headers['x-real-ip'] || ctx.req.headers['x-forwarded-for'] || null
    );
  }),
  domain: publicProcedure.query(({ ctx }) => {
    return ctx.req.headers.host || null;
  }),
});
