import { type ClientEvents, Events, type Message } from 'discord.js';

import { logger } from '@/common/logger/index.js';
import { getCrosspostingProperty } from '@/configuration/bot/index.js';

export const name = Events.MessageCreate;

const crosspost = async (message: Message) => {
  const crosspostingEnabled = getCrosspostingProperty('enabled');
  const crosspostingChannels = getCrosspostingProperty('channels');

  if (
    !crosspostingEnabled ||
    crosspostingChannels?.length === 0 ||
    !crosspostingChannels?.includes(message.channel.id)
  ) {
    return;
  }

  try {
    await message.crosspost();
  } catch (error) {
    logger.error(
      `Failed crossposting message in channel ${message.channel.id}\n${String(error)}`,
    );
  }
};

export const execute = async (...[message]: ClientEvents[typeof name]) => {
  await crosspost(message);
};
