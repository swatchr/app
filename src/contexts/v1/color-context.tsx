import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import type { Palette, Swatch } from '@/contexts';
import type ColorLab from 'lib/color';

import { usePaletteDispatch, usePaletteState } from '@/contexts';
import { useKeyboardShortcut } from '@/hooks';
import { useSwatchUndo, useTinyColor } from './hooks';

interface ColorProviderProps {
  color: Swatch;
  index: number;
  children: React.ReactNode;
}

export interface ColorStateValue {
  color: Swatch;
  index: number;
  instance: ColorLab;
  isActive: boolean;
  activeSwatchIndex: number;
  palette: Palette;
}

type SwatchUndoState = {
  history: string[];
  currentIndex: number;
};

type SwatchUndoActions = {
  undo: () => void;
  redo: () => void;
  handleChange: (newColor: string) => void;
  handleRemove: (index: number) => void;
  clearHistory: () => void;
};

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
      if (!isActive) return;
      // if (!newColor || newColor === color) return;
      paletteHandlers.updateSwatch(index, newColor);
    },
    [index, paletteHandlers, isActive]
  );
  const removeColor = useCallback(
    (index: number) => {
      if (!isActive) return;
      paletteHandlers.removeSwatch(index);
    },
    [paletteHandlers, isActive]
  );

  const history = useSwatchUndo(
    color,
    updateColor,
    removeColor,
    index,
    isActive
  );

  /* -------------------------------------------------------------------------- */
  /*                                  TINYCOLOR                                 */
  /* -------------------------------------------------------------------------- */

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
    console.log('generating color');
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
    () => ({
      paletteHandlers,
      tinycolor: colorHandlers,
      history,
    }),
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
