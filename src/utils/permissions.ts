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
  ad: {
    permissions: [],
    roles: [Role.Administrators],
  },
  chat: {
    permissions: [],
    roles: [Role.Regulars],
  },
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
  'irregulars add': {
    permissions: [],
    roles: [Role.Management],
  },
  'irregulars remove': {
    permissions: [],
    roles: [Role.Management],
  },
  lottery: {
    permissions: [],
    roles: [Role.Administrators, Role.Moderators],
  },
  manage: {
    permissions: [],
    roles: [Role.Administrators],
  },
  members: {
    permissions: [],
    roles: [Role.Administrators, Role.Moderators, Role.Management, Role.VIP],
  },
  'members count': {
    permissions: [],
    roles: [],
  },
  message: {
    permissions: [],
    roles: [Role.Administrators],
  },
  'poll delete': {
    permissions: [],
    roles: [Role.Administrators],
  },
  purge: {
    permissions: [PermissionsBitField.Flags.ManageMessages],
    roles: [],
  },
  register: {
    permissions: [],
    roles: [Role.Administrators],
  },
  regulars: {
    permissions: [],
    roles: [Role.Administrators, Role.Moderators],
  },
  'regulars recreate': {
    permissions: [],
    roles: [Role.Administrators, Role.Moderators],
  },
  'reminder dump': {
    permissions: [],
    roles: [Role.Administrators],
  },
  script: {
    permissions: [],
    roles: [Role.Administrators],
  },
  'special bar': {
    permissions: [],
    roles: [Role.Management],
  },
  'special delete': {
    permissions: [],
    roles: [Role.Administrators],
  },
  'special list': {
    permissions: [],
    roles: [Role.Administrators, Role.Moderators, Role.VIP],
  },
  'special override': {
    permissions: [PermissionsBitField.Flags.Administrator],
    roles: [],
  },
  'special remaining': {
    permissions: [],
    roles: [Role.Management],
  },
  'special unbar': {
    permissions: [],
    roles: [Role.Management],
  },
  Star: {
    permissions: [PermissionsBitField.Flags.ManageMessages],
    roles: [Role.VIP],
  },
  ticket: {
    permissions: [],
    roles: [Role.Administrators, Role.Moderators, Role.FSS, Role.Ombudsman],
  },
  vip: {
    permissions: [],
    roles: [Role.Management],
  },
  'vip recreate': {
    permissions: [],
    roles: [Role.Administrators, Role.Moderators],
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
