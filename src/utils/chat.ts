import { z } from 'zod';

import { getChatbotUrl } from '../configuration/environment.js';
import { logger } from '../logger.js';
import { logMessageFunctions } from '../translations/logs.js';

export const sendPrompt = async (query: string) => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  const result = await fetch(`${chatbotUrl}/chat`, {
    body: JSON.stringify({
      model: 'llama3.3:70b',
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
};
