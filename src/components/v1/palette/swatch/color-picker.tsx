import { Box, Center, useOutsideClick } from '@chakra-ui/react';
import { HexColorPicker } from 'react-colorful';

import type { ColorDispatchValue } from '@/contexts';

import { useCallback, useRef } from 'react';
import { REACT_COLORFUL_STYLES } from './react-colorful-styles';

export function ColorPicker({
  isActive,
  render,
}: {
  isActive: boolean;
  render: ({ isActive }: { isActive: boolean }) => JSX.Element | null;
}) {
  return render({ isActive });
}

export function ColorPickerWrapper({
  color,
  colorHandlers,
  onClick,
  view,
}: {
  color: string;
  colorHandlers: ColorDispatchValue;
  onClick: () => void;
  view: 'swatch' | 'picker';
}) {
  const popover = useRef<HTMLDivElement | null>(null);

  const closePicker = useCallback(() => {
    if (view !== 'picker') return;
    onClick();
  }, []);

  useOutsideClick({ ref: popover, handler: closePicker });

  const isOpen = view === 'picker';

  return (
    <Center
      ref={popover}
      className="colorful-color-picker"
      position="absolute"
      fontFamily="mono"
      sx={REACT_COLORFUL_STYLES}
      zIndex={2} // must appear under hex input
    >
      <ColorPicker
        isActive={isOpen}
        render={({ isActive }) =>
          isActive ? (
            <HexColorPicker
              color={color}
              onChange={colorHandlers.history.handleChange}
            />
          ) : null
        }
      />
    </Center>
  );
}
