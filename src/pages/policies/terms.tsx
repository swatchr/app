import type { NextPage } from 'next';

import { BaseLayout } from '@/components';
import { TermsAndConditions } from '@/components/v1/_scaffold/legal';

const Privacy: NextPage = () => {
  return (
    <BaseLayout title="Terms and Conditions">
      <TermsAndConditions />
    </BaseLayout>
  );
};

export default Privacy;
