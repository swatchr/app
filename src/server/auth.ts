import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { getServerSession } from 'next-auth';

import type { User } from '@prisma/client';
import { type GetServerSidePropsContext } from 'next';
import { type DefaultSession, type NextAuthOptions } from 'next-auth';

import { prisma } from '@/server/db';
import { callbacks, events, providers } from 'lib/next-auth/options';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken: string | unknown;
    user: {
      id: string;
      // ...other properties
      role: User['roleType'];
      // role?: string;
    } & DefaultSession['user'];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks,
  adapter: PrismaAdapter(prisma),
  providers,
  events,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *import { GoogleProvider } from 'next-auth/providers/google';

 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
