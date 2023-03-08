import { SkipNavLink } from '@chakra-ui/skip-nav';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

import { type AppType } from 'next/app';
import { type Session } from 'next-auth';

import { api } from '@/utils/api';
import { ErrorBoundary } from '@/utils';
import { ChakraWrapper } from 'chakra.ui';

import '@/styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
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
        <ChakraWrapper>
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </ChakraWrapper>
        <Analytics />
      </ErrorBoundary>
    </>
  );
};

export default api.withTRPC(MyApp);
