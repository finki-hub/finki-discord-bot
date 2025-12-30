import { Cron } from 'croner';

import { logger } from '@/common/logger/index.js';
import { getDataStorageUrl } from '@/configuration/environment.js';
import { type Room, RoomSchema } from '@/modules/room/schemas/Room.js';

import { clearTransformedRooms } from './cache.js';

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

let rooms: Room[] = [];
let reloadCron: Cron | null = null;

export const reloadRooms = async () => {
  const baseUrl = getDataStorageUrl();

  if (!baseUrl) {
    logger.warn('DATA_STORAGE_URL not configured, room data loading disabled');
    return;
  }

  try {
    const roomsUrl = `${baseUrl}/rooms.json`;

    const roomsRaw = await fetchJsonFromUrl(roomsUrl).catch(
      (error: unknown) => {
        logger.error(
          `Failed fetching rooms from data storage\n${String(error)}`,
        );
        throw error;
      },
    );

    const roomsData = parseContent(roomsRaw);
    const roomsParsed = await RoomSchema.array()
      .parseAsync(roomsData)
      .catch((error: unknown) => {
        logger.error(`Failed parsing rooms data\n${String(error)}`);
        throw error;
      });

    rooms = roomsParsed;
    clearTransformedRooms();
    logger.info('Rooms data reloaded from data storage');
  } catch (error) {
    logger.error(`Failed reloading rooms\n${String(error)}`);
    throw error;
  }
};

export const startPeriodicReload = () => {
  const baseUrl = getDataStorageUrl();

  if (!baseUrl) {
    logger.debug(
      'DATA_STORAGE_URL not configured, periodic room reload disabled',
    );
    return;
  }

  if (reloadCron) {
    reloadCron.stop();
  }

  // Reload every hour
  reloadCron = new Cron('0 * * * *', () => {
    logger.info('Starting scheduled rooms reload from data storage...');
    reloadRooms().catch((error: unknown) => {
      logger.error(`Scheduled rooms reload failed\n${String(error)}`);
    });
  });

  logger.info('Periodic rooms reload scheduled (every hour)');
};

export const getRooms = (): Room[] => rooms;
