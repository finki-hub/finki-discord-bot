/* eslint-disable camelcase */

import { createParser } from 'eventsource-parser';
import { z } from 'zod';

import type { ChatOptions } from '../lib/schemas/Chat.js';

import { getApiKey, getChatbotUrl } from '../configuration/environment.js';
import { getConfigProperty } from '../configuration/main.js';
import { QuestionsSchema } from '../lib/schemas/Question.js';
import { logger } from '../logger.js';
import { labels } from '../translations/labels.js';
import {
  logErrorFunctions,
  logMessageFunctions,
} from '../translations/logs.js';

export const sendPrompt = async (
  chatOptions: ChatOptions,
  onChunk: (chunk: string) => void,
) => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    throw new Error('LLM_UNAVAILABLE');
  }

  const models = getConfigProperty('models');

  const res = await fetch(`${chatbotUrl}/chat/`, {
    body: JSON.stringify({
      embeddings_model: chatOptions.embeddingsModel ?? models.embeddings,
      inference_model: chatOptions.inferenceModel ?? models.inference,
      max_tokens: chatOptions.maxTokens,
      prompt: chatOptions.query,
      temperature: chatOptions.temperature,
      top_p: chatOptions.topP,
    }),
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!res.ok || !res.body) {
    throw new Error('LLM_UNAVAILABLE');
  }

  const parser = createParser({
    onEvent: (event) => {
      const restoredChunk = event.data.replaceAll(String.raw`\n`, '\n');
      onChunk(restoredChunk);
    },
  });

  const reader: ReadableStreamDefaultReader<Uint8Array> = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const decoded = decoder.decode(value, { stream: true });
    parser.feed(decoded);
  }

  logger.info(logMessageFunctions.promptAnswered(chatOptions.query));
};

export const getClosestQuestions = async (
  query: string,
  embeddingsModel?: string,
  threshold?: number,
  limit?: number,
) => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  const models = getConfigProperty('models');

  const url = new URL(`${chatbotUrl}/questions/closest`);
  url.searchParams.append('prompt', query);

  const model = embeddingsModel ?? models.embeddings;
  if (model !== undefined) {
    url.searchParams.append('model', model);
  }

  if (threshold !== undefined) {
    url.searchParams.append('threshold', threshold.toString());
  }

  if (limit !== undefined) {
    url.searchParams.append('limit', limit.toString());
  }

  try {
    const result = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!result.ok || !result.body || result.status !== 200) {
      return null;
    }

    const data = QuestionsSchema.parse(await result.json());
    return data;
  } catch (error) {
    logger.error(logErrorFunctions.closestQuestionsError(error));
    return null;
  }
};

export const getSupportedModels = async () => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  try {
    const result = await fetch(`${chatbotUrl}/chat/models`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!result.ok || !result.body || result.status !== 200) {
      return null;
    }

    const data = await result.json();
    return z.array(z.string()).parse(data);
  } catch (error) {
    logger.error(logErrorFunctions.supportedModelsError(error));
    return null;
  }
};

export const FillProgressSchema = z.object({
  id: z.string(),
  index: z.number(),
  name: z.string(),
  status: z.string(),
  total: z.number(),
  ts: z.string(),
});

export const sendFillEmbeddings = async (
  embeddingsModel: string,
  all: boolean,
  onChunk: (chunk: string) => void,
) => {
  const chatbotUrl = getChatbotUrl();
  const apiKey = getApiKey();

  if (chatbotUrl === null || apiKey === null) {
    throw new Error('LLM_UNAVAILABLE');
  }

  const res = await fetch(`${chatbotUrl}/questions/fill`, {
    body: JSON.stringify({
      all,
      model: embeddingsModel,
    }),
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    method: 'POST',
  });

  if (!res.ok || !res.body || res.status !== 200) {
    throw new Error('LLM_UNAVAILABLE');
  }

  const parser = createParser({
    onEvent: (event) => {
      onChunk(event.data);
    },
  });

  let hasChunks = false;

  const reader: ReadableStreamDefaultReader<Uint8Array> = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    hasChunks = true;
    parser.feed(decoder.decode(value, { stream: true }));
  }

  if (!hasChunks) {
    parser.feed(`data: ${labels.none}\n\n`);
  }

  logger.info(logMessageFunctions.fillEmbeddingsCompleted(embeddingsModel));
};
