//@link: https://devtrium.com/posts/how-keyboard-shortcut
//@SEE: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values``
import { isClient } from '@/utils';
import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

interface UseMetaKeyPressProps {
  keys: string[];
  callback: (e: KeyboardEvent) => void;
  node?: Document | null;
}

// @NOTE: default hook, requires the cmd key to be pressed along with any of the other keys[]
export const useMetaKeyPress = ({
  keys,
  callback,
  node = null,
}: UseMetaKeyPressProps) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    if (!isClient) return;
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!event.metaKey) return;
      // check if one of the key is part of the ones we want
      if (keys.some((key: string) => event.key === key)) {
        callbackRef.current(event);
      }
    },
    [keys]
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, node]);
};

/**
 *
 * Usage:
 *
const keysPressed = useMetaKeyPress({
  keys: ['k'],
  callback: (e) => console.log('lkajdflkajsdf', e),
  // node: document,
});
 */

// @NOTE: listens for a single key press does not require or handle any modifiers
export const useKeyPress = ({
  keys,
  callback,
  node = null,
}: UseMetaKeyPressProps) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    if (!isClient) return;
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // check if one of the key is part of the ones we want
      if (keys.some((key: string) => event.key === key)) {
        callbackRef.current(event);
      }
    },
    [keys]
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, node]);
};

// @NOTE: Listens for multiple keys to be pressed at the same time
export const useMultiKeyPress = ({
  keys,
  callback,
  node = null,
}: UseMetaKeyPressProps) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    if (!isClient) return;
    callbackRef.current = callback;
  });

  // keep track of the pressed keys
  const pressedKeys = useRef<string[]>([]);

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // add the pressed key to the list
      // if (!event.altKey) return;
      if (!pressedKeys.current.includes(event.key)) {
        pressedKeys.current.push(event.key);
      }

      // check if all keys have been pressed in the correct order
      if (keys.every((key, index) => pressedKeys.current[index] === key)) {
        // invoke the callback
        callbackRef.current(event);
        // clear the list of pressed keys
        pressedKeys.current = [];
      }
    },
    [keys]
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, node]);
};

interface UseNodeKeyPressProps {
  keys: string[];
  callback: (e: KeyboardEvent) => void;
  node: React.RefObject<HTMLDivElement | null>;
}
// @NOTE: Not currently working, need to update to allow a ref to be passed in properly
export const useNodeKeyPress = ({
  keys,
  callback,
  node,
}: UseNodeKeyPressProps) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        callbackRef.current(event);
      }
    };

    if (node.current) {
      node.current.addEventListener('keydown', handleKeyPress);
    }
    const current = node.current;

    return () => {
      if (current) {
        current.removeEventListener('keydown', handleKeyPress);
      }
    };
  }, [keys, node]);
};
