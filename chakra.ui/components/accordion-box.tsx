import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  chakra,
  ComponentWithAs,
  Flex,
  Icon,
  IconProps,
  Spinner,
} from '@chakra-ui/react';

import type { AccordionItemProps } from '@chakra-ui/react';

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
      fillColor?: string;
      props?: IconProps;
    };
    status?: ReactQueryStatus;
    contrast: string;
    children: React.ReactNode;
  } & AccordionItemProps
> = ({ title, icon, status, contrast, children, ...rest }) => {
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
          <Icon as={icon.Component} fill={icon.fillColor} {...icon.props} />
        ) : null}
        {status ? (
          // if there is a status then implement loading otherwise show title
          <Center w="full">
            {status === 'loading' ? (
              <Spinner size="xs" />
            ) : status === 'error' ? (
              'No info Available'
            ) : title ? (
              // <Box as="span" flex="1" textAlign="center">
              <chakra.p fontSize="sm" cursor="pointer">
                {capitalize(title)}
              </chakra.p>
            ) : // </Box>
            null}
          </Center>
        ) : title ? (
          // <Box as="span" flex="1" textAlign="center">
          <chakra.p fontSize="sm" cursor="pointer">
            {capitalize(title)}
          </chakra.p>
        ) : // </Box>
        null}
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel maxH="30vh" overflowY="auto">
        {children}
      </AccordionPanel>
    </AccordionItem>
  );
};
