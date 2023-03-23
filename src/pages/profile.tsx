import { useSession } from 'next-auth/react';

import type { NextPage } from 'next';

import { api } from '@/utils/api';

// @TODO: build out profile page

const ProfilePage: NextPage = () => {
  const { data: session, status } = useSession();

  const { data } = api.profile.me.useQuery(
    {},
    { enabled: !!session && status === 'authenticated' }
  );

  return <>{JSON.stringify(data)}</>;
};

export default ProfilePage;
