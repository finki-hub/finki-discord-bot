import type { Guild } from 'discord.js';

export const getMemberFromGuild = async (userId: string, guild: Guild) => {
  try {
    return await guild.members.fetch(userId);
  } catch {
    return null;
  }
};
