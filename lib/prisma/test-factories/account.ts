import { Prisma } from '@prisma/client';
import crypto from 'crypto';

import { addDays, dateToSeconds } from '../../../src/utils';

type TestAccount = Prisma.AccountCreateArgs['data'];

export const createTestUserAccount = ({
  type = 'simple',
  provider = 'credentials',
  providerAccountId = crypto.randomUUID(),
  access_token = crypto.randomUUID(),
  expires_at = dateToSeconds(addDays(new Date(), 2)),
  token_type = 'bearer',
  scope = '',
  id_token = crypto.randomUUID(),
}: TestAccount): Partial<TestAccount> => ({
  type,
  provider,
  providerAccountId,
  access_token,
  expires_at,
  token_type,
  scope,
  id_token,
});
