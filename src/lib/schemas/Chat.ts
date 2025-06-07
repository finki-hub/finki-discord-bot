/* eslint-disable camelcase */

import { z } from 'zod';

export const SendPromptOptionsSchema = z
  .object({
    embeddingsModel: z.string().optional(),
    inferenceModel: z.string().optional(),
    maxTokens: z.number().min(1).max(4_096).optional(),
    prompt: z.string().min(1, 'Query must not be empty'),
    systemPrompt: z.string().optional(),
    temperature: z.number().min(0).max(1).optional(),
    topP: z.number().min(0).max(1).optional(),
  })
  .transform((data) => ({
    embeddings_model: data.embeddingsModel,
    inference_model: data.inferenceModel,
    max_tokens: data.maxTokens,
    prompt: data.prompt,
    system_prompt: data.systemPrompt,
    temperature: data.temperature,
    top_p: data.topP,
  }));

export type SendPromptOptions = z.infer<typeof SendPromptOptionsSchema>;

export const ClosestQuestionsOptionsSchema = z
  .object({
    embeddingsModel: z.string().optional(),
    limit: z.number().min(1).max(100).optional(),
    prompt: z.string().min(1, 'Query must not be empty'),
    threshold: z.number().min(0).max(1).optional(),
  })
  .transform((data) => ({
    embeddings_model: data.embeddingsModel,
    limit: data.limit,
    prompt: data.prompt,
    threshold: data.threshold,
  }));

export type ClosestQuestionsOptions = z.infer<
  typeof ClosestQuestionsOptionsSchema
>;

export const FillProgressSchema = z.object({
  error: z.string(),
  id: z.string(),
  index: z.number(),
  model: z.string(),
  name: z.string(),
  status: z.string(),
  total: z.number(),
  ts: z.string(),
});

export const FillEmbeddingsOptionsSchema = z
  .object({
    allModels: z.boolean().optional(),
    allQuestions: z.boolean().optional(),
    embeddingsModel: z.string().optional(),
    questions: z
      .array(z.string().min(1, 'Question must not be empty'))
      .optional(),
  })
  .transform((data) => ({
    all_models: data.allModels,
    all_questions: data.allQuestions,
    embeddings_model: data.embeddingsModel,
    questions: data.questions?.length ? data.questions : undefined,
  }));

export type FillEmbeddingsOptions = z.infer<typeof FillEmbeddingsOptionsSchema>;

export const UnembeddedQuestionsOptionsSchema = z
  .object({
    embeddingsModel: z.string().optional(),
  })
  .transform((data) => ({
    embeddings_model: data.embeddingsModel,
  }));

export type UnembeddedQuestionsOptions = z.infer<
  typeof UnembeddedQuestionsOptionsSchema
>;
