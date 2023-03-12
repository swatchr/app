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
    session.user.id = user?.id;
    if (!session?.accessToken) {
      session.accessToken = token?.accessToken;
    }
  }
  return session;
};

export const signIn: CallbacksOptions['signIn'] = ({
  user,
  account,
  profile,
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
