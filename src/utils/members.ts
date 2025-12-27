import { type GuildMember, PermissionsBitField } from 'discord.js';

import { logger } from '../logger.js';
import {
  logErrorFunctions,
  logMessageFunctions,
} from '../translations/logs.js';
import { getGuild } from './guild.js';

export const initializeMembers = async () => {
  const guild = await getGuild();

  if (guild === null) {
    return;
  }

  try {
    const members = await guild.members.fetch();
    logger.info(logMessageFunctions.membersInitialized(members.size));
  } catch (error) {
    logger.error(logErrorFunctions.membersFetchError(error));
  }
};

export const isMemberAdministrator = (member: GuildMember) =>
  member.permissions.has(PermissionsBitField.Flags.Administrator);
