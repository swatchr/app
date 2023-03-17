import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  chakra,
  Flex,
  Icon,
  Spinner,
} from '@chakra-ui/react';

import type {
  AccordionItemProps,
  ComponentWithAs,
  IconProps,
} from '@chakra-ui/react';

import { capitalize } from '@/utils';

type ReactQueryStatus =
  | 'idle'
  | 'loading'
  | 'error'
  | 'success'
  | 'data'
  | 'isFetching'
  | 'isLoading'
  | 'isSuccess'
  | 'isError';

export const AccordionBox: React.FC<
  {
    title?: string;
    icon?: {
      Component: ComponentWithAs<'svg', IconProps>;
      props?: IconProps;
    };
    status?: ReactQueryStatus;
    contrast: string;
    children: React.ReactNode;
    showIcon: boolean;
  } & AccordionItemProps
> = ({
  title,
  icon,
  status,
  contrast,
  children,
  showIcon = false,
  ...rest
}) => {
  let contrastColor = contrast === 'dark' ? 'blackAlpha' : 'whiteAlpha';

  return (
    <AccordionItem
      border="1px"
      borderColor={contrastColor + '.300'}
      rounded="md"
      position="relative"
      {...rest}
    >
      <AccordionButton as={Flex} justifyContent="space-between">
        {icon ? (
          <Icon as={icon.Component} fill={'currentColor'} {...icon.props} />
        ) : null}
        {status ? (
          // if there is a status then implement loading otherwise show title
          <Center w="full" opacity={showIcon ? 1 : 0.5}>
            {status === 'loading' ? (
              <Spinner size="xs" />
            ) : status === 'error' ? (
              'No info Available'
            ) : title ? (
              <chakra.p fontSize="sm" cursor="pointer">
                {capitalize(title)}
              </chakra.p>
            ) : null}
          </Center>
        ) : title ? (
          <chakra.p fontSize="sm" cursor="pointer">
            {capitalize(title)}
          </chakra.p>
        ) : null}
        <Box visibility={showIcon ? 'visible' : 'hidden'}>
          <AccordionIcon />
        </Box>
      </AccordionButton>
      <AccordionPanel maxH="30vh" overflowY="auto">
        {children}
      </AccordionPanel>
    </AccordionItem>
  );
};
