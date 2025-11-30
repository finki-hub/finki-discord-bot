/* eslint-disable n/prefer-global/process */

import { env } from 'node:process';
import { z } from 'zod';

import { configErrors } from '../translations/errors.js';

export const getToken = () => {
  try {
    return z.string().parse(env['TOKEN']);
  } catch {
    throw new Error(configErrors.noToken);
  }
};

export const getApplicationId = () => {
  try {
    return z.string().parse(env['APPLICATION_ID']);
  } catch {
    throw new Error(configErrors.noApplicationId);
  }
};

export const getDatabaseUrl = () => {
  try {
    return z.string().parse(env['DATABASE_URL']);
  } catch {
    throw new Error(configErrors.noDatabaseUrl);
  }
};

export const getChatbotUrl = () => {
  try {
    return z
      .string()
      .transform((url) => (url.endsWith('/') ? url.slice(0, -1) : url))
      .parse(env['CHATBOT_URL']);
  } catch {
    return null;
  }
};

export const getAnalyticsUrl = () => {
  try {
    return z
      .string()
      .transform((url) => (url.endsWith('/') ? url.slice(0, -1) : url))
      .parse(env['ANALYTICS_URL']);
  } catch {
    return null;
  }
};

export const getApiKey = () => {
  try {
    return z.string().parse(env['API_KEY']);
  } catch {
    return null;
  }
};

export const getAocUrl = () => {
  try {
    return z.string().parse(env['AOC_URL']);
  } catch {
    return null;
  }
};

export const getAocApiKey = () => {
  try {
    return z.string().parse(env['AOC_API_KEY']);
  } catch {
    return null;
  }
};
