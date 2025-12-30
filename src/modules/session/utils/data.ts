import { Cron } from 'croner';
import { z } from 'zod';

import { logger } from '@/common/logger/index.js';
import { fetchJsonFromUrl, parseContent } from '@/common/utils/data.js';
import { getDataStorageUrl } from '@/configuration/environment.js';

import { clearTransformedSessions } from './cache.js';

let sessions: Record<string, string> = {};
let reloadCron: Cron | null = null;

export const reloadSessions = async () => {
  const baseUrl = getDataStorageUrl();

  if (!baseUrl) {
    logger.warn(
      'DATA_STORAGE_URL not configured, session data loading disabled',
    );

    return;
  }

  try {
    const sessionsUrl = `${baseUrl}/sessions.json`;

    const sessionsRaw = await fetchJsonFromUrl(sessionsUrl).catch(
      (error: unknown) => {
        logger.error(
          `Failed fetching sessions from data storage\n${String(error)}`,
        );
        throw error;
      },
    );

    const sessionsData = parseContent(sessionsRaw, {});
    const sessionsParsed = await z
      .record(z.string(), z.string())
      .parseAsync(sessionsData)
      .catch((error: unknown) => {
        logger.error(`Failed parsing sessions data\n${String(error)}`);
        throw error;
      });

    sessions = sessionsParsed;
    clearTransformedSessions();
    logger.info('Sessions data reloaded from data storage');
  } catch (error: unknown) {
    logger.error(`Failed reloading sessions\n${String(error)}`);
    throw error;
  }
};

export const startPeriodicReload = () => {
  const baseUrl = getDataStorageUrl();

  if (!baseUrl) {
    logger.debug(
      'DATA_STORAGE_URL not configured, periodic session reload disabled',
    );

    return;
  }

  if (reloadCron) {
    reloadCron.stop();
  }

  // Reload every hour
  reloadCron = new Cron('0 * * * *', () => {
    logger.info('Starting scheduled sessions reload from data storage...');
    reloadSessions().catch((error: unknown) => {
      logger.error(`Scheduled sessions reload failed\n${String(error)}`);
    });
  });

  logger.info('Periodic sessions reload scheduled (every hour)');
};

export const getSessions = (): Record<string, string> => sessions;
