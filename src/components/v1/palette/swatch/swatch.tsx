import { Box, Center, Flex, useDisclosure } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import {
  ContentProvider,
  useColorDispatch,
  useColorState,
  usePaletteState,
} from '@/contexts';
import { useKeyboardShortcut } from '@/hooks';
import { useMounted } from '@/hooks/use-mounted';
import { getContrastColor } from '@/utils';
import { useThemeColors } from 'chakra.ui';
import {
  ColorPickerWrapper,
  ColorPopover,
  EditableHexInput,
  SwatchMenu,
} from '.';
import { HistoryViewer, InfoPanel, SwatchWindow } from '../panels';

const BG_TRANSITION = { duration: 0.5, ease: 'easeInOut' };

export function Swatch({ index }: { index: number }) {
  const [reset, setReset] = useState(false);
  const colorState = useColorState();
  const colorHandlers = useColorDispatch();

  const { text: themeTexts } = useThemeColors();
  const text = colorState.instance.getBestContrastColor(themeTexts);

  const {
    isOpen: swatchMenuIsOpen,
    onOpen: swatchMenuOnOpen,
    onClose: swatchMenuOnClose,
  } = useDisclosure();

  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      backgroundColor: colorState.color,
      transition: BG_TRANSITION,
    });
  }, [colorState.color, controls]);

  useMounted('swatch');

  return (
    <>
      <Flex
        className="swatch-wrapper"
        direction="column"
        position="relative"
        w="full"
        minH="100vh"
        justifyContent="center"
        alignItems="center"
        as={motion.div}
        animate={controls}
        onMouseEnter={() => {
          colorHandlers.paletteHandlers.activateSwatch(index);
          swatchMenuOnOpen();
        }}
        onMouseLeave={() => {
          swatchMenuOnClose();
        }}
        color={text} // all of the icons and text inherit this text color
      >
        <Center
          className="swatch-menu-wrapper"
          boxSize={72}
          position="relative"
          zIndex={1}
        >
          <SwatchDetails
            color={colorState.color}
            swatchMenuIsOpen={swatchMenuIsOpen}
          />
          {swatchMenuIsOpen ? (
            <SwatchMenu
              colorState={colorState}
              colorHandlers={colorHandlers}
              reset={reset}
            />
          ) : null}
          <ContentProvider>
            <SwatchWindow isActive={swatchMenuIsOpen} />
          </ContentProvider>
        </Center>
        <InfoPanel {...colorState} showIcon={swatchMenuIsOpen} />
        {colorState.isActive ? (
          <>
            <HistoryViewer colorHandlers={colorHandlers} />
          </>
        ) : null}
      </Flex>
    </>
  );
}

function SwatchDetails({
  color,
  swatchMenuIsOpen,
}: {
  color: string;
  swatchMenuIsOpen: boolean;
}) {
  const colorState = useColorState();
  const colorHandlers = useColorDispatch();
  const picker = useDisclosure();

  useMounted('swatch-detail');
  return (
    <Center
      as={motion.div}
      role="button"
      className="picker-swatch"
      tabIndex={0}
      h={52}
      m={9}
      flex={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      rounded="xl"
      zIndex={2}
      initial={{ boxShadow: '0px 0px 20px rgba(0,0,0, 0)' }}
      whileHover={{ boxShadow: '0px 0px 20px rgba(0,0,0, 0.1)' }}
      whileTap={{ boxShadow: '0px 0px 20px rgba(0,0,0, 0.1)' }}
      transition="0.55 easeInOut 0.3"
      onClick={picker.onOpen}
    >
      {picker.isOpen ? (
        <ColorPickerWrapper color={color} colorHandlers={colorHandlers} />
      ) : null}

      <EditableHexInput
        show={swatchMenuIsOpen && !picker.isOpen}
        colorState={colorState}
        handleChange={colorHandlers.history.handleChange}
      />
    </Center>
  );
}

export function MobileSwatch({
  swatch,
  palette,
  index,
  onToggle,
  isOpen,
}: {
  swatch: string;
  palette: string[];
  index: number;
  onToggle: () => void;
  isOpen: boolean;
}) {
  const clickRef = useRef<HTMLDivElement>(null);
  const { activeSwatchIndex } = usePaletteState();
  const colorState = useColorState();
  const colorHandlers = useColorDispatch();

  useMounted(`mobile-${colorState.color}-swatch`);

  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      backgroundColor: swatch,
      transition: BG_TRANSITION,
    });
  }, [swatch, controls]);

  const isActive = activeSwatchIndex === index;

  useKeyboardShortcut([' '], () => {
    if (isActive) return;
    colorHandlers.tinycolor.generateRandomColor();
  });

  return (
    <Box flex={1} bg={swatch}>
      <Center
        my="auto"
        h="full"
        maxH={`calc(100vh / ${palette.length})`}
        minH={'100px'}
        color={getContrastColor(swatch)}
        as={motion.div}
        animate={controls}
        onMouseEnter={() => {
          colorHandlers.paletteHandlers.activateSwatch(index);
        }}
        onMouseLeave={() => {
          // swatchMenuOnClose();
        }}
      >
        <Center w={96} maxH={12} h="full" ref={clickRef}>
          {isActive ? (
            <ColorPopover
              open={isOpen}
              trigger={
                <Box w="80%" h="full" py={6} zIndex={0} onClick={onToggle} />
              }
            >
              <ColorPickerWrapper
                color={colorState.color}
                colorHandlers={colorHandlers}
              />
            </ColorPopover>
          ) : null}
          <EditableHexInput
            show={!isOpen}
            colorState={colorState}
            handleChange={colorHandlers.history.handleChange}
          />
        </Center>
      </Center>
    </Box>
  );
}
