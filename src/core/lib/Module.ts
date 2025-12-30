import { z } from 'zod';

import {
  AwaitableVoid,
  createAsyncFunctionSchema,
} from '@/common/schemas/utils.js';

export const ModuleSchema = z.object({
  init: createAsyncFunctionSchema(
    z.function({
      input: [],
      output: AwaitableVoid,
    }),
  ),
});

export type Module = z.infer<typeof ModuleSchema>;
