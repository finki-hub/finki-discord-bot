import { database } from '../data/database/connection.js';
import { logger } from '../logger.js';
import { exitMessageFunctions, exitMessages } from '../translations/logs.js';
import { sendErrorToWebhook } from './webhooks.js';

const shutdown = async () => {
  logger.info(exitMessages.shutdownGracefully);

  try {
    await database.$disconnect();
    logger.info(exitMessages.databaseConnectionClosed);
  } catch (error) {
    logger.error(exitMessageFunctions.databaseConnectionError(error));
  }

  // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
  process.exit(0);
};

const logErrorToWebhook = async (thrownError?: Error) => {
  try {
    await sendErrorToWebhook(
      thrownError
        ? exitMessageFunctions.shutdownWithError(thrownError.message)
        : exitMessages.shutdownGracefully,
    );
  } catch {
    // Do nothing
  }
};

export const attachProcessListeners = () => {
  process.on('SIGINT', () => shutdown());

  process.on('SIGTERM', () => shutdown());

  process.on('uncaughtException', async (error) => {
    await logErrorToWebhook(error);
  });

  process.on('warning', (warning) => {
    logger.warn(warning);
  });

  process.on('beforeExit', async () => {
    logger.info(exitMessages.beforeExit);
    await database.$disconnect();
  });

  process.on('exit', () => {
    logger.info(exitMessages.goodbye);
  });
};
