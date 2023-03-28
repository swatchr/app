import { HamburgerIcon, SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  chakra,
  Flex,
  HStack,
  IconButton,
  Tooltip,
  useOutsideClick,
} from '@chakra-ui/react';
import { LayoutGroup, motion, Reorder } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

import { usePaletteDispatch, usePaletteState } from '@/contexts';
import { isDev, publish } from '@/utils';
import ColorLab from 'lib/color';
import { CommandPalette } from '../_wip/command-palette';
import { LogoCredits } from '../_wip/logo-credits';
import { ColorBlindnessSimulator } from './color-blindness-simulator';
import { HeaderIconStack } from './header-icon-stack';
import { Palette } from './palette';
import { PaletteNameInput } from './palette-name-input';
import { ExportPanel } from './panels/export-panel';

export function PaletteEditor() {
  const { palette } = usePaletteState();
  const [view, setView] = useState('default');
  const updateView = useCallback((view: string) => {
    setView(view);
  }, []);

  return (
    <>
      {/* @TODO: WIP: finish command Palette logic */}
      {isDev ? <CommandPalette /> : null}
      <PaletteUI view={view} palette={palette} setView={updateView} />
      <Palette palette={palette} />
      {/* @TODO: WIP: Finish LogoCredits */}
      <LogoCredits />
    </>
  );
}

export function PaletteUI({
  view,
  palette,
  setView,
}: {
  view: string;
  palette: string[];
  setView: (view: string) => void;
}) {
  const { updatePalette } = usePaletteDispatch();

  const handleClose = () => {
    publish('view-controls', { detail: 'default' });
  };
  const updateView = (view: string) => {
    setView(view);
  };

  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideClick({
    ref: ref,
    handler: handleClose,
  });

  const stack = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delay: 2000,
        staggerChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: 0 },
    show: { opacity: 1, x: -20 },
  };

  const contrast =
    new ColorLab(palette[0]!).contrast == 'dark' ? 'whiteAlpha' : 'blackAlpha';

  const controlsText =
    new ColorLab(palette[palette.length - 1]!).contrast == 'dark'
      ? 'gray.600'
      : 'gray.300';

  return (
    <>
      <Box ref={ref} bg={'whiteAlpha.300'}>
        <LayoutGroup>
          {view === 'actions' ? (
            <motion.div layout variants={stack} style={{ overflowX: 'hidden' }}>
              <HeaderIconStack
                palette={palette}
                view={view}
                setView={setView}
              />
            </motion.div>
          ) : (
            <Tooltip label={view === 'default' ? 'Actions...' : 'Close'}>
              <IconButton
                as={motion.div}
                layout
                variants={item}
                position="fixed"
                top={16}
                right={24}
                zIndex={10}
                aria-label="Export Palette"
                icon={
                  view === 'default' ? (
                    <HamburgerIcon boxSize={'1.7rem'} />
                  ) : (
                    <SmallCloseIcon boxSize={'1.7rem'} />
                  )
                }
                onClick={() =>
                  view !== 'default'
                    ? updateView('default')
                    : updateView('actions')
                }
                colorScheme={contrast}
                color={controlsText}
                fill={controlsText}
                cursor="pointer"
              />
            </Tooltip>
          )}
        </LayoutGroup>
        {view === 'edit' && palette.length ? (
          <HStack
            position="absolute"
            top={14}
            right={36}
            zIndex={1}
            justify="flex-end"
          >
            <PaletteNameInput text={controlsText} />
            <Tooltip label="Reorder Swatches" placement="top">
              <Flex
                p={2}
                bg={contrast + '.300'}
                rounded="md"
                as={Reorder.Group}
                axis="x"
                values={palette}
                onReorder={updatePalette}
              >
                {palette.length &&
                  palette.map((color) => (
                    <Box
                      as={Reorder.Item}
                      key={color}
                      w={8}
                      h={8}
                      bg={color}
                      value={color}
                    />
                  ))}
              </Flex>
            </Tooltip>
          </HStack>
        ) : null}
      </Box>
      <ExportPanel
        isOpen={view === 'export'}
        onClose={() => updateView('default')}
      />
      {view === 'color-blindness' ? (
        <ColorBlindnessSimulator
          palette={palette}
          contrast={contrast}
          onClose={() => updateView('default')}
        />
      ) : null}
    </>
  );
}
