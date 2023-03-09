import { useCallback, useState } from 'react';

interface Swatch {
  id: string;
  color: string;
  locked: boolean;
}

interface UseSwatchLockingReturn {
  isLocked: (id: string) => boolean;
  toggleLock: (id: string) => void;
}

export const useSwatchLocking = (
  initialSwatches: Swatch[]
): UseSwatchLockingReturn => {
  const [swatches, setSwatches] = useState<Swatch[]>(initialSwatches);

  const isLocked = (id: string) => {
    const swatch = swatches.find((swatch) => swatch.id === id);
    return swatch ? swatch.locked : false;
  };

  const toggleLock = (id: string) => {
    setSwatches((prevSwatches) =>
      prevSwatches.map((swatch) =>
        swatch.id === id ? { ...swatch, locked: !swatch.locked } : swatch
      )
    );
  };

  return {
    isLocked,
    toggleLock,
  };
};

export const useSwatchLocking2 = (initialLockedIndexes: number[] = []) => {
  const [lockedIndexes, setLockedIndexes] =
    useState<number[]>(initialLockedIndexes);

  const isSwatchLocked = (index: number) => lockedIndexes.includes(index);

  const lockSwatch = (index: number) => {
    setLockedIndexes((prevIndexes) => [...prevIndexes, index]);
  };

  const unlockSwatch = (index: number) => {
    setLockedIndexes((prevIndexes) =>
      prevIndexes.filter((lockedIndex) => lockedIndex !== index)
    );
  };

  return {
    lockedIndexes,
    isSwatchLocked,
    lockSwatch,
    unlockSwatch,
  };
};
