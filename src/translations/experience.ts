import { userMention } from 'discord.js';

export const experienceMessages = {
  levelUp: (userId: string, level: number) =>
    `Корисникот ${userMention(userId)} достигна ниво ${level}.`,
};
