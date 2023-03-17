import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

import type { BoxProps, ModalProps } from '@chakra-ui/react';

type CustomModalProps = {
  title?: string;
  footer?: React.ReactNode;
  hasSubmit: boolean;
  allowClose: boolean;
  handler?: {
    label: string;
    action: (event: React.MouseEventHandler<HTMLButtonElement>) => void;
  };
  noOverlay?: boolean;
  contentProps?: BoxProps;
  colorScheme?: string;
};

export const CHModal: React.FC<ModalProps & BoxProps & CustomModalProps> = ({
  title = '',
  children,
  footer,
  isOpen,
  onClose,
  allowClose = true,
  noOverlay = false,
  colorScheme = 'green',
  contentProps = {},
  ...rest
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      isCentered={true}
      size="2xl"
      colorScheme={colorScheme}
      {...rest}
    >
      {!noOverlay && <ModalOverlay />}
      <ModalContent {...contentProps}>
        {title ? (
          <ModalHeader textTransform="capitalize">{title}</ModalHeader>
        ) : null}
        {allowClose && <ModalCloseButton colorScheme={colorScheme} />}
        <ModalBody>{children}</ModalBody>
        {footer ? (
          <ModalFooter as={ButtonGroup} gap={3} size="sm">
            {footer}
            <Button mr={3} onClick={onClose} colorScheme={'gray'}>
              Close
            </Button>
          </ModalFooter>
        ) : null}
      </ModalContent>
    </Modal>
  );
};
