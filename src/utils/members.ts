import { type GuildMember, PermissionsBitField } from 'discord.js';

import { client } from '../client.js';
import { getRolesProperty } from '../configuration/main.js';
import { getBarByUserId } from '../data/database/Bar.js';
import { getExperienceByUserId } from '../data/database/Experience.js';
import { Role } from '../lib/schemas/Role.js';

export const getUsername = async (userId: string) => {
  const user = await client.users.fetch(userId);

  return user.tag;
};

export const memberHasRole = (member: GuildMember, role: Role) => {
  const roleId = getRolesProperty(role);

  return roleId !== undefined && member.roles.cache.has(roleId);
};

export const isMemberAdministrator = (member: GuildMember) =>
  member.permissions.has(PermissionsBitField.Flags.Administrator);

export const isMemberInVip = (member: GuildMember) => {
  if (isMemberAdministrator(member)) {
    return true;
  }

  return (
    memberHasRole(member, Role.VIP) ||
    memberHasRole(member, Role.Moderators) ||
    memberHasRole(member, Role.Administrators)
  );
};

export const isMemberInCouncil = (member: GuildMember) =>
  memberHasRole(member, Role.Council);

export const isMemberInIrregulars = (member: GuildMember) =>
  memberHasRole(member, Role.Irregulars);

export const isMemberInRegulars = (member: GuildMember) =>
  memberHasRole(member, Role.Regulars);

export const isMemberAdmin = (member: GuildMember) => {
  if (isMemberAdministrator(member)) {
    return true;
  }

  return (
    memberHasRole(member, Role.Administrators) ||
    memberHasRole(member, Role.Moderators)
  );
};

export const isMemberLevel = async (
  member: GuildMember,
  level: number,
  orAbove = true,
) => {
  const experience = await getExperienceByUserId(member.id);

  if (experience === null) {
    return false;
  }

  return orAbove ? experience.level >= level : experience.level === level;
};

export const isMemberBarred = async (userId: string) => {
  const bar = await getBarByUserId(userId);

  return bar !== null;
};
