import { useCallback, useMemo } from 'react';

import Color from 'lib/color';

export type Scales =
  | 'analogic'
  | 'monochrome'
  | 'monochrome-dark'
  | 'quad'
  | 'triad'
  | 'split-complement'
  | 'complement';

const SCALE_STEPS = 10;

export function useTinyColor(
  color: string,
  updateColor: (colorHex: string) => void,
  palette: string[]
) {
  const instance = new Color(color);

  /* -------------------------------------------------------------------------- */
  /*                                COLOR HELPERS                               */
  /* -------------------------------------------------------------------------- */

  const generateRandomColor = useCallback(() => {
    const randomColor = instance.random();
    updateColor(randomColor);
  }, [updateColor, instance]);

  const generateScale = useCallback(
    (mode: Scales) => {
      // if (mode === 'complement') {
      //   return instance.generateComplementaryColors(color, SCALE_STEPS);
      // }

      return instance.generateColorScales(mode, SCALE_STEPS);
    },
    [instance, SCALE_STEPS]
  );

  const colorCombinations = useCallback(
    (instance: Color) => {
      const grays = [
        '#060606',
        '#171717',
        '#282828',
        '#393939',
        '#4a4a4a',
        '#5b5b5b',
        '#6c6c6c',
        '#7d7d7d',
        '#8e8e8e',
        '#9f9f9f',
        '#b0b0b0',
        '#c1c1c1',
        '#d2d2d2',
        '#e3e3e3',
        '#f4f4f4',
      ];
      return instance.validateColorCombinations([
        palette,
        grays,
        instance.generateColorScales('analogic', SCALE_STEPS),
        instance.generateColorScales('monochrome', SCALE_STEPS),
        instance.generateColorScales('complement'),
        instance.generateColorScales('quad'),
        instance.generateColorScales('split-complement'),
        instance.generateColorScales('triad'),
      ]);
    },
    [instance, SCALE_STEPS]
  );

  /* -------------------------------------------------------------------------- */
  /*                                   EXPORTS                                  */
  /* -------------------------------------------------------------------------- */

  const state = useMemo(
    () => ({
      instance,
    }),
    [instance]
  );
  const dispatch = useMemo(
    () => ({
      generateRandomColor,
      generateScale,
      colorCombinations,
    }),
    [generateRandomColor, generateScale, colorCombinations]
  );

  return [state, dispatch] as const;
}
