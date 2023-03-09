import { createTRPCRouter } from '@/server/api/trpc';
import { authRouter, colorRouter, emailRouter } from './routers';
import { exampleRouter } from './routers/example';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  email: emailRouter,
  color: colorRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
