import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  ButtonGroup,
  HStack,
  IconButton,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react';

import { SaveIcon } from '@/components';
import { usePaletteDispatch } from '@/contexts';
import ColorLab from 'lib/color';
import { ExportIcon, SunglassesIcon, UndoIcon } from '../icons';
import { FeedbackWidget } from './feedback-widget';

export function HeaderIconStack({
  palette,
  openModal,
  showCB,
  showColorBlindness,
}: {
  palette: string[];
  openModal: () => void;
  showCB: boolean;
  showColorBlindness: () => void;
}) {
  const { savePalette, restorePalette } = usePaletteDispatch();
  const { colorMode, toggleColorMode } = useColorMode();

  const contrast =
    new ColorLab(palette[palette.length - 1]!).contrast == 'dark'
      ? 'blackAlpha'
      : 'whiteAlpha';

  const fillColor =
    new ColorLab(palette[palette.length - 1]!).contrast == 'dark'
      ? 'gray.300'
      : 'gray.900';

  const handleSave = () => {
    savePalette();
  };

  return (
    <ButtonGroup
      as={HStack}
      className="header-icons"
      position="fixed"
      top={16}
      right={24}
      zIndex={10}
      colorScheme={contrast}
      color={fillColor}
      fill={fillColor}
      opacity={0.7}
      _hover={{ opacity: 1 }}
    >
      <Tooltip label={colorMode === 'dark' ? 'Light' : 'Dark'}>
        <IconButton
          aria-label="color mode"
          color={'inherit'}
          icon={
            colorMode === 'dark' ? (
              <SunIcon boxSize={'1.35rem'} />
            ) : (
              <MoonIcon boxSize={'1.35rem'} />
            )
          }
          onClick={toggleColorMode}
        />
      </Tooltip>
      <FeedbackWidget isDisabled={showCB} />
      <Tooltip label="Simulate Color Blindness">
        <IconButton
          aria-label="Export Palette"
          icon={<SunglassesIcon boxSize={'1.7rem'} />}
          onClick={showColorBlindness}
          border={showCB ? '2px solid' : 'none'}
        />
      </Tooltip>
      <Tooltip label="Export">
        <IconButton
          aria-label="Export Palette"
          icon={<ExportIcon boxSize={'1.35rem'} />}
          onClick={openModal}
          isDisabled={showCB}
        />
      </Tooltip>
      <Tooltip label="Restore Palette">
        <IconButton
          aria-label="Restore Palette"
          icon={<UndoIcon boxSize={'1.35rem'} />}
          onClick={restorePalette}
        />
      </Tooltip>
      <Tooltip label="Save Palette (Local Storage)">
        <IconButton
          aria-label="Save Palette"
          icon={<SaveIcon boxSize={'1.35rem'} />}
          onClick={handleSave}
          isDisabled={showCB}
        />
      </Tooltip>
    </ButtonGroup>
  );
}
