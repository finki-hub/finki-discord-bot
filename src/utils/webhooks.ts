import { type Guild } from 'discord.js';

import { getConfigProperty } from '../configuration/main.js';
import { logger } from '../logger.js';
import { labels } from '../translations/labels.js';
import { logErrorFunctions } from '../translations/logs.js';
import { getChannelFromGuild } from './guild.js';

export const getOrCreateWebhookByChannelId = async (
  channelId: string,
  guild?: Guild,
) => {
  const channel = await getChannelFromGuild(channelId, guild);

  if (channel === null || !channel.isTextBased() || channel.isThread()) {
    return null;
  }

  const webhooks = await channel.fetchWebhooks();
  const firstWebhook = webhooks.first();

  if (firstWebhook === undefined) {
    return await channel.createWebhook({
      name: labels.starboard,
    });
  }

  return firstWebhook;
};

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
