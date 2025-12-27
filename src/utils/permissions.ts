import { type GuildMember, PermissionsBitField } from 'discord.js';

import { getRolesProperty } from '../configuration/main.js';
import { Role } from '../lib/schemas/Role.js';
import { commandDescriptions } from '../translations/commands.js';
import { isMemberAdministrator } from './members.js';

const commandPermissions: Record<
  string,
  {
    permissions: bigint[];
    roles: Role[];
  }
> = {
  'chat embed': {
    permissions: [],
    roles: [Role.Administrators],
  },
  config: {
    permissions: [],
    roles: [Role.Administrators],
  },
  'experience add': {
    permissions: [],
    roles: [Role.Administrators],
  },
  'experience dump': {
    permissions: [],
    roles: [Role.Administrators],
  },
  'experience set': {
    permissions: [],
    roles: [Role.Administrators],
  },
  'Get Experience': {
    permissions: [PermissionsBitField.Flags.ManageMessages],
    roles: [],
  },
  manage: {
    permissions: [],
    roles: [Role.Administrators],
  },
  message: {
    permissions: [],
    roles: [Role.Administrators],
  },
  purge: {
    permissions: [],
    roles: [Role.Moderators],
  },
  'reminder dump': {
    permissions: [],
    roles: [Role.Administrators],
  },
  script: {
    permissions: [],
    roles: [Role.Administrators],
  },
  ticket: {
    permissions: [],
    roles: [Role.Moderators],
  },
};

const getCommandKey = (command: string) => {
  const topCommand = command.split(' ')[0];
  const commandPermission = commandPermissions[command];

  if (commandPermission !== undefined) {
    return command;
  }

  if (topCommand === undefined) {
    return null;
  }

  const topComandPermission = commandPermissions[topCommand];

  if (topComandPermission !== undefined) {
    return topCommand;
  }

  return null;
};

const getCommandPermission = (
  command: string,
): [bigint[], Array<string | undefined>] => {
  const key = getCommandKey(command);

  if (key !== null) {
    const permissions = commandPermissions[key]?.permissions ?? [];
    const roles =
      commandPermissions[key]?.roles.map((role) => getRolesProperty(role)) ??
      [];

    return [permissions, roles];
  }

  return [[], []];
};

// Check whether the member has all the command permissions, or any of the roles
export const hasCommandPermission = (member: GuildMember, command: string) => {
  if (isMemberAdministrator(member)) {
    return true;
  }

  const [permissions, roles] = getCommandPermission(command);

  if (permissions.length === 0 && roles.length === 0) {
    return true;
  }

  // If all roles are undefined, the command is restricted for safety
  if (roles.length > 0 && roles.every((role) => role === undefined)) {
    return false;
  }

  // Check if the member has the required permissions or roles
  return (
    (permissions.length > 0 && member.permissions.has(permissions)) ||
    (roles.length > 0 &&
      member.roles.cache.hasAny(...roles.filter((role) => role !== undefined)))
  );
};

export const getCommandsWithPermission = (member: GuildMember) => {
  const permittedCommands = Object.keys(commandDescriptions).map((command) =>
    hasCommandPermission(member, command),
  );

  return Object.keys(commandDescriptions).filter(
    (_, index) => permittedCommands[index],
  );
};
