import { analytics } from 'lib/analytics';
import { useEffect } from 'react';

import { getAnonId } from '@/utils';
// @ts-expect-error: no types for cookie-cutter
import cookieCutter from 'cookie-cutter';
import { useSession } from 'next-auth/react';

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
          ip: cookieCutter.get('current-ip'),
        },
        () => console.log('Identified user')
      );
    } else if (status === 'unauthenticated') {
      const ip = cookieCutter.get('current-ip');
      const anon = getAnonId();
      analytics.identify(anon!, { ip }, () =>
        console.log('Identified anon user', anon, ip)
      );
    }

    // @TODO: create new random user using shortname
  }, [session, status]);

  return null;
};
