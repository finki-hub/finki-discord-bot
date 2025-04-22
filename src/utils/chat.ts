import { z } from 'zod';

import { getChatbotUrl } from '../configuration/environment.js';
import { getConfigProperty } from '../configuration/main.js';
import { logger } from '../logger.js';
import {
  logErrorFunctions,
  logMessageFunctions,
} from '../translations/logs.js';

export const sendPrompt = async (query: string) => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  const model = getConfigProperty('chatBotModel');

  try {
    const result = await fetch(`${chatbotUrl}/chat`, {
      body: JSON.stringify({
        model,
        question: query,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!result.ok) {
      return null;
    }

    const data: unknown = await result.json();
    const { answer } = z
      .object({
        answer: z.string(),
      })
      .parse(data);

    logger.info(logMessageFunctions.promptAnswered(answer));

    return answer;
  } catch (error) {
    logger.error(logErrorFunctions.promptError(error));

    return null;
  }
};
