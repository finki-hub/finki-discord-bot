import { getFromRoleConfig } from './config.js';
import { type Guild, type Role } from 'discord.js';

const roles: { [K in RoleSets]: Role[] } = {
  activity: [],
  color: [],
  courses: [],
  notification: [],
  program: [],
  year: [],
};

export const refreshRoles = (guild: Guild | null, type: RoleSets) => {
  if (roles[type].length === 0 && guild !== null) {
    let list;

    if (type === 'courses') {
      list = Object.keys(getFromRoleConfig('courses'));
    } else {
      list = getFromRoleConfig(type);
    }

    list = list.map((role) =>
      guild?.roles.cache.find((ro) => ro.name === role),
    );

    if (!list.includes(undefined)) {
      roles[type] = list as Role[];
    }
  }
};

export const getRole = (guild: Guild | null, type: RoleSets, role?: string) => {
  if (role === undefined) {
    return undefined;
  }

  if (roles[type].length === 0 && guild !== null) {
    refreshRoles(guild, type);
  }

  return roles[type].find((ro) => ro.name === role);
};

export const getRoles = (guild: Guild | null, type: RoleSets) => {
  if (roles[type].length === 0) {
    refreshRoles(guild, type);
  }

  return roles[type];
};

export const getCourseRolesBySemester = (
  guild: Guild | null,
  semester: number,
) => {
  const courses = getFromRoleConfig('course')[semester];

  if (courses === undefined) {
    return [];
  }

  if (roles.courses.length === 0) {
    refreshRoles(guild, 'courses');
  }

  return roles.courses.filter((role) => courses.includes(role.name));
};

export const getCourseRoleByCourseName = (
  guild: Guild | null,
  course?: string | null,
) => {
  if (course === undefined || course === null) {
    return undefined;
  }

  const roleName = Object.entries(getFromRoleConfig('courses')).find(
    ([, courseName]) => course === courseName,
  );

  if (roleName === undefined) {
    return undefined;
  }

  return guild?.roles.cache.find((role) => role.name === roleName[0]);
};

export const getMembersWithRoles = async (
  guild: Guild | null,
  ...rolesWithMembers: Role[] | string[]
) => {
  if (guild === null) {
    return [];
  }

  await guild.members.fetch();
  await guild.roles.fetch();

  const members = rolesWithMembers.map((role) =>
    typeof role === 'string'
      ? guild.roles.cache.get(role)?.members.keys()
      : role.members.keys(),
  );

  const uniqueMembers = new Set<string>();
  for (const iterator of members) {
    const ids = Array.from(iterator ?? []);

    for (const id of ids) {
      uniqueMembers.add(id);
    }
  }

  return Array.from(uniqueMembers);
};
