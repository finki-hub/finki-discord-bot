import {
  type ChatInputCommandInteraction,
  roleMention,
  SlashCommandBuilder,
} from 'discord.js';

import { getRoles } from '@/common/services/roles.js';
import { type RoleSets } from '@/common/types/RoleSets.js';
import { getGuild } from '@/common/utils/guild.js';
import { safeReplyToInteraction } from '@/common/utils/messages.js';
import {
  getMaxEmojisByBoostLevel,
  getMaxSoundboardSoundsByBoostLevel,
  getMaxStickersByBoostLevel,
} from '@/modules/statistics/utils/boost.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponseFunctions,
} from '@/translations/commands.js';

export const name = 'statistics';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Color')
  .addSubcommand((command) =>
    command
      .setName('color')
      .setDescription(commandDescriptions['statistics color']),
  )
  .addSubcommand((command) =>
    command
      .setName('program')
      .setDescription(commandDescriptions['statistics program']),
  )
  .addSubcommand((command) =>
    command
      .setName('year')
      .setDescription(commandDescriptions['statistics year']),
  )
  .addSubcommand((command) =>
    command
      .setName('course')
      .setDescription(commandDescriptions['statistics course']),
  )
  .addSubcommand((command) =>
    command
      .setName('notification')
      .setDescription(commandDescriptions['statistics notification']),
  )
  .addSubcommand((command) =>
    command
      .setName('server')
      .setDescription(commandDescriptions['statistics server']),
  );

import { executeSubcommand } from '@/common/commands/subcommands.js';

const handleStatisticsRole = async (
  interaction: ChatInputCommandInteraction,
  roleType: string,
) => {
  const guild = await getGuild(interaction);

  if (guild === null) {
    await interaction.editReply(commandErrors.commandGuildOnly);

    return;
  }

  const roleSetType: RoleSets =
    roleType === 'course' ? 'courses' : (roleType as RoleSets);
  const roles = getRoles(guild, roleSetType);
  roles.sort((a, b) => b.members.size - a.members.size);
  const output = roles.map(
    (role) => `${roleMention(role.id)}: ${role.members.size}`,
  );

  await safeReplyToInteraction(interaction, output.join('\n'));
};

const handleStatisticsServer = async (
  interaction: ChatInputCommandInteraction,
) => {
  const guild = await getGuild(interaction);

  if (guild === null) {
    await interaction.editReply(commandErrors.commandGuildOnly);

    return;
  }

  const boostLevel = guild.premiumTier;

  await guild.channels.fetch();
  await guild.roles.fetch();
  await guild.emojis.fetch();
  await guild.stickers.fetch();
  await guild.invites.fetch();
  await guild.soundboardSounds.fetch();

  const output = [
    commandResponseFunctions.serverMembersStat(
      guild.memberCount,
      guild.maximumMembers,
    ),
    commandResponseFunctions.serverBoostStat(
      guild.premiumSubscriptionCount ?? 0,
    ),
    commandResponseFunctions.serverBoostLevelStat(guild.premiumTier),
    commandResponseFunctions.serverChannelsStat(
      guild.channels.cache.filter((channel) => !channel.isThread()).size,
    ),
    commandResponseFunctions.serverRolesStat(guild.roles.cache.size),
    commandResponseFunctions.serverEmojiStat(
      guild.emojis.cache.filter((emoji) => !emoji.animated).size,
      getMaxEmojisByBoostLevel(boostLevel),
    ),
    commandResponseFunctions.serverAnimatedEmojiStat(
      guild.emojis.cache.filter((emoji) => emoji.animated).size,
      getMaxEmojisByBoostLevel(boostLevel),
    ),
    commandResponseFunctions.serverStickersStat(
      guild.stickers.cache.size,
      getMaxStickersByBoostLevel(boostLevel),
    ),
    commandResponseFunctions.serverSoundboardSoundsStat(
      guild.soundboardSounds.cache.size,
      getMaxSoundboardSoundsByBoostLevel(boostLevel),
    ),
    commandResponseFunctions.serverInvitesStat(guild.invites.cache.size),
  ];

  await interaction.editReply(output.join('\n'));
};

const statisticsHandlers = {
  color: (interaction: ChatInputCommandInteraction) =>
    handleStatisticsRole(interaction, 'color'),
  course: (interaction: ChatInputCommandInteraction) =>
    handleStatisticsRole(interaction, 'course'),
  notification: (interaction: ChatInputCommandInteraction) =>
    handleStatisticsRole(interaction, 'notification'),
  program: (interaction: ChatInputCommandInteraction) =>
    handleStatisticsRole(interaction, 'program'),
  server: handleStatisticsServer,
  year: (interaction: ChatInputCommandInteraction) =>
    handleStatisticsRole(interaction, 'year'),
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, statisticsHandlers);
};
