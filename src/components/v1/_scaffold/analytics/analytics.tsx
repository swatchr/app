import { getCookie, hasCookies } from '@analytics/cookie-utils';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { getAnonId } from '@/utils';
import { analytics } from 'lib/analytics';

interface IAnalytics {
  asPath: string;
}

export const CustomAnalytics: React.FC<IAnalytics> = ({ asPath }) => {
  const { data: session, status } = useSession();
  useEffect(() => {
    analytics.page();
  }, [asPath]);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') {
      analytics.identify(
        session.user.id!,
        {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          anon: getAnonId()!,
          ip: hasCookies ? getCookie('current-ip') : null,
        },
        () => console.log('Identified user')
      );
    } else if (status === 'unauthenticated') {
      const ip = hasCookies ? getCookie('current-ip') : null;
      const anon = getAnonId();
      analytics.identify(anon!, { ip }, () =>
        console.log('Identified anon user', anon, ip)
      );
    }

    // @TODO: create new random user using shortname
  }, [session, status]);

  return null;
};
