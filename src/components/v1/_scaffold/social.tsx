/* eslint-disable quotes */
import { VStack } from '@chakra-ui/react';
import {
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'next-share';

import type { FC } from 'react';

import { usePaletteState } from '@/contexts';
import { getBaseUrl, stringifyPalette } from '@/utils';

export const SocialShare: FC<{
  twitter?: boolean;
  facebook?: boolean;
  pinterest?: boolean;
}> = ({ twitter = false, facebook = false, pinterest = false }) => {
  const { palette, info } = usePaletteState();
  const shareData = {
    title: info?.name,
    url: `https://www.swatchr.app?colors=${encodeURIComponent(
      stringifyPalette(palette ?? '#BADA55')
    )}&name=${encodeURIComponent(info?.name ?? '')}`,
    quote:
      "I just created this awesome color palette with @SwatchrApp! It's so easy to use and it's free!",
    hashtag: 'SwatchrApp',
    media: `${getBaseUrl()}/api/og?colors=${encodeURIComponent(
      stringifyPalette(palette ?? '#BADA55')
    )}&title=${encodeURIComponent(encodeURIComponent(info?.name ?? ''))}`,
    blankTarget: true,
  };
  return (
    <VStack position="fixed" zIndex="docked" right={4} bottom={36}>
      {facebook ? (
        <FacebookShareButton {...shareData}>
          <FacebookIcon size={32} round={false} />
        </FacebookShareButton>
      ) : null}
      {twitter ? (
        <TwitterShareButton {...shareData}>
          <TwitterIcon size={32} round={false} />
        </TwitterShareButton>
      ) : null}
      {pinterest ? (
        <PinterestShareButton {...shareData}>
          <PinterestIcon size={32} round={false} />
        </PinterestShareButton>
      ) : null}
    </VStack>
  );
};
