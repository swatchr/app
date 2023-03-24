import config from '__data/seo/config.json';

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
) {
  let images = config?.images;
  if (images[0]?.url && image?.url && image?.url !== images[0]?.url) {
    images = images.concat([image]); // @TODO: invert this after validating twitter card
  }

  return {
    title: `${title || (config?.title ?? '')}`,
    description: description || config?.description,
    keywords: config?.keywords,
    twitter: {
      cardType: 'summary_large_image',
      handle: config.twitterHandle,
    },
    openGraph: {
      url: config?.url,
      title: `${title || config?.title}`,
      description: description || config?.description,
      locale: config?.locale,
      images: images,
    },
    additionalLinkTags: config.additionalLinkTags,
  };
}
