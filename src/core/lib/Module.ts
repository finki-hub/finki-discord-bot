import { z } from 'zod';

const AwaitableVoid = z.union([z.void(), z.promise(z.void())]);

export const ModuleSchema = z.object({
  init: z.function({
    input: [],
    output: AwaitableVoid,
  }),
});

export type Module = z.infer<typeof ModuleSchema>;
