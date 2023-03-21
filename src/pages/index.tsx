import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import type { NextPage } from 'next';

import { BaseLayout, Palette } from '@/components';
import { PaletteProvider } from '@/contexts';
import { isClient, parsePalette, publish } from '@/utils';
import { FullScreenLoader } from 'chakra.ui';
import { shortname } from 'lib/unique-names-generator';

const Home: NextPage = () => {
  return (
    <BaseLayout title="Swatchr" description="Color Palette Manager">
      <PaletteWrapper>
        {(colorParams) => (
          <PaletteProvider colorParams={colorParams} paletteName={shortname()}>
            <Palette />
          </PaletteProvider>
        )}
      </PaletteWrapper>
    </BaseLayout>
  );
};

export default Home;

type PaletteWrapperProps = {
  children: (colorParams: string[]) => React.ReactNode;
};

const PaletteWrapper = ({ children }: PaletteWrapperProps): JSX.Element => {
  const router = useRouter();
  const [colorParams, setColorParams] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!colorParams.length) setIsLoading(true);
    if (isLoading) {
      if (colorParams.length) setIsLoading(false);
    }
  }, [isLoading, colorParams.length]);

  useEffect(() => {
    if (!router.query?.colors && isClient) {
      const localPalette = localStorage.getItem('palette');
      if (localPalette) {
        const palette = parsePalette(localPalette);

        if (palette?.length) {
          setColorParams(palette);
          publish('show-toast', {
            id: 'local-storage-palette-loaded',
            title: 'Loaded saved palette',
            description: JSON.stringify(palette),
          });
        }
      }
    }
  }, [router.query?.colors]);

  useEffect(() => {
    if (!router.query?.colors) return;
    let colors = parsePalette(router.query?.colors as string);

    if (colors.length) {
      setColorParams(colors);
      publish('show-toast', {
        id: 'custom-url-palette-loaded',
        title: 'Loaded custom palette',
        description: JSON.stringify(colors),
      });
    }
  }, [router.query]);

  useEffect(() => {
    if (colorParams.length) return;
    const timer = setTimeout(
      () => !colorParams.length && setColorParams(['#BADA55']),
      300
    );
    return () => clearTimeout(timer);
  }, [colorParams.length]);

  return isLoading ? (
    <FullScreenLoader color="green" />
  ) : (
    <>{children(colorParams)}</>
  );
};
