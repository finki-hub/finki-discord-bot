import { type ClientEvents, Events } from 'discord.js';

import { logger } from '@/common/logger/index.js';
import { initializeChannels } from '@/common/services/channels.js';
import { initializeRoles } from '@/common/services/roles.js';

import { client as bot } from '../client.js';

export const name = Events.ClientReady;
export const once = true;

export const execute = async (...[client]: ClientEvents[typeof name]) => {
  await initializeChannels();
  await initializeRoles();
  await client.application.commands.fetch();

  logger.info(
    `Bot is ready! Logged in as ${bot.user?.tag ?? 'an unknown user'}`,
  );
  logger.info(`Bot successfully started at ${new Date().toUTCString()}`);
};
