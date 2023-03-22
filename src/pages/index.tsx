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

  return (
    <BaseLayout title="Swatchr" description="Color Palette Manager">
      {isLoading ? (
        <FullScreenLoader color="green" />
      ) : (
        <PaletteProvider
          paletteName={shortname()}
          colorParams={
            router?.query?.colors
              ? parsePalette(router.query?.colors as string)
              : undefined
          }
        >
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
