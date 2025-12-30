import { z } from 'zod';

export const AwaitableVoid = z.union([z.void(), z.promise(z.void())]);

export const createAsyncFunctionSchema = <T extends z.core.$ZodFunction>(
  schema: T,
) =>
  z.custom<Parameters<T['implementAsync']>[0]>((fn) =>
    schema.implementAsync(fn as Parameters<T['implementAsync']>[0]),
  );
