import type { AppRouter } from '@/server';
import { TRPCClientError } from '@trpc/client';

export function isTRPCClientError(
  cause: unknown
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

export function trpcClientErrorHandler(cause: unknown) {
  if (isTRPCClientError(cause)) {
    const { data, message } = cause;
    console.log('trpcClientErrorHandler', data?.code, message);
  }
  console.log('default error handler', cause);
}
