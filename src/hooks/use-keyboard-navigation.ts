import { useEffect, useState } from 'react';

type UseKeyboardNavigationProps = {
  focusIndex: number;
  itemsCount: number;
  onKeyDown: (event: React.KeyboardEvent) => void;
};

export const useKeyboardNavigation = ({
  focusIndex,
  itemsCount,
  onKeyDown,
}: UseKeyboardNavigationProps) => {
  const [currentFocusIndex, setCurrentFocusIndex] = useState(focusIndex);

  useEffect(() => {
    setCurrentFocusIndex(focusIndex);
  }, [focusIndex]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setCurrentFocusIndex((prev) => (prev > 0 ? prev - 1 : itemsCount - 1));
        break;
      case 'ArrowDown':
        event.preventDefault();
        setCurrentFocusIndex((prev) => (prev < itemsCount - 1 ? prev + 1 : 0));
        break;
      default:
        onKeyDown(event);
        break;
    }
  };

  return {
    currentFocusIndex,
    handleKeyDown,
  };
};
