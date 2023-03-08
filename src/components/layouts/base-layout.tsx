import { Box, chakra } from '@chakra-ui/react';
import { SkipNavContent } from '@chakra-ui/skip-nav';
import { NextSeo } from 'next-seo';

import type { FC } from 'react';

import { SEOConfig } from '@/utils/seo';
import { MotionBox, transitionDown as variants } from 'chakra.ui';

export type BaseLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export const BaseLayout: FC<BaseLayoutProps> = ({
  title = 'Site Title',
  description = '',
  children,
}) => {
  return (
    <>
      <NextSeo {...SEOConfig(title, description)} />
      <Main>{children}</Main>
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
        <Box
          position="relative"
          w="full"
          color={'text'}
          minHeight="100vh"
          overflowX="hidden"
        >
          {children}
        </Box>
      </MotionBox>
    </chakra.main>
  );
};
