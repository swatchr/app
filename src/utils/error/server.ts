import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as trpc from '@trpc/server';

export function trpcPrismaErrorHandler(error: any) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new trpc.TRPCError({
        code: 'CONFLICT',
        message: 'User Already Exists.',
      });
    }
    throw new trpc.TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });
  }
  console.error(error);
}
