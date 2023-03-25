import type { NextPage } from 'next';

import { MinimalLayout } from '@/components';
import { TermsAndConditions } from '@/components/v1/_scaffold/legal';

const Privacy: NextPage = () => {
  return (
    <MinimalLayout title="Terms and Conditions">
      <TermsAndConditions />
    </MinimalLayout>
  );
};

export default Privacy;
