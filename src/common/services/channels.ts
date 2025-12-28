import { type GuildTextBasedChannel } from 'discord.js';

import { logger } from '@/common/logger/index.js';
import { getConfigProperty } from '@/configuration/bot/index.js';
import { client } from '@/core/client.js';

import { type Channel } from '../schemas/Channel.js';

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
        logger.warn(`Channel ${channelId} is not a guild text-based channel`);
        return;
      }

      channels[Channel as Channel] = channel;
    } catch (error) {
      logger.error(`Failed fetching channel ${channelId}\n${String(error)}`);
    }
  }

  logger.info('Channels initialized');
};

export const getChannel = (type: Channel) => channels[type];
