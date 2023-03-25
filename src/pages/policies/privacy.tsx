import type { NextPage } from 'next';

import { MinimalLayout } from '@/components';
import { PrivacyPolicy } from '@/components/v1/_scaffold/legal';

const Privacy: NextPage = () => {
  return (
    <MinimalLayout title="Privacy Policy">
      <PrivacyPolicy />
    </MinimalLayout>
  );
};

export default Privacy;
