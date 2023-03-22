import type { User } from '@prisma/client';
import type { CallbacksOptions } from 'next-auth';

export const jwt: CallbacksOptions['jwt'] = ({ token, account, profile }) => {
  if (account) {
    token.accessToken = account.access_token;
    token.id = profile?.sub;
  }

  return token;
};

export const session: CallbacksOptions['session'] = ({
  session,
  user,
  token,
}) => {
  if (session.user) {
    session.user.id = user.id;
    session.user.profileId = user?.profileId;
    session.user.emailVerified = user?.emailVerified;
    session.user.role = user?.role || 0; // make user anonymous if they don't have a role
    if (!session?.accessToken) {
      session.accessToken = token?.accessToken;
    }
  }
  return session;
};

export const signIn: CallbacksOptions['signIn'] = ({
  user,
  account,
  profile, // @NOTE: this is the profile from the provider not our profile
  email,
  credentials,
}) => {
  // @NOTE: must specify a validation check for each provider
  if (account?.provider === 'google' && profile?.email) {
    return profile?.email.endsWith('@gmail.com');
  }
  return true;
};

export const callbacks = { signIn, jwt, session };
