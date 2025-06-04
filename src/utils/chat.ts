/* eslint-disable camelcase */

import { getChatbotUrl } from '../configuration/environment.js';
import { getConfigProperty } from '../configuration/main.js';
import { QuestionsSchema } from '../lib/schemas/Question.js';
import { logger } from '../logger.js';
import {
  logErrorFunctions,
  logMessageFunctions,
} from '../translations/logs.js';

export const sendPrompt = async (
  query: string,
  onChunk?: (chunk: string) => void,
) => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  const models = getConfigProperty('models');

  try {
    const result = await fetch(`${chatbotUrl}/chat/`, {
      body: JSON.stringify({
        embeddings_model: models.embeddings,
        inference_model: models.inference,
        question: query,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!result.ok || !result.body || result.status !== 200) {
      return null;
    }

    const reader: ReadableStreamDefaultReader<Uint8Array> =
      result.body.getReader();
    const decoder = new TextDecoder();
    let answer = '';
    let done = false;

    while (!done) {
      const { done: doneReading, value } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        answer += chunk;
        onChunk?.(chunk);
      }
    }

    logger.info(logMessageFunctions.promptAnswered(answer));
    return answer;
  } catch (error) {
    logger.error(logErrorFunctions.promptError(error));
    return null;
  }
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
