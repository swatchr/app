import {
  Box,
  chakra,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  InputGroup,
  useDisclosure,
  useToast,
  VisuallyHidden,
} from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';

import { Swatch } from '@/components';
import { ColorProvider, ContentProvider, usePaletteState } from '@/contexts';
import { isDev, stringifyPalette } from '@/utils';
import { api } from '@/utils/api';
import ColorLab from 'lib/color';
import { CommandPalette } from '../_wip/command-palette';
import { LogoCredits } from '../_wip/logo-credits';
import { ColorBlindnessSimulator } from './color-blindness-simulator';
import { HeaderIconStack } from './header-icon-stack';
import { ExportPanel } from './panels/export-panel';

export function Palette() {
  const { palette } = usePaletteState();
  const [showCB, setShowCB] = useState(false);
  const showColorBlindness = useCallback(
    () => setShowCB(!showCB),
    [showCB, setShowCB]
  );

  const { isOpen, onOpen, onClose } = useDisclosure(); // export modal

  const contrast =
    new ColorLab(palette[0]!).contrast == 'dark' ? 'whiteAlpha' : 'blackAlpha';

  const controlsText =
    new ColorLab(palette[palette.length - 1]!).contrast == 'dark'
      ? 'gray.600'
      : 'gray.300';

  return (
    <>
      {/* @TODO: WIP: finish commandPalette logic */}
      {isDev ? <CommandPalette /> : null}
      <HeaderIconStack
        palette={palette}
        openModal={onOpen}
        showColorBlindness={showColorBlindness}
        showCB={showCB}
      />
      <ExportPanel isOpen={isOpen} onClose={onClose} />
      {showCB ? (
        <ColorBlindnessSimulator contrast={contrast} palette={palette} />
      ) : null}
      <PaletteNameInput palette={palette} text={controlsText} />
      <Flex className="swatches" m={0} p={0} gap={0}>
        {palette && palette.length
          ? palette.map((swatch, index) => (
              <ColorProvider key={index} color={swatch} index={index}>
                <ContentProvider>
                  <Swatch index={index} />
                </ContentProvider>
              </ColorProvider>
            ))
          : null}
      </Flex>
      {/* @TODO: WIP: Finish LogoCredits */}
      <LogoCredits />
    </>
  );
}

function PaletteNameInput({
  palette,
  text,
}: {
  palette: string[];
  text: string;
}) {
  const toast = useToast();

  const editableInput = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState<string | undefined>();
  const mutation = api.palette.update.useMutation({
    onSuccess(data) {
      toast({
        title: 'Palette name updated',
        description: `Palette name updated to ${data?.palette.name}`,
        status: 'success',
      });
    },
    onError(error) {
      console.error('🚀 | file: palette.tsx:43 | error:', error);
      toast({
        title: 'Error updating palette name',
        description: 'Error updating palette name',
        status: 'error',
      });
    },
  });
  const { data } = api.palette.get.useQuery(
    {
      serial: stringifyPalette(palette),
    },
    {
      onSuccess(data) {
        setValue(data?.name);
      },
    }
  );
  return (
    <Box
      position="absolute"
      top={28}
      right={8}
      py={2}
      color={text}
      zIndex={1}
      textAlign="center"
    >
      <Editable
        ref={editableInput}
        tabIndex={0}
        value={value}
        placeholder={value}
        size="sm"
        onChange={(value) => setValue(value)}
        onSubmit={(value) => {
          mutation.mutateAsync({
            serial: data?.serial!,
            data: {
              name: value,
            },
          });
        }}

        // @TODO: WIP: add regex pattern and slugify name
      >
        <EditablePreview>{data?.name}</EditablePreview>
        <InputGroup>
          <VisuallyHidden>
            <chakra.label htmlFor="name">Palette Name</chakra.label>
          </VisuallyHidden>
          <EditableInput color="gray.300" type="text" name="name" />
        </InputGroup>
      </Editable>
    </Box>
  );
}
