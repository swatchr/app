import { Search2Icon } from '@chakra-ui/icons';
import { Flex, useDisclosure } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import { Swatch } from '@/components';
import { ColorProvider, ContentProvider, usePaletteState } from '@/contexts';
import { isDev } from '@/utils';
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

  const contrast =
    new ColorLab(palette[0]!).contrast == 'dark' ? 'whiteAlpha' : 'blackAlpha';

  const { isOpen, onOpen, onClose } = useDisclosure(); // export modal

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
