import {
  Button,
  ButtonProps,
  Center,
  chakra,
  Flex,
  SlideFade,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import {
  useColorDispatch,
  useColorState,
  useDisclosureDispatch,
} from '@/contexts';
import { useMounted } from '@/hooks/use-mounted';
import { useThemeColors } from 'chakra.ui';
import { ColorPickerWrapper, EditableHexInput, SwatchMenu } from '.';
import { InfoPanel, InfoWindow } from '../panels';

const BG_TRANSITION = { duration: 0.5, ease: 'easeInOut' };

type SwatchView = 'swatch' | 'picker';
export function Swatch({ index }: { index: number }) {
  const [view, setView] = useState<SwatchView>('swatch');
  const [reset, setReset] = useState(false);
  const colorState = useColorState();
  const colorHandlers = useColorDispatch();

  const { text: themeTexts } = useThemeColors();
  const text = colorState.instance.getBestContrastColor(themeTexts);

  const { isActive } = useDisclosureDispatch(); // used for info panel
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
      color={text} // all of the icons and text inherit the text color
      _before={
        swatchMenuIsOpen
          ? {
              content: '""',
              position: 'absolute',
              bottom: 12,
              left: '50%',
              right: '50%',
              transform: 'translateX(-50%)',
              width: '1.25rem',
              height: '1.25rem',
              borderRadius: '50%',
              backgroundColor: 'currentColor',
              opacity: 0.1,
              zIndex: 3,
            }
          : {}
      }
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
              // the icon grid menu behind the swatch
              colorState={colorState}
              colorHandlers={colorHandlers}
              reset={reset}
            />
          ) : null}
          <Center
            as={motion.div}
            className="picker-swatch"
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
                colorState={colorState}
                handleChange={colorHandlers.history.handleChange}
              />
            ) : null}
          </Center>
        </Center>
      </SlideFade>
      <InfoPanel {...colorState} index={isActive('info') ? 0 : undefined} />
      <InfoWindow />
      <VStack w="full" mx={2} p={2} borderRadius="xl">
        <chakra.p fontSize="xs">History</chakra.p>
        <Flex w="full" justifyContent="center">
          {colorHandlers.history.history.map((color, i) => {
            return (
              <Center
                key={color + i}
                ml={1}
                bg={color}
                rounded="xl"
                boxSize="1.25em"
                border={
                  colorHandlers.history.historyIndex === i
                    ? '1px solid currentColor'
                    : 'none'
                }
              />
            );
          })}
        </Flex>
      </VStack>
    </Flex>
  );
}
