import { Flex } from '@chakra-ui/react';

import { Swatch } from '@/components';
import { ColorProvider, ContentProvider } from '@/contexts';

export function Palette({ palette }: { palette: string[] }) {
  return (
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
  );
}
