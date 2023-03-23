import { createTRPCRouter } from '@/server/api/trpc';
import {
  authRouter,
  colorRouter,
  dbRouter,
  emailRouter,
  paletteRouter,
  profileRouter,
  serverRouter,
} from './routers';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  server: serverRouter,
  email: emailRouter,
  color: colorRouter,
  palette: paletteRouter,
  profile: profileRouter,
  // db: dbRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
