import { useCallback, useEffect, useState } from 'react';

import type { GetServerSideProps, NextPage } from 'next';

import { BaseLayout, Palette } from '@/components';
import { SocialShare } from '@/components/v1/_scaffold/social';
import { PaletteProvider } from '@/contexts';
import { getBuildUrl, parsePalette, slugify } from '@/utils';
import { Center } from '@chakra-ui/react';
import { FullScreenLoader } from 'chakra.ui';
import { shortname } from 'lib/unique-names-generator';
import { encodeQueryParams } from '../utils/fns';

interface Props {
  ogImageUrl: string;
  paletteName: string;
  colorParams?: string[];
}

const Home: NextPage<Props> = ({ ogImageUrl, paletteName, colorParams }) => {
  const { isLoading } = useIsLoading(true, 200);

  return (
    <BaseLayout
      title="Swatchr"
      description="Color Palette Manager"
      {...Object.assign(
        {},
        colorParams
          ? {
              image: {
                url: ogImageUrl,
                width: 1200,
                height: 640,
                alt: `${paletteName} color palette`,
                type: 'image/png',
              },
            }
          : {}
      )}
    >
      {isLoading ? (
        <FullScreenLoader color="green" />
      ) : (
        <PaletteProvider paletteName={paletteName} colorParams={colorParams}>
          <Palette />
        </PaletteProvider>
      )}
      <SocialShare twitter pinterest />
      <Center w="full" position="fixed" bottom={0} p={12}></Center>
    </BaseLayout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  let colorParams: string[] | undefined = undefined;
  let paletteName: string = shortname();

  // If query parameters are present, validate them
  if (query) {
    const { colors, name } = query;
    // Validate the color parameter
    if (colors && typeof colors === 'string') {
      const parsedColors = parsePalette(colors);
      if (Array.isArray(parsedColors)) {
        colorParams = parsedColors;
      } else {
        console.error(`Invalid color parameter: ${colors}`);
      }
    } else if (colors) {
      console.error(`Invalid color parameter: ${colors}`);
    }
    // Validate the palette name
    if (name && typeof name === 'string') {
      paletteName = slugify(name.substring(0, 20));
    } else if (name) {
      console.error(`Invalid palette name: ${name}`);
    }
  }

  const ogImageUrl = `${getBuildUrl()}/api/og?${encodeQueryParams(query)}`;

  return {
    props: {
      colorParams,
      paletteName,
      ogImageUrl,
    },
  };
};

function useIsLoading(initialValue: boolean, resetInterval: number) {
  const [isLoading, setIsLoading] = useState(initialValue);
  const toggleLoading = useCallback(
    () => setIsLoading(!isLoading),
    [isLoading]
  );

  useEffect(() => {
    if (isLoading && resetInterval) {
      const timer = setTimeout(() => setIsLoading(false), resetInterval);
      return () => clearTimeout(timer);
    }
  }, [isLoading, resetInterval]);

  return { isLoading, toggleLoading, setIsLoading };
}
