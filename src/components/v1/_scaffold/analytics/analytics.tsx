import { analytics } from 'lib/analytics';
import { useEffect } from 'react';

import { chakra } from '@chakra-ui/react';

interface IAnalytics {
  asPath: string;
  children: React.ReactNode;
}

export const Analytics: React.FC<IAnalytics> = ({ asPath, children }) => {
  useEffect(() => {
    analytics.page();
  }, [asPath]);

  return <chakra.div>{children}</chakra.div>;
};
