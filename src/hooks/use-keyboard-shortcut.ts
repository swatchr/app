import { useCallback, useEffect, useMemo, useRef } from 'react';

// @SEE: https://github.com/arthurtyukayev/use-keyboard-shortcut/tree/develop/lib
// @SEE: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values``
/* -------------------------------------------------------------------------- */
/*                                    UTILS                                   */
/* -------------------------------------------------------------------------- */
export const overrideSystemHandling = (e: Event) => {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) {
      e.stopPropagation();
    } else if (window.event) {
      (window.event as Event).cancelBubble = true;
    }
  }
};

export const uniq_fast = <T>(a: T[]): T[] => {
  const seen: { [key: string]: boolean } = {};
  const out: T[] = [];
  const len = a.length;
  let j = 0;
  for (let i = 0; i < len; i++) {
    const item = a[i];
    if (seen[item as unknown as string] !== true) {
      seen[item as unknown as string] = true;
      out[j++] = item!;
    }
  }
  return out;
};

export const checkHeldKeysRecursive = (
  shortcutKey: string,
  shortcutKeyRecursionIndex = 0,
  shortcutArray: string[],
  heldKeysArray: string[]
): boolean => {
  const shortcutIndexOfKey = shortcutArray.indexOf(shortcutKey);
  const keyPartOfShortCut = shortcutArray.indexOf(shortcutKey) >= 0;

  // Early exit if they key isn't even in the shortcut combination.
  if (!keyPartOfShortCut) return false;

  // While holding down one of the keys, if another is to be let go, the shortcut
  // should be void. Shortcut keys must be held down in a specific order.
  // This function is always called before a key is added to held keys on keydown,
  // this will ensure that heldKeys only contains the prefixing keys
  const comparisonIndex = Math.max(heldKeysArray.length - 1, 0);
  if (
    heldKeysArray.length &&
    heldKeysArray[comparisonIndex] !== shortcutArray[comparisonIndex]
  ) {
    return false;
  }

  // Early exit for the first held down key in the shortcut,
  // except if this is a recursive call
  if (shortcutIndexOfKey === 0) {
    // If this isn't the first iteration of this recursive function, and we're
    // recursively calling this function, we should always be checking the
    // currently held down keys instead of returning true
    if (shortcutKeyRecursionIndex > 0)
      return heldKeysArray.indexOf(shortcutKey) >= 0;
    return true;
  }

  const previousShortcutKeyIndex = shortcutIndexOfKey - 1;
  const previousShortcutKey = shortcutArray[previousShortcutKeyIndex];
  const previousShortcutKeyHeld =
    heldKeysArray[previousShortcutKeyIndex] === previousShortcutKey;

  // Early exit if the key just before the currently checked shortcut key
  // isn't being held down.
  if (!previousShortcutKeyHeld) return false;

  // Recursively call this function with the previous key as the new shortcut key
  // but the index of the current shortcut key.
  return checkHeldKeysRecursive(
    previousShortcutKey!,
    shortcutIndexOfKey,
    shortcutArray,
    heldKeysArray
  );
};

/* -------------------------------------------------------------------------- */
/*                                  END UTILS                                 */
/* -------------------------------------------------------------------------- */

const BLACKLISTED_DOM_TARGETS = ['TEXTAREA', 'INPUT'];

interface UseKeyboardShortcutOptions {
  overrideSystem?: boolean;
  ignoreInputFields?: boolean;
  repeatOnHold?: boolean;
}

const DEFAULT_OPTIONS: UseKeyboardShortcutOptions = {
  overrideSystem: false,
  ignoreInputFields: true,
  repeatOnHold: true,
};

export const useKeyboardShortcut = (
  shortcutKeys: string[],
  callback: (keys: string[]) => void,
  userOptions?: UseKeyboardShortcutOptions
) => {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };
  if (!Array.isArray(shortcutKeys))
    throw new Error(
      'The first parameter to `useKeyboardShortcut` must be an ordered array of `KeyboardEvent.key` strings.'
    );

  if (!shortcutKeys.length)
    throw new Error(
      'The first parameter to `useKeyboardShortcut` must contain at least one `KeyboardEvent.key` string.'
    );

  if (!callback || typeof callback !== 'function')
    throw new Error(
      'The second parameter to `useKeyboardShortcut` must be a function that will be invoked when the keys are pressed.'
    );

  const shortcutKeysId = useMemo(() => shortcutKeys.join(), [shortcutKeys]);

  // Normalizes the shortcut keys a deduplicated array of lowercased keys.
  const shortcutArray = useMemo(
    () => uniq_fast(shortcutKeys).map((key) => String(key).toLowerCase()),
    // While using .join() is bad for most larger objects, this shortcut
    // array is fine as it's small, according to the answer below.
    // https://github.com/facebook/react/issues/14476#issuecomment-471199055
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shortcutKeysId]
  );
  // useRef to avoid a constant re-render on keydown and keyup.
  const heldKeys = useRef<string[]>([]);

  const keydownListener = useCallback(
    (keydownEvent: KeyboardEvent): boolean | undefined => {
      const loweredKey = String(keydownEvent.key).toLowerCase();
      if (!(shortcutArray.indexOf(loweredKey) >= 0)) return;
      if (
        options.ignoreInputFields &&
        // @ts-ignore -- TS doesn't know about the `tagName` property on `target`.
        BLACKLISTED_DOM_TARGETS.indexOf(keydownEvent?.target?.tagName) >= 0
      ) {
        return;
      }

      if (keydownEvent.repeat && !options.repeatOnHold) return;

      if (options.overrideSystem) {
        overrideSystemHandling(keydownEvent);
      }

      const isHeldKeyCombinationValid = checkHeldKeysRecursive(
        loweredKey,
        undefined,
        shortcutArray,
        heldKeys.current
      );

      if (!isHeldKeyCombinationValid) {
        return;
      }

      const nextHeldKeys = [...heldKeys.current, loweredKey];
      if (nextHeldKeys.join() === shortcutArray.join()) {
        callback(shortcutKeys);
        return false;
      }

      heldKeys.current = nextHeldKeys;

      return false;
    },
    [
      shortcutArray,
      options.ignoreInputFields,
      options.repeatOnHold,
      options.overrideSystem,
      callback,
      shortcutKeys,
    ]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // keyupListener
  const keyupListener = useCallback(
    (keyupEvent: KeyboardEvent) => {
      const raisedKey = String(keyupEvent.key).toLowerCase();
      if (!(shortcutArray.indexOf(raisedKey) >= 0)) return;

      const raisedKeyHeldIndex = heldKeys.current.indexOf(raisedKey);
      if (!(raisedKeyHeldIndex >= 0)) return;

      let nextHeldKeys: string[] = [];
      let loopIndex;
      for (loopIndex = 0; loopIndex < heldKeys.current.length; ++loopIndex) {
        if (loopIndex !== raisedKeyHeldIndex) {
          nextHeldKeys.push(heldKeys.current[loopIndex]!);
        }
      }
      heldKeys.current = nextHeldKeys;

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shortcutKeysId]
  );

  // flushHeldKeys
  const flushHeldKeys = useCallback(() => {
    heldKeys.current = [];
  }, []);

  // useEffects
  useEffect(() => {
    window.addEventListener('keydown', keydownListener);
    window.addEventListener('keyup', keyupListener);
    return () => {
      window.removeEventListener('keydown', keydownListener);
      window.removeEventListener('keyup', keyupListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keydownListener, keyupListener, shortcutKeysId]);

  useEffect(() => {
    flushHeldKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortcutKeysId, flushHeldKeys]);

  // return statement
  return {
    flushHeldKeys,
  };
};
