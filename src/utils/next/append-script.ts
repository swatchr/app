import type { NextRouter } from 'next/router';

export function appendScriptOnPage(
  pagesArray: string[],
  router: NextRouter
): boolean {
  return !!pagesArray.filter((page) => {
    if (page === '/') return true;
    return router.asPath.includes(page);
  }).length;
}

// usage:
/**
 *
   {isProd && appendScriptOnPage(['/', '/services']) ? (
      <Script src={process.env.NEXT_PUBLIC_TRUSTMARY} async />
    ) : null}
 *
 */
