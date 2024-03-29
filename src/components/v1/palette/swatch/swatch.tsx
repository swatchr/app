import {
  Center,
  chakra,
  Flex,
  SlideFade,
  useDisclosure,
} from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import { useColorDispatch, useColorState } from '@/contexts';
import { useMounted } from '@/hooks/use-mounted';
import { useThemeColors } from 'chakra.ui';
import { ColorPickerWrapper, EditableHexInput, SwatchMenu } from '.';
import { HistoryViewer, InfoPanel, SwatchWindow } from '../panels';

const BG_TRANSITION = { duration: 0.5, ease: 'easeInOut' };

type SwatchView = 'swatch' | 'picker';
export function Swatch({ index }: { index: number }) {
  const [view, setView] = useState<SwatchView>('swatch');
  const [reset, setReset] = useState(false);
  const colorState = useColorState();
  const colorHandlers = useColorDispatch();

  const { text: themeTexts } = useThemeColors();
  const text = colorState.instance.getBestContrastColor(themeTexts);

  const mounted = useMounted();
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

  const switchView = useCallback(() => {
    setView((prev) => (prev === 'swatch' ? 'picker' : 'swatch'));
  }, []);
  const switchToPickerView = useCallback(() => {
    setView('picker');
    setReset(true);
    const timeout = setTimeout(() => {
      setReset(false);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Flex
      direction="column"
      className="swatch-wrapper"
      position="relative"
      w="full"
      h="100vh"
      my="auto"
      mx="auto"
      justifyContent="center"
      alignItems="center"
      as={motion.div}
      animate={controls}
      onMouseEnter={() => {
        colorHandlers.paletteHandlers.activateSwatch(index);
        swatchMenuOnOpen();
      }}
      onMouseLeave={() => {
        colorHandlers.paletteHandlers.activateSwatch(-1);
        swatchMenuOnClose();
      }}
      color={text} // all of the icons and text inherit this text color
    >
      <SlideFade in={mounted} offsetX={-96} reverse unmountOnExit>
        <Center
          className="swatch-wrapper"
          boxSize={72}
          position="relative"
          zIndex={1}
        >
          {swatchMenuIsOpen ? (
            <SwatchMenu
              colorState={colorState}
              colorHandlers={colorHandlers}
              reset={reset}
            />
          ) : null}
          <SwatchWindow isActive={swatchMenuIsOpen} />
          <Center
            as={motion.div}
            className="picker-swatch"
            position="relative"
            role="button"
            initial={{ boxShadow: '0px 0px 20px rgba(0,0,0, 0)' }}
            animate={controls}
            whileHover={{ boxShadow: '0px 0px 20px rgba(0,0,0, 0.1)' }}
            whileTap={{ boxShadow: '0px 0px 20px rgba(0,0,0, 0.1)' }}
            transition="0.55 easeInOut 0.3"
            boxSize={52}
            tabIndex={0}
            zIndex={0}
            rounded="xl"
            onClick={switchToPickerView}
          >
            {view === 'picker' ? (
              <ColorPickerWrapper
                color={colorState.color}
                colorHandlers={colorHandlers}
                view={view}
                onClick={switchView}
              />
            ) : null}
            {view == 'swatch' ? (
              <EditableHexInput
                show={swatchMenuIsOpen}
                colorState={colorState}
                handleChange={colorHandlers.history.handleChange}
              />
            ) : null}
          </Center>
        </Center>
      </SlideFade>
      <InfoPanel {...colorState} showIcon={swatchMenuIsOpen} />
      {colorState.isActive ? (
        <>
          <HistoryViewer colorHandlers={colorHandlers} />
        </>
      ) : null}
    </Flex>
  );
}
