// create a react typescript disclosure context

import { createContext, useCallback, useContext, useState } from 'react';
import { removeAtIndex } from '../../utils/fns';

type DisclosureContextValue = {
  isActive: (id: string) => boolean;
  toggleActive: (id: string) => void;
};
export const DisclosureContext = createContext<DisclosureContextValue>({
  isActive: () => false,
  toggleActive: () => {},
});

export const DisclosureProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [active, setActive] = useState<string[]>([]);

  // @NOTE: this hook will cause a re-render on each render. because isActive is re-evaluated everytime
  const isActive = useCallback((id: string) => active.includes(id), [active]);
  const toggleActive = useCallback((id: string) => {
    setActive((prevActive) =>
      prevActive.includes(id)
        ? removeAtIndex(prevActive, prevActive.indexOf(id))
        : [...prevActive, id]
    );
  }, []);

  return (
    <DisclosureContext.Provider value={{ isActive, toggleActive }}>
      {children}
    </DisclosureContext.Provider>
  );
};

export function useDisclosureDispatch() {
  const context = useContext(DisclosureContext);

  if (!context) {
    throw new Error(
      'useDisclosureDispatch must be used within a DisclosureProvider'
    );
  }

  return context;
}
