import {
  DASHES_REGEX,
  HEX_COLOR_REGEX,
  isClient,
  UNDERSCORES_REGEX,
} from './constants';

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/* -------------------------------------------------------------------------- */
/*                                 ARRAY UTILS                                */
/**
 *
 *
 * @export
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @return {*}
 */
export function isWithinRange(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

/**
 * @params {array} array - array of objects to flatten
 * @params {string} key - key to flatten on
 * @returns {array} - of objects
 */
export function flattenArrayOfObjects<T, U>(arr: T[], key = 'label') {
  if (!arr?.length) throw new Error(`cannot flatten ${JSON.stringify(arr)}`);
  const object = arr?.reduce(
    // @ts-expect-error: item[key] - @TODO: implicit any -must be properly typed
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (obj, item) => Object.assign(obj, { [item[key]]: item.value }),
    {}
  );
  return object as U;
}
``;
/**
 * chunk a flat array into groups based in the provided value for n
 *
 * @export
 * @param {any[]} arr
 * @param {number} n
 * @param {number} [min=1]
 * @return {*}
 */
export function chunkArray(arr: any[], n: number, min = 1) {
  if (arr.length < min) return arr;
  const chunkLength = Math.max(arr.length / n, 1);
  const chunks = [];
  for (let i = 0; i < n; i++) {
    if (chunkLength * (i + 1) <= arr.length)
      chunks.push(arr.slice(chunkLength * i, chunkLength * (i + 1)));
  }
  return chunks;
}
/**
 *
 *
 * @param {*} arr
 * @return {*}
 */
export function deDupeArrayOfObjects(arr: Record<string, any>[]) {
  return Array.from(new Set(arr.map((el) => JSON.stringify(el)))).map(
    (el: any) => JSON.parse(el)
  );
}

/**
 *
 *
 * @export
 * @param {any[]} array
 * @return {*}
 */
export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 *
 *
 * @export
 * @template T
 * @param {T[]} array
 * @param {number} oldIndex
 * @param {number} newIndex
 * @return {*}  {T[]}
 */
export function reorderArray<T>(
  array: T[],
  oldIndex: number,
  newIndex: number
): T[] {
  if (
    // don't allow moving past the end
    newIndex >= array.length ||
    oldIndex >= array.length ||
    // don't allow moving to the same index
    newIndex === oldIndex
  ) {
    return array;
  }

  const [removed] = array.splice(oldIndex, 1);
  array.splice(newIndex, 0, removed as T);
  return array;
}

export function modifyArrayAtIndex<T>(
  array: (T | undefined)[],
  index: number,
  modifier: (item: T | undefined) => T | undefined
): (T | undefined)[] {
  if (isNaN(index)) return array;
  // if (index > array.length - 1) return array;
  const newArray = [...array];
  newArray[index] = modifier(array[index]);
  return newArray;
}

export function removeFromArrayAtIndex<T>(
  array: (T | undefined)[],
  index: number
): T[] {
  const newArray = modifyArrayAtIndex(array, index, () => undefined);
  return newArray.filter((item): item is T => Boolean(item));
}

export function addToArrayAtIndex<T>(
  array: (T | undefined)[],
  index: number,
  item: T
): T[] {
  const newArray = modifyArrayAtIndex(array, index, () => item);
  return newArray.filter((item): item is T => Boolean(item));
}

export function updateArrayAtIndex<T>(
  array: (T | undefined)[],
  index: number,
  updater: (item: T | undefined) => T
): T[] {
  const newArray = modifyArrayAtIndex(array, index, updater);
  return newArray.filter((item): item is T => Boolean(item));
}

/**
 * USAGE:

// Update the person with id "2"
const updatedPeople = updateArrayAtIndex(
  people,
  1,
  (person) => ({ ...person, name: "Bobby" })
);

 */

export function insertAtIndex<T>(arr: T[], index: number, item: T): T[] {
  // Use the splice() method to insert the new item at the specified index
  arr.splice(index, 0, item);

  // Return the modified array
  return arr;
}

export function removeAtIndex<T>(arr: T[], index: number): T[] {
  // Make a copy of the original array
  const newArr = arr.slice();

  // Use the splice() method to remove the item at the given index
  newArr.splice(index, 1);

  // Return the modified array
  return newArr;
}

export function reorderArrayItems<T>(
  array: (T | undefined)[],
  oldIndex: number,
  newIndex: number
): T[] {
  const item = array[oldIndex];
  if (!item) return array.filter(Boolean) as T[];
  const newArray = [...array];
  newArray.splice(oldIndex, 1);
  newArray.splice(newIndex, 0, item);
  return newArray.filter((item): item is T => Boolean(item));
}

/* -------------------------------------------------------------------------- */
/*                                STRING UTILS                                */
/* -------------------------------------------------------------------------- */
/**
 * truncate a string to a certain length
 *
 * @export
 * @param {string} str
 * @param {number} n
 * @return {*}
 */
export function truncate(str: string, n: number) {
  return str?.length > n ? str.substring(0, n - 1) + '...' : str;
}

/**
 * works well for simple strings. No language support
 *
 * @param {string} str
 * @return {*}
 */
export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function unSlugifyFilename(slug: string) {
  return filename(slug)
    .split('.')[0]
    ?.replace(UNDERSCORES_REGEX, ' + ')
    .replace(DASHES_REGEX, ' ');
}

/**
 *
 *
 * @export
 * @param {string} str
 * @return {*}
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 *
 *
 * @param {string} word
 * @return {*}
 */
export function unplauralize(word: string) {
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('s')) return word.slice(0, -1);
  return word;
}

export function isEven(n: number) {
  return n % 2 == 0;
}

export function isOdd(n: number) {
  return Math.abs(n % 2) == 1;
}

export const shortId = () => Math.random().toString(36).slice(-6);

/* -------------------------------------------------------------------------- */
/*                                    FILE UTILS                                   */
/* -------------------------------------------------------------------------- */
/**
 * @description: regex to return a filename from a filepath works on both / and \ filepaths
 *
 * @param {string} str
 */
export const filename = (str: string) => str.replace(/^.*[\\\/]/, '');

/**
 * @description: returns the extension from a filepath or filename
 *
 * @param {string} str
 */
export const fileExtension = (str: string) => str.split('.').pop();

/* -------------------------------------------------------------------------- */
/*                                Image Helpers                               */
/* -------------------------------------------------------------------------- */
/**
 *
 *
 * @export
 * @param {string} url
 * @param {string} [prefix]
 * @return {*}  {Promise<{ width: number; height: number }>}
 */
export function getImageDetails(
  // @NOTE: used by 'src/utils/seo/index.ts'
  url: string,
  prefix?: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = prefix ? `${prefix}${url}` : url;
  });
}

/* -------------------------------------------------------------------------- */
/*                                 COLOR UTILS                                */
/* -------------------------------------------------------------------------- */
export function getTextMode(
  colors: string[],
  background: string
): string | null {
  const bg = background;
  const bgRgb = hexToRgb(bg);
  if (!bgRgb) return null;

  const luminances = colors.map((color) => {
    const rgb = hexToRgb(color);
    if (!rgb) return null;

    const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
    return { color, luminance };
  });

  const sortedLuminances = luminances
    .filter((l) => l !== null)
    .sort((a, b) => b!.luminance - a!.luminance);

  const bestColor = sortedLuminances[0]?.color ?? null;
  return bestColor;
}

export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);

  if (match) {
    return {
      r: parseInt(String(match[1]), 16),
      g: parseInt(String(match[2]), 16),
      b: parseInt(String(match[3]), 16),
    };
  } else {
    return null;
  }
}

export function isValidHexColor(value: string) {
  if (HEX_COLOR_REGEX.test(value)) {
    return true;
  }
  return false;
}

export function makeValidHex(hex: string | null, fallback: string): string {
  if (!hex) return fallback;
  if (hex.startsWith('#')) {
    if (HEX_COLOR_REGEX.test(hex)) {
      return hex.toUpperCase();
    } else {
      return fallback;
    }
  } else {
    const validHex = hex.match(HEX_COLOR_REGEX);
    if (validHex) {
      return '#' + validHex[0].toUpperCase();
    } else {
      return makeValidHex(fallback, fallback); // Use fallback instead of hex to avoid infinite loop
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                               RANDOM HELPERS                               */
/* -------------------------------------------------------------------------- */

/**
 *
 *
 * @export
 * @template T
 * @param {(event: React.SyntheticEvent) => Promise<T>} promise
 * @return {*}
 */
export function onPromise<T>(
  // used to wrap react-hook-forms's submit handler
  // https://github.com/react-hook-form/react-hook-form/discussions/8020#discussioncomment-3429261
  promise: (event: React.SyntheticEvent) => Promise<T>
) {
  return (event: React.SyntheticEvent) => {
    if (promise) {
      promise(event).catch((error) => {
        console.error('Unexpected error', error);
      });
    }
  };
}

export const wait = (delay?: number) => {
  // https://appdividend.com/2022/06/10/javascript-wait/#:~:text=JavaScript%20wait%20To%20make%20your%20JavaScript%20code%20wait%2C,need%20to%20use%20the%20await%20keyword%20with%20it.
  return new Promise((r) => setTimeout(r, delay || 1000));
};

export function getUsernameFromEmail(
  email: string | null | undefined
): string | null {
  const splitEmail = email ? email.split('@')[0] : null;
  return splitEmail ?? null;
}

/**
 *
 *
 * @export
 * @return {*}
 */
export function getAnonId() {
  if (!isClient) return undefined;
  return localStorage.getItem('__anon_id');
}

/**
 *
 *
 * @export
 * @param {number} num
 * @return {*}  {string}
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

/**
 *
 *
 * @param {number} probability
 * @param {{ truthy: any; falsy: any }} { truthy, falsy }
 * @return {*}  {*}
 */
export const randomConditional = (
  probability: number,
  { truthy, falsy }: { truthy: any; falsy: any }
): any => (Math.random() >= probability ? truthy : falsy);
