import { Box, chakra } from '@chakra-ui/react';
import { SkipNavContent } from '@chakra-ui/skip-nav';
import { NextSeo } from 'next-seo';

import type { OGImage } from '@/utils/seo';
import type { FC } from 'react';

import { SEOConfig } from '@/utils/seo';
import { MotionBox, transitionDown as variants } from 'chakra.ui';
import { MadeFooter } from './made-footer';
import { PreviewDisclaimer } from './preview-disclaimer';

export type BaseLayoutProps = {
  title: string;
  description?: string;
  image?: OGImage;
  children: React.ReactNode;
};

export const BaseLayout: FC<BaseLayoutProps> = ({
  title = 'Site Title',
  description = '',
  image,
  children,
}) => {
  return (
    <>
      <NextSeo {...SEOConfig(title, description, image)} />
      <chakra.main bg="bg">
        <PreviewDisclaimer />
        <SkipNavContent />
        <Box
          position="relative"
          w="full"
          color="text"
          height="$100vh" // chakra box height trick:
          // @SEE: https://twitter.com/pagebakers/status/1638973614296031232/photo/1
          overflow="hidden"
        >
          {children}
          <MadeFooter />
        </Box>
      </chakra.main>
    </>
  );
};

type MainProps = {
  children: React.ReactNode;
};

const Main: FC<MainProps> = ({ children }) => {
  return (
    <chakra.main bg="bg">
      <SkipNavContent />
      <MotionBox
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        position="relative"
        w="full"
        pt={0}
        mt={0}
        pb={0}
      >
        {/* <Box
          position="relative"
          w="full"
          color={'text'}
          minHeight="100vh"
          overflowX="hidden"
        > */}
        {children}
        {/* </Box> */}
      </MotionBox>
    </chakra.main>
  );
};
