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
    if (status === 'unauthenticated') {
      const anon = getAnonId();
      analytics.identify(
        anon!,
        {
          category: 'anon',
          label: 'anon-user',
          value: 1,
        },
        () => console.log('Identified anon user', anon, ip)
      );
    }
  }, [session, status, ip]);

  return null;
};
