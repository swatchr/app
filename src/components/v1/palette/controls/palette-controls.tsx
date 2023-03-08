import { AddIcon, MinusIcon, NotAllowedIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';

import { useColorState, usePaletteDispatch, usePaletteState } from '@/contexts';
import { ControlWrapper } from './control-wrapper';

export function PaletteControls({
  index,
  modifier,
}: {
  index: number;
  modifier: string;
}) {
  const { palette } = usePaletteState();
  const { addSwatch, removeSwatch } = usePaletteDispatch();
  const { instance } = useColorState();

  const swatchIndex = modifier === 'increment' ? index + 1 : index - 1;

  const handleAddSwatch = () => addSwatch(swatchIndex);
  const handleRemoveSwatch = () => removeSwatch(index);
  const isOnlySwatch = palette.length === 1;

  const contrast = instance.contrast === 'dark' ? 'blackAlpha' : 'whiteAlpha';
  const fillColor = instance.contrast === 'dark' ? 'whiteAlpha' : 'blackAlpha';
  return (
    <>
      <ControlWrapper
        label={
          index === 4 ? 'Swatch Limit Reached' : `Add Swatch ${swatchIndex}`
        }
        shortcuts={['SHIFT', 'CTRL', '+']}
      >
        <IconButton
          p={1}
          aria-label="add new swatch"
          icon={index === 4 ? <NotAllowedIcon /> : <AddIcon />}
          size="2rem"
          rounded="50%"
          colorScheme={`${contrast}`}
          color={`${fillColor}.500`}
          onClick={handleAddSwatch}
          disabled={index === 4}
        />
      </ControlWrapper>
      <ControlWrapper
        label={
          isOnlySwatch && index !== 0
            ? `Remove Swatch ${index}`
            : 'Cannot Remove Swatch'
        }
        shortcuts={['SHIFT', 'CTRL', '-']}
      >
        <IconButton
          p={1}
          aria-label="remove swatch"
          icon={
            isOnlySwatch && index === 0 ? <NotAllowedIcon /> : <MinusIcon />
          }
          size="2rem"
          rounded="50%"
          colorScheme={`${contrast}`}
          color={`${fillColor}.500`}
          onClick={handleRemoveSwatch}
          disabled={isOnlySwatch && index === 0}
        />
      </ControlWrapper>
    </>
  );
}
