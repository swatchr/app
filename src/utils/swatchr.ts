export function stringifyPalette(palette: string[]): string {
  if (!Array.isArray(palette)) return '';
  const string = palette?.map((c) => c.replace('#', '')).join('-');
  return string;
}

export function parsePalette(palette: string): string[] {
  if (typeof palette !== 'string') return [];
  const arr = palette?.split('-').map((c) => '#' + c);
  return arr;
}

export function parsePalettes(stringPalettes: string[]) {
  // @NOTE: provide the parsed json as argument
  return stringPalettes?.map((pal) => parsePalette(pal));
}

const colorProperties = [
  'primary',
  'secondary',
  'alternate',
  'accent',
  'contrast',
];

export function cssStringifyPalette(palette: string[]): string {
  const endResult = palette.reduce(
    (acc: Record<string, string>, color: string, index: number) => {
      if (colorProperties[index]) {
        acc[`--${colorProperties[index]}`] = color;
      }
      return acc;
    },
    {}
  );

  const endResultString = JSON.stringify(endResult, null, 2)
    .replace(/"/g, '')
    .replace(/,/g, ';')
    .replace(/^{/, ':root {  ')
    .replace(/}$/, '}');

  return endResultString;
}

export function tailwindStringifyPalette(palette: string[]) {
  const tailwindColors: Record<string, string> = palette.reduce(
    (acc, color, index) => {
      // @ts-expect-error implicit-any
      acc[index + 1 + '00'] = color;
      return acc;
    },
    {}
  );
  return JSON.stringify({ colors: tailwindColors }, null, 2);
}

export function objectStringifyPalette(
  palette: string[]
  // outputFormat = 'js'
): string | { [key: string]: string } {
  const endResult = palette.reduce((acc, color, index) => {
    const key = colorProperties[index];
    if (key) {
      // @ts-expect-error implicit-any
      acc[key] = color;
    }
    return acc;
  }, {});

  // return outputFormat === 'json'
  //   ? JSON.stringify(endResult, null, 2)
  //   : endResult;
  return JSON.stringify(endResult, null, 2);
}

export function sysUIStringifyPalette(palette: string[]): string {
  const colors = palette.reduce((acc, color, index) => {
    // @ts-expect-error implicit-any
    acc[index + 1 + '00'] = color;
    return acc;
  }, {});
  return `const colors = ${JSON.stringify(colors, null, 2)};`;
}

export function scssStringifyPalette(palette: string[]): string {
  const string = `$colors: (\n${palette
    .map((color, index) => `  ${colorProperties[index]}: ${color}`)
    .join(',\n')}\n);`;
  return string;
}

type RecursiveProperty<T> =
  | T
  | {
      [K in keyof any]?: RecursiveProperty<T>;
    };

interface ColorHues {
  [hue: string]: string;
}

interface ChakraTheme {
  colors: {
    [color: string]: RecursiveProperty<
      string | Record<string, Partial<ColorHues>>
    >;
  };
}

export function generateSVG(colors: ChakraTheme['colors']) {
  const svgPaths: string[] = [];

  Object.entries(colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Use a type assertion to tell TypeScript that `value` is an array of strings.
      svgPaths.push(`<path fill="${value}" d="M0 0h500v50H0z"/>`);
    } else {
      Object.entries(value).forEach(([hue, colorValues]) => {
        const hueValue =
          typeof colorValues === 'string' ? colorValues : colorValues!['500'];
        svgPaths.push(
          `<path fill="${hueValue}" d="M0 ${svgPaths.length * 50}h500v50H0z"/>`
        );
      });
    }
  });

  return `
    <svg width="500" height="${svgPaths.length * 50}" viewBox="0 0 500 ${
    svgPaths.length * 50
  }" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_102_64)">
        ${svgPaths.join('')}
      </g>
      <defs>
        <clipPath id="clip0_102_64">
          <rect width="500" height="${svgPaths.length * 50}" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  `;
}

export function getContrastColor(color: string) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
}

export function generateSVGPalette(colors: string[], includeHex = false) {
  const svgPaths: string[] = [];

  colors.forEach((value, index) => {
    const hexColor = value.toUpperCase();
    const textColor = getContrastColor(value);
    svgPaths.push(`
      <path fill="${value}" d="M0 ${index * 100}h500v100H0z"/>
      ${
        includeHex
          ? `<text x="50%" y="${
              index * 100 + 50
            }" text-anchor="middle" font-weight="bold" font-size="24" fill="${textColor}">
        ${hexColor}
      </text>`
          : ''
      }
    `);
  });

  return `
    <svg width="500" height="${colors.length * 100}" viewBox="0 0 500 ${
    colors.length * 100
  }" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_102_64)">
        ${svgPaths.join('')}
      </g>
      <defs>
        <clipPath id="clip0_102_64">
          <rect width="500" height="${colors.length * 100}" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  `;
}

export function generateSVGPaletteRow(colors: string[], includeHex = false) {
  const svgPaths: string[] = [];

  colors.forEach((color, i) => {
    svgPaths.push(
      `<rect x="${i * 50}" y="0" width="50" height="50" fill="${color}"/>`
    );
    if (includeHex) {
      svgPaths.push(
        `<text x="${i * 50 + 25}" y="30" fill="${getContrastColor(
          color
        )}" text-anchor="middle" font-size="9" font-weight="bold">${color}</text>`
      );
    }
  });

  return `
    <svg width="${colors.length * 50}" height="50" viewBox="0 0 ${
    colors.length * 50
  } 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_102_64)">
        ${svgPaths.join('')}
      </g>
      <defs>
        <clipPath id="clip0_102_64">
          <rect width="${colors.length * 50}" height="50" fill="white" rx="10"/>
        </clipPath>
      </defs>
    </svg>
  `;
}

export const SVG_ROW = { height: 50, width: 50 };
export const SVG_STACK = { width: 125, height: 50 };
