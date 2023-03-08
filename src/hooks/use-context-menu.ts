import { useCallback, useEffect, useState } from 'react';

interface ContextMenuProps {
  xPos: string;
  yPos: string;
  menu: boolean;
}

interface useContextMenuOptions {
  outerRef?: React.RefObject<HTMLElement>;
  handleClick?: () => void;
  handleContextMenu?: (event: MouseEvent) => void;
}

export const useContextMenu = (
  options: useContextMenuOptions = {}
): ContextMenuProps => {
  const {
    outerRef = null,
    handleClick = () => {},
    handleContextMenu = () => {},
  } = options;
  const [xPos, setXPos] = useState('0px');
  const [yPos, setYPos] = useState('0px');
  const [menu, setMenu] = useState(false);

  const handleContextMenuCallback = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      const outerRefExists = outerRef && outerRef.current;
      const targetIsChildOfOuterRef =
        outerRefExists &&
        outerRef.current.contains(event.target as HTMLElement);
      if (targetIsChildOfOuterRef) {
        setXPos(`${event.pageX}px`);
        setYPos(`${event.pageY}px`);
        setMenu(true);
        handleContextMenu(event);
      } else {
        setMenu(false);
      }
    },
    [handleContextMenu, outerRef]
  );

  const handleClickCallback = useCallback(() => {
    setMenu(false);
    handleClick();
  }, [handleClick]);

  useEffect(() => {
    document.addEventListener('click', handleClickCallback);
    document.addEventListener('contextmenu', handleContextMenuCallback);
    return () => {
      document.removeEventListener('click', handleClickCallback);
      document.removeEventListener('contextmenu', handleContextMenuCallback);
    };
  }, [handleClickCallback, handleContextMenuCallback]);

  return { xPos, yPos, menu };
};
