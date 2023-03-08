import config from '__data/seo/config.json';

type seoImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
  type: string;
};

export function SEOConfig(
  title: string,
  description?: string,
  image?: seoImage
) {
  let images = config?.images;
  if (images[0]?.url && image?.url && image?.url !== images[0]?.url) {
    images = [image].concat(images);
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
