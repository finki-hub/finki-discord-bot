import { Cron } from 'croner';

import { logger } from '@/common/logger/index.js';
import { getDataStorageUrl } from '@/configuration/environment.js';

import { type Staff, StaffSchema } from '../schemas/Staff.js';
import { clearTransformedProfessors } from './cache.js';

const parseContent = (content: string, fallback: unknown = []): unknown => {
  if (content.length === 0) {
    return fallback;
  }

  return JSON.parse(content);
};

const fetchJsonFromUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }
  return response.text();
};

let staff: Staff[] = [];
let reloadCron: Cron | null = null;

export const reloadStaff = async () => {
  const baseUrl = getDataStorageUrl();

  if (!baseUrl) {
    logger.warn('DATA_STORAGE_URL not configured, staff data loading disabled');
    return;
  }

  try {
    const staffUrl = `${baseUrl}/staff.json`;

    const staffRaw = await fetchJsonFromUrl(staffUrl).catch(
      (error: unknown) => {
        logger.error(
          `Failed fetching staff from data storage\n${String(error)}`,
        );
        throw error;
      },
    );

    const staffData = parseContent(staffRaw);
    const staffParsed = await StaffSchema.array()
      .parseAsync(staffData)
      .catch((error: unknown) => {
        logger.error(`Failed parsing staff data\n${String(error)}`);
        throw error;
      });

    staff = staffParsed;
    clearTransformedProfessors();
    logger.info('Staff data reloaded from data storage');
  } catch (error) {
    logger.error(`Failed reloading staff\n${String(error)}`);
    throw error;
  }
};

export const startPeriodicReload = () => {
  const baseUrl = getDataStorageUrl();

  if (!baseUrl) {
    logger.debug(
      'DATA_STORAGE_URL not configured, periodic staff reload disabled',
    );
    return;
  }

  if (reloadCron) {
    reloadCron.stop();
  }

  // Reload every hour
  reloadCron = new Cron('0 * * * *', () => {
    logger.info('Starting scheduled staff reload from data storage...');
    reloadStaff().catch((error: unknown) => {
      logger.error(`Scheduled staff reload failed\n${String(error)}`);
    });
  });

  logger.info('Periodic staff reload scheduled (every hour)');
};

export const getStaff = (): Staff[] => staff;
