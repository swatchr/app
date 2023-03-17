import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { getServerSession } from 'next-auth';

import type { User as PrismaUser } from '@prisma/client';
import { type GetServerSidePropsContext } from 'next';
import {
  type DefaultSession,
  type DefaultUser,
  type NextAuthOptions,
} from 'next-auth';

import { prisma } from '@/server/db';
import { callbacks, events, providers } from 'lib/next-auth/options';
import { z } from 'zod';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

type U = Omit<PrismaUser, keyof DefaultUser>;
declare module 'next-auth' {
  interface User extends U {
    role: number | null;
    profileId: string | undefined;
  }
  interface Session extends DefaultSession {
    accessToken: string | unknown;

    user: {
      role: number | undefined;
      profileId: string | undefined;
    } & DefaultUser;
  }
}

export const authUserSchema = z.object({
  id: z.string().nullish().optional(),
  email: z.string().nullish().optional(),
  image: z.string().nullish().optional(),
  name: z.string().nullish().optional(),
  role: z.number().nullish().optional(),
  profile: z.string().nullish().optional(),
});

export const authSessionSchema = z.object({
  accessToken: z.union([z.string(), z.unknown()]),
  expires: z.string(),
  user: authUserSchema,
});

export type AuthSession = z.infer<typeof authSessionSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;

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
import { User } from '@prisma/client';

 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
