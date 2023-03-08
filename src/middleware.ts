import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { isDev } from './utils';
import { env } from './env.mjs';

// @SEE: https://supabase.com/docs/guides/auth/auth-helpers/nextjs#auth-with-nextjs-middleware
export async function middleware(req: NextRequest) {
  const start = Date.now();
  console.log('middleware running...', { start });
  // create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next();

  if (!isDev && !res.cookies.get('current-ip')) {
    let ip = req.ip ?? req.headers.get('x-real-ip');
    const forwardedFor = req.headers.get('x-forwarded-for');

    if (!ip && forwardedFor) {
      console.log('🚀 | file: middleware.ts:18 | ip:', ip);
    }

    if (ip) {
      res.cookies.set('current-ip', ip, { httpOnly: false });
    }
    console.log('🚀 | file: middleware.ts:21 | ip:', ip, forwardedFor);
  }

  const token = await getToken({ req, secret: env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  const whitelist: string[] = ['api/auth', '/'];

  if (whitelist.includes(pathname) || token) {
    console.log('response.next at middleware', null);
    return NextResponse.next();
  }

  //redirect them to login if they don't have token and are
  //requesting a protected route
  const protectedRoutes: string[] = ['/admin'];

  const isProtectedRoute = protectedRoutes.every((path) => path === pathname);

  if (!token && isProtectedRoute) {
    console.log('redirect to login middleware', null);
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // // @NOTE: Check auth condition
  // if (!!session?.user.email) {
  //   // Authentication successful, forward request to protected route.
  //   return res;
  // }

  // const { pathname } = req.nextUrl;

  // // @NOTE: Auth condition not met, redirect to home page.
  // const redirectUrl = req.nextUrl.clone();
  // redirectUrl.pathname = '/';
  // redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);

  const end = Date.now();
  console.log('middleware ended', { elapsed: end - start });

  // return NextResponse.redirect(encodeURIComponent(redirectUrl));
}

export const config = {
  matcher: '/sandbox',
};
