import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { useKeyboardShortcut } from '@/hooks';
import {
  insertAtIndex,
  isClient,
  parsePalette,
  publish,
  removeFromArrayAtIndex,
  stringifyPalette,
  updateArrayAtIndex,
  wait,
} from '@/utils';
import { api } from '@/utils/api';
import { useToast } from '@chakra-ui/react';
import ColorLab from 'lib/color';
import { useSession } from 'next-auth/react';

export type Swatch = string;
export type Palette = Swatch[];

interface PaletteProviderProps {
  colorParams: Swatch[] | undefined;
  children?: React.ReactNode;
}

interface PaletteStateValue {
  palettes: Palette[];
  palette: Palette;
  activePaletteIndex: number;
  activeSwatchIndex: number;
}

export interface PaletteDispatchValue {
  activatePalette: (index: number) => void;
  activateSwatch: (index: number) => void;
  addPalette: () => void;
  savePalettes: () => void;
  savePalette: () => void;
  addSwatch: (index: number) => void;
  updateSwatch: (swatchIndex: number, newColor: string) => void;
  removeSwatch: (swatchIndex: number) => void;
  updatePalette: (palette: Palette) => void;
}

export const PaletteStateContext = createContext<PaletteStateValue>(
  {} as PaletteStateValue
);

export const PaletteDispatchContext = createContext<PaletteDispatchValue>(
  {} as PaletteDispatchValue
);

export const PaletteProvider: React.FC<PaletteProviderProps> = ({
  colorParams,
  children,
}) => {
  const toast = useToast();
  const { data: session, status } = useSession();

  const mutation = api.palette.save.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Palette Saved',
        description: `Your palette ${data?.serial ?? ''} has been saved.`,
        status: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving palette',
        description: 'There was an error saving your palette.',
        status: 'error',
      });
    },
  });
  const colorMutation = api.color.save.useMutation();

  const initialState: PaletteStateValue = {
    palettes: [[]],
    palette: [],
    activePaletteIndex: 0,
    activeSwatchIndex: -1,
  };

  const [
    { palettes, palette, activePaletteIndex, activeSwatchIndex },
    setState,
  ] = useReducer(
    (prev: PaletteStateValue, next: Partial<PaletteStateValue>) => {
      // @NOTE: reconcile palettes with palette / vice-versa - on state updates
      if (next?.palette?.length) {
        next.palettes = updateArrayAtIndex(
          prev.palettes,
          prev.activePaletteIndex,
          () => next.palette!
        );
      } else if (next?.palettes?.length) {
        next.palette = next.palettes[prev.activePaletteIndex];
        next.activePaletteIndex = next.palettes.length - 1;
        next.palettes = updateArrayAtIndex(
          prev.palettes,
          prev.activePaletteIndex,
          () => next.palette!
        );
      }

      return { ...prev, ...next };
    },
    initialState
  );

  useEffect(() => {
    // @NOTE: load from URL / Delayed Load from Local Storage / Default Palette
    if (colorParams?.length) {
      setState({ palettes: [colorParams] });
      publish('show-toast', {
        id: 'custom-url-palette-loaded',
        title: 'Loaded custom palette',
        description: stringifyPalette(colorParams ?? []),
      });
      return;
    } else if (isClient) {
      const serializedPalette = localStorage.getItem('palette');
      const palette = parsePalette(serializedPalette!);
      if (palette.length) {
        setState({ palettes: [palette] });
        publish('show-toast', {
          id: 'local-storage-loaded',
          title: 'Loaded previously saved palette.',
          description: stringifyPalette(palette ?? []),
        });
        return;
      }
    }
    setState({ palettes: [['#BADA55']] });
  }, [colorParams]);

  const activateSwatch = useCallback(
    (index: number) => {
      setState({ activeSwatchIndex: index });
    },
    [setState]
  );

  const activatePalette = useCallback(
    (index: number) => {
      setState({ activePaletteIndex: index });
    },
    [setState]
  );

  const addPalette = useCallback(() => {
    setState({
      palettes: [...palettes, ['#BADA55']],
    });
  }, [palettes]);

  const savePalettes = useCallback(() => {
    const serializedPalettes = JSON.stringify(
      palettes.map((pal) => stringifyPalette(pal))
    );
    localStorage.setItem('palettes', serializedPalettes);
  }, [palettes]);

  const savePalette = useCallback(() => {
    const serializedPalette = stringifyPalette(palette);
    localStorage.setItem('palette', serializedPalette);

    if (session?.user?.profileId) {
      mutation.mutate({
        palette,
        // @TODO: impelment palette name
      });
    }
  }, [palette, mutation, session]);

  const addSwatch = useCallback(
    (swatchIndex: number) => {
      const newColor = new ColorLab('#BADA55').random();
      setState({
        palette: insertAtIndex(palette, swatchIndex, newColor),
      });
      colorMutation.mutate({
        hex: newColor.startsWith('#') ? newColor.replace('#', '') : newColor,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- do not add colorMutation to deps
    [setState, palette]
  );

  const updateSwatch = useCallback(
    (swatchIndex: number, newColor: string) => {
      setState({
        palette: updateArrayAtIndex(palette, swatchIndex, () => newColor),
      });
      colorMutation.mutate({
        hex: newColor.startsWith('#') ? newColor.replace('#', '') : newColor,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- do not add colorMutation to deps
    [setState, palette]
  );

  const removeSwatch = useCallback(
    (swatchIndex: number) => {
      // don't remove the first swatch if there's only one
      if (palette.length < 1 && swatchIndex <= 0) return;
      const newPalette = removeFromArrayAtIndex(palette, swatchIndex);
      setState({ palette: newPalette });
    },
    [setState, palette]
  );

  const updatePalette = useCallback(
    // used by framer-motion drag and drop to update the entire palette on reorder
    (newPalette: Palette) => {
      setState({ palette: newPalette });
    },
    [setState]
  );

  const addNewSwatch = useCallback(() => {
    addSwatch(activeSwatchIndex + 1);
  }, [activeSwatchIndex, addSwatch]);
  const removeCurrentSwatch = useCallback(() => {
    removeSwatch(activeSwatchIndex);
  }, [activeSwatchIndex, removeSwatch]);

  useKeyboardShortcut(['Shift', 'Control', '+'], addNewSwatch, {
    repeatOnHold: true,
  });

  useKeyboardShortcut(['Shift', 'Control', '_'], removeCurrentSwatch, {
    repeatOnHold: true,
  });

  return (
    <PaletteStateContext.Provider
      value={useMemo(
        () => ({
          palettes,
          activePaletteIndex,
          activeSwatchIndex,
          palette,
        }),
        [palettes, activePaletteIndex, activeSwatchIndex, palette]
      )}
    >
      <PaletteDispatchContext.Provider
        value={useMemo(
          () => ({
            activatePalette,
            activateSwatch,
            addPalette,
            savePalette,
            savePalettes,
            addSwatch,
            updateSwatch,
            removeSwatch,
            updatePalette,
          }),
          [
            activatePalette,
            activateSwatch,
            addPalette,
            savePalette,
            savePalettes,
            addSwatch,
            updateSwatch,
            removeSwatch,
            updatePalette,
          ]
        )}
      >
        {children}
      </PaletteDispatchContext.Provider>
    </PaletteStateContext.Provider>
  );
};

export function usePaletteState(): PaletteStateValue {
  const context = useContext(PaletteStateContext);
  if (context === undefined) {
    throw new Error('usePaletteState must be used within a PaletteProvider');
  }

  return context;
}

export function usePaletteDispatch(): PaletteDispatchValue {
  const context = useContext(PaletteDispatchContext);
  if (context === undefined) {
    throw new Error('usePaletteState must be used within a PaletteProvider');
  }
  return context;
}
