import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from '@chakra-ui/react';
import '@fontsource/bebas-neue/400.css';
import '@fontsource/recursive/300.css';
import '@fontsource/recursive/400.css';
import '@fontsource/recursive/500.css';
import '@fontsource/recursive/600.css';
import '@fontsource/recursive/700.css';
import '@fontsource/recursive/800.css';
import '@fontsource/recursive/900.css';

import type { GetServerSidePropsContext } from 'next';

import { CookieConsent } from '@/components';
import { AvatarMenu } from 'chakra.ui/components';
import { theme } from '../theme';

type ChakraProps = {
  cookies?: string;
  children: React.ReactNode;
};

export const ChakraWrapper: React.FC<ChakraProps> = ({ cookies, children }) => {
  const colorModeManager =
    // https://chakra-ui.com/docs/styled-system/color-mode#add-colormodemanager-optional-for-ssr
    typeof cookies === 'string'
      ? cookieStorageManagerSSR(cookies)
      : localStorageManager;

  return (
    <ChakraProvider
      resetCSS
      theme={theme}
      // colorModeManager={colorModeManager} //
    >
      <AvatarMenu />
      {children}
      <CookieConsent />
    </ChakraProvider>
  );
};

// also export a reusable function getServerSideProps
export function getServerSideProps({ req }: GetServerSidePropsContext) {
  return {
    props: {
      cookies: req.headers.cookie ?? '',
      // first time users will not have any cookies and you may not return
      // undefined here, hence ?? is necessary
    },
  };
}
