import { z } from 'zod';

import { getApiKey, getChatbotUrl } from '../../configuration/environment.js';
import {
  type CreateQuestion,
  PreparedCreateQuestionSchema,
  PreparedUpdateQuestionSchema,
  QuestionSchema,
  QuestionsSchema,
  type UpdateQuestion,
} from '../../lib/schemas/Question.js';
import { logger } from '../../logger.js';
import { databaseErrorFunctions } from '../../translations/database.js';

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
    logger.error(databaseErrorFunctions.getQuestionsError(error));

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
    logger.error(databaseErrorFunctions.getQuestionNamesError(error));

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
    logger.error(databaseErrorFunctions.getQuestionError(error));

    return null;
  }
};

export const createQuestion = async (question?: CreateQuestion) => {
  const chatbotUrl = getChatbotUrl();
  const apiKey = getApiKey();

  if (chatbotUrl === null || apiKey === null) {
    return null;
  }

  if (question === undefined) {
    return null;
  }

  try {
    const result = await fetch(`${chatbotUrl}/questions`, {
      body: JSON.stringify(PreparedCreateQuestionSchema.parse(question)),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      method: 'POST',
    });

    if (!result.ok) {
      return null;
    }

    return QuestionSchema.parse(await result.json());
  } catch (error) {
    logger.error(databaseErrorFunctions.createQuestionError(error));

    return null;
  }
};

export const updateQuestion = async (
  name?: string,
  question?: UpdateQuestion,
) => {
  const chatbotUrl = getChatbotUrl();
  const apiKey = getApiKey();

  if (chatbotUrl === null || apiKey === null) {
    return null;
  }

  if (name === undefined || question === undefined) {
    return null;
  }

  try {
    const result = await fetch(`${chatbotUrl}/questions/${name}`, {
      body: JSON.stringify(PreparedUpdateQuestionSchema.parse(question)),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      method: 'PUT',
    });

    if (!result.ok) {
      return null;
    }

    return QuestionSchema.parse(await result.json());
  } catch (error) {
    logger.error(databaseErrorFunctions.updateQuestionError(error));

    return null;
  }
};

export const deleteQuestion = async (name?: string) => {
  const chatbotUrl = getChatbotUrl();
  const apiKey = getApiKey();

  if (chatbotUrl === null || apiKey === null) {
    return null;
  }

  if (name === undefined) {
    return null;
  }

  try {
    const result = await fetch(`${chatbotUrl}/questions/${name}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      method: 'DELETE',
    });

    if (!result.ok) {
      return null;
    }

    return QuestionSchema.parse(await result.json());
  } catch (error) {
    logger.error(databaseErrorFunctions.deleteQuestionError(error));

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
    logger.error(databaseErrorFunctions.getNthQuestionError(error));

    return null;
  }
};
