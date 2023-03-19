import { TRPCError } from '@trpc/server';
import { ZodError } from 'zod';

import type { DefaultErrorShape } from '@trpc/server';

export const formatTRPCError = (error: TRPCError, shape: DefaultErrorShape) => {
  return {
    ...shape,
    data: {
      ...shape.data,
      zodError:
        error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
          ? error.cause.flatten()
          : null,
    },
  };
};

export const handleServerError = (
  e: Error | any,
  code: TRPCError['code'],
  msg?: string
) => {
  console.error('An unexpected error occurred, please try again later.', e);
  throw new TRPCError({
    code: code ?? 'INTERNAL_SERVER_ERROR',
    message:
      msg ||
      e?.message ||
      'An unexpected error occurred, please try again later.',
    cause: e,
  });
};
