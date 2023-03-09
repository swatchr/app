import type { Prisma } from '@prisma/client';

import { addDays } from '../../../src/utils';
import { hashPassword } from '../../next-auth';

type TestUser = Prisma.UserCreateArgs['data'];

export const createTestUser = ({
  email = process.env.TEST_USER,
  name = 'e2e',
  password = process.env.TEST_PW,
  image = '',
  emailVerified = addDays(new Date(), -3),
  roleType = 'test',
}: Partial<TestUser>): TestUser => ({
  email,
  name,
  password: hashPassword(String(password)),
  image,
  emailVerified,
  roleType,
});
