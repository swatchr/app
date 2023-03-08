import { useSession } from 'next-auth/react';
import React from 'react';
import { FullScreenLoader } from 'chakra.ui';

type AuthGateProps = {
  // session: Session| null;
  children: React.ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  // @link: https://next-auth.js.org/getting-started/client#custom-client-session-handling
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === 'loading') {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
}
