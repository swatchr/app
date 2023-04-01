import type { NextPage } from 'next';

import { MinimalLayout } from '@/components';
import { Disclaimer } from '@/components/v1/_scaffold/legal';

const DisclaimerPage: NextPage = () => {
  return (
    <MinimalLayout title="Privacy Policy">
      <Disclaimer />
    </MinimalLayout>
  );
};

export default DisclaimerPage;
