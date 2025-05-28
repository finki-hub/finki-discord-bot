import { z } from 'zod';

export const AdSchema = z.object({
  channels: z.array(z.string()),
  content: z.string(),
  cron: z.string(),
  dedupeAds: z.boolean().optional().default(true),
  expiry: z.string().optional(),
  name: z.string(),
});

export type Ad = z.infer<typeof AdSchema>;
