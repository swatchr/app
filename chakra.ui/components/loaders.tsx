import { Box, Spinner, VStack } from '@chakra-ui/react';

import type { SpinnerProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const FullScreenLoader: React.FC<SpinnerProps> = (
  props
): JSX.Element => {
  return (
    <VStack h="" w="full">
      <Box position="absolute" top={64} left="50%" translateX="50%">
        <Spinner {...props} />
      </Box>
    </VStack>
  );
};

export const ColorLoader: React.FC<SpinnerProps> = (props): JSX.Element => {
  return (
    <VStack as={motion.div} h="" w="full">
      <Box position="absolute" top={64} left="50%" translateX="50%">
        <Spinner {...props} />
      </Box>
    </VStack>
  );
};

export const PanelLoader: React.FC<SpinnerProps> = (props): JSX.Element => {
  return (
    <VStack
      position="relative"
      w="full"
      maxH="675px"
      minH="200px"
      justify="center"
      align="center"
    >
      <Box flex={1}>
        <Spinner {...props} />
      </Box>
    </VStack>
  );
};
