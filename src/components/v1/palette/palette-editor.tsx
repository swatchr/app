import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  chakra,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Switch,
  Tooltip,
  useColorMode,
  useDisclosure,
  useOutsideClick,
  VisuallyHidden,
  VStack,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

import { ColorProvider, usePaletteDispatch, usePaletteState } from '@/contexts';
import { useMounted } from '@/hooks';
import {
  generateSVGPaletteRow,
  getContrastColor,
  isDev,
  publish,
  stringifyPalette,
  SVG_ROW,
} from '@/utils';
import { api } from '@/utils/api';
import ColorLab from 'lib/color';
import {
  BinocularsIcon,
  ExportIcon,
  FullScreenIcon,
  LayoutIcon,
  LockedIcon,
  SaveIcon,
  UnlockedIcon,
} from '../icons';
import { OptionKeyIcon } from '../icons/swatchr/option-key-icon';
import { CommandPalette } from '../_wip/command-palette';
import { LogoCredits } from '../_wip/logo-credits';
import { ColorBlindnessSimulator } from './color-blindness-simulator';
import { Palette, StaticPalette } from './palette';
import { PaletteNameInput } from './palette-name-input';
import { ExportPanel } from './panels/export-panel';
import { MobileSwatch } from './swatch';

export function MobilePaletteEditor() {
  const { palette } = usePaletteState();
  const disclosure = useDisclosure();

  return (
    <Flex
      position="relative"
      h="100vh"
      w="full"
      direction="column"
      justifyContent="center"
    >
      {palette.map((swatch, index) => (
        <ColorProvider
          key={`${swatch}-mobile-swatch`}
          color={swatch}
          index={index}
        >
          <MobileSwatch
            swatch={swatch}
            palette={palette}
            index={index}
            isOpen={disclosure.isOpen}
            onToggle={disclosure.onToggle}
          />
        </ColorProvider>
      ))}
    </Flex>
  );
}

export function PaletteEditor() {
  const { palette } = usePaletteState();

  const [scaled, setScaled] = useState(false);

  const scaledLayoutVariants = {
    full: {
      x: 0,
      scale: 1,
      transition: { duration: 0.3, type: 'tween', ease: 'easeInOut' },
    },
    scaled: {
      x: 220,
      scale: 0.6,
      transition: { duration: 0.5, type: 'tween', ease: 'easeInOut' },
    },
    exit: {
      x: 0,
      scale: 1,
      transition: { duration: 0.3, type: 'tween', ease: 'easeInOut' },
    },
  };

  // const contrast =
  //   new ColorLab(palette[0]!).contrast == 'dark' ? 'whiteAlpha' : 'blackAlpha';

  // const controlsText =
  //   new ColorLab(palette[palette.length - 1]!).contrast == 'dark'
  //     ? 'gray.600'
  //     : 'gray.300';
  useMounted('palette-editor');
  return (
    <>
      {/* @TODO: WIP: finish command Palette logic */}
      {isDev ? <CommandPalette /> : null}
      <Toolbar palette={palette} scaled={scaled} setScaled={setScaled} />

      <Box
        w="full"
        position="relative"
        as={motion.div}
        layout
        layoutId="palette"
        initial="full"
        animate={scaled ? 'scaled' : 'full'}
        variants={scaledLayoutVariants}
        mt={scaled ? 24 : 0}
      >
        {scaled ? (
          <>
            <AnimatePresence>
              <StaticPalette palette={palette} />
              {scaled ? (
                <HStack w="full" gap={4} my={4}>
                  {palette.map((color, index) => {
                    return (
                      <ColorDetails
                        key={`${color}-${index}-details`}
                        color={color}
                      />
                    );
                  })}
                </HStack>
              ) : null}
            </AnimatePresence>
          </>
        ) : (
          <Palette palette={palette} show={!scaled} />
        )}
      </Box>
      <HStack
        position="fixed"
        top={10}
        left={14}
        cursor={isDev ? 'pointer' : 'initial'}
        alignItems="center"
        zIndex="overlay"
      >
        <LogoCredits scaled={scaled} />
      </HStack>
      {scaled ? <PaletteInfo /> : null}
    </>
  );
}

export function ColorDetails({ color }: { color: string }) {
  const instance = new ColorLab(color);

  const {
    data: info,
    status,
    isLoading,
    isError,
  } = api.color.schemeAPI.useQuery(
    {
      hex: color.replace('#', ''),
    },
    {
      enabled: !!color,
      onError(err) {
        console.log('🚀 | file: info-panel.tsx:46 | error:', err);
      },
    }
  );

  return (
    <Center
      bg="panelBg"
      w="full"
      p={2}
      py={4}
      border="1px"
      flexDirection="column"
      gap={6}
    >
      <HStack w="full" justifyContent="space-between">
        <chakra.p>{color}</chakra.p>
        <chakra.p>{info?.seed.name.value}</chakra.p>
      </HStack>
      <VStack w="full" alignItems="flex-start">
        {Object.keys(info?.seed).length
          ? Object.keys(info?.seed).map((field) => {
              if (['name', 'image', '_links', '_embedded'].includes(field)) {
                return null;
              }
              return (
                <HStack key={field} w="full">
                  <chakra.p w="35%">{field}:</chakra.p>
                  <chakra.p>{info?.seed[field].value}</chakra.p>
                </HStack>
              );
            })
          : null}
      </VStack>
    </Center>
  );
}

export function PaletteInfo() {
  const { palette, info } = usePaletteState();
  const { updatePaletteStatus } = usePaletteDispatch();

  const svgMarkup = generateSVGPaletteRow(palette);
  const { status: statusColors, ...uiColors } = new ColorLab(
    '#FFF'
  ).generateUIColors(palette);

  const handleUpdateStatus = (
    e: React.SyntheticEvent<HTMLButtonElement> | any
  ) => {
    e.preventDefault();

    if (status !== 'authenticated') {
      publish('show-toast', {
        id: 'unauthorized-user',
        title: 'Unauthorized',
        description: 'Log in to perform this action',
        status: 'info',
        isClosable: true,
      });
      return;
    }

    updatePaletteStatus();
  };
  return (
    <VStack
      position="absolute"
      top={36}
      left={12}
      fontFamily="accent"
      alignItems="flex-start"
      gap={4}
      p={4}
      maxW="sm"
      bg="dashBg"
      rounded="md"
    >
      <HStack w="full" bg="dashBgFilled" p={2} rounded="md">
        <chakra.p
          w={16}
          textTransform="uppercase"
          fontWeight="bold"
          fontSize="sm"
          color="dashLabel"
        >
          Name:
        </chakra.p>
        <PaletteNameInput text="palette-name" />
      </HStack>
      <HStack w="full" bg="dashBgFilled" p={2} rounded="md">
        <chakra.p
          w={16}
          textTransform="uppercase"
          fontWeight="bold"
          fontSize="sm"
          color="dashLabel"
        >
          Serial:
        </chakra.p>
        <chakra.p
          color="gray.500"
          textTransform="uppercase"
          fontWeight="bold"
          fontSize="sm"
        >
          {stringifyPalette(palette)}
        </chakra.p>
      </HStack>
      <HStack w="full" alignItems="center" bg="dashBgFilled" p={2} rounded="md">
        <chakra.p
          textTransform="uppercase"
          fontWeight="bold"
          fontSize="sm"
          color="dashLabel"
          verticalAlign="middle"
        >
          Status:
        </chakra.p>
        <Tooltip label={info.status} size="xs">
          <FormControl as={HStack} w={16} alignItems="center" gap={2}>
            <VisuallyHidden>
              <FormLabel htmlFor="status" fontSize="xs">
                {info.status}
              </FormLabel>
            </VisuallyHidden>
            <IconButton
              aria-label="Palette Privacy Status"
              icon={
                info.status === 'public' ? (
                  <UnlockedIcon boxSize="1.15rem" fill={'text'} />
                ) : (
                  <LockedIcon boxSize="1.15rem" fill={'text'} />
                )
              }
              size="sm"
              variant="unstyled"
              colorScheme="green"
              isDisabled={status !== 'authenticated'}
              onClick={handleUpdateStatus}
            />
            <Box>
              <Switch
                aria-label="Toggle palette status"
                id="status"
                size="md"
                colorScheme="green"
                isChecked={info.status === 'public'}
                onChange={handleUpdateStatus}
              />
            </Box>
          </FormControl>
        </Tooltip>
      </HStack>
      <HStack w="full" bg="dashBgFilled" p={2} rounded="md">
        <chakra.p
          w={16}
          textTransform="uppercase"
          fontWeight="bold"
          fontSize="sm"
          color="dashLabel"
        >
          SVG:
        </chakra.p>
        <Box
          as="svg"
          width={36}
          pl={2}
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
          viewBox={`0 0 ${palette.length * SVG_ROW.width} ${SVG_ROW.height}`}
        />
      </HStack>
      <VStack p={4} alignItems="flex-start" bg="dashBgFilled" rounded="md">
        <chakra.p
          w="full"
          color="dashLabel"
          fontWeight="bold"
          fontSize="sm"
          borderBottom="1px"
          borderColor="gray.700"
          textTransform="uppercase"
          mb={2}
        >
          Supplementary Palette
        </chakra.p>
        <HStack>
          <VStack>
            {Object.keys(statusColors).map((color, i) => {
              return (
                <HStack
                  key={`${color}-${i}-status-palette}`}
                  alignItems="center"
                  justifyContent="flex-start"
                  // w={48}
                >
                  <VStack
                    bg={statusColors[color as keyof typeof statusColors]}
                    rounded="md"
                    width={36}
                    alignItems="flex-end"
                    color={getContrastColor(
                      statusColors[color as keyof typeof statusColors]
                    )}
                    p={1}
                  >
                    <chakra.p fontSize="xs">{color}</chakra.p>
                    <chakra.p textStyle="tiny" textTransform="uppercase">
                      {statusColors[color as keyof typeof statusColors]}
                    </chakra.p>
                  </VStack>
                </HStack>
              );
            })}
          </VStack>
          <VStack>
            {Object.keys(uiColors).map((color, i) => {
              return (
                <HStack
                  key={`${color}-${i}-contrast-palette}`}
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <VStack
                    bg={uiColors[color as keyof typeof uiColors]}
                    rounded="md"
                    width={36}
                    alignItems="flex-end"
                    color={getContrastColor(
                      uiColors[color as keyof typeof uiColors]
                    )}
                    p={1}
                  >
                    <chakra.p fontSize="xs">{color}</chakra.p>
                    <chakra.p textStyle="tiny" textTransform="uppercase">
                      {uiColors[color as keyof typeof uiColors]}
                    </chakra.p>
                  </VStack>
                </HStack>
              );
            })}
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
}

export function Toolbar({
  palette,
  scaled,
  setScaled,
}: {
  palette: string[];
  scaled: boolean;
  setScaled: (n: boolean) => void;
}) {
  const [view, setView] = useState('default');
  const updateView = (view: string) => {
    setView(view);
  };

  const { updatePalette, updatePaletteOrder } = usePaletteDispatch();
  // const debouncedPaletteUpdate = useDebounce((palette: string[]) => {
  //   updatePaletteOrder(palette);
  // }, 200);

  const fullScreenRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = useCallback(() => {
    setScaled(!scaled);
    // must remove focus to allow the spacebar shortcut to generate random color
    fullScreenRef.current?.blur();
  }, [scaled, setScaled]);

  const handleClose = () => {
    publish('view-controls', { detail: 'default' });
  };

  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideClick({
    ref: ref,
    handler: handleClose,
  });

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <HStack
        position="fixed"
        top={10}
        right={20}
        gap={2}
        zIndex="overlay"
        color="dashLabel"
      >
        <Tooltip label="Color Blindness Sim">
          <IconButton
            aria-label="Color Blindness Sim"
            colorScheme={'blackAlpha'}
            fill="panelIcon"
            icon={<BinocularsIcon boxSize={'1rem'} />}
            size="sm"
            onClick={() => updateView('color-blindness')}
          />
        </Tooltip>
        <Tooltip label="Save Palette">
          <IconButton
            aria-label="Save Palette"
            colorScheme={'blackAlpha'}
            fill="panelIcon"
            icon={<SaveIcon boxSize={'1rem'} />}
            size="sm"
            onClick={() => updatePalette(palette)}
          />
        </Tooltip>
        <Tooltip label="Export">
          <IconButton
            aria-label="Export Panel"
            colorScheme={'blackAlpha'}
            fill="panelIcon"
            icon={<ExportIcon boxSize={'1rem'} />}
            size="sm"
            onClick={() => updateView('export')}
          />
        </Tooltip>
        <Tooltip label={scaled ? 'Editor' : 'Details'}>
          <IconButton
            ref={fullScreenRef}
            aria-label="Toggle Palette Info"
            icon={
              scaled ? (
                <FullScreenIcon
                  transform="translate(-0.32em, -0.1em)"
                  fill="panelIcon"
                  boxSize={'1.5rem'}
                />
              ) : (
                <LayoutIcon fill="panelIcon" boxSize={'1rem'} />
              )
            }
            onClick={handleClick}
            colorScheme={'blackAlpha'}
            size={'sm'}
          />
        </Tooltip>
        <Tooltip label={colorMode === 'dark' ? 'Light' : 'Dark'}>
          <IconButton
            aria-label="color mode"
            colorScheme={'blackAlpha'}
            icon={
              colorMode === 'dark' ? (
                <SunIcon p={1} boxSize={'1.5rem'} />
              ) : (
                <MoonIcon p={1} boxSize={'1.5rem'} />
              )
            }
            color="panelIcon"
            size="sm"
            onClick={toggleColorMode}
          />
        </Tooltip>
        <Tooltip label="Shortcuts">
          <IconButton
            aria-label="Shortcuts"
            icon={<OptionKeyIcon boxSize={'1rem'} fill="panelIcon" />}
            // onClick={handleClick} // @TODO: add action
            colorScheme={'blackAlpha'}
            size={'sm'}
            p={1}
          />
        </Tooltip>
      </HStack>
      <ExportPanel
        isOpen={view === 'export'}
        onClose={() => updateView('default')}
      />
      {view === 'color-blindness' ? (
        <ColorBlindnessSimulator
          palette={palette}
          onClose={() => updateView('default')}
        />
      ) : null}
    </>
  );
}
