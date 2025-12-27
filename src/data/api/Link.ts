import { z } from 'zod';

import { getChatbotUrl } from '../../configuration/environment.js';
import { LinkSchema, LinksSchema } from '../../lib/schemas/Link.js';
import { logger } from '../../logger.js';
import { databaseErrorFunctions } from '../../translations/database.js';

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
    logger.error(databaseErrorFunctions.getLinksError(error));

    return null;
  }
};

export const getLinkNames = async () => {
  const chatbotUrl = getChatbotUrl();

  if (chatbotUrl === null) {
    return null;
  }

  try {
    const result = await fetch(`${chatbotUrl}/links/names`);

    if (!result.ok) {
      return null;
    }

    return z.array(z.string()).parse(await result.json());
  } catch (error) {
    logger.error(databaseErrorFunctions.getLinkNamesError(error));

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
    logger.error(databaseErrorFunctions.getLinkError(error));

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
    logger.error(databaseErrorFunctions.getNthLinkError(error));

    return null;
  }
};
