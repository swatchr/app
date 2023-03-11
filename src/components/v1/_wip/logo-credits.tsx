import {
  Box,
  Button,
  chakra,
  Container,
  HStack,
  Icon,
  Input,
  InputGroup,
  Link,
  VisuallyHidden,
} from '@chakra-ui/react';
import { useState } from 'react';

import { InputUser } from '@/hooks/use-input';
import { isDev } from '@/utils';
import { Drawer, Sidebar } from 'chakra.ui';
import { LogoIconNew } from '../icons/swatchr/logo-icon-new';
import { SidebarTests } from './sidebar-tests';

export function LogoCredits() {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <Box position="absolute" bottom={12} right={12} cursor="pointer">
      <Icon
        as={LogoIconNew}
        boxSize={14}
        filter="drop-shadow(0.1rem 0.1rem 0.1rem #333)"
        onClick={() => setShowCredits(true)}
      />
      {isDev && true ? (
        <Sidebar open={true}>
          <SidebarTests />
        </Sidebar>
      ) : isDev ? (
        <Drawer
          isOpen={isDev && showCredits}
          onClose={() => setShowCredits(false)}
          placement="bottom"
        >
          <Container
            w="full"
            maxW="container.xl"
            minH="20vh"
            p={4}
            my={4}
            rounded="md"
          >
            <chakra.h3 fontFamily="mono">Credits</chakra.h3>
            <Box py={4}>
              <HStack>
                <Link href={'https://www.thecolorapi.com'} isExternal>
                  The Color Api
                </Link>
                <chakra.p fontSize="sm">
                  <Link
                    as={chakra.span}
                    href={'https://www.joshbeckman.org/'}
                    isExternal
                  >
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Josh Beckman's
                  </Link>
                  free color api project allows us to query the closest matching
                  names of each color.
                </chakra.p>
              </HStack>
              <HStack>
                <Link href={'https://wesbos.com/'} isExternal>
                  Wes Bos
                </Link>
                <chakra.p fontSize="sm">
                  For sharing his knowledge and making the learning process a
                  whole lot more approachable
                </chakra.p>
              </HStack>
            </Box>
          </Container>
        </Drawer>
      ) : null}
    </Box>
  );
}
