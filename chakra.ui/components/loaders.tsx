import { Box, Spinner, VStack } from '@chakra-ui/react';

export const FullScreenLoader: React.FC = (): JSX.Element => {
  return (
    <VStack h="" w="full">
      <Box position="absolute" top={64} left="50%" translateX="50%">
        <Spinner />
      </Box>
    </VStack>
  );
};

export const PanelLoader: React.FC = (): JSX.Element => {
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
        <Spinner />
      </Box>
    </VStack>
  );
};
