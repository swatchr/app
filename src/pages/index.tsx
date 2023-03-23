import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import type { NextPage } from 'next';

import { BaseLayout, Palette } from '@/components';
import { PaletteProvider } from '@/contexts';
import { parsePalette } from '@/utils';
import { FullScreenLoader } from 'chakra.ui';
import { shortname } from 'lib/unique-names-generator';

const Home: NextPage = () => {
  const router = useRouter();
  const { isLoading } = useIsLoading(true, 200);

  let colorParams = undefined;
  let paletteName = shortname();
  if (router?.query) {
    colorParams = parsePalette(router.query?.colors as string);
    if (router?.query.name) {
      paletteName = String(router.query?.name);
    }
  }

  return (
    <BaseLayout title="Swatchr" description="Color Palette Manager">
      {isLoading ? (
        <FullScreenLoader color="green" />
      ) : (
        <PaletteProvider paletteName={paletteName} colorParams={colorParams}>
          <Palette />
        </PaletteProvider>
      )}
    </BaseLayout>
  );
};

export default Home;

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
