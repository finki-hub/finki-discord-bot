import { z } from 'zod';

import { logger } from '@/common/logger/index.js';
import { getChatbotUrl } from '@/configuration/environment.js';
import { apiErrorFunctions } from '@/translations/api.js';

import { LinkSchema, LinksSchema } from '../schemas/Link.js';
import { QuestionSchema, QuestionsSchema } from '../schemas/Question.js';

const CACHE_TTL = 60 * 1_000;
const MAX_FETCH_TIMEOUT = 2_000;

let questionNamesCache: null | {
  data: null | string[];
  timestamp: number;
} = null;

let linkNamesCache: null | {
  data: null | string[];
  timestamp: number;
} = null;

const fetchWithTimeout = async (
  url: string,
  timeout: number = MAX_FETCH_TIMEOUT,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
};

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

export const getQuestionNames = async (useCache = true) => {
  if (useCache && questionNamesCache !== null) {
    const age = Date.now() - questionNamesCache.timestamp;
    if (age < CACHE_TTL && questionNamesCache.data !== null) {
      return questionNamesCache.data;
    }
  }

  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    if (questionNamesCache !== null && questionNamesCache.data !== null) {
      return questionNamesCache.data;
    }
    return null;
  }

  try {
    const result = await fetchWithTimeout(
      `${chatbotUrl}/questions/names`,
      MAX_FETCH_TIMEOUT,
    );

    if (!result.ok) {
      if (questionNamesCache !== null && questionNamesCache.data !== null) {
        return questionNamesCache.data;
      }
      return null;
    }

    const data = z.array(z.string()).parse(await result.json());

    questionNamesCache = {
      data,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    logger.error(apiErrorFunctions.getQuestionNamesError(error));

    if (questionNamesCache !== null && questionNamesCache.data !== null) {
      return questionNamesCache.data;
    }

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

export const getLinks = async () => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  try {
    const result = await fetch(`${chatbotUrl}/links/list`);

    if (!result.ok) {
      return null;
    }

    return LinksSchema.parse(await result.json());
  } catch (error) {
    logger.error(apiErrorFunctions.getLinksError(error));

    return null;
  }
};

export const getLinkNames = async (useCache = true) => {
  if (useCache && linkNamesCache !== null) {
    const age = Date.now() - linkNamesCache.timestamp;
    if (age < CACHE_TTL && linkNamesCache.data !== null) {
      return linkNamesCache.data;
    }
  }

  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    if (linkNamesCache !== null && linkNamesCache.data !== null) {
      return linkNamesCache.data;
    }
    return null;
  }

  try {
    const result = await fetchWithTimeout(
      `${chatbotUrl}/links/names`,
      MAX_FETCH_TIMEOUT,
    );

    if (!result.ok) {
      if (linkNamesCache !== null && linkNamesCache.data !== null) {
        return linkNamesCache.data;
      }
      return null;
    }

    const data = z.array(z.string()).parse(await result.json());

    linkNamesCache = {
      data,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    logger.error(apiErrorFunctions.getLinkNamesError(error));

    if (linkNamesCache !== null && linkNamesCache.data !== null) {
      return linkNamesCache.data;
    }

    return null;
  }
};

export const getLink = async (name?: string) => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  if (name === undefined) {
    return null;
  }

  try {
    const result = await fetch(`${chatbotUrl}/links/name/${name}`);

    if (!result.ok) {
      return null;
    }

    return LinkSchema.parse(await result.json());
  } catch (error) {
    logger.error(apiErrorFunctions.getLinkError(error));

    return null;
  }
};

export const getNthLink = async (index?: number) => {
  const chatbotUrl = getChatbotUrl();

  if (index === undefined) {
    return null;
  }

  try {
    const result = await fetch(`${chatbotUrl}/links/nth/${index}`);

    if (!result.ok) {
      return null;
    }

    return LinkSchema.parse(await result.json());
  } catch (error) {
    logger.error(apiErrorFunctions.getNthLinkError(error));

    return null;
  }
};
