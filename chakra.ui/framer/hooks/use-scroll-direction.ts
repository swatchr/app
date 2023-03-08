import { useEffect, useState } from 'react';

export type DirectionEnum = 'up' | 'down';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<DirectionEnum>('down');
  useEffect(() => {
    let lastScrollY: number = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY: number = window.pageYOffset;
      const direction: DirectionEnum = scrollY > lastScrollY ? 'down' : 'up';
      if (
        direction &&
        scrollDirection &&
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener('scroll', updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener('scroll', updateScrollDirection); // clean up
    };
  }, [scrollDirection]);

  return scrollDirection;
}
