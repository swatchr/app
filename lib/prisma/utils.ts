import { env } from '@/env.mjs';

export const ROLES = {
  ADMIN: env.NEXT_PUBLIC_ADMIN,
  USER: env.NEXT_PUBLIC_USER,
  UNVERIFIED: env.NEXT_PUBLIC_UNVERIFIED,
  ANONYMOUS: env.NEXT_PUBLIC_ANONYMOUS,
};
