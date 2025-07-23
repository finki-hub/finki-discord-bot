import { z } from 'zod';

const AwaitableVoid = z.union([z.void(), z.promise(z.void())]);

const createAsyncFunctionSchema = <T extends z.core.$ZodFunction>(schema: T) =>
  z.custom<Parameters<T['implementAsync']>[0]>((fn) =>
    schema.implementAsync(fn as Parameters<T['implementAsync']>[0]),
  );

export const ClientEventSchema = z.object({
  execute: createAsyncFunctionSchema(
    z.function({
      input: [z.unknown()],
      output: AwaitableVoid,
    }),
  ),
  name: z.string(),
  once: z.boolean().optional(),
});
