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
  capitalize,
  DASHES_REGEX,
  disableQuery,
  insertAtIndex,
  isClient,
  PALETTE_KEY,
  PALETTE_NAME_KEY,
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

const notify = (key: string, data: any, debug: boolean = false) => {
  let notification = {};
  if (key === 'palette-saved') {
    notification = {
      id: key,
      title: capitalize(key.replace(DASHES_REGEX, ' ')),
      description: `Your palette ${data?.serial ?? ''} has been saved.`,
      status: 'success',
    };
  }

  if (key === 'palette-updated') {
    notification = {
      id: key,
      title: capitalize(key.replace(DASHES_REGEX, ' ')),
      description: `Your palette ${data?.serial ?? ''} has been updated.`,
      status: 'success',
    };
  }

  if (key === 'palette-not-updated') {
    notification = {
      id: key,
      title: capitalize(key.replace(DASHES_REGEX, ' ')),
      description: `Your palette ${data?.serial ?? ''} could not be updated.`,
      status: 'info',
    };
  }

  if (key === 'palette-name-updated') {
    notification = {
      id: key,
      title: capitalize(key.replace(DASHES_REGEX, ' ')),
      description: `Your palette name has been updated to: ${data}.`,
      status: 'success',
    };
  }

  if (key === 'palette-status-updated') {
    notification = {
      id: key,
      title: capitalize(key.replace(DASHES_REGEX, ' ')),
      description: `Your palette status has been updated to: ${data}.`,
      status: 'success',
    };
  }

  if (key === 'palette-save-error') {
    notification = {
      id: key,
      title: capitalize(key.replace(DASHES_REGEX, ' ')),
      description: 'There was an error saving your palette.',
      status: 'error',
    };
  }

  if (key === 'palette-restored') {
    notification = {
      id: key,
      title: capitalize(key.replace(DASHES_REGEX, ' ')),
      description: 'You palette was restored.',
      status: 'success',
    };
  }

  if (key === 'palette-not-restored') {
    notification = {
      id: key,
      title: capitalize(key.replace(DASHES_REGEX, ' ')),
      description: 'No changes detected.',
      status: 'info',
    };
  }

  if (key === 'palette-restore-error') {
    notification = {
      id: key,
      title: capitalize(key.replace(DASHES_REGEX, ' ')),
      description: 'There was an error restoring your palette.',
      status: 'error',
    };
  }

  if (key === 'custom-url-palette-loaded') {
    notification = {
      id: 'custom-url-palette-loaded',
      title: 'Loaded custom palette',
      description: stringifyPalette(data ?? []),
    };
  }
  if (key === 'local-storage-loaded') {
    notification = {
      id: 'local-storage-loaded',
      title: 'Loaded previously saved palette.',
      description: stringifyPalette(data ?? []),
    };
  }

  publish('show-toast', notification);
  if (debug) console.log(key, notification);
};

export const PaletteProvider: React.FC<PaletteProviderProps> = ({
  paletteName,
  colorParams,
  children,
}) => {
  const { data: session, status } = useSession();

  const mutation = api.palette.save.useMutation({
    onSuccess: (data) => {
      notify('palette-saved', data);
      if (!isClient) return;
      localStorage.setItem(PALETTE_NAME_KEY, info.name!);
    },
    onError: (error) => {
      notify('palette-save-error', error);
    },
  });

  const colorMutation = api.color.save.useMutation();

  const initialState: PaletteStateValue = {
    palettes: [[]],
    palette: [],
    info: { id: '', name: '', status: 'public' },
    isInfoDirty: false,
    activePaletteIndex: 0,
    activeSwatchIndex: 0,
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
      notify('custom-url-palette-loaded', colorParams);
      return;
    } else if (isClient) {
      const serializedPalette = localStorage.getItem(PALETTE_KEY);
      const _paletteName = localStorage.getItem(PALETTE_NAME_KEY);
      const palette = parsePalette(serializedPalette!);
      if (palette.length) {
        setState({
          palettes: [palette],
          info: { name: _paletteName ?? shortname() },
        });

        notify('local-storage-loaded', palette);
        return;
      }
    }
    setState({
      palettes: [['#BADA55']],
      info: { name: paletteName ?? shortname() },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    localStorage.setItem(PALETTE_KEY, serializedPalettes);
  }, [palettes]);

  const savePalette = useCallback(() => {
    const serializedPalette = stringifyPalette(palette);
    localStorage.setItem(PALETTE_KEY, serializedPalette);
    localStorage.setItem(PALETTE_NAME_KEY, info?.name!);

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
      if (!newPalette.length) return;
      if (stringifyPalette(newPalette) === stringifyPalette(palette)) {
        notify('palette-not-updated', {});
        return;
      }
      setState({ palette: newPalette });
      notify('palette-updated', newPalette);
    },
    [setState, palette]
  );

  const restorePalette = useCallback(() => {
    if (!isClient) return;
    const serializedPalette = localStorage.getItem(PALETTE_KEY);
    if (serializedPalette === stringifyPalette(palette)) {
      notify('palette-not-restored', {});
      return;
    }
    const parsedPalette = parsePalette(serializedPalette!);
    if (parsedPalette.length) {
      setState({ palette: parsedPalette });
      notify('palette-restored', parsedPalette);
      return;
    }
    notify('palette-restore-error', parsedPalette);
  }, [setState, palette]);

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
      if (palette.length <= 1) return;
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
    notify('palette-name-updated', name);
  }, []);

  const updatePaletteStatus = useCallback(() => {
    setState({
      info: { status: info.status === 'public' ? 'private' : 'public' },
    });
    notify(
      'palette-status-updated',
      info.status === 'public' ? 'private' : 'public'
    );
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
          isInfoDirty,
          activePaletteIndex,
          activeSwatchIndex,
          palette,
        }),
        [
          palettes,
          info,
          isInfoDirty,
          activePaletteIndex,
          activeSwatchIndex,
          palette,
        ]
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
