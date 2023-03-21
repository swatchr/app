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
import { useDebounce } from '@/hooks';
import { isDev, slugify, stringifyPalette } from '@/utils';
import { api } from '@/utils/api';
import ColorLab from 'lib/color';
import { useSession } from 'next-auth/react';
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
      {/* @TODO: WIP: finish command Palette logic */}
      {isDev ? <CommandPalette /> : null}
      <HeaderIconStack
        palette={palette}
        openModal={onOpen}
        showColorBlindness={showColorBlindness}
        showCB={showCB}
      />
      <ExportPanel isOpen={isOpen} onClose={onClose} />
      {showCB ? (
        <ColorBlindnessSimulator palette={palette} contrast={contrast} />
      ) : null}
      {palette.length && (
        <PaletteNameInput
          serial={stringifyPalette(palette)}
          text={controlsText}
        />
      )}
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

function PaletteNameInput({ serial, text }: { serial: string; text: string }) {
  const toast = useToast();
  const { status } = useSession();

  const editableInput = useRef<HTMLInputElement | null>(null);
  const {
    info: { name },
  } = usePaletteState();
  const [value, setValue] = useState<string | undefined>(name);

  const mutation = api.palette.update.useMutation({
    onSuccess(data) {
      setValue(data?.Palette.name);
      toast({
        title: 'Palette name updated',
        description: `Palette (serial: ${data?.Palette.serial}) name updated to ${data?.Palette.name}`,
        status: 'success',
      });
    },
    onError(error) {
      toast({
        title: 'Error updating palette name',
        description: error.message,
        status: 'error',
      });
      setValue(data?.name);
    },
  });
  const { data } = api.palette.get.useQuery(
    { serial },
    {
      enabled: !!serial,
      onSuccess(data) {
        setValue(data?.name);
        localStorage.setItem('paletteName', data?.name!);
      },
      onError(error) {
        toast({
          title: error.data?.code,
          description: `Could not fetch palette name: ${
            isDev && error.message
          }`,
          status: 'warning',
        });
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
        size="sm"
        value={value}
        placeholder={data?.name}
        isDisabled={status !== 'authenticated'}
        onChange={(val: string) => setValue(val)}
        onSubmit={(value) => {
          mutation.mutate({
            serial: data?.serial!,
            data: {
              name: slugify(value),
              status: data?.status,
            },
          });
        }}
      >
        <EditablePreview>{value}</EditablePreview>
        <InputGroup>
          <VisuallyHidden>
            <chakra.label htmlFor="name">Palette Name</chakra.label>
          </VisuallyHidden>
          <EditableInput
            color={text}
            type="text"
            name="name"
            pattern={'^[a-zA-Zs-]+$'}
            onBlur={(e) => e.preventDefault()}
            _selection={{ color: 'white', bg: 'green.500' }}
          />
        </InputGroup>
      </Editable>
    </Box>
  );
}
