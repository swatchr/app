import { useEffect, useRef } from 'react';

export function useMounted(debug?: string) {
  const mountedRef = useRef(false);

  useEffect(() => {
    // Set the mounted flag to true after the initial mount
    mountedRef.current = true;
    // Return a cleanup function to set the mounted flag to false on unmount
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!debug) return;
    console.log(`[useMounted] ${debug} RENDER: ${mountedRef.current}`);
    return () => {
      console.log(`[useMounted] ${debug} UNMOUNT: ${mountedRef.current}`);
    };
  }, [debug]);

  return mountedRef.current;
}
