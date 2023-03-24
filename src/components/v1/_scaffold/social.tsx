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
import { useRouter } from 'next/router';

export const SocialShare: FC<{
  twitter?: boolean;
  facebook?: boolean;
  pinterest?: boolean;
}> = ({ twitter = false, facebook = false, pinterest = false }) => {
  const { palette, info } = usePaletteState();
  const router = useRouter();

  const mediaParams = {
    colors: stringifyPalette(palette ?? '#BADA55'),
    title: encodeURIComponent(info?.name ?? ''),
  };
  const shareData = {
    title: info?.name,
    url: `${getBuildUrl()}?${encodeQueryParams(router.query)}`,
    quote:
      "I just created this awesome color palette with @SwatchrApp! It's so easy to use and it's free!",
    hashtag: 'SwatchrApp',
    media: `${getClientBaseUrl()}/api/og?${encodeQueryParams(router.query)}`,
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
