import config from '__data/seo/config.json';

// export type OGImage = {
//   url: string;
//   width: number;
//   height: number;
//   alt: string;
//   type: string;
// };

// export function SEOConfig(
//   title: string,
//   description?: string,
//   image?: OGImage
// ) {
//   let images = config?.images;
//   if (images && images[0]?.url && image?.url && image?.url !== images[0]?.url) {
//     // images = images.concat([image]); // @TODO: invert this after validating twitter card
//     images = [image].concat(images); // @DONE?: testing this on this branch specifically
//   }

//   return {
//     title: `${title || (config?.title ?? '')}`,
//     description: description || config?.description,
//     keywords: config?.keywords,
//     twitter: {
//       cardType: 'summary_large_image',
//       handle: config.twitterHandle,
//     },
//     openGraph: {
//       url: config?.url,
//       title: `${title || config?.title}`,
//       description: description || config?.description,
//       locale: config?.locale,
//       images: images,
//     },
//     additionalLinkTags: config.additionalLinkTags,
//   };
// }

interface SEOConfig {
  title: string;
  description: string | undefined;
  keywords: string[] | undefined;
  twitter: {
    cardType: string;
    handle: string | undefined;
  };
  openGraph: {
    url: string | undefined;
    title: string;
    description: string | undefined;
    locale: string | undefined;
    images: OGImage[];
  };
  additionalLinkTags: { rel: string; href: string }[] | undefined;
}

interface Config {
  title: string;
  description: string | undefined;
  keywords: string[] | undefined;
  twitterHandle: string | undefined;
  url: string | undefined;
  locale: string | undefined;
  images: OGImage[];
  additionalLinkTags: { rel: string; href: string }[] | undefined;
}

export type OGImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
  type: string;
};

export function SEOConfig(
  title: string,
  description?: string,
  image?: OGImage
): SEOConfig {
  const { images, ...config }: Config = require('__data/seo/config.json');
  const newImages =
    image?.url && images?.[0]?.url !== image.url ? [image, ...images] : images;
  const ogImages = newImages.map(({ url, width, height, alt, type }) => ({
    url,
    width,
    height,
    alt,
    type,
  }));

  return {
    title: `${title ?? config.title}`,
    description: description ?? config.description,
    keywords: config.keywords,
    twitter: {
      cardType: 'summary_large_image',
      handle: config.twitterHandle,
    },
    openGraph: {
      url: config.url,
      title: `${title ?? config.title}`,
      description: description ?? config.description,
      locale: config.locale,
      images: ogImages,
    },
    additionalLinkTags: config.additionalLinkTags,
  };
}
