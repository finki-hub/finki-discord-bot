import {
  type EmbedBuilder,
  type GuildTextBasedChannel,
  type Interaction,
  type InteractionResponse,
  type Message,
} from 'discord.js';
import { setTimeout } from 'node:timers/promises';

import { client } from '../client.js';
import {
  getConfigProperty,
  getIntervalsProperty,
} from '../configuration/main.js';
import { type Channel } from '../lib/schemas/Channel.js';
import { logger } from '../logger.js';
import {
  logErrorFunctions,
  logMessageFunctions,
  logMessages,
} from '../translations/logs.js';

const channels: Partial<Record<Channel, GuildTextBasedChannel | undefined>> =
  {};

export const initializeChannels = async () => {
  const channelIds = getConfigProperty('channels');

  if (channelIds === undefined) {
    return;
  }

  for (const [Channel, channelId] of Object.entries(channelIds)) {
    if (channelId === undefined) {
      continue;
    }

    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel?.isTextBased() || channel.isDMBased()) {
        logger.warn(logMessageFunctions.channelNotGuildTextBased(channelId));
        return;
      }

      channels[Channel as Channel] = channel;
    } catch (error) {
      logger.error(logErrorFunctions.channelFetchError(channelId, error));
    }
  }

  logger.info(logMessages.channelsInitialized);
};

export const getChannel = (type: Channel) => channels[type];

export const logEmbed = async (
  embed: EmbedBuilder,
  interaction: Interaction,
  type: Channel,
) => {
  const channel = channels[type];

  if (!channel?.isTextBased()) {
    return;
  }

  try {
    await channel.send({
      embeds: [embed],
    });
  } catch (error) {
    logger.error(logErrorFunctions.interactionLogError(interaction.id, error));
  }
};

export const deleteResponse = async (
  message: InteractionResponse | Message,
  interval?: number,
) => {
  const ephemeralReplyInterval = getIntervalsProperty('ephemeralReply');

  await setTimeout(interval ?? ephemeralReplyInterval);

  try {
    await message.delete();
  } catch (error) {
    logger.error(logErrorFunctions.responseDeleteError(message.id, error));
  }
};
