import {
  Drawer as ChDrawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { useRef } from 'react';

import type { DrawerProps } from '@chakra-ui/react';

type CustomDrawerProps = {
  Header?: React.ElementType; // throws an error with ReactNode
  Footer?: React.ElementType; // throws an error with ReactNode
  type?: 'default' | 'consent';
  bg?: string;
} & DrawerProps;

export const Drawer: React.FC<CustomDrawerProps> = ({
  isOpen,
  onClose,
  Header,
  Footer,
  children,
  size = 'lg',
  placement = 'left',
  type = 'default',
  bg,
  ...props
}) => {
  const btnRef = useRef<HTMLInputElement>(null);
  return (
    <ChDrawer
      isOpen={isOpen}
      placement={placement}
      onClose={onClose}
      finalFocusRef={btnRef}
      size={size}
      preserveScrollBarGap
      {...props}
    >
      <DrawerOverlay>
        <DrawerContent bg={bg || 'bg'}>
          {type !== 'consent' && <DrawerCloseButton size="sm" />}
          {Header && (
            <DrawerHeader>
              <Header />
            </DrawerHeader>
          )}

          <DrawerBody>{children}</DrawerBody>
          {Footer && (
            <DrawerFooter>
              <Footer />
            </DrawerFooter>
          )}
        </DrawerContent>
      </DrawerOverlay>
    </ChDrawer>
  );
};
