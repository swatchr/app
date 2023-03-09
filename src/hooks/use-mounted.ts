import { useEffect, useRef } from 'react';

export function useMounted() {
  const mountedRef = useRef(false);

  useEffect(() => {
    // Set the mounted flag to true after the initial mount
    mountedRef.current = true;

    // Return a cleanup function to set the mounted flag to false on unmount
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef.current;
}
