import tinycolor, { type Instance } from 'tinycolor2';

export type ColorHarmonyMode =
  | 'complement'
  | 'analogous'
  | 'triad'
  | 'tetrad'
  | 'monochromatic';

export type ColorMode =
  | 'analogic'
  | 'monochrome'
  | 'monochrome-dark'
  | 'quad'
  | 'triad'
  | 'split-complement'
  | 'complement'
  | 'default';

export type StrictColorModes = Exclude<ColorMode, 'default'>;

export interface ColorCombination {
  colors: string[];
  reason: string;
}

export interface ColorValidationResult {
  aa: ColorCombination[];
  aaa: ColorCombination[];
  fails: ColorCombination[];
}

interface ColorFilters {
  protanomaly: string;
  protanopia: string;
  deuteranomaly: string;
  deuteranopia: string;
  tritanomaly: string;
  tritanopia: string;
  achromatomaly: string;
  achromatopsia: string;
}

const SCALE_STEPS = 10;

class Color {
  color: tinycolor.Instance;
  complement: string;
  contrast: 'light' | 'dark';
  // Declare a global variable to store previous baseColor
  constructor(color: string) {
    this.color = tinycolor(color);
    this.complement = this.color.complement().toHexString();
    this.contrast = this.color.isLight() ? 'dark' : 'light';
  }

  /* -------------------------------------------------------------------------- */
  /*                          Color Conversion Helpers                          */
  /* -------------------------------------------------------------------------- */
  toHexString(color?: string | Instance): string {
    return color ? tinycolor(color).toHexString() : this.color.toHexString();
  }

  toHslString(color?: string): string {
    return color ? tinycolor(color).toHslString() : this.color.toHslString();
  }

  toHsl(color?: string): { h: number; s: number; l: number } {
    return color ? tinycolor(color).toHsl() : this.color.toHsl();
  }

  toCmykString(hex?: string): string {
    // Remove # character if present
    hex = hex?.replace('#', '');

    // Convert hex to RGB values
    let r = parseInt(hex?.substr(0, 2)!, 16) / 255;
    let g = parseInt(hex?.substr(2, 2)!, 16) / 255;
    let b = parseInt(hex?.substr(4, 2)!, 16) / 255;

    // Calculate CMYK values
    let k = Math.min(1 - r, 1 - g, 1 - b);
    let c = (1 - r - k) / (1 - k);
    let m = (1 - g - k) / (1 - k);
    let y = (1 - b - k) / (1 - k);

    // Format CMYK values as a string
    return `${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(
      y * 100
    )}%, ${Math.round(k * 100)}%`;
  }

  darken(amount: number, color?: string): string {
    return color
      ? tinycolor(color).darken(amount).toHexString()
      : this.color.darken(amount).toHexString();
  }

  lighten(amount: number, color?: string): string {
    return color
      ? tinycolor(color).lighten(amount).toHexString()
      : this.color.lighten(amount).toHexString();
  }

  /* -------------------------------------------------------------------------- */
  /*                           Color Scale Generators                           */
  /* -------------------------------------------------------------------------- */
  /**
   * Generates an array of complementary colors based on a given base color.
   *
   * The algorithm used to generate the complementary colors is as follows:
   * 1. Convert the base color to HSL color space.
   * 2. Generate a random hue value in the range [0, 360).
   * 3. Generate a random saturation value in the range [0, 100].
   * 4. Generate a random lightness value in the range [0, 100].
   * 5. Convert the HSL color to RGB color space.
   *
   * * used by color-context to generate semi-random complementary colors
   *
   * @param baseColor - The base color used to generate the complementary colors.
   * @param numColors - The number of complementary colors to generate (default: 5).
   * @returns An array of complementary colors.
   */
  generateComplementaryColors(
    baseColor: string,
    numColors = SCALE_STEPS
  ): string[] {
    // Convert the base color to HSL color space
    const baseColorHSL = tinycolor(baseColor).toHsl();

    // Create an array to store complementary colors
    const colors: string[] = [];

    // Calculate the minimum difference between colors required to meet the contrast threshold
    const deltaEThreshold = 50;

    // Use a loop to generate numColors complementary colors based on baseColor
    for (let i = 0; i < numColors; i++) {
      let color: any;
      let deltaE: number;

      // Generate a random color in HSL space
      do {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 100);
        const lightness = Math.floor(Math.random() * 100);
        color = tinycolor({
          h: hue,
          s: saturation,
          l: lightness,
        }).toHexString();

        // Calculate the difference between the generated color and the base color
        const colorHSL = tinycolor(color).toHsl();
        const hueDelta = Math.abs(colorHSL.h - baseColorHSL.h);
        const saturationDelta = Math.abs(colorHSL.s - baseColorHSL.s);
        const lightnessDelta = Math.abs(colorHSL.l - baseColorHSL.l);
        deltaE = Math.sqrt(
          hueDelta * hueDelta +
            saturationDelta * saturationDelta +
            lightnessDelta * lightnessDelta
        );
      } while (deltaE < deltaEThreshold || colors.includes(color));

      // Add the color to the array
      colors.push(color);
    }

    // Return the array of complementary colors
    return colors;
  }

  /**
   * Generate a set of color scales based on a given color and mode.
   *
   * * used by color-context to generate color scales for a given color
   *
   * The algorithm used to generate the color scales is as follows:
   * 1. Create an empty set to hold unique color values.
   * 2. Define a map of color modes to their respective color functions.
   * 3. Define a function to generate a color scale based on a given color and mode.
   * 4. Generate a color scale based on the given color and mode.
   * 5. Sort the color scale based on the given sort function.
   * 6. Return the color scale.
   *
   * @param {ColorMode} [mode='complement'] - The color mode to use.
   * @param {number} [count=SCALE_STEPS] - The number of colors to generate.
   * @param {(a: string, b: string) => number} [sortFn] - A sorting function to use for the color scales.
   *
   * @returns {string[]} An array of hex string values for the generated color scales.
   */
  generateColorScales(
    mode: ColorMode = 'complement',
    count: number = SCALE_STEPS,
    sortFn: (a: string, b: string) => number = (a, b) =>
      tinycolor(b).getLuminance() - tinycolor(a).getLuminance()
  ): string[] {
    // Create an empty set to hold unique color values
    const colorSet: Set<string> = new Set();

    // Define a map of color modes to their respective color functions
    const colorFunctionMap: Record<ColorMode, Function> = {
      analogic: this.color.analogous,
      monochrome: this.color.monochromatic,
      'monochrome-dark': () =>
        this.color.monochromatic(count).map((c: any) => c.darken(11)),
      quad: this.color.tetrad,
      triad: this.color.triad,
      'split-complement': this.color.splitcomplement,
      complement: this.color.complement,
      default: () => this.color.complement().analogous,
    };

    // Get the color function based on the provided mode or default to complement
    const colorsFn = colorFunctionMap[mode] || colorFunctionMap.default;

    // Call the color function with the provided count and add each resulting color to the set
    const colors = colorsFn.call(this.color, count);
    if (Array.isArray(colors)) {
      colors.forEach((c: any) => colorSet.add((c as Instance).toHexString()));
    } else {
      colorSet.add((colors as Instance).toHexString());
    }
    // Convert the set to an array and sort it using the provided sorting function or default to sorting by luminance
    return [...colorSet].sort(sortFn);
  }

  /**
   * Generate a set of color scales based on a given color and mode.
   *
   * * used by color-context to generate color scales for a given color
   *
   * The algorithm used to validate the color combinations is as follows:
   * 1. Initialize the result object with empty arrays for AA, AAA, and fails.
   * 2. Initialize a set to store unique combinations of colors.
   * 3. Loop over the color arrays.
   * 4. Check that colors1 is defined and is an array.
   * 5. Loop over the remaining color arrays.
   * 6. Check that colors2 is defined and is an array.
   * 7. Loop over the colors in colors1.
   * 8. Check that color1 is defined and is a string.
   * 9. Loop over the colors in colors2.
   * 10. Check that color2 is defined and is a string.
   * 11. Check that the combination of color1 and color2 has not already been validated.
   * 12. Calculate the contrast ratio between color1 and color2.
   * 13. Check that the contrast ratio is greater than or equal to the WCAG AA standard.
   * 14. Check that the contrast ratio is greater than or equal to the WCAG AAA standard.
   * 15. Add the combination of color1 and color2 to the set of validated combinations.
   * 16. Add the combination of color1 and color2 to the result object based on its level of compliance.
   * 17. Return the result object.
   *
   * Validates color combinations to ensure they meet WCAG AA and AAA contrast ratio standards.
   * @param colorArrays An array of string arrays containing the color combinations to validate.
   * @returns A ColorValidationResult object containing the validated color combinations grouped by their level of compliance.
   */
  validateColorCombinations(colorArrays: string[][]): ColorValidationResult {
    // Initialize the result object with empty arrays for AA, AAA, and fails.
    const result: ColorValidationResult = { aa: [], aaa: [], fails: [] };
    // Initialize a set to store unique combinations of colors.
    const combinations: Set<string> = new Set();

    // Loop over the color arrays.
    for (let i = 0; i < colorArrays.length; i++) {
      const colors1 = colorArrays[i];

      // Check that colors1 is defined and is an array.
      if (!Array.isArray(colors1)) {
        continue;
      }

      // Loop over the remaining color arrays.
      for (let j = i + 1; j < colorArrays.length; j++) {
        const colors2 = colorArrays[j];

        // Check that colors2 is defined and is an array.
        if (!Array.isArray(colors2)) {
          continue;
        }

        // Check if the two color arrays have been compared before.
        const colorsKey = [colors1[0], colors2[0]].sort().join('-');
        if (combinations.has(colorsKey)) {
          continue;
        }
        combinations.add(colorsKey);

        // Loop over the colors in the first array.
        for (const color1 of colors1) {
          // Loop over the colors in the second array.
          for (const color2 of colors2) {
            // Create a ColorCombination object to represent the combination of colors being validated.
            const combo: ColorCombination = {
              colors: [color1, color2],
              reason: '',
            };

            // Calculate the contrast ratio between the two colors.
            const contrastRatio = tinycolor.readability(color1, color2);
            // Determine whether the combination meets the AA and/or AAA standard.
            const aa = contrastRatio >= 4.5;
            const aaa = contrastRatio >= 7;

            // Add the combination to the appropriate array in the result object based on its level of compliance.
            if (aa && aaa) {
              result.aaa.push(combo);
            } else if (aa) {
              combo.reason = `Fails AAA (contrast ratio: ${contrastRatio.toFixed(
                2
              )})`;
              result.aa.push(combo);
            } else if (aaa) {
              combo.reason = `Fails AA (contrast ratio: ${contrastRatio.toFixed(
                2
              )})`;
              result.aa.push(combo);
            } else {
              combo.reason = `Fails AA and AAA (contrast ratio: ${contrastRatio.toFixed(
                2
              )})`;
              result.fails.push(combo);
            }
          }
        }
      }
    }

    return result;
  }

  /* -------------------------------------------------------------------------- */
  /*                                     --                                     */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                Color Helpers                               */
  /* -------------------------------------------------------------------------- */

  // used by color-context to generate a single random color
  random(): string {
    return tinycolor.random().toHexString();
  }

  // used as a way to modify one color based on the properties of another
  matchColor(color: string) {
    const sourceColor = tinycolor(this.color);
    const targetColor = tinycolor(color);

    const sourceLuminance = sourceColor.getLuminance();
    const targetLuminance = targetColor.getLuminance();

    const luminanceDifference =
      Math.abs(sourceLuminance - targetLuminance) * 100;
    // const saturateDiff =
    //   Math.abs(sourceColor.toHsl().s - targetColor.toHsl().s) * 100;

    return (
      sourceColor
        .brighten(luminanceDifference)
        // .saturate(saturateDiff)
        .toHexString()
    );
  }

  // find the closest web-safe color to the current color
  getWebSafeColor(): string {
    const color = tinycolor(this.color);
    const rgb = color.toRgb();
    const r = Math.round(rgb.r / 51) * 51;
    const g = Math.round(rgb.g / 51) * 51;
    const b = Math.round(rgb.b / 51) * 51;
    return tinycolor({ r, g, b }).toHexString();
  }
  /* -------------------------------------------------------------------------- */
  /*                                     --                                     */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                             Text Color Helpers                             */
  /* -------------------------------------------------------------------------- */

  // used throughout the app to get the appropriate text color for a given background color
  getContrastColors(background = this.color) {
    const contrastThreshold = 4.5;
    const colorObj = tinycolor(background);
    const isDark = colorObj.isDark();
    let textColor = null;
    let headingColor = null;
    let bodyColor = null;

    // Check if midGray provides enough contrast, if not use black/white
    const midGray = tinycolor('#808080');
    const white = tinycolor('#fff').darken(10);
    const black = tinycolor('#000').lighten(10);
    const midGrayContrast = tinycolor.readability(midGray, colorObj);
    if (midGrayContrast >= contrastThreshold) {
      textColor = midGray;
      const readableOptions = [
        midGray.toHexString(),
        black.toHexString(),
        white.toHexString(),
      ];
      headingColor = tinycolor
        .mostReadable(background, readableOptions, {
          level: 'AAA',
          size: 'large',
        })
        .toHexString();
      bodyColor = tinycolor
        .mostReadable(background, readableOptions, {
          level: 'AAA',
          size: 'small',
        })
        .toHexString();
    } else {
      textColor = tinycolor(isDark ? white : black);
      const readableOptions = [black, white];
      headingColor = tinycolor
        .mostReadable(background, readableOptions, {
          level: 'AAA',
          size: 'large',
        })
        .toHexString();
      bodyColor = tinycolor
        .mostReadable(background, readableOptions, {
          level: 'AAA',
          size: 'small',
        })
        .toHexString();
    }

    const accentColor = tinycolor(background).complement().toHexString();

    return [headingColor, bodyColor, accentColor];
  }

  // used throughout the app to find the appropriate text color from a list of options
  getBestContrastColor(colorOptions: string[], level: 'AAA' | 'AA' = 'AAA') {
    const backgroundColor = this.color;
    const isLightBackground = tinycolor(backgroundColor).isLight();

    let bestColor;
    if (isLightBackground) {
      // Ensure sufficient contrast for light backgrounds
      bestColor = colorOptions.find((colorOption) => {
        const contrast = tinycolor.readability(backgroundColor, colorOption);
        return contrast > 4.5;
      });
    } else {
      // Ensure sufficient contrast for dark backgrounds
      bestColor = colorOptions.find((colorOption) => {
        const contrast = tinycolor.readability(backgroundColor, colorOption);
        return contrast > 3;
      });
    }

    const defaultColors = tinycolor
      .mostReadable(backgroundColor, colorOptions, {
        includeFallbackColors: true,
        level,
        size: 'small',
      })
      .toHexString();

    if (bestColor) {
      const isLargeContrast = tinycolor.isReadable(backgroundColor, bestColor, {
        level,
        size: 'small',
      });
      return isLargeContrast ? bestColor : defaultColors;
    }

    return defaultColors;
  }

  /* -------------------------------------------------------------------------- */
  /*                               COLOR BLINDNESS                              */
  /* -------------------------------------------------------------------------- */

  applyColorFilters(): ColorFilters {
    const filteredColors: ColorFilters = {
      protanomaly: '',
      protanopia: '',
      deuteranomaly: '',
      deuteranopia: '',
      tritanomaly: '',
      tritanopia: '',
      achromatomaly: '',
      achromatopsia: '',
    };

    const rgb = this.color.toRgb();
    const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;

    // protanomaly
    filteredColors.protanomaly = tinycolor({
      r: 0.817 * rgb.r + 0.183 * rgb.g + 0.0 * rgb.b,
      g: 0.333 * rgb.r + 0.667 * rgb.g + 0.0 * rgb.b,
      b: 0.0 * rgb.r + 0.125 * rgb.g + 0.875 * rgb.b,
      a: rgb.a,
    }).toRgbString();

    // protanopia
    filteredColors.protanopia = tinycolor({
      r: 0.567 * rgb.r + 0.433 * rgb.g + 0.0 * rgb.b,
      g: 0.558 * rgb.r + 0.442 * rgb.g + 0.0 * rgb.b,
      b: 0.0 * rgb.r + 0.242 * rgb.g + 0.758 * rgb.b,
      a: rgb.a,
    }).toRgbString();

    // deuteranomaly
    filteredColors.deuteranomaly = tinycolor({
      r: 0.8 * rgb.r + 0.2 * rgb.g + 0.0 * rgb.b,
      g: 0.258 * rgb.r + 0.742 * rgb.g + 0.0 * rgb.b,
      b: 0.0 * rgb.r + 0.142 * rgb.g + 0.858 * rgb.b,
      a: rgb.a,
    }).toRgbString();

    // deuteranopia
    filteredColors.deuteranopia = tinycolor({
      r: 0.625 * rgb.r + 0.375 * rgb.g + 0.0 * rgb.b,
      g: 0.7 * rgb.r + 0.3 * rgb.g + 0.0 * rgb.b,
      b: 0.0 * rgb.r + 0.3 * rgb.g + 0.7 * rgb.b,
      a: rgb.a,
    }).toRgbString();

    // tritanomaly
    filteredColors.tritanomaly = tinycolor({
      r: 0.967 * rgb.r + 0.033 * rgb.g + 0.0 * rgb.b,
      g: 0.0 * rgb.r + 0.733 * rgb.g + 0.267 * rgb.b,
      b: 0.0 * rgb.r + 0.183 * rgb.g + 0.817 * rgb.b,
      a: rgb.a,
    }).toRgbString();

    // tritanopia
    filteredColors.tritanopia = tinycolor({
      r: 0.95 * rgb.r + 0.05 * rgb.g + 0.0 * rgb.b,
      g: 0.0 * rgb.r + 0.433 * rgb.g + 0.567 * rgb.b,
      b: 0.0 * rgb.r + 0.475 * rgb.g + 0.525 * rgb.b,
      a: rgb.a,
    }).toRgbString();

    // achromatomaly
    filteredColors.achromatomaly = tinycolor({
      r: 0.618 * rgb.r + 0.32 * rgb.g + 0.062 * rgb.b,
      g: 0.163 * rgb.r + 0.775 * rgb.g + 0.062 * rgb.b,
      b: 0.163 * rgb.r + 0.32 * rgb.g + 0.516 * rgb.b,
      a: rgb.a,
    }).toRgbString();

    // achromatopsia
    filteredColors.achromatopsia = tinycolor({
      r: 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b,
      g: 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b,
      b: 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b,
      a: rgb.a,
    }).toRgbString();

    return filteredColors;
  }

  /* -------------------------------------------------------------------------- */
  /*                                     --                                     */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                     WIP                                    */
  /* -------------------------------------------------------------------------- */

  // @WIP: this is not working as expected
  generatePalette(): string[] {
    const colorModeWeights: Record<StrictColorModes, number> = {
      analogic: 2,
      monochrome: 2,
      'monochrome-dark': 1,
      quad: 1,
      triad: 2,
      'split-complement': 2,
      complement: 1,
    };
    let totalWeight = 0;
    const shuffledModes = Object.keys(colorModeWeights).sort(
      () => Math.random() - 0.5
    );
    shuffledModes.forEach((mode: string) => {
      totalWeight += colorModeWeights[mode as StrictColorModes];
    });
    const colors: Set<string> = new Set();

    while (colors.size < SCALE_STEPS) {
      const rand = Math.random() * totalWeight;
      let currentWeight = 0;
      let selectedMode: StrictColorModes = 'triad';

      shuffledModes.forEach((mode: string) => {
        currentWeight += colorModeWeights[mode as StrictColorModes];
        if (currentWeight >= rand) {
          selectedMode = mode as StrictColorModes;
          return;
        }
      });
      let count = Math.floor(Math.random() * 4) + 2;
      if (colors.size + count > SCALE_STEPS) {
        count = Math.min(count, SCALE_STEPS - colors.size);
      }

      const modeColors = this.generateColorScales(selectedMode, count);
      modeColors.forEach((c) => colors.add(c));
    }
    const palette = Array.from(colors).sort(
      (a, b) => tinycolor(b).getBrightness() - tinycolor(a).getBrightness()
    );
    return palette;
  }
}

export default Color;
