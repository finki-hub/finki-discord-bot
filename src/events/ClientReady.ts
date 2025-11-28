import { type ClientEvents, Events } from 'discord.js';

import { client as bot } from '../client.js';
import { Channel } from '../lib/schemas/Channel.js';
import { logger } from '../logger.js';
import { bootMessage, logMessageFunctions } from '../translations/logs.js';
import { getChannel, initializeChannels } from '../utils/channels.js';
import { initializeCronJobs } from '../utils/cron/main.js';
import { initializeMembers } from '../utils/members.js';
import { initializeSpecialPolls } from '../utils/polls/core/special.js';
import { initializeRoles } from '../utils/roles.js';

export const name = Events.ClientReady;
export const once = true;

export const execute = async (...[client]: ClientEvents[typeof name]) => {
  await initializeMembers();
  await initializeChannels();
  await initializeRoles();
  await initializeSpecialPolls();
  await client.application.commands.fetch();

  initializeCronJobs();

  logger.info(logMessageFunctions.loggedIn(bot.user?.tag));

  const commandsChannel = getChannel(Channel.Logs);
  await commandsChannel?.send(bootMessage(new Date().toUTCString()));
};
