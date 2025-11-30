import { getAocApiKey, getAocUrl } from '../../configuration/environment.js';
import {
  AocLeaderboardSchema,
  AocProblemSchema,
  AocSubmitBonusResultSchema,
  AocSubmitResultSchema,
  type GetAocProblemOptions,
  type SubmitAocAnswerOptions,
} from '../../lib/schemas/Aoc.js';
import { logger } from '../../logger.js';
import { logErrorFunctions } from '../../translations/logs.js';

export const getAocProblem = async (options: GetAocProblemOptions) => {
  const aocUrl = getAocUrl();
  const aocApiKey = getAocApiKey();

  if (aocUrl === null || aocApiKey === null) {
    return null;
  }

  try {
    const result = await fetch(`${aocUrl}/problem`, {
      body: JSON.stringify(options),
      headers: {
        Authorization: `Bearer ${aocApiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!result.ok) {
      return null;
    }

    return AocProblemSchema.parse(await result.json());
  } catch (error) {
    logger.error(logErrorFunctions.aocProblemError(error));
    return null;
  }
};

export const submitAocAnswer = async (options: SubmitAocAnswerOptions) => {
  const aocUrl = getAocUrl();
  const aocApiKey = getAocApiKey();

  if (aocUrl === null || aocApiKey === null) {
    return null;
  }

  try {
    const result = await fetch(`${aocUrl}/submit`, {
      body: JSON.stringify(options),
      headers: {
        Authorization: `Bearer ${aocApiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!result.ok) {
      return null;
    }

    return AocSubmitResultSchema.parse(await result.json());
  } catch (error) {
    logger.error(logErrorFunctions.aocSubmitError(error));
    return null;
  }
};

export const getAocBonusProblem = async (options: GetAocProblemOptions) => {
  const aocUrl = getAocUrl();
  const aocApiKey = getAocApiKey();

  if (aocUrl === null || aocApiKey === null) {
    return null;
  }

  try {
    const result = await fetch(`${aocUrl}/problem/bonus`, {
      body: JSON.stringify(options),
      headers: {
        Authorization: `Bearer ${aocApiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!result.ok) {
      return null;
    }

    return AocProblemSchema.parse(await result.json());
  } catch (error) {
    logger.error(logErrorFunctions.aocProblemError(error));
    return null;
  }
};

export const submitAocBonusAnswer = async (options: SubmitAocAnswerOptions) => {
  const aocUrl = getAocUrl();
  const aocApiKey = getAocApiKey();

  if (aocUrl === null || aocApiKey === null) {
    return null;
  }

  try {
    const result = await fetch(`${aocUrl}/submit/bonus`, {
      body: JSON.stringify(options),
      headers: {
        Authorization: `Bearer ${aocApiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!result.ok) {
      return null;
    }

    return AocSubmitBonusResultSchema.parse(await result.json());
  } catch (error) {
    logger.error(logErrorFunctions.aocSubmitError(error));
    return null;
  }
};

export const getAocLeaderboard = async () => {
  const aocUrl = getAocUrl();
  const aocApiKey = getAocApiKey();

  if (aocUrl === null || aocApiKey === null) {
    return null;
  }

  try {
    const result = await fetch(`${aocUrl}/leaderboard`, {
      headers: {
        Authorization: `Bearer ${aocApiKey}`,
      },
    });

    if (!result.ok) {
      return null;
    }

    return AocLeaderboardSchema.parse(await result.json());
  } catch (error) {
    logger.error(logErrorFunctions.aocLeaderboardError(error));
    return null;
  }
};
