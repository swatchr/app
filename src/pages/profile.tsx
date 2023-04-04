import { Box, Center, chakra, Container, Flex, HStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

import type { Color, Fork, Owned, Palette } from '@prisma/client';
import type { NextPage } from 'next';

import { BaseLayout } from '@/components';
import { parsePalette } from '@/utils';
import { api } from '@/utils/api';
import ColorLab from 'lib/color';
import Link from 'next/link';

// @TODO: build out profile page

const ProfilePage: NextPage = () => {
  const { data: session, status } = useSession();

  const { data: Profile } = api.profile.me.useQuery(
    {},
    { enabled: !!session && status === 'authenticated' }
  );

  const { data: Palette } = api.palette.getAll.useQuery(
    {},
    { enabled: !!Profile }
  );

  return (
    <BaseLayout title={`${Profile?.User?.name}'s Profile`}>
      <Container
        mt={28}
        pb={12}
        maxW="container.xl"
        border="1px"
        borderTopRadius="md"
        bg="white"
      >
        <chakra.h1 color="gray.600" textAlign="center">
          {Profile?.User?.name}
        </chakra.h1>
        <PaletteMapper
          palettes={Palette}
          title="Owned Palettes"
          fallback="Palettes that you own will be listed here."
        />
      </Container>
    </BaseLayout>
  );
};

export default ProfilePage;

export function PaletteMapper({
  palettes,
  title = 'Owned Palettes',
  fallback = 'Palettes that you own will be listed here.',
}: {
  palettes:
    | (Palette & { Owned: Owned[]; Forks: Fork[]; Colors: Color[] })[]
    | null
    | undefined;
  title: 'Owned Palettes';
  fallback?: string;
}) {
  return (
    <Box px={6} textAlign="left">
      <chakra.h2 color="gray.600">{title}</chakra.h2>
      <Flex flexWrap="wrap" gap={12}>
        {palettes?.length ? (
          palettes?.map((palette) => {
            return (
              <Box
                key={`${palette.id}-profile-palette`}
                position="relative"
                p={2}
                border="1px"
                rounded="md"
              >
                <Box
                  as={Link}
                  href={`/?colors=${palette.serial}&name=${palette.name}`}
                  position="absolute"
                  w="full"
                  h="full"
                  cursor="pointer"
                  objectFit="cover"
                  zIndex={0}
                />
                <Box rounded="md" shadow="md" zIndex={1}>
                  <Flex borderTopRadius="md" overflow="hidden">
                    {parsePalette(palette.serial).map((color) => {
                      const _color = new ColorLab(color);
                      return (
                        <Center
                          key={`${color}-profile-palette-swatch`}
                          bg={color}
                          color={
                            _color.contrast === 'light' ? 'white' : 'black'
                          }
                          boxSize={20}
                        >
                          {color}
                        </Center>
                      );
                    })}
                  </Flex>
                  <HStack
                    px={2}
                    py={4}
                    justifyContent="space-between"
                    color="gray.500"
                  >
                    <chakra.p color="gray.500" fontSize="sm">
                      {palette.name}
                    </chakra.p>
                    <HStack>
                      <chakra.p fontSize="xs">Forks:</chakra.p>
                      <chakra.p fontSize="xs">{palette.Forks.length}</chakra.p>
                    </HStack>
                  </HStack>
                </Box>
              </Box>
              // </Box>
            );
          })
        ) : (
          <>
            <chakra.p color="gray.400" textAlign="center">
              {fallback}
            </chakra.p>
          </>
        )}
      </Flex>
    </Box>
  );
}
