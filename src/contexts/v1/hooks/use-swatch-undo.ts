import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';
import { useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useDebounce } from '@/hooks';

export const useSwatchUndo = (
  initialColor: string,
  updateSwatch: (color: string) => void
) => {
  const colorHistoryRef = useRef<string[]>([initialColor]);
  const historyIndexRef = useRef(0);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < colorHistoryRef.current.length - 1;
  const toast = useToast();

  const undo = useCallback(() => {
    if (canUndo) {
      historyIndexRef.current--;
      updateSwatch(colorHistoryRef.current[historyIndexRef.current]!);
    } else {
      toast({
        title: 'Cannot Undo - Limit Reached',
        status: 'error',
        duration: 600,
        isClosable: true,
      });
    }
  }, [canUndo, updateSwatch, toast]);

  const redo = useCallback(() => {
    if (canRedo) {
      historyIndexRef.current++;
      updateSwatch(colorHistoryRef.current[historyIndexRef.current]!);
    } else {
      toast({
        title: 'Cannot Redo - Limit Reached',
        status: 'error',
        duration: 600,
        isClosable: true,
      });
    }
  }, [canRedo, updateSwatch, toast]);

  const handleChange = useDebounce(
    useCallback(
      (newColor: string) => {
        if (newColor !== colorHistoryRef.current[historyIndexRef.current]) {
          const newColorHistory = [
            ...colorHistoryRef.current.slice(0, historyIndexRef.current + 1),
            newColor,
          ];
          colorHistoryRef.current = newColorHistory;
          historyIndexRef.current = newColorHistory.length - 1;
          updateSwatch(newColor);
        }
      },
      [updateSwatch]
    ),
    200
  );

  useEffect(() => {
    // only set a new history when the initial color actually changes
    if (initialColor !== colorHistoryRef.current[historyIndexRef.current]) {
      colorHistoryRef.current = [initialColor];
      historyIndexRef.current = 0;
      updateSwatch(initialColor);
    }
  }, [initialColor, updateSwatch]);

  /* -------------------------------------------------------------------------- */
  /*                             KEYBOARD SHORTCUTS                             */
  /* -------------------------------------------------------------------------- */
  useKeyboardShortcut(['Meta', 'z'], undo, {
    overrideSystem: true,
    ignoreInputFields: true,
    repeatOnHold: false,
  });
  useKeyboardShortcut(['Shift', 'z'], redo, {
    overrideSystem: true,
    ignoreInputFields: true,
    repeatOnHold: false,
  });

  const actions = useMemo(() => ({ undo, redo }), [redo, undo]);
  const state = useMemo(
    () => ({ canUndo, canRedo, color: colorHistoryRef.current }),
    [canRedo, canUndo, colorHistoryRef]
  );

  return {
    color: colorHistoryRef.current[historyIndexRef.current],
    undo,
    redo,
    canUndo,
    canRedo,
    handleChange,
  };
  // return { ...actions, ...state, handleChange };
};
