import { Box } from '@chakra-ui/react';
import Link from 'next/link';

import { MobileMenu, NavMenu } from '@/components';
import { Bar, ChakraNextImage } from '../components';
import { ScrollSlide } from '../framer';

export const Header: React.FC = () => {
  return (
    <Box zIndex="docked" mt={{ base: 32, xl: 0 }}>
      <ScrollSlide dir="down" from="top">
        <Bar as="header" top={0} bg="barBg" shadow="md">
          <Box position="relative" w="100px" h="172px" flex={1}>
            <Link href="/">
              <ChakraNextImage
                width="100"
                height="172"
                objectFit="contain"
                src={'/swatchr-md.png'}
                alt="swatchr;"
                priority
              />
            </Link>
          </Box>
          <NavMenu />
          <MobileMenu />
        </Bar>
      </ScrollSlide>
    </Box>
  );
};
