import {
  Button,
  ButtonGroup,
  Code,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
} from '@chakra-ui/react';

import { usePaletteState } from '@/contexts';
import { useClipboard } from '@/hooks';
import {
  cssStringifyPalette,
  objectStringifyPalette,
  publish,
  scssStringifyPalette,
  sysUIStringifyPalette,
  tailwindStringifyPalette,
} from '@/utils';
import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { CHModal } from 'chakra.ui';

const exportItems = {
  css: {
    title: 'CSS',
    description: 'Copy CSS variables to clipboard',
    stringify: cssStringifyPalette,
  },
  scss: {
    title: 'SCSS',
    description: 'Copy SCSS variables to clipboard',
    stringify: scssStringifyPalette,
  },
  js: {
    title: 'JS',
    description: 'Copy JS object to clipboard',
    stringify: objectStringifyPalette,
  },
  tailwind: {
    title: 'TailwindCSS',
    description: 'Copy TailwindCSS config to clipboard',
    stringify: tailwindStringifyPalette,
  },
  sysui: {
    title: 'System UI',
    description: 'Copy System UI config to clipboard',
    stringify: sysUIStringifyPalette,
  },
};

export function ExportPanel({
  isOpen,
  onClose = () => publish('view-controls', { detail: 'default' }),
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  const { palette } = usePaletteState();
  const { colorMode } = useColorMode();
  const scheme = 'green';

  return (
    <CHModal
      id="export-palette"
      title="Export Palette"
      isOpen={isOpen}
      onClose={onClose}
      allowClose={true}
      hasSubmit={false}
      size="xl"
      colorScheme={scheme}
    >
      <Tabs isFitted variant="soft-rounded" colorScheme={scheme} size="sm">
        <TabList mb="1em">
          {Object.keys(exportItems).map((key) => {
            const item = exportItems[key as keyof typeof exportItems];
            return (
              <Tab key={key} px={1} py={1} borderRadius="5px">
                {item.title}
              </Tab>
            );
          })}
        </TabList>
        <TabPanels fontFamily="mono">
          {Object.keys(exportItems).map((key) => {
            const item = exportItems[key as keyof typeof exportItems];
            console.log('🚀 | file: export-panel.tsx:109 | item:', item);
            return (
              <CodeBlockPanels
                key={key}
                item={item}
                palette={palette}
                colorMode={colorMode}
                scheme={scheme}
                onClose={onClose}
              />
            );
          })}
        </TabPanels>
      </Tabs>
    </CHModal>
  );
}

export function CodeBlockPanels({
  key,
  palette,
  item,
  colorMode,
  scheme,
  onClose,
}: {
  key: string;
  palette: string[];
  item: any;
  colorMode: string;
  scheme: string;
  onClose: () => void;
}) {
  const contrast = colorMode === 'light' ? 'gray.200' : 'gray.800';
  const { isCopied, copy } = useClipboard({
    text: item?.stringify(palette).toString(),
    onCopy: () => {
      publish('show-toast', {
        id: `export-${key}-copied`,
        title: 'Copied to clipboard',
        description: item.description || 'Sorry. Please try again',
        status: 'success',
        duration: 1000,
        isClosable: true,
      });
    },
  });
  return (
    <TabPanel key={key} position="relative">
      <Code
        w="full"
        whiteSpace="pre"
        bg={contrast}
        p={8}
        border="1px"
        borderColor={contrast}
        rounded="lg"
        onClick={copy}
        cursor="pointer"
      >
        {item?.stringify(palette).toString()}
      </Code>

      <ButtonGroup
        as={HStack}
        w="full"
        mt={8}
        justifyContent="flex-end"
        gap={3}
        size="sm"
      >
        <Button
          leftIcon={isCopied ? <CheckIcon /> : <CopyIcon />}
          colorScheme={scheme}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            copy(e);
          }}
        >
          {isCopied ? 'Copied' : 'Copy'}
        </Button>
        <Button colorScheme="gray" onClick={onClose}>
          Close
        </Button>
      </ButtonGroup>
    </TabPanel>
  );
}
