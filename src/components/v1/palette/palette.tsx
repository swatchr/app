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
import { Reorder } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { ExportPanel } from './panels/export-panel';

import { LogoIcon, Swatch } from '@/components';
import {
  ColorProvider,
  ContentProvider,
  DisclosureProvider,
  usePaletteDispatch,
  usePaletteState,
} from '@/contexts';
import { isDev } from '@/utils';
import { Drawer } from 'chakra.ui';
import Color from 'lib/color';
import { ColorBlindnessSimulator } from './color-blindness-simulator';
import { HeaderIconStack } from './header-icon-stack';

export function Palette() {
  const { palette } = usePaletteState();
  const { updatePalette } = usePaletteDispatch();
  const [currentPalette, setCurrentPalette] = useState(palette);

  const [showCB, setShowCB] = useState(false);
  const showColorBlindness = useCallback(
    () => setShowCB(!showCB),
    [showCB, setShowCB]
  );

  const contrast =
    new Color(palette[0]!).contrast == 'dark' ? 'whiteAlpha' : 'blackAlpha';

  const { isOpen, onOpen, onClose } = useDisclosure(); // for export modal
  const openModal = useCallback(() => {
    if (isOpen) return;
    onOpen();
  }, [isOpen, onOpen]);
  const closeModal = useCallback(() => {
    if (!isOpen) return;
    onClose();
  }, [isOpen, onClose]);

  useEffect(() => {
    if (JSON.stringify(currentPalette) === JSON.stringify(palette)) return;
    updatePalette(currentPalette);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPalette]); // @FIXME: @WIP:

  return (
    <>
      <HeaderIconStack
        palette={palette}
        openModal={openModal}
        showColorBlindness={showColorBlindness}
        showCB={showCB}
      />
      <ExportPanel isOpen={isOpen} onClose={closeModal} />
      {showCB ? (
        <ColorBlindnessSimulator contrast={contrast} palette={palette} />
      ) : null}

      {false ? ( // WIP drag and drop reorder swatches
        <Flex
          m={0}
          p={0}
          gap={0}
          w="full"
          as={Reorder.Group}
          axis="x"
          values={currentPalette}
          onReorder={setCurrentPalette}
          className="swatches"
        >
          {currentPalette && currentPalette.length
            ? currentPalette.map((swatch, index) => (
                <Box key={index} w="full" as={Reorder.Item} value={swatch}>
                  <ColorProvider color={swatch} index={index}>
                    <ContentProvider>
                      <DisclosureProvider>
                        <Swatch index={index} />
                      </DisclosureProvider>
                    </ContentProvider>
                  </ColorProvider>
                </Box>
              ))
            : null}
        </Flex>
      ) : (
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
      )}

      <LogoCredits />
    </>
  );
}

export function LogoCredits() {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <Box position="absolute" bottom={12} right={12} cursor="pointer">
      <Icon
        as={LogoIcon}
        boxSize={10}
        filter="drop-shadow(0.1rem 0.1rem 0.1rem #000)"
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
          // bg="gray.700"
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
                  Josh Beckman&aposs
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