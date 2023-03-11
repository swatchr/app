import { useCallback, useMemo, useState } from 'react';

import { useColorDispatch, useColorState } from '@/contexts';

export const roots = ['color', 'palette', 'help', 'credits'];

const colorOptions = ['add', 'remove', 'edit', 'copy', 'replace'];

const paletteOptions = ['add', 'remove', 'save'];

const helpOptions = ['about', 'shortcuts'];

const creditsOptions = ['about', 'shortcuts'];

const options: Record<string, string[]> = {
  roots,
  color: colorOptions,
  palette: paletteOptions,
  help: helpOptions,
  credits: creditsOptions,
};

export function useCommands() {
  const { activeSwatchIndex, color, palette } = useColorState();
  const { paletteHandlers, tinycolor } = useColorDispatch();
  const [category, setCategory] = useState('roots');

  const updateCategory = useCallback(
    (category: string) => setCategory(category),
    [setCategory]
  );

  return {
    options: useMemo(() => options[category], [category]),
    category,
    updateCategory,
  };
}
