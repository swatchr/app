import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  chakra,
  Collapse,
  Flex,
  HStack,
  Icon,
  IconButton,
  Tooltip,
  useOutsideClick,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { ColorDispatchValue } from '@/contexts';
import type { Scales } from '@/contexts/v1/hooks/use-tinycolor';

import {
  useColorDispatch,
  useColorState,
  useContentDispatch,
  useContentState,
} from '@/contexts';
import { useClipboard } from '@/hooks';
import { capitalize, publish } from '@/utils';
import { MotionBox } from 'chakra.ui';
import ColorLab from 'lib/color';
import {
  AAAIcon,
  AAIcon,
  AnalogicIcon,
  ColorMixIcon,
  ComplementaryIcon,
  PaletteIcon,
  QuadIcon,
  SplitComplementaryIcon,
  TriadIcon,
} from '../../icons';

export function SwatchWindow({ isActive }: { isActive: boolean }) {
  const { color, instance } = useColorState();
  const colorHandlers = useColorDispatch();
  const { isOpen, type } = useContentState();
  const { onClose } = useContentDispatch();
  const ref = useRef<HTMLDivElement | null>(null);

  useOutsideClick({
    ref: ref,
    handler: () => onClose(),
  });

  useEffect(() => {
    if (!isOpen) return;
    return () => onClose();
  }, [onClose, isOpen]);

  // let contrastColor =
  //   instance.contrast === 'dark' ? 'blackAlpha' : 'whiteAlpha';

  return isActive && isOpen ? (
    // return true ? (
    <Center
      ref={ref}
      boxSize={72}
      bg={color}
      zIndex={10}
      position="absolute"
      inset={0}
      rounded="lg"
      shadow="xl"
    >
      <VStack w="full" p={1} rounded="md">
        {type === 'scales' ? (
          <MonochromeScale
            color={color}
            instance={instance}
            onClose={onClose}
            colorHandlers={colorHandlers}
          />
        ) : null}
        {type === 'match' ? (
          <ColorScales
            instance={instance}
            onClose={onClose}
            colorHandlers={colorHandlers}
          />
        ) : null}
        {type === 'combos' ? (
          <ColorCombos
            instance={instance}
            onClose={onClose}
            colorHandlers={colorHandlers}
          />
        ) : null}
      </VStack>
    </Center>
  ) : null;
}

export function ColorScales({
  instance,
  onClose,
  colorHandlers,
}: {
  instance: ColorLab;
  onClose: () => void;
  colorHandlers: ColorDispatchValue;
}) {
  const [mode, setMode] = useState<Scales>('analogic');

  let contrastColor =
    instance.contrast === 'dark' ? 'blackAlpha' : 'whiteAlpha';

  const colorScaleIcons = {
    analogic: AnalogicIcon,
    complement: ComplementaryIcon,
    'split-complement': SplitComplementaryIcon,
    triad: TriadIcon,
    quad: QuadIcon,
  };

  const scales = useMemo(() => {
    return colorHandlers?.tinycolor.generateScale(mode);
  }, [colorHandlers?.tinycolor, mode]);

  return (
    <VStack w="full" py={1} px={2} mb={2} position="relative" gap={8}>
      <HStack
        w="full"
        pb={2}
        justifyContent="space-between"
        borderBottom="1px"
        borderColor={contrastColor + '.300'}
      >
        <Icon as={PaletteIcon} opacity={0.6} fill={'currentColor'} />
        <chakra.p w="full" p={1} fontSize="sm" textAlign="center">
          {capitalize(mode)}
        </chakra.p>
        <IconButton
          position="absolute"
          right={0}
          top={2}
          aria-label="close window"
          icon={<SmallCloseIcon />}
          bg="transparent"
          color={'currentColor'}
          size="xs"
          colorScheme="contrastColor"
          onClick={onClose}
          _hover={{
            color: 'gray.200',
            bg: 'blackAlpha.300',
          }}
        />
      </HStack>
      <Box
        w="full"
        p={3}
        mt={2}
        bg={`${contrastColor}.300`}
        rounded="md"
        flex={1}
      >
        <ScaledColorItems
          contrastColor={contrastColor}
          scales={scales}
          colorHandlers={colorHandlers}
        />
      </Box>
      <HStack
        as="ul"
        mt={12}
        pt={3}
        borderTop="1px solid"
        borderColor={contrastColor + '.300'}
        gap={1.5}
        justifyContent="center"
      >
        {Object.keys(colorScaleIcons).map((currentMode) => {
          const CurrentIcon =
            colorScaleIcons[currentMode as keyof typeof colorScaleIcons];

          const isSelected = mode === currentMode;
          return (
            <Tooltip key={currentMode} label={currentMode} fontSize="xs">
              <Button variant="unstyled">
                <Icon
                  as={CurrentIcon}
                  aria-label={currentMode}
                  p={1}
                  boxSize={10}
                  bg={`${contrastColor}.100`}
                  rounded="md"
                  border={isSelected ? '2px' : 'initial'}
                  borderColor={isSelected ? `${contrastColor}.300` : 'initial'}
                  cursor="pointer"
                  onClick={() => setMode(currentMode as Scales)}
                />
              </Button>
            </Tooltip>
          );
        })}
      </HStack>
    </VStack>
  );
}

const ScaledColorItems = ({
  contrastColor,
  scales,
  colorHandlers,
}: {
  contrastColor: string;
  scales: string[];
  colorHandlers: ColorDispatchValue;
}) => {
  return (
    <HStack justify="center" ml={4}>
      {scales?.length &&
        scales?.map((color, i) => {
          return (
            <MotionBox
              key={color.toString()}
              role="button"
              cursor="pointer"
              initial={{ y: 0, scale: 1 }}
              whileHover={{ y: -5, scale: 1.2 }}
              whileTap={{ y: -5, scale: 1.2 }}
              // @ts-expect-error type conflict
              transition={{ duration: 0.2, type: 'spring' }}
            >
              <Tooltip label={color} placement="top">
                <Box
                  boxSize={8}
                  bg={color}
                  tabIndex={i + 2} // creates the stacking context
                  zIndex={i}
                  ml={-4}
                  rounded="md"
                  border="0.1px solid"
                  borderColor={`${contrastColor}.600`}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    if (e.detail === 2) return;
                    navigator.clipboard.writeText(color);
                    publish('show-toast', {
                      title: 'Copied',
                      description: color,
                      status: 'success',
                      duration: 1000,
                    });
                  }}
                  onDoubleClick={() => {
                    colorHandlers.history.handleChange(color);
                  }}
                />
              </Tooltip>
            </MotionBox>
          );
        })}
    </HStack>
  );
};

export type ComboModes = 'aa' | 'aaa' | 'fails';
export function ColorCombos({
  instance,
  onClose,
  colorHandlers,
}: {
  instance: ColorLab;
  onClose: () => void;
  colorHandlers: ColorDispatchValue;
}) {
  const [mode, setMode] = useState<ComboModes>('aa');

  let contrastColor =
    instance.contrast === 'dark' ? 'blackAlpha' : 'whiteAlpha';
  let complement = instance.complement;

  const colorComboIcons = {
    aa: AAIcon,
    aaa: AAAIcon,
  };

  const combos = useMemo(() => {
    return colorHandlers?.tinycolor.colorCombinations(instance)[mode];
  }, [colorHandlers?.tinycolor, instance, mode]);

  return (
    <Box w="full" py={1} mb={2} position="relative">
      <HStack
        justifyContent="space-between"
        borderBottom="1px"
        borderColor={`${contrastColor}.300`}
      >
        <Icon as={ColorMixIcon} opacity={0.6} fill="currentColor" />
        <chakra.p w="full" p={1} fontSize="sm" textAlign="center">
          WCAG Combinations
        </chakra.p>
        <IconButton
          position="absolute"
          right={0}
          top={2}
          aria-label="close window"
          icon={<SmallCloseIcon />}
          bg="transparent"
          color={'currentColor'}
          size="xs"
          colorScheme="contrastColor"
          onClick={onClose}
          _hover={{
            color: 'gray.200',
            bg: 'blackAlpha.300',
          }}
        />
      </HStack>
      <Box
        w="full"
        py={2}
        mt={2}
        maxH={36}
        bg={`${contrastColor}.200`}
        rounded="md"
        overflowY="auto"
      >
        <Flex direction="row" justify="center" flexWrap="wrap" gap={4}>
          {combos.length
            ? combos.map((c, i) => {
                return (
                  <VStack
                    key={`${mode}-${c.colors[0]}-${c.colors[1]}-${i}`}
                    boxSize={16}
                    bgGradient={`linear(to-r, ${c.colors[1]}, ${c.colors[0]})`}
                    rounded="md"
                    shadow="md"
                    fontFamily="mono"
                    textAlign="center"
                    overflowY="hidden"
                    textTransform="uppercase"
                  >
                    <Box
                      w="full"
                      h={6}
                      mb={-2}
                      fontSize="xs"
                      bg={c.colors[1]}
                      color={c.colors[0]}
                      cursor="pointer"
                      userSelect="none"
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                        if (e.detail === 2) return;
                        navigator.clipboard.writeText(c.colors[1]!),
                          publish('show-toast', {
                            title: 'Copied',
                            description: c.colors[1],
                            status: 'success',
                            duration: 1000,
                          });
                      }}
                      onDoubleClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                        colorHandlers.history.handleChange(c.colors[1]!);
                      }}
                    >
                      {c.colors[1]}
                    </Box>
                    <Box
                      w="full"
                      fontSize="xs"
                      h={6}
                      bg={c.colors[0]}
                      color={c.colors[1]}
                      cursor="pointer"
                      userSelect="none"
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                        if (e.detail === 2) return;
                        navigator.clipboard.writeText(c.colors[0]!);
                        publish('show-toast', {
                          title: 'Copied',
                          description: c.colors[0],
                          status: 'success',
                          duration: 1000,
                        });
                      }}
                      onDoubleClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                        colorHandlers.history.handleChange(c.colors[0]!);
                      }}
                    >
                      {c.colors[0]}
                    </Box>
                  </VStack>
                );
              })
            : null}
        </Flex>
      </Box>
      <HStack
        mt={4}
        as="ul"
        pt={3}
        borderTop="0.25px solid"
        borderColor={'currentColor'}
        gap={1.5}
        justifyContent="flex-end"
      >
        <chakra.p fontSize="sm" mr={3}>
          Mode:
        </chakra.p>

        {Object.keys(colorComboIcons).map((currentMode, i) => {
          const CurrentIcon =
            colorComboIcons[currentMode as keyof typeof colorComboIcons];
          const isSelected = mode === currentMode;
          return (
            <Tooltip
              key={`${currentMode}-${i}`}
              label={currentMode}
              fontSize="xs"
            >
              <IconButton
                aria-label={currentMode}
                onClick={() => {
                  setMode(currentMode as ComboModes);
                }}
                icon={
                  <CurrentIcon
                    boxSize="1.25rem"
                    fill={new ColorLab(complement).getContrastColors()[1]}
                  />
                }
                bg={isSelected ? `${complement}` : `${contrastColor}.100`}
                _hover={{
                  bg: `${new ColorLab(complement).lighten(20)}`,
                }}
              />
            </Tooltip>
          );
        })}
      </HStack>
    </Box>
  );
}

export function MonochromeScale({
  color,
  instance,
  onClose,
  colorHandlers,
}: {
  color: string;
  instance: ColorLab;
  onClose: () => void;
  colorHandlers: ColorDispatchValue;
}) {
  let contrastColor =
    instance.contrast === 'dark' ? 'blackAlpha' : 'whiteAlpha';

  const scales = useMemo(() => {
    return new ColorLab(color).generateColorScales('monochrome', 15);
  }, [color]);

  const close = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose();
  };
  return (
    <Box position="relative" w="full" py={1} overflow="scroll">
      <Box position="relative" mr={1} zIndex={10}>
        <IconButton
          position="absolute"
          right={0}
          mt={1}
          aria-label=""
          icon={<SmallCloseIcon fill="gray.800" />}
          colorScheme={contrastColor}
          onClick={close}
          size="sm"
        />
      </Box>
      <Flex
        className="swatch-background"
        direction="column"
        alignItems="center"
        fontSize="xs"
        zIndex={0}
      >
        {scales.map((_c) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const { isCopied, copy } = useClipboard({
            text: _c,
            onCopy: () => {
              publish('show-toast', {
                title: 'Copied',
                description: `${_c} copied to clipboard (Double-click to select)`,
                status: 'success',
                duration: 2000,
              });
            },
          });

          const contrast = new ColorLab(_c).contrast;
          return (
            <Center
              key={_c}
              as={Button}
              bg={_c}
              w={'full'}
              h={5}
              color={contrast === 'dark' ? 'gray.800' : 'gray.200'}
              rounded="none"
              fontSize="xs"
              cursor="pointer"
              _hover={{
                h: 6,
                bg: _c,
              }}
              onClick={copy}
              onDoubleClick={(e) => {
                e.stopPropagation();
                colorHandlers.history.handleChange(_c);
              }}
              _first={{
                borderTopRadius: 'md',
              }}
              _last={{
                borderBottomRadius: 'md',
              }}
            >
              {isCopied ? 'copied' : _c.toUpperCase()}
            </Center>
          );
        })}
      </Flex>
    </Box>
  );
}

export function InfoWindow({ isActive }: { isActive: boolean }) {
  // @NOTE: this component was deprecated in favor of the SwatchWindow component
  const { color, instance } = useColorState();
  const colorHandlers = useColorDispatch();
  const { isOpen, type } = useContentState();
  const { onClose } = useContentDispatch();

  useEffect(() => {
    if (!isOpen || !isActive) return;
    return () => onClose();
  }, [isActive, onClose, isOpen]);

  let contrastColor =
    instance.contrast === 'dark' ? 'blackAlpha' : 'whiteAlpha';
  return (
    <Collapse in={isActive && isOpen} animateOpacity unmountOnExit>
      {isOpen ? (
        <VStack
          width={72}
          mt={1}
          px={3}
          mb={1}
          rounded="md"
          border={type === 'scales' ? 'none' : '1px'}
          borderColor={`${contrastColor}.400`}
        >
          {type === 'scales' ? (
            <MonochromeScale
              color={color}
              instance={instance}
              onClose={onClose}
              colorHandlers={colorHandlers}
            />
          ) : null}
          {type === 'match' ? (
            <ColorScales
              instance={instance}
              onClose={onClose}
              colorHandlers={colorHandlers}
            />
          ) : null}
          {type === 'combos' ? (
            <ColorCombos
              instance={instance}
              onClose={onClose}
              colorHandlers={colorHandlers}
            />
          ) : null}
        </VStack>
      ) : null}
    </Collapse>
  );
}
