/* eslint-disable camelcase */

import { z } from 'zod';

export const UsageEventSchema = z
  .object({
    eventType: z.string().min(1),
    metadata: z.record(z.string(), z.any()).optional(),
    payload: z.record(z.string(), z.any()),
  })
  .transform((data) => ({
    event_type: data.eventType,
    metadata: data.metadata,
    payload: data.payload,
  }));

export type UsageEvent = z.infer<typeof UsageEventSchema>;

export const IngestResponseSchema = z.object({
  event_id: z.string(),
  event_type: z.string(),
  inserted_id: z.string(),
  status: z.literal('ok'),
});

export type IngestResponse = z.infer<typeof IngestResponseSchema>;
