export function stringifyPalette(palette: string[]): string {
  const string = palette.map((c) => c.replace('#', '')).join('-');
  return string;
}

export function parsePalette(palette: string): string[] {
  const arr = palette.split('-').map((c) => '#' + c);
  return arr;
}

export function parsePalettes(stringPalettes: string[]) {
  // @NOTE: provide the parsed json as argument
  return stringPalettes.map((pal) => parsePalette(pal));
}

const colorProperties = [
  'primary',
  'secondary',
  'alternate',
  'accent',
  'contrast',
];

export function cssStringifyPalette(palette: string[]): string {
  const string = `:root {
    ${palette
      .map((color, index) => `--${colorProperties[index]}: ${color}`)
      .join(';\n  ')}
  }`;
  return string;
}

export function tailwindStringifyPalette(palette: string[]) {
  const themeColors = {} as { [key: string]: string };
  palette.forEach((color, index) => {
    themeColors[`${index + 1}00`] = color;
  });
  return JSON.stringify({ colors: themeColors }, null, 2);
}

export function objectStringifyPalette(palette: string[]): string {
  const string = `const colors = ${JSON.stringify(
    palette
      .map((color: string, index: number) => {
        const obj: { [key: string]: string } = {};
        obj[colorProperties[index]!] = color;
        return obj;
      })
      .reduce((result, currentObj) => ({ ...result, ...currentObj }), {}),
    null,
    2
  )}`;
  return string;
}

export function sysUIStringifyPalette(palette: string[]): string {
  const colors = {} as { [key: string]: string };
  palette.forEach((color, index) => {
    colors[`${index + 1}00`] = color;
  });
  return `const colors = ${JSON.stringify(colors, null, 2)} `;
}

export function scssStringifyPalette(palette: string[]): string {
  const string = `$colors: (
    ${palette
      .map((color, index) => `${colorProperties[index]}: ${color},`)
      .join('\n\t')}
  );`;
  return string;
}
