import {
  Button,
  IconButton,
  Popover as ChPopover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';

import type {
  ButtonProps,
  ComponentWithAs,
  IconButtonProps,
  IconProps,
  PopoverContentProps,
  PopoverProps,
} from '@chakra-ui/react';
import type ColorLab from 'lib/color';

import Image from 'next/image';

type CustomPopoverProps = {
  open: boolean;
  popoverProps?: PopoverProps;
  content?: { header?: React.ReactNode; footer?: React.ReactNode };
  icon?: {
    Component: ComponentWithAs<'svg', IconProps>;
    fillColor?: string;
    instance?: ColorLab;
    props?: IconButtonProps;
  };
  customButton?: {
    Component: ({ ...props }: ButtonProps) => JSX.Element;
    props?: ButtonProps;
  };
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    style: React.CSSProperties;
  };
  children?: React.ReactNode;
} & PopoverContentProps;

export const Popover: React.FC<CustomPopoverProps> = ({
  open,
  popoverProps,
  content,
  icon,
  image,
  customButton,
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
      {...popoverProps}
    >
      <PopoverTrigger>
        {icon ? (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            aria-label="Open"
            icon={<icon.Component fill={icon.fillColor} />}
            size="xs"
            variant="unstyled"
            {...icon.props}
          />
        ) : image ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image {...image} onClick={onOpen} />
        ) : customButton ? (
          <customButton.Component onClick={onOpen} {...customButton.props} />
        ) : (
          <Button onClick={onOpen}>Open</Button>
        )}
      </PopoverTrigger>
      <PopoverContent {...props}>
        <PopoverCloseButton />
        {content?.header ? (
          <PopoverHeader>{content.header}</PopoverHeader>
        ) : null}
        <PopoverArrow />
        <PopoverBody>{children}</PopoverBody>
        {content?.footer ? (
          <PopoverFooter>{content.footer}</PopoverFooter>
        ) : null}
      </PopoverContent>
    </ChPopover>
  );
};
