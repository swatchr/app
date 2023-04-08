import { Box, Center } from '@chakra-ui/react';
import { HexColorPicker } from 'react-colorful';

import type { ColorDispatchValue } from '@/contexts';

import { REACT_COLORFUL_STYLES } from './react-colorful-styles';

export function ColorPickerWrapper({
  color,
  colorHandlers,
}: {
  color: string;
  colorHandlers: ColorDispatchValue;
}) {
  return (
    <Center
      className="colorful-color-picker"
      position={{ base: 'absolute', lg: 'relative' }}
      bg={{ base: color, md: 'transparent' }}
      fontFamily="mono"
      rounded={{ base: 'md', md: 'none' }}
      shadow={{ base: 'md', md: 'none' }}
      sx={REACT_COLORFUL_STYLES}
      p={{ base: 12, md: 0 }}
      zIndex={{ base: 0, md: 2 }}
      overflow={{ base: 'hidden', md: 'initial' }}
    >
      <Box boxShadow="'0px 0px 20px rgba(0,0,0, 0.1)" rounded="md">
        <HexColorPicker
          color={color}
          onChange={colorHandlers.history.handleChange}
        />
      </Box>
    </Center>
  );
}
