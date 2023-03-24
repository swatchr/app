import { CloseIcon } from '@chakra-ui/icons';
import { Box, Center, chakra, IconButton, Slide } from '@chakra-ui/react';
import { SkipNavContent } from '@chakra-ui/skip-nav';
import { NextSeo } from 'next-seo';
import { useState } from 'react';

import type { OGImage } from '@/utils/seo';
import type { FC } from 'react';

import { SEOConfig } from '@/utils/seo';
import { MotionBox, transitionDown as variants } from 'chakra.ui';

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
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  return (
    <>
      <NextSeo {...SEOConfig(title, description, image)} />
      <chakra.main bg="bg">
        <Center
          w="full"
          bg="#BADA55"
          color="black"
          position="absolute"
          top={0}
          py={1}
          zIndex={10}
          as={Slide}
          in={showDisclaimer}
          direction="top"
          unmountOnExit
          // @ts-expect-error transition is not properly typed
          transition={{ delay: 2000 }}
          shadow="sm"
        >
          Public Alpha Preview | &nbsp;
          <chakra.span fontWeight={600}>DISCLAIMER: </chakra.span>&nbsp; User
          data is not persisted during preview period.
          <IconButton
            position="absolute"
            right={6}
            aria-label="Close"
            icon={<CloseIcon />}
            size="xs"
            variant="unstyled"
            colorScheme="blackAlpha"
            color="black"
            onClick={() => {
              setShowDisclaimer(false);
            }}
            float="right"
          />
        </Center>
        <SkipNavContent />
        <Box
          position="relative"
          w="full"
          color={'text'}
          // minHeight="100vh"
          // maxHeight="100vh"
          height="$100vh" // chakra box height trick:
          // @SEE: https://twitter.com/pagebakers/status/1638973614296031232/photo/1
          overflow="hidden"
        >
          {children}
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
