import z from 'zod';

export const FillEvent = z.object({
  id: z.string(),
  index: z.number(),
  name: z.string(),
  status: z.string(),
  total: z.number(),
  ts: z.string(),
});
