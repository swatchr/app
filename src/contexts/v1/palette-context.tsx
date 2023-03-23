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
  disableQuery,
  insertAtIndex,
  isClient,
  parsePalette,
  publish,
  removeFromArrayAtIndex,
  stringifyPalette,
  updateArrayAtIndex,
} from '@/utils';
import { api } from '@/utils/api';
import ColorLab from 'lib/color';
import { shortname } from 'lib/unique-names-generator';
import { useSession } from 'next-auth/react';

export type Swatch = string;
export type Palette = Swatch[];

interface PaletteProviderProps {
  paletteName: string;
  colorParams: Swatch[] | undefined;
  children?: React.ReactNode;
}

interface PaletteStateValue {
  palettes: Palette[];
  palette: Palette;
  info: {
    id?: string;
    name?: string;
    status?: 'public' | 'private' | string;
  };
  isInfoDirty: boolean;
  activePaletteIndex: number;
  activeSwatchIndex: number;
}

export interface PaletteDispatchValue {
  activatePalette: (index: number) => void;
  activateSwatch: (index: number) => void;
  addPalette: () => void;
  savePalettes: () => void;
  savePalette: () => void;
  restorePalette: () => void;
  addSwatch: (index: number) => void;
  updateSwatch: (swatchIndex: number, newColor: string) => void;
  removeSwatch: (swatchIndex: number) => void;
  updatePalette: (palette: Palette) => void;
  updatePaletteName: (name: string) => void;
  updatePaletteStatus: () => void;
}

export const PaletteStateContext = createContext<PaletteStateValue>(
  {} as PaletteStateValue
);

export const PaletteDispatchContext = createContext<PaletteDispatchValue>(
  {} as PaletteDispatchValue
);

export const PaletteProvider: React.FC<PaletteProviderProps> = ({
  paletteName,
  colorParams,
  children,
}) => {
  const { data: session, status } = useSession();

  const mutation = api.palette.save.useMutation({
    onSuccess: (data) => {
      publish('show-toast', {
        id: 'palette-saved',
        title: 'Palette Saved',
        description: `Your palette ${data?.serial ?? ''} has been saved.`,
        status: 'success',
      });
      if (!isClient) return;
      localStorage.setItem('palette-name', info.name!);
    },
    onError: (error) => {
      publish('show-toast', {
        id: 'palette-save-error',
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
    info: { id: '', name: '', status: 'public' },
    isInfoDirty: false,
    activePaletteIndex: 0,
    activeSwatchIndex: -1,
  };

  const [
    {
      palettes,
      palette,
      info,
      isInfoDirty,
      activePaletteIndex,
      activeSwatchIndex,
    },
    setState,
  ] = useReducer(
    (prev: PaletteStateValue, next: Partial<PaletteStateValue>) => {
      if (next.info && status !== 'authenticated') {
        const hasChanged =
          JSON.stringify(prev.info) !== JSON.stringify(next.info);
        if (hasChanged) {
          next.info = Object.assign({}, prev.info, next.info);
          next.isInfoDirty = true;
        }
      }

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

  api.palette.get.useQuery(
    {
      serial: stringifyPalette(palette),
    },
    {
      enabled: !!palette.length,
      initialData: info,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      ...disableQuery,
      onSuccess: (data) => {
        setState({
          info: { id: data?.id!, name: data?.name!, status: data?.status! },
        });
      },
      onError: (error) => {
        console.log('palette.get', error.message, error.data?.code);
      },
    }
  );

  useEffect(() => {
    // @NOTE: load from URL / Delayed Load from Local Storage / Default Palette
    if (colorParams?.length) {
      setState({ palettes: [colorParams], info: { name: paletteName } });
      publish('show-toast', {
        id: 'custom-url-palette-loaded',
        title: 'Loaded custom palette',
        description: stringifyPalette(colorParams ?? []),
      });
      return;
    } else if (isClient) {
      const serializedPalette = localStorage.getItem('palette');
      const _paletteName = localStorage.getItem('palette-name');
      const palette = parsePalette(serializedPalette!);
      if (palette.length) {
        setState({
          palettes: [palette],
          info: { name: _paletteName ?? shortname() },
        });
        publish('show-toast', {
          id: 'local-storage-loaded',
          title: 'Loaded previously saved palette.',
          description: stringifyPalette(palette ?? []),
        });
        return;
      }
    }
    setState({
      palettes: [['#BADA55']],
      info: { name: paletteName ?? shortname() },
    });
  }, [colorParams, paletteName]);

  useEffect(() => {
    if (status !== 'authenticated' || !isInfoDirty) return;
    console.log('mutating');
    mutation.mutate({
      palette,
      data: info,
    });
    setState({ isInfoDirty: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInfoDirty, info]);

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
    localStorage.setItem('palette-name', info?.name!);

    if (session?.user?.profileId) {
      mutation.mutate({
        palette,
        data: {
          name: info.name ?? shortname(),
        },
      });
    }
  }, [palette, info.name, session?.user?.profileId, mutation]);

  const updatePalette = useCallback(
    // used by framer-motion drag and drop to update the entire palette on reorder
    (newPalette: Palette) => {
      setState({ palette: newPalette });
    },
    [setState]
  );

  const restorePalette = useCallback(() => {
    if (!isClient) return;
    const serializedPalette = localStorage.getItem('palette');
    const palette = parsePalette(serializedPalette!);
    if (palette.length) {
      setState({ palette });
    }
  }, [setState]);

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

  const addNewSwatch = useCallback(() => {
    console.log('adding swatch');
    addSwatch(activeSwatchIndex + 1);
  }, [activeSwatchIndex, addSwatch]);
  const removeCurrentSwatch = useCallback(() => {
    removeSwatch(activeSwatchIndex);
  }, [activeSwatchIndex, removeSwatch]);

  const updatePaletteName = useCallback((name: string) => {
    setState({ info: { name } });
  }, []);

  const updatePaletteStatus = useCallback(() => {
    setState({
      info: { status: info.status === 'public' ? 'private' : 'public' },
    });
  }, [info.status]);

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
          info,
          activePaletteIndex,
          activeSwatchIndex,
          palette,
        }),
        [palettes, info, activePaletteIndex, activeSwatchIndex, palette]
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
            restorePalette,
            addSwatch,
            updateSwatch,
            removeSwatch,
            updatePalette,
            updatePaletteName,
            updatePaletteStatus,
          }),
          [
            activatePalette,
            activateSwatch,
            addPalette,
            savePalette,
            savePalettes,
            restorePalette,
            addSwatch,
            updateSwatch,
            removeSwatch,
            updatePalette,
            updatePaletteName,
            updatePaletteStatus,
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
