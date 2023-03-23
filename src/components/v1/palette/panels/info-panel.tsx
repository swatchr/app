import { CheckIcon } from '@chakra-ui/icons';
import {
  Accordion,
  Button,
  Center,
  chakra,
  Flex,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { useState } from 'react';

import type { ColorApiClientInfo } from '@/server/api/types/color';
import type ColorLab from 'lib/color';

import { CopyIcon } from '@/components';
import { useClipboard } from '@/hooks';
import { createColorInfo } from '@/server/api/types/color';
import { publish } from '@/utils';
import { api } from '@/utils/api';
import { AccordionBox } from 'chakra.ui';

export function InfoPanel({
  color,
  instance,
  showIcon,
}: {
  color: string;
  instance: ColorLab;
  showIcon: boolean;
}) {
  const [info, setInfo] = useState<ColorApiClientInfo>();

  // @TODO: replace with a color.get trpc request
  const { status, isLoading, isError } = api.color.schemeAPI.useQuery(
    { hex: color.replace('#', '') },
    {
      enabled: !!color,
      onSuccess: (data) => {
        setInfo(createColorInfo(data?.seed, instance));
      },
      onError(err) {
        console.log('🚀 | file: info-panel.tsx:46 | err:', err);
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
      <Accordion w="full" fontSize="md" rounded="md" allowToggle>
        <AccordionBox
          // title={hasInfo ? info?.name! : ''}
          title={hasInfo ? info?.name?.value : ''}
          status={status}
          contrast={instance.contrast} // used for bg color
          w={72}
          border={'none'}
          isDisabled={!info}
          showIcon={showIcon}
        >
          <Flex direction="column" gap={4}>
            {Object.entries(info || {}).map(([field, item]) => {
              return <InfoListItem key={field} field={field} item={item} />;
            })}
          </Flex>
        </AccordionBox>
      </Accordion>
    </Center>
  );
}

function InfoListItem({ field, item }: { field: string; item: any }) {
  const { isCopied, copy } = useClipboard({
    text: item?.toString() || 'Sorry. Please try again',
    onCopy: () => {
      publish('show-toast', {
        id: `copied-${field}`,
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
      p={1}
      borderRadius="md"
      _hover={{ bg: 'blackAlpha.200' }}
    >
      <chakra.span w="30%" fontSize="2xs">
        {field === 'name' || field === 'id' ? null : field + ':'}
      </chakra.span>
      {field === 'name' || field === 'id' ? null : (
        <chakra.p key={field} w="full" flex={1} pl={2} fontSize="2xs">
          {item?.toString()}
        </chakra.p>
      )}
      {['rgb', 'hsl', 'hsv', 'cmyk', 'hex'].includes(field) ? (
        <Button
          colorScheme="blackAlpha"
          size="xs"
          variant="outline"
          onClick={copy}
          fontSize="2xs"
          color="inherit"
        >
          <Icon
            as={isCopied ? CheckIcon : CopyIcon}
            fill={'currentColor'}
            stroke={'currentColor'}
          />
        </Button>
      ) : null}
    </HStack>
  );
}
