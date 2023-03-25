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
import {
  encodeQueryParams,
  getBuildUrl,
  getClientBaseUrl,
  stringifyPalette,
} from '@/utils';

export const SocialShare: FC<{
  twitter?: boolean;
  facebook?: boolean;
  pinterest?: boolean;
}> = ({ twitter = false, facebook = false, pinterest = false }) => {
  const { palette, info } = usePaletteState();

  const url = `${getClientBaseUrl()}?${encodeQueryParams({
    // colors: stringifyPalette(palette ?? '#BADA55'),
    colors: stringifyPalette(palette),
    name: encodeURIComponent(info?.name ?? ''),
  })}`;

  const media = `${getBuildUrl()}/api/og?${encodeQueryParams({
    // colors: stringifyPalette(palette ?? '#BADA55'),
    colors: stringifyPalette(palette),
    name: encodeURIComponent(info?.name ?? ''),
  })}`;

  const quote =
    "I just created this awesome color palette with @SwatchrApp! It's was so easy to use, give it a try.\n";

  const shareData = {
    title: info?.name,
    url,
    quote,
    hashtag: 'SwatchrApp',
    media,
    blankTarget: true,
  };
  return (
    <VStack position="fixed" zIndex="docked" right={4} bottom={20}>
      {facebook ? (
        <FacebookShareButton {...shareData}>
          <FacebookIcon size={32} round={false} />
        </FacebookShareButton>
      ) : null}
      {twitter ? (
        <TwitterShareButton {...shareData} title={shareData.quote}>
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
