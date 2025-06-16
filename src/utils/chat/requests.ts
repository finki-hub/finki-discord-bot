import { createParser } from 'eventsource-parser';
import { z } from 'zod';

import type {
  ClosestQuestionsOptions,
  FillEmbeddingsOptions,
  SendPromptOptions,
  UnembeddedQuestionsOptions,
} from '../../lib/schemas/Chat.js';

import { getApiKey, getChatbotUrl } from '../../configuration/environment.js';
import { QuestionsSchema } from '../../lib/schemas/Question.js';
import { logger } from '../../logger.js';
import { labels } from '../../translations/labels.js';
import {
  logErrorFunctions,
  logMessageFunctions,
} from '../../translations/logs.js';
import { sanitizeOptions } from './utils.js';

export const sendPrompt = async (
  options: SendPromptOptions,
  onChunk: (chunk: string) => void,
) => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    throw new Error('LLM_UNAVAILABLE');
  }

  const result = await fetch(`${chatbotUrl}/chat/`, {
    body: JSON.stringify(sanitizeOptions(options)),
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!result.ok || !result.body || result.status !== 200) {
    throw new Error('LLM_UNAVAILABLE');
  }

  const parser = createParser({
    onEvent: (event) => {
      const restoredChunk = event.data.replaceAll(String.raw`\n`, '\n');
      onChunk(restoredChunk);
    },
  });

  const reader: ReadableStreamDefaultReader<Uint8Array> =
    result.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const decoded = decoder.decode(value, { stream: true });
    parser.feed(decoded);
  }

  logger.info(logMessageFunctions.promptAnswered(options.prompt));
};

export const getClosestQuestions = async (options: ClosestQuestionsOptions) => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  const url = new URL(`${chatbotUrl}/questions/closest`);

  const sanitizedOptions = sanitizeOptions(options);

  for (const [key, value] of Object.entries(sanitizedOptions)) {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
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

export const fillEmbeddings = async (
  options: FillEmbeddingsOptions,
  onChunk: (chunk: string) => void,
) => {
  const chatbotUrl = getChatbotUrl();
  const apiKey = getApiKey();

  if (chatbotUrl === null || apiKey === null) {
    throw new Error('LLM_UNAVAILABLE');
  }

  const result = await fetch(`${chatbotUrl}/questions/fill`, {
    body: JSON.stringify(sanitizeOptions(options)),
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    method: 'POST',
  });

  if (!result.ok || !result.body || result.status !== 200) {
    throw new Error('LLM_UNAVAILABLE');
  }

  const parser = createParser({
    onEvent: (event) => {
      onChunk(event.data);
    },
  });

  let hasChunks = false;

  const reader: ReadableStreamDefaultReader<Uint8Array> =
    result.body.getReader();
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

  logger.info(
    logMessageFunctions.fillEmbeddingsCompleted(
      options.embeddings_model ?? 'ALL',
    ),
  );
};

export const getUnembeddedQuestions = async (
  options: UnembeddedQuestionsOptions,
) => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  const url = new URL(`${chatbotUrl}/questions/unfilled`);

  const sanitizedOptions = sanitizeOptions(options);

  for (const [key, value] of Object.entries(sanitizedOptions)) {
    if (value !== undefined) {
      url.searchParams.append(key, value);
    }
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
    logger.error(logErrorFunctions.unembeddedQuestionsError(error));
    return null;
  }
};
