import { CheckIcon } from '@chakra-ui/icons';
import {
  Accordion,
  Button,
  Center,
  chakra,
  Flex,
  HStack,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

import type Color from 'lib/color';
import type { ColorApiClientInfo, ColorApiScheme } from '@/server/api/types';

import { CopyIcon, InfoIcon } from '@/components';
import { useClipboard } from '@/hooks';
import { createColorInfo } from '@/server/api/types';
import { AccordionBox } from 'chakra.ui';
import { api } from '@/utils/api';

export function InfoPanel({
  color,
  instance,
  index,
}: {
  color: string;
  instance: Color;
  index: number | undefined;
}) {
  const [info, setInfo] = useState<ColorApiClientInfo>();
  // const { status } = useColorScheme({
  //   hex: color.replace('#', ''),
  //   mode: 'analogic-complement',
  //   count: 5,
  //   options: {
  //     onSuccess: (data: ColorApiScheme) => {
  //       setInfo(createColorInfo(data?.seed, instance));
  //     },
  //   },
  // });

  const { status, isLoading, isError } = api.color.scheme.useQuery(
    { hex: color.replace('#', '') },
    {
      onSuccess: (data: ColorApiScheme) => {
        setInfo(createColorInfo(data?.seed, instance));
      },
    }
  );

  const hasInfo = info && !isLoading && !isError;

  return (
    <Center
      mt={1}
      rounded="md"
      _hover={{
        bg: 'blackAlpha.50',
      }}
    >
      <Accordion
        w="full"
        fontSize="md"
        rounded="md"
        allowToggle
        color={instance.getContrastColors()[1]}
        index={index}
      >
        <AccordionBox
          title={hasInfo ? info?.name?.value : undefined}
          icon={{
            Component: InfoIcon,
            fillColor: instance.getContrastColors()[1],
          }}
          status={status}
          contrast={instance.contrast}
          w={72}
          border="1px"
          isDisabled={!info}
        >
          <Flex direction="column" gap={4}>
            {Object.entries(info || {}).map(([field, item]) => {
              return (
                <InfoListItem
                  key={field}
                  field={field}
                  item={item}
                  instance={instance}
                />
              );
            })}
          </Flex>
        </AccordionBox>
      </Accordion>
    </Center>
  );
}

function InfoListItem({
  instance,
  field,
  item,
}: {
  instance: Color;
  field: string;
  item: any;
}) {
  const toast = useToast();

  const { isCopied, copy } = useClipboard({
    text: item?.toString() || 'Sorry. Please try again',
    onCopy: () => {
      toast({
        title: 'Copied to clipboard',
        description: item?.toString() || 'Sorry. Please try again',
        status: 'success',
        duration: 1000,
        isClosable: true,
      });
    },
  });

  return (
    <HStack
      key={field}
      color={instance.getContrastColors()[1]}
      p={1}
      borderBottom="1px"
      borderColor="blackAlpha.100"
      borderRadius="md"
      _hover={{ bg: 'blackAlpha.200' }}
    >
      <>
        <chakra.span w="30%" fontSize="2xs">
          {field === 'name' ? null : field + ':'}
        </chakra.span>
        {field === 'name' ? null : (
          <chakra.p key={field} w="full" flex={1} pl={2} fontSize="2xs">
            {item?.toString()}
          </chakra.p>
        )}
        {['rgb', 'hsl', 'hsv', 'cmyk', 'hex'].includes(field) ? (
          <Button
            color={instance.getContrastColors()[1]}
            colorScheme="blackAlpha"
            size="xs"
            variant="outline"
            onClick={copy}
            fontSize="2xs"
          >
            <Icon
              as={isCopied ? CheckIcon : CopyIcon}
              fill={instance.getContrastColors()[1]}
              stroke={instance.getContrastColors()[1]}
            />
          </Button>
        ) : null}
      </>
    </HStack>
  );
}
