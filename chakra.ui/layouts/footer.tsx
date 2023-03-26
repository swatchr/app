import { Box, HStack, Text } from '@chakra-ui/react';

import { NavMenu } from '@/components';
import { Bar, ChakraNextImage } from '../components';
import { ScrollSlide } from '../framer';

export const Footer: React.FC = () => {
  return (
    <Box zIndex="docked" position="fixed">
      <ScrollSlide dir="up" from="bottom">
        <Bar as="footer" bottom={0} bg="barBg" shadow="md">
          <HStack h="100%" align="flex-end" maxW="lg">
            <Box position="relative" w="100px" h="54px" flex={1}>
              <ChakraNextImage
                width="100"
                height="54"
                objectFit="contain"
                src={'/swatchr-md.png'}
                alt="swatchr;"
                priority
              />
            </Box>
            <Text fontSize="xl" color="gray.600">
              &copy; {new Date().getFullYear()}{' '}
            </Text>
          </HStack>
          <NavMenu
            // display={{ base: 'none', md: 'flex' }}
            mr={{ base: 0, lg: 20 }}
          />
        </Bar>
      </ScrollSlide>
    </Box>
  );
};
