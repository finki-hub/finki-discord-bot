import { z } from 'zod';

import { getChatbotUrl } from '../../configuration/environment.js';
import { QuestionSchema, QuestionsSchema } from '../../lib/schemas/Question.js';
import { logger } from '../../logger.js';
import { apiErrorFunctions } from '../../translations/api.js';

export const getQuestions = async () => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  try {
    const result = await fetch(`${chatbotUrl}/questions/list`);

    if (!result.ok) {
      return null;
    }

    return QuestionsSchema.parse(await result.json());
  } catch (error) {
    logger.error(apiErrorFunctions.getQuestionsError(error));

    return null;
  }
};

export const getQuestionNames = async () => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  try {
    const result = await fetch(`${chatbotUrl}/questions/names`);

    if (!result.ok) {
      return null;
    }

    return z.array(z.string()).parse(await result.json());
  } catch (error) {
    logger.error(apiErrorFunctions.getQuestionNamesError(error));

    return null;
  }
};

export const getQuestion = async (name?: string) => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  if (name === undefined) {
    return null;
  }

  try {
    const result = await fetch(`${chatbotUrl}/questions/name/${name}`);

    if (!result.ok) {
      return null;
    }

    return QuestionSchema.parse(await result.json());
  } catch (error) {
    logger.error(apiErrorFunctions.getQuestionError(error));

    return null;
  }
};

export const getNthQuestion = async (index?: number) => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  if (index === undefined) {
    return null;
  }

  try {
    const result = await fetch(`${chatbotUrl}/questions/nth/${index}`);

    if (!result.ok) {
      return null;
    }

    return QuestionSchema.parse(await result.json());
  } catch (error) {
    logger.error(apiErrorFunctions.getNthQuestionError(error));

    return null;
  }
};
