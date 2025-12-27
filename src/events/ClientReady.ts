import { type ClientEvents, Events } from 'discord.js';

import { client as bot } from '../client.js';
import { logger } from '../logger.js';
import { bootMessage, logMessageFunctions } from '../translations/logs.js';
import { initializeChannels } from '../utils/channels.js';
import { initializeCronJobs } from '../utils/cron/main.js';
import { initializeMembers } from '../utils/members.js';
import { initializeRoles } from '../utils/roles.js';
import { sendErrorToWebhook } from '../utils/webhooks.js';

export const name = Events.ClientReady;
export const once = true;

export const execute = async (...[client]: ClientEvents[typeof name]) => {
  await initializeMembers();
  await initializeChannels();
  await initializeRoles();
  await client.application.commands.fetch();

  initializeCronJobs();

  logger.info(logMessageFunctions.loggedIn(bot.user?.tag));

  await sendErrorToWebhook(bootMessage(new Date().toUTCString()));
};
