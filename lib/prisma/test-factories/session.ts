/**
 ** @SEE: https://tinyurl.com/2hmcdg8u
 */

import { createHash, randomBytes } from 'crypto';

import type { Session, User } from 'next-auth';

import { prisma } from '../../../src/server/db';

const defaultSessionMaxAge = 30 * 24 * 60 * 60 * 1000;
const sessionMaxAge = defaultSessionMaxAge;
const sessionUpdateAge = 24 * 60 * 60 * 1000;

export async function createTestSession(user: User) {
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
