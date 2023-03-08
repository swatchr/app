import { randomBytes } from 'crypto';

import type { Session, User } from 'next-auth';

import { prisma } from '../../../src/server/db';

/**
 ** Use by test factory
 *
 ** @SEE: https://tinyurl.com/2hmcdg8u
 */

const defaultSessionMaxAge = 30 * 24 * 60 * 60 * 1000;
const sessionMaxAge = defaultSessionMaxAge;
const sessionUpdateAge = 24 * 60 * 60 * 1000;
/**
 *
 *
 * @export
 * @param {User} user
 * @return {*}
 */
export async function createSession(user: User) {
  try {
    let expires = null;
    if (sessionMaxAge) {
      const dateExpires = new Date();
      dateExpires.setTime(dateExpires.getTime() + sessionMaxAge);
      expires = dateExpires.toISOString();
    }
    if (!expires) throw new Error('createSession ' + 'no expiration');
    return prisma['session'].create({
      data: {
        expires,
        userId: user.id,
        sessionToken: randomBytes(32).toString('hex'),
        // accessToken: randomBytes(32).toString('hex'),
      },
    });
  } catch (error) {
    console.error('CREATE_SESSION_ERROR', error);
    return Promise.reject(
      new Error('CREATE_SESSION_ERROR ' + JSON.stringify(error))
    );
  }
}

/**
 *
 *
 * @export
 * @param {Session} session
 * @param {boolean} force
 * @return {*}
 */
export async function updateSession(session: Session, force: boolean) {
  console.log('UPDATE_SESSION', session);
  try {
    if (
      sessionMaxAge &&
      (sessionUpdateAge || sessionUpdateAge === 0) &&
      session.expires
    ) {
      // Calculate last updated date, to throttle write updates to database
      // Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
      //     e.g. ({expiry date} - 30 days) + 1 hour
      //
      // Default for sessionMaxAge is 30 days.
      // Default for sessionUpdateAge is 1 hour.
      const dateSessionIsDueToBeUpdated = new Date(session.expires);
      dateSessionIsDueToBeUpdated.setTime(
        dateSessionIsDueToBeUpdated.getTime() - sessionMaxAge
      );
      dateSessionIsDueToBeUpdated.setTime(
        dateSessionIsDueToBeUpdated.getTime() + sessionUpdateAge
      );

      // Trigger update of session expiry date and write to database, only
      // if the session was last updated more than {sessionUpdateAge} ago
      if (new Date() > dateSessionIsDueToBeUpdated) {
        const newExpiryDate = new Date();
        newExpiryDate.setTime(newExpiryDate.getTime() + sessionMaxAge);
        session.expires = `${newExpiryDate}`; // check: coerced to string
      } else if (!force) {
        return null;
      }
    } else {
      // If session MaxAge, session UpdateAge or session.expires are
      // missing then don't even try to save changes, unless force is set.
      if (!force) {
        return null;
      }
    }

    const { id, expires } = session as { id: string } & Session;
    return prisma['session'].update({ where: { id }, data: { expires } });
  } catch (error) {
    console.error('UPDATE_SESSION_ERROR', error);
    return Promise.reject(
      new Error('UPDATE_SESSION_ERROR ' + JSON.stringify(error))
    );
  }
}

/**
 *
 *
 * @export
 * @param {*} sessionToken
 * @return {*}
 */
export async function deleteSession(sessionToken: any) {
  console.log('DELETE_SESSION', sessionToken);
  try {
    return prisma['session'].delete({ where: { sessionToken } });
  } catch (error) {
    console.error('DELETE_SESSION_ERROR', error);
    return Promise.reject(
      new Error('DELETE_SESSION_ERROR ' + JSON.stringify(error))
    );
  }
}
