import { type NextAuthOptions } from 'next-auth';

import { analytics } from '../../analytics';

// @link: https://next-auth.js.org/configuration/options#events
export const events: NextAuthOptions['events'] = {
  async signIn(message) {
    analytics.track('auth-signIn', {
      category: 'auth',
      label: 'auth:signIn',
      value: 1,
      ...message.user,
      isNewUser: message.isNewUser,
      // @TODO: add emailVerified field to tracking
    });
    analytics.identify(message.user.id, {
      ...message.user,
      isNewUser: message.isNewUser,
    });
  },
  async signOut(message) {
    analytics.track('auth-signOut', {
      category: 'auth',
      label: 'auth:signOut',
      value: 1,
      ...message.session.user,
    });
    analytics.identify(message.session.user.id, {});
  },
  async createUser(message) {
    analytics.track('auth-user-create', {
      category: 'auth',
      label: 'user:create',
      value: 1,
      ...message.user,
    });
    analytics.identify(message.user.id, {
      ...message.user,
    });
  },
  async updateUser(message) {
    analytics.track('auth-user-update', {
      category: 'auth',
      label: 'user:update',
      value: 1,
      ...message.user,
    });
    analytics.identify(message.user.id, {
      ...message.user,
    });
  },
  async linkAccount(message) {
    analytics.track('auth-link-account', {
      category: 'auth',
      label: 'account:link',
      value: 1,
      ...message.account,
    });
    if (!message.account && !message.user.name) {
      analytics.track('auth-link-account-error', {
        category: 'auth',
        label: 'account:link:error',
        value: 1,
      });
      analytics.identify(message.user.id, {
        ...message.user,
      });
    }
  },
  async session(message) {
    analytics.track('auth-session', {
      category: 'auth',
      label: 'session',
      value: 1,
      ...message.session.user,
    });
  },
};
