import { type GuildMember, PermissionsBitField } from 'discord.js';

import { getRolesProperty } from '@/configuration/bot/index.js';
import { getChatCommand } from '@/core/commands/modules.js';
import { commandDescriptions } from '@/translations/commands.js';

const getCommandPermission = (
  command: string,
): [bigint[], Array<string | undefined>] => {
  const parts = command.split(' ');
  const topCommand = parts[0];
  const subcommand = parts[1];
  const commandObj = topCommand ? getChatCommand(topCommand) : undefined;

  if (commandObj?.permissions === undefined) {
    return [[], []];
  }

  const permissions = commandObj.permissions;

  // Check for subcommand-specific permissions first (e.g., "chat embed")
  if (subcommand && permissions.subcommands?.[subcommand]) {
    const subcommandPerms = permissions.subcommands[subcommand];

    const subcommandPermissions = subcommandPerms.permissions ?? [];

    const subcommandRoles =
      subcommandPerms.roles?.map((role) => getRolesProperty(role)) ?? [];

    return [subcommandPermissions, subcommandRoles];
  }

  // Fall back to top-level command permissions (e.g., "chat")
  const commandPermissions = permissions.permissions ?? [];
  const commandRoles =
    permissions.roles?.map((role) => getRolesProperty(role)) ?? [];

  return [commandPermissions, commandRoles];
};

const isMemberAdministrator = (member: GuildMember) =>
  member.permissions.has(PermissionsBitField.Flags.Administrator);

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
