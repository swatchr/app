/* eslint-disable @typescript-eslint/no-explicit-any */

export function omit(obj: Record<string, any>, ...keys: string[]) {
  const keysToRemove = new Set(keys.flat()); // flatten the props, and convert to a Set

  return Object.fromEntries(
    // convert the entries back to object
    Object.entries(obj) // convert the object to entries
      .filter(([k]) => !keysToRemove.has(k)) // remove entries with keys that exist in the Set
  );
}

/**
 * @link: https://stackoverflow.com/a/60855343
 * USAGE:
 *    const value = pick(JSON.parse('{"name": "Bob", "error": false}'), {
        name: String,
        error: Boolean,
      });
 */
      type Descriptor<T> = {
        [P in keyof T]: (v: any) => T[P];
      };
      export function pick<T>(v: any, d: Descriptor<T>): T {
        const ret: any = {};
        for (const key in d) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const val = d[key](v[key]);
            if (typeof val !== 'undefined') {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              ret[key] = val;
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            throw new Error(`could not pick ${key}: ${msg}`);
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return ret;
      }
