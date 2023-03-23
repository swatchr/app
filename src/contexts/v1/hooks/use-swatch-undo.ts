import { useCallback, useEffect, useReducer } from 'react';

import { useDebounce } from '@/hooks';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';
import { isClient, publish } from '@/utils';

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

const HISTORY_LIMIT = 10;

export const useSwatchUndo = (
  initialColor: string,
  updateSwatch: (color: string) => void,
  removeColor: (index: number) => void,
  index: number,
  isActive: boolean
) => {
  const key = `swatch-${index}`;
  const [{ history, currentIndex }, setState] = useReducer(
    (prev: SwatchUndoState, next: Partial<SwatchUndoState>) => {
      if (next?.history && next.history.length > HISTORY_LIMIT) {
        next.history?.shift();
      }

      return { ...prev, ...next };
    },
    { history: [initialColor], currentIndex: 0 }
  );

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const notify = useCallback(
    (title: string) => {
      isActive &&
        publish('show-toast', {
          title,
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
    },
    [isActive]
  );

  useEffect(() => {
    if (isClient) {
      const storedState = localStorage.getItem(key);
      if (storedState) {
        setState(JSON.parse(storedState));
      }
    }
  }, [key]);

  useEffect(() => {
    const newState = { history, currentIndex };
    localStorage.setItem(key, JSON.stringify(newState));
  }, [history, currentIndex, key]);

  const undo = useCallback(() => {
    if (isActive && canUndo) {
      const newIndex = currentIndex - 1;
      setState({ currentIndex: newIndex });
      updateSwatch(history[newIndex]!);
      localStorage.setItem(
        key,
        JSON.stringify({ history, currentIndex: newIndex })
      );
    } else {
      notify('Nothing to undo');
    }
  }, [isActive, canUndo, currentIndex, updateSwatch, history, key, notify]);

  const redo = useCallback(() => {
    if (isActive && canRedo) {
      const newIndex = currentIndex + 1;
      setState({ currentIndex: newIndex });
      updateSwatch(history[newIndex]!);
      localStorage.setItem(
        key,
        JSON.stringify({ history, currentIndex: newIndex })
      );
    } else {
      notify('Nothing to redo');
    }
  }, [isActive, canRedo, currentIndex, updateSwatch, history, key, notify]);

  const handleChange = useDebounce(
    useCallback(
      (newColor: string) => {
        if (isActive && newColor !== history[currentIndex]) {
          const newHistory = history;
          newHistory.push(newColor);
          const lastIndex = newHistory.length - 1;
          setState({
            history: newHistory,
            currentIndex: lastIndex,
          });
          updateSwatch(newColor);
        }
      },
      [isActive, history, currentIndex, updateSwatch]
    ),
    200
  );

  const handleRemove = useCallback(
    (index: number) => {
      if (isActive && isClient && localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
      removeColor(index);
    },
    [isActive, key, removeColor]
  );

  const clearHistory = useCallback(() => {
    if (isActive && isClient && localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
    setState({ history: [initialColor], currentIndex: 0 });
  }, [initialColor, isActive, key]);

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

  return {
    history,
    historyIndex: currentIndex,
    color: history[currentIndex],
    undo,
    redo,
    canUndo,
    canRedo,
    handleChange,
    handleRemove,
  };
};
