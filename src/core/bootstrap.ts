import { config } from 'dotenv';

import { logger } from '@/common/logger/index.js';
import { reloadConfig } from '@/configuration/bot/index.js';
import { reloadData } from '@/configuration/data/index.js';
import { getToken } from '@/configuration/environment.js';

import { client } from './client.js';
import { registerCommands } from './commands/modules.js';
import { attachEventListeners } from './utils/events.js';
import { initializeModules } from './utils/modules.js';
import { attachProcessListeners } from './utils/process.js';

export const bootstrap = async () => {
  logger.info('Starting bot initialization...');

  config();
  logger.debug('Environment variables loaded');

  await Promise.all([reloadConfig(), reloadData()]);
  logger.debug('Configuration and data files loaded');

  attachProcessListeners();
  logger.debug('Process listeners attached');

  await initializeModules();
  logger.debug('Modules initialized');

  await registerCommands();
  logger.debug('Commands registered');

  await attachEventListeners();
  logger.debug('Event listeners attached');

  logger.info('Attempting to login to Discord...');
  try {
    await client.login(getToken());
  } catch (error) {
    const errorMessage = `Failed logging in\n${String(error)}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};
