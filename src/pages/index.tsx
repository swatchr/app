import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { type NextPage } from 'next';

import { BaseLayout, Palette } from '@/components';
import { PaletteProvider } from '@/contexts';
import { isClient, parsePalette, publish } from '@/utils';

const Home: NextPage = () => {
  return (
    <BaseLayout title="Swatchr" description="Color Palette Manager">
      <PaletteWrapper>
        {(colorParams) => (
          <PaletteProvider colorParams={colorParams}>
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

export const PaletteWrapper = ({ children }: PaletteWrapperProps) => {
  const router = useRouter();
  const [colorParams, setColorParams] = useState<string[]>([]);

  useEffect(() => {
    let colors: string[] = [];

    if (router.query?.colors) {
      colors = parsePalette(router.query.colors as string);
    } else if (typeof window !== 'undefined') {
      const localPalette = localStorage.getItem('palette');
      if (localPalette) {
        colors = parsePalette(localPalette);
      }
    }

    if (colors.length) {
      setColorParams(colors);
      publish('show-toast', {
        id: router.query?.colors
          ? 'custom-url-palette-loaded'
          : 'local-storage-palette-loaded',
        title: router.query?.colors
          ? 'Loaded custom palette'
          : 'Loaded saved palette',
        description: JSON.stringify(colors),
      });
    }
  }, [router.query]);

  return <>{children(colorParams)}</>;
};
