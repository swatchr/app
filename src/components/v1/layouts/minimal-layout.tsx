import { Box, chakra } from '@chakra-ui/react';
import { SkipNavContent } from '@chakra-ui/skip-nav';
import { NextSeo } from 'next-seo';

import type { OGImage } from '@/utils/seo';
import type { FC } from 'react';

import { SEOConfig } from '@/utils/seo';
import { PreviewDisclaimer } from './preview-disclaimer';

export type MinimalLayoutProps = {
  title: string;
  description?: string;
  image?: OGImage;
  children: React.ReactNode;
};

export const MinimalLayout: FC<MinimalLayoutProps> = ({
  title = 'Site Title',
  description = '',
  image,
  children,
}) => {
  return (
    <>
      <NextSeo {...SEOConfig(title, description, image)} />
      <chakra.main bg="bg">
        <PreviewDisclaimer />s
        <SkipNavContent />
        <Box
          position="relative"
          w="full"
          color={'text'}
          minHeight="100vh"
          overflow="hidden"
          my={20}
        >
          {children}
        </Box>
      </chakra.main>
    </>
  );
};
