import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { type NextPage } from 'next';

import { BaseLayout, Palette } from '@/components';
import { PaletteProvider } from '@/contexts';
import { isClient, parsePalette, publish } from '@/utils';

const Home: NextPage = () => {
  const router = useRouter();
  const [colorParams, setColorParams] = useState<string[]>([]);

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
    if (!isClient || router.query?.colors) return;
    const localPalette = localStorage.getItem('palette');
    if (localPalette) {
      const palette = parsePalette(localPalette);

      if (palette?.length) {
        // if (window.confirm('Load saved palette?')) {}
        setColorParams(palette);
        publish('show-toast', {
          id: 'local-storage-palette-loaded',
          title: 'Loaded saved palette',
          description: JSON.stringify(palette),
        });
      }
    }
  }, [router.query?.colors]);
  return (
    <BaseLayout title="Swatchr" description="Color Palette Manager">
      <PaletteProvider colorParams={colorParams}>
        <Palette />
      </PaletteProvider>
    </BaseLayout>
  );
};

export default Home;
