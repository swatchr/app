import {
  Box,
  chakra,
  Container,
  HStack,
  Icon,
  Link,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import { isDev } from '@/utils';
import { Drawer, Sidebar } from 'chakra.ui';
import { motion } from 'framer-motion';
import { LogoIcon } from '../icons/swatchr/logo-icon';
import { SidebarTests } from './sidebar-tests';

export function LogoCredits({ scaled }: { scaled: boolean }) {
  const [showCredits, setShowCredits] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Box
        as={motion.div}
        boxSize={8}
        initial={{ scale: 0.9 }}
        animate={{
          opacity: [1, 0.1, 0.1, 1],
          scale: [1, 0.1, 1],
          rotateY: [0, -180, -360],
          rotateX: [0, -180, -360, 180, 0],
          transition: { duration: 1.5, ease: 'circIn' },
        }}
        exit={{ scale: 0.9, transition: { duration: 0.75 } }}
      >
        <Icon as={LogoIcon} onClick={onOpen} />
      </Box>
      {scaled && (
        <VStack
          as={motion.div}
          maxH={10}
          pl={4}
          initial="hide"
          animate={scaled ? 'show' : 'hide'}
          align="center"
        >
          <chakra.p
            as={motion.div}
            fontFamily="brand"
            fontSize="3xl"
            lineHeight="shorter"
            display="block"
            letterSpacing="wider"
            initial={{ y: 10, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                delay: 0.5,
              },
            }}
          >
            Swatchr
          </chakra.p>
          <chakra.p
            as={motion.div}
            display="block"
            fontFamily="accent"
            fontSize="xs"
            letterSpacing="wider"
            initial={{ y: 15, opacity: 0 }}
            animate={{
              y: -12,
              opacity: 1,
              transition: {
                delay: 1,
              },
            }}
          >
            Color Palette Manager
          </chakra.p>
        </VStack>
      )}
      {isDev && isOpen ? (
        // {true ? (
        <Sidebar open={true} onClose={onClose}>
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
    </>
  );
}
