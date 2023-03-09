import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import {
  Palette,
  Swatch,
  usePaletteDispatch,
  usePaletteState,
} from '@/contexts';
import { useKeyboardShortcut } from '@/hooks';
import Color from 'lib/color';
import { useSwatchUndo } from './hooks/use-swatch-undo';
import { useTinyColor } from './hooks/use-tinycolor';

interface ColorProviderProps {
  color: Swatch;
  index: number;
  children: React.ReactNode;
}

export interface ColorStateValue {
  color: Swatch;
  index: number;
  instance: Color;
  isActive: boolean;
  activeSwatchIndex: number;
  palette: Palette;
}

export interface ColorDispatchValue {
  paletteHandlers: ReturnType<typeof usePaletteDispatch>;
  history: ReturnType<typeof useSwatchUndo>;
  tinycolor: ReturnType<typeof useTinyColor>[1];
}

export const ColorStateContext = createContext<ColorStateValue>(
  {} as ColorStateValue
);
export const ColorDispatchContext = createContext<ColorDispatchValue>(
  {} as ColorDispatchValue
);

export const ColorProvider: React.FC<ColorProviderProps> = ({
  color,
  index,
  children,
}) => {
  const paletteState = usePaletteState();
  const paletteHandlers = usePaletteDispatch();
  const isActive = paletteState.activeSwatchIndex === index;
  const updateColor = useCallback(
    (newColor: string) => {
      // if (!newColor || newColor === color) return;
      paletteHandlers.updateSwatch(index, newColor);
    },
    [index, paletteHandlers]
  );

  const history = useSwatchUndo(color, updateColor);

  const [{ instance }, colorHandlers] = useTinyColor(
    color,
    history.handleChange,
    paletteState.palette
  );

  /* -------------------------------------------------------------------------- */
  /*                             KEYBOARD SHORTCUTS                             */
  /* -------------------------------------------------------------------------- */

  // empty space represents the spacebar
  useKeyboardShortcut([' '], () => {
    if (!isActive) return;
    colorHandlers.generateRandomColor();
  });
  /* -------------------------------------------------------------------------- */
  /*                                   LOGGING                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const text = instance.contrast === 'light' ? '#000' : '#fff';
    console.groupCollapsed('Current Color', color);
    console.log('color  ', 'complement', 'text');
    console.log(
      '%c        %c        %c        ',
      `background-color: ${color}`,
      `background-color: ${instance.complement}`,
      `background-color: ${text}`
    );
    console.log(color, instance.complement, text);
    console.groupEnd();
  }, [color, instance.complement, instance.contrast]);

  /* -------------------------------------------------------------------------- */
  /*                                   EXPORTS                                  */
  /* -------------------------------------------------------------------------- */

  const colorStateValue: ColorStateValue = useMemo(
    () => ({
      color,
      index,
      instance,
      isActive,
      activeSwatchIndex: paletteState.activeSwatchIndex,
      palette: paletteState.palette,
    }),
    [
      color,
      index,
      instance,
      isActive,
      paletteState.activeSwatchIndex,
      paletteState.palette,
    ]
  );

  const colorDispatchValue: ColorDispatchValue = useMemo(
    () => ({ paletteHandlers, tinycolor: colorHandlers, history }),
    [paletteHandlers, colorHandlers, history]
  );

  return (
    <ColorStateContext.Provider value={colorStateValue}>
      <ColorDispatchContext.Provider value={colorDispatchValue}>
        {children}
      </ColorDispatchContext.Provider>
    </ColorStateContext.Provider>
  );
};

export function useColorState() {
  const context = useContext(ColorStateContext);
  if (context === undefined) {
    throw new Error('useColorState must be used within a ColorProvider');
  }
  return context;
}

export function useColorDispatch() {
  const context = useContext(ColorDispatchContext);
  if (context === undefined) {
    throw new Error('useColorDispatch must be used within a ColorProvider');
  }
  return context;
}
