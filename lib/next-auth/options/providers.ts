/* eslint-disable no-unused-vars */
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '@/server/db';
import { type NextAuthOptions } from 'next-auth';

// import EmailProvider from 'next-auth/providers/email';
// import { ONE_DAY } from '@/utils';
import { env } from '@/env.mjs';
import { ONE_DAY_MS, TEST_ENV } from '@/utils';
import { User } from '@prisma/client';
import EmailProvider from 'next-auth/providers/email';
import { comparePasswords } from '../services';

const google = GoogleProvider({
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  // authorization: {
  //   params: {
  //     prompt: 'consent',
  //     access_type: 'offline',
  //     response_type: 'code',
  //     scope:
  //       'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  //   },
  // },
});

// /**
//  * @NOTE: Requires nodemailer + JWT strategy + callback to work
//  */
const email = EmailProvider({
  server: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  },
  from: process.env.EMAIL_FROM,
  maxAge: ONE_DAY_MS, // How long email links are valid for (default 24h)
});

/**
 * @NOTE: Requires JWT strategy + callback to work
 * + must also add password field to db
 * @FIXME: this is not working due to a type issue after updating client side user/session/role handling see #sha- 250b035b441448c2e5e3461ad6393a56222c16ab
 */
// const credentials = CredentialsProvider({
//   name: 'Credentials',
//   credentials: {
//     email: {
//       label: 'Username',
//       type: 'text',
//       placeholder: 'you@youremail.com',
//       value: process.env.TEST_USER,
//     },
//     password: {
//       label: 'Password',
//       type: 'password',
//       placeholder: '***********',
//       value: process.env.TEST_PW,
//     },
//   },
//   async authorize(credentials, req) {
//     if (!credentials || !credentials?.email || !credentials?.password) {
//       console.log('🔴 invalid credentials');
//       return null;
//     }
//     const user = await prisma.user.findUnique({
//       where: { email: credentials?.email },
//       include: { Profile: true },
//     });

//     if (!user || !user?.password) return null;

//     if (comparePasswords(credentials?.password, user?.password)) {
//       console.log('🟢 password compare success');
//       return { ...user, profile: user?.Profile?.id };
//     }
//     console.log('🔴 password compare fail');
//     return null;
//   },
// });

export const providers: NextAuthOptions['providers'] = [email];
// TEST_ENV ? providers.push(credentials) : providers.push(google);
