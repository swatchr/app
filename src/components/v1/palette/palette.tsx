import { DragHandleIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, Icon, VStack } from '@chakra-ui/react';

import { Swatch } from '@/components';
import { ColorProvider, ContentProvider, usePaletteDispatch } from '@/contexts';
import { useDebounce } from '@/hooks';
import { MotionBox } from 'chakra.ui';
import { motion, Reorder } from 'framer-motion';
import ColorLab from 'lib/color';

export function Palette({
  show,
  palette,
}: {
  show: boolean;
  palette: string[];
}) {
  return (
    <Flex
      as={motion.div}
      layoutId="swatches"
      className="swatches"
      shadow="lg"
      rounded="md"
      h="100%"
      zIndex={show ? 0 : -1}
    >
      {palette && palette.length
        ? palette.map((swatch, index) => (
            <ColorProvider
              key={`${swatch}-${index}-swatch`}
              color={swatch}
              index={index}
            >
              <ContentProvider>
                <VStack w="full" flex={1}>
                  <Swatch index={index} />
                </VStack>
              </ContentProvider>
            </ColorProvider>
          ))
        : null}
    </Flex>
  );
}
export function StaticPalette({ palette }: { palette: string[] }) {
  const { updatePaletteOrder } = usePaletteDispatch();
  const debouncedPaletteUpdate = useDebounce((palette: string[]) => {
    updatePaletteOrder(palette);
  }, 200);
  return (
    <Flex
      layoutId="swatches"
      className="swatches"
      rounded="md"
      as={Reorder.Group}
      axis="x"
      values={palette}
      onReorder={debouncedPaletteUpdate}
    >
      {palette && palette.length
        ? palette.map((swatch, index) => {
            const contrast = new ColorLab(swatch);
            const text = contrast.getBestContrastColor(['white', 'black']);
            return (
              <Flex
                key={swatch}
                className="scaled-swatch-wrapper"
                position="relative"
                w="full"
                my="auto"
                mx="auto"
                color="white"
                backgroundColor={swatch}
                justifyContent="center"
                alignItems="center"
                as={Reorder.Item}
                value={swatch}
                mr={6}
                _last={{ mr: 0 }}
              >
                <Box
                  className="scaled-swatch-menu-wrapper"
                  position="relative"
                  py={6}
                  fontFamily="heading"
                  fontSize="5xl"
                  color={text}
                  opacity={0.5}
                >
                  <Center flexDirection="column" gap={6}>
                    {swatch}
                    <Icon
                      w="full"
                      boxSize="2rem"
                      as={DragHandleIcon}
                      cursor="grab"
                    />
                  </Center>
                </Box>
              </Flex>
            );
          })
        : null}
    </Flex>
  );
}
