import {
  Popover as ChPopover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';

import type { PopoverContentProps, PopoverProps } from '@chakra-ui/react';

type CustomPopoverProps = {
  open: boolean;
  popoverProps?: PopoverProps;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
} & PopoverContentProps;

export const ColorPopover: React.FC<CustomPopoverProps> = ({
  open,
  popoverProps,
  trigger,
  children,
  ...props
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChPopover
      isOpen={open || isOpen}
      onOpen={onOpen}
      onClose={onClose}
      autoFocus={true}
      isLazy={true}
      lazyBehavior="unmount"
      strategy="fixed"
      {...popoverProps}
    >
      {trigger ? <PopoverTrigger>{trigger}</PopoverTrigger> : null}
      <PopoverContent {...props} border="none" shadow="md" position="relative">
        <PopoverArrow />
        <PopoverBody p={0} m={0}>
          {children}
        </PopoverBody>
      </PopoverContent>
    </ChPopover>
  );
};
