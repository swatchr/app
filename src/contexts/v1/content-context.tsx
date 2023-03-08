import { useDisclosure } from '@chakra-ui/react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface ContentStateValue {
  type: string;
  isOpen: boolean;
}
export interface ContentDispatchValue {
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  openAndUpdate: (type: any) => void;
}

export const ContentStateContext = createContext<ContentStateValue>(
  {} as ContentStateValue
);
export const ContentDispatchContext = createContext<ContentDispatchValue>(
  {} as ContentDispatchValue
);

export const ContentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [type, setType] = useState<ContentStateValue['type']>('match');
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  const openAndUpdate = useCallback(
    (type: any) => {
      setType(type);
      !isOpen && onOpen();
    },
    [setType, onOpen]
  );

  return (
    <ContentStateContext.Provider value={{ type, isOpen }}>
      <ContentDispatchContext.Provider
        value={{ openAndUpdate, onOpen, onClose, onToggle }}
      >
        {children}
      </ContentDispatchContext.Provider>
    </ContentStateContext.Provider>
  );
};

export function useContentState() {
  const context = useContext(ContentStateContext);
  if (context === undefined) {
    throw new Error('useContentState must be used within a ContentProvider');
  }
  return context;
}

export function useContentDispatch() {
  const context = useContext(ContentDispatchContext);
  if (context === undefined) {
    throw new Error('useContentDispatch must be used within a ContentProvider');
  }
  return context;
}
