import { SkipNavLink } from '@chakra-ui/skip-nav';
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';

import type { NextComponentTypeWithAuth } from '@/types';
import type { Session } from 'next-auth';
import type { AppType } from 'next/app';

import { AutoToast, CustomAnalytics, getToastStatus } from '@/components/';
import { AuthGate } from '@/components/v1/auth';
import { ErrorBoundary, isDev } from '@/utils';
import { api } from '@/utils/api';
import { ChakraWrapper } from 'chakra.ui';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
  router,
}) => {
  const { auth } = Component as NextComponentTypeWithAuth;
  const { status, success, error } = getToastStatus(router.asPath);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
      </Head>
      <SkipNavLink mt={56} ml={4}>
        Skip to content
      </SkipNavLink>
      <ErrorBoundary>
        <SessionProvider session={session}>
          {!isDev ? <CustomAnalytics asPath={router.asPath} /> : null}
          <ChakraWrapper>
            <AutoToast
              status={status}
              message={String(error) ?? String(success)}
            >
              {auth ? (
                <AuthGate>
                  <Component {...pageProps} />
                </AuthGate>
              ) : (
                <Component {...pageProps} />
              )}
            </AutoToast>
          </ChakraWrapper>
        </SessionProvider>
        <Analytics />
      </ErrorBoundary>
    </>
  );
};

export default api.withTRPC(MyApp);
