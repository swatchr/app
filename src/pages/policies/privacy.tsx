import type { NextPage } from 'next';

import { BaseLayout } from '@/components';
import { PrivacyPolicy } from '@/components/v1/_scaffold/legal';

const Privacy: NextPage = () => {
  return (
    <BaseLayout title="Privacy Policy">
      <PrivacyPolicy />
    </BaseLayout>
  );
};

export default Privacy;
