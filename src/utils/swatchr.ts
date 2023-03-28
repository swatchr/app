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
