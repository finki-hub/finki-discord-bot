import { getConfigProperty } from '../configuration/main.js';
import { logger } from '../logger.js';
import { logErrorFunctions } from '../translations/logs.js';

export const sendErrorToWebhook = async (content: string) => {
  const errorWebhookUrl = getConfigProperty('errorWebhook');

  if (errorWebhookUrl === undefined) {
    return;
  }

  try {
    await fetch(errorWebhookUrl, {
      body: JSON.stringify({
        content,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  } catch (error) {
    logger.error(logErrorFunctions.webhookSendError(error));
  }
};
