import * as jwt from 'jsonwebtoken';

import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

import { env } from '@/env.mjs';
import { composeUrl, ONE_DAY_MS } from '@/utils';

/** refreshToken is used to refresh google auth token
 * @SEE: https://tinyurl.com/2gnnzhky
 */
export const refreshAccessToken = async (token: JWT) => {
  try {
    const url = composeUrl('https://oauth2.googleapis.com/token?', {
      client_id:
        process.env.GOOGLE_CLIENT_ID ??
        '681384252351-1nspra5u28snv8om0vg9ost0tpgovlvq.apps.googleusercontent.com',
      client_secret:
        process.env.GOOGLE_CLIENT_SECRET ??
        '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',
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
    }).toString();

    const r = await fetch(url, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    });

    const refreshedTokens = await r.json();

    if (!r.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      // Fall back to old refresh token
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);

    return { ...token, error: 'RefreshAccessTokenError' };
  }
};

export const jwtHandlers: NextAuthOptions['jwt'] = {
  async encode({ token }) {
    return jwt.sign(token as JWT, String(env.NEXTAUTH_SECRET));
  },
  async decode({ token }) {
    return jwt.verify(String(token), String(env.NEXTAUTH_SECRET)) as JWT;
  },
};

/**
 * REST OF THIS FILE IS CURRENTLY NOT IMPLEMENTED-- SAVED AS A REFERENCE
 * @SEE: https://tinyurl.com/2mokc9p6
 *
 * @export
 * @param {JWT} tokenToSign
 * @return {*}  {string}
 */
export function generateToken(tokenToSign: JWT): string {
  const token = jwt.sign(tokenToSign, String(env.NEXTAUTH_SECRET), {
    expiresIn: process.env.JWT_EXPIRED_TIME ?? ONE_DAY_MS,
  });
  return token;
}

/**
 * @SEE: https://tinyurl.com/2mokc9p6
 *
 * To generate jwt token for admin@socialgames.com admin-user
 * @param tokenToSign contains user_id
 */
export function generateAdminToken(tokenToSign: JWT): string {
  const token = jwt.sign(tokenToSign, String(process.env.NEXTAUTH_SECRET));
  return token;
}
/**
 *
 *
 * @export
 * @param {string} token
 * @return {*}  {Promise<JWT>}
 */
export async function verify(token: string): Promise<JWT> {
  try {
    const payload = jwt.verify(
      token,
      String(process.env.NEXTAUTH_SECRET)
    ) as JWT;
    return { user_id: payload.user_id };
  } catch (e) {
    console.log(e);
    throw new Error('verification error');
  }
}

/**
 * @SEE: https://tinyurl.com/2mokc9p6
 *
 * @export
 * @param {Request} request
 * @return {*}  {string}
 */
export function getTokenFromHeader(request: Request): string {
  let token = request.headers.get('x-access-token');

  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    return (token = token.slice(7, token.length));
  }
  return token as string;
}
