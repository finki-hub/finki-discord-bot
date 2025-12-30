import { z } from 'zod';

import { AwaitableVoid, createAsyncFunctionSchema } from './utils.js';

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
