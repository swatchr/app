// source - https://github.com/craig1123/react-recipes/blob/master/src/useEventListener.js

import { isClient } from '@/utils';
import { useEffect, useRef } from 'react';

type EventListener = (event: Event) => void;

export function useEventListener(
  eventName: string,
  handler: EventListener,
  element?: HTMLElement | Window // Make the parameter optional
): void {
  const savedHandler = useRef<EventListener>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Make sure element supports addEventListener
    const targetElement = element ?? (isClient ? window : undefined);
    const isSupported = targetElement && targetElement.addEventListener;
    if (!isSupported) return;

    const eventListener: EventListener = (event) => {
      savedHandler.current && savedHandler.current(event);
    };
    targetElement.addEventListener(eventName, eventListener);

    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}

// Usage

// function App(){
//   // State for storing mouse coordinates
//   const [coords, setCoords] = useState({ x: 0, y: 0 });

//   // Event handler utilizing useCallback ...
//   // ... so that reference never changes.
//   const handler = useCallback(
//     ({ clientX, clientY }) => {
//       // Update coordinates
//       setCoords({ x: clientX, y: clientY });
//     },
//     [setCoords]
//   );

//   // Add event listener using our hook
//   useEventListener('mousemove', handler);

//   return (
//     <h1>
//       The mouse position is ({coords.x}, {coords.y})
//     </h1>
//   );
// }
