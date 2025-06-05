/* eslint-disable camelcase */

import type { ChatOptions } from '../lib/schemas/Chat.js';

import { getChatbotUrl } from '../configuration/environment.js';
import { getConfigProperty } from '../configuration/main.js';
import { QuestionsSchema } from '../lib/schemas/Question.js';
import { logger } from '../logger.js';
import {
  logErrorFunctions,
  logMessageFunctions,
} from '../translations/logs.js';

export const sendPrompt = async (
  chatOptions: ChatOptions,
  onChunk?: (chunk: string) => void,
) => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return;
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
    return;
  }

  const reader: ReadableStreamDefaultReader<Uint8Array> = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const sseRe = /data:\s?(?<chunk>.*)\r?\n\r?\n/gu;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let match;
    while ((match = sseRe.exec(buffer)) !== null) {
      const chunk = match.groups?.['chunk'] ?? '';
      onChunk?.(chunk);
    }

    const lastDelim = buffer.lastIndexOf('\n\n');
    if (lastDelim !== -1) {
      buffer = buffer.slice(lastDelim + 2);
      sseRe.lastIndex = 0;
    }
  }

  if (buffer.startsWith('data:')) {
    const tail = buffer.replace(/^data:\s?/u, '');
    onChunk?.(tail);
  }

  logger.info(logMessageFunctions.promptAnswered(chatOptions.query));
};

export const getClosestQuestions = async (query: string) => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  const models = getConfigProperty('models');

  const url = new URL(`${chatbotUrl}/questions/closest`);
  url.searchParams.append('prompt', query);
  if (models.embeddings !== undefined) {
    url.searchParams.append('model', models.embeddings);
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
