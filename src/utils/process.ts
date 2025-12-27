import { logger } from '../logger.js';
import { exitMessageFunctions, exitMessages } from '../translations/logs.js';
import { sendErrorToWebhook } from './webhooks.js';

const shutdown = () => {
  logger.info(exitMessages.shutdownGracefully);

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

  process.on('beforeExit', () => {
    logger.info(exitMessages.beforeExit);
  });

  process.on('exit', () => {
    logger.info(exitMessages.goodbye);
  });
};
