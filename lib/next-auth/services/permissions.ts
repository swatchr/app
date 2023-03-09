export default {};
/**
 *
 * @TODO: implement permissions handling as inspired from BisonApp
 * @SEE: https://github.com/echobind/bisonapp/blob/canary/packages/create-bison-app/template/services/permissions.ts
 *
 * Requires user roles to be added to prisma db
 */

// import { User } from '@prisma/client';

// // import { Context } from '@/server/trpc/context';
// import { Context } from '@/server/api/trpc';

// /**
//  * Returns true if the user has a role of admin
//  * @param user The user to check the role for
//  */
// export const isAdmin = (user?: Partial<User> | null): boolean => {
//   if (!user?.roleType) {
//     return false;
//   }

//   return user.roleType.includes('admin');
// };

// /**
//  * Returns true if the passed in user is the same as the logged in user
//  * @param user the user to test
//  * @param ctx the context which contains the current user
//  */
// export function isSelf(user: Pick<User, 'id'>, ctx: Context): boolean {
//   return user.id === ctx.session?.user.id;
// }

// /**
//  * Returns true if a user can access an object. This is a very basic check that quickly does the following:
//  *   The current user is an admin
//  *   The current user is trying to access themselves
//  *   The object has a userId property that the same id as the current user
//  * @param object the object to check for a userId property on
//  * @param ctx the context which contains the current user
//  * @param idField the key in the object to check against
//  */
// export function canAccess(
//   object: User,
//   ctx: Context,
//   idField = 'userId'
// ): boolean {
//   if (!ctx.session?.user) return false;
//   if (isAdmin(ctx.session.user)) return true;
//   if (isSelf(object, ctx)) return true;

//   return (object as any)[idField] === ctx.session.user?.id;
// }
