import { z } from 'zod';

export const ChatOptionsSchema = z.object({
  embeddingsModel: z.string().optional(),
  inferenceModel: z.string().optional(),
  maxTokens: z.number().min(1).max(4_096).optional(),
  query: z.string().min(1, 'Query must not be empty'),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
  topP: z.number().min(0).max(1).optional(),
});

export type ChatOptions = z.infer<typeof ChatOptionsSchema>;
