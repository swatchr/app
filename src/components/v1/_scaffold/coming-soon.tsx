import { Box, chakra, Flex } from '@chakra-ui/react';

import type { FC } from 'react';

import { ChakraNextImage } from 'chakra.ui';

export const ComingSoon: FC = () => {
  return (
    <Flex
      w="full"
      flexDirection="column"
      justify="center"
      alignItems="center"
      h="80vh"
      my="auto"
      mx="auto"
    >
      <Box position="relative" mt="10em" flex={1}>
        <ChakraNextImage
          width="500"
          height="430"
          objectFit="contain"
          src={'/uploads/assets/brand/rupi-new-logo-optimized.webp'}
          alt=""
          priority
        />
        <chakra.p
          fontSize="4xl"
          color="secondary"
          textTransform="uppercase"
          letterSpacing="widest"
          textAlign="center"
        >
          Coming Soon
        </chakra.p>
      </Box>
    </Flex>
  );
};
