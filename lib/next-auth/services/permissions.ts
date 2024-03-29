/**
 *
 * @fileoverview This file contains functions that can be used to check if a user has permissions to perform an action
 * @SEE: https://github.com/echobind/bisonapp/blob/canary/packages/create-bison-app/template/services/permissions.ts
 *
 * Requires user roles to be added to prisma db
 */

import type { InnerTRPCContext } from '@/server/api/trpc';
import type { User } from '@prisma/client';

import { ROLES } from 'lib/prisma/utils';

// /**
//  * Returns true if the user has a role of admin
//  * @param user The user to check the role for
//  */
export const isAdmin = (user?: Partial<User> | null): boolean => {
  if (!user?.role) {
    return false;
  }

  return user.role === Number(ROLES.ADMIN);
};

// /**
//  * Returns true if the passed in user is the same as the logged in user
//  * @param user the user to test
//  * @param ctx the context which contains the current user
//  */
export function isSelf(
  id: User['id'],
  session: InnerTRPCContext['session']
): boolean {
  return id === session?.user.id;
}

export function isOwner(
  profileId: User['profileId'],
  session: InnerTRPCContext['session']
): boolean {
  return profileId === session?.user.profileId;
}

// /**
//  * Returns true if a user can access an object. This is a very basic check that quickly does the following:
//  *   The current user is an admin
//  *   The current user is trying to access themselves
//  *   The object has a userId property that the same id as the current user
//  * @param object the object to check for a userId property on
//  * @param ctx the context which contains the current user
//  * @param idField the key in the object to check against
//  */
export function canAccess(
  user: User,
  session: InnerTRPCContext['session'],
  idField = 'id' || 'userId'
): boolean {
  if (!session?.user) return false;
  if (isAdmin(session.user)) return true;
  if (isSelf(user.id, session)) return true;

  return (user as any)[idField] === session.user?.id;
}
