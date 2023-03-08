import {
  ButtonGroup,
  HStack,
  IconButton,
  Tooltip,
  useToast,
} from '@chakra-ui/react';

import { SaveIcon } from '@/components';
import { usePaletteDispatch } from '@/contexts';
import Color from 'lib/color';
import { ExportIcon, SunglassesIcon } from '../icons';
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
  const { savePalette } = usePaletteDispatch();
  const toast = useToast();

  const contrast =
    new Color(palette[palette.length - 1]!).contrast == 'dark'
      ? 'WhiteAlpha'
      : 'blackAlpha';

  const fillColor =
    new Color(palette[palette.length - 1]!).contrast == 'dark'
      ? 'gray.300'
      : 'gray.900';

  const handleSave = () => {
    savePalette();
    toast({
      title: 'Palette Saved',
      description: 'Your palette has been saved to local storage.',
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <ButtonGroup
      as={HStack}
      className="header-icons"
      position="fixed"
      top={10}
      right={12}
      zIndex={10}
      colorScheme={contrast}
      color={fillColor}
      fill={fillColor}
      opacity={0.7}
      _hover={{ opacity: 1 }}
    >
      <FeedbackWidget fill={fillColor} isDisabled={showCB} />
      <Tooltip label="Simulate Color Blindness">
        <IconButton
          aria-label="Export Palette"
          icon={<SunglassesIcon boxSize={'1.35rem'} />}
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
