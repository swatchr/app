import {
  Box,
  chakra,
  Container,
  Flex,
  HStack,
  Icon,
  Link,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import { LogoIcon, Swatch } from '@/components';
import {
  ColorProvider,
  ContentProvider,
  DisclosureProvider,
  usePaletteState,
} from '@/contexts';
import { isDev } from '@/utils';
import { Drawer } from 'chakra.ui';
import Color from 'lib/color';
import { LogoIconNew } from '../icons/swatchr/logo-icon-new';
import { ColorBlindnessSimulator } from './color-blindness-simulator';
import { HeaderIconStack } from './header-icon-stack';
import { ExportPanel } from './panels/export-panel';

export function Palette() {
  const { palette } = usePaletteState();

  const [showCB, setShowCB] = useState(false);
  const showColorBlindness = useCallback(
    () => setShowCB(!showCB),
    [showCB, setShowCB]
  );

  const contrast =
    new Color(palette[0]!).contrast == 'dark' ? 'whiteAlpha' : 'blackAlpha';

  const { isOpen, onOpen, onClose } = useDisclosure(); // export modal

  return (
    <>
      <HeaderIconStack
        palette={palette}
        openModal={onOpen}
        showColorBlindness={showColorBlindness}
        showCB={showCB}
      />
      <ExportPanel isOpen={isOpen} onClose={onClose} />
      {showCB ? (
        <ColorBlindnessSimulator contrast={contrast} palette={palette} />
      ) : null}
      <Flex className="swatches" m={0} p={0} gap={0}>
        {palette && palette.length
          ? palette.map((swatch, index) => (
              <ColorProvider key={index} color={swatch} index={index}>
                <ContentProvider>
                  <DisclosureProvider>
                    <Swatch index={index} />
                  </DisclosureProvider>
                </ContentProvider>
              </ColorProvider>
            ))
          : null}
      </Flex>
      <LogoCredits />
    </>
  );
}

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
    </Box>
  );
}
