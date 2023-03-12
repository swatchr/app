import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { getAnonId } from '@/utils';
import { api } from '@/utils/api';
import { analytics } from 'lib/analytics';

interface IAnalytics {
  asPath: string;
}

export const CustomAnalytics: React.FC<IAnalytics> = ({ asPath }) => {
  const { data: session, status } = useSession();
  const { data: ip } = api.server.ip.useQuery();
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
          ip: ip,
        },
        () => console.log('Identified user')
      );
    } else if (status === 'unauthenticated') {
      const anon = getAnonId();
      analytics.identify(anon!, { ip }, () =>
        console.log('Identified anon user', anon, ip)
      );
    }

    // @TODO: create new random user using shortname
  }, [session, status, ip]);

  return null;
};
