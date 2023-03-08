// @NOTE: unused in favor of useOutsideClick from chakra
import { useEffect } from 'react';

export const useClickOutside = (
  ref: React.MutableRefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) return;

      handler(event);
    };

    const validateEventStart = (event: MouseEvent | TouchEvent) => {
      // @ts-expect-error MouseEvent#target is not readonly
      startedWhenMounted = ref.current;
      // @ts-expect-error MouseEvent#target is not readonly
      startedInside = ref.current && ref.current.contains(event.target as Node);
    };

    document.addEventListener('mousedown', validateEventStart);
    document.addEventListener('touchstart', validateEventStart);
    document.addEventListener('click', listener);

    return () => {
      document.removeEventListener('mousedown', validateEventStart);
      document.removeEventListener('touchstart', validateEventStart);
      document.removeEventListener('click', listener);
    };
  }, [ref, handler]);
};
