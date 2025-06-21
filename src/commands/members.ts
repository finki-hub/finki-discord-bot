/* eslint-disable unicorn/no-await-expression-member */

import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { getRolesProperty } from '../configuration/main.js';
import { getBars } from '../data/database/Bar.js';
import { Role } from '../lib/schemas/Role.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponseFunctions,
  commandResponses,
} from '../translations/commands.js';
import { labels } from '../translations/labels.js';
import { formatUsers } from '../translations/users.js';
import { getGuild, getMemberFromGuild } from '../utils/guild.js';
import { safeReplyToInteraction } from '../utils/messages.js';
import {
  getMembersByRoleIds,
  getMembersByRoleIdsExtended,
} from '../utils/roles.js';

const name = 'members';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Members')
  .addSubcommand((command) =>
    command
      .setName('count')
      .setDescription(commandDescriptions['members count']),
  )
  .addSubcommand((command) =>
    command.setName('vip').setDescription(commandDescriptions['members vip']),
  )
  .addSubcommand((command) =>
    command
      .setName('regulars')
      .setDescription(commandDescriptions['members regulars']),
  )
  .addSubcommand((command) =>
    command
      .setName('barred')
      .setDescription(commandDescriptions['members barred']),
  )
  .addSubcommand((command) =>
    command
      .setName('boosters')
      .setDescription(commandDescriptions['members boosters']),
  )
  .addSubcommand((command) =>
    command
      .setName('irregulars')
      .setDescription(commandDescriptions['members irregulars']),
  )
  .addSubcommand((command) =>
    command
      .setName('management')
      .setDescription(commandDescriptions['members management']),
  )
  .addSubcommand((command) =>
    command
      .setName('statistics')
      .setDescription(commandDescriptions['members statistics']),
  );

const handleMembersCount = async (interaction: ChatInputCommandInteraction) => {
  const guild = await getGuild(interaction);

  await interaction.editReply(
    commandResponseFunctions.serverMembers(guild?.memberCount),
  );
};

const handleMembersVip = async (interaction: ChatInputCommandInteraction) => {
  const guild = await getGuild(interaction);

  if (guild === null) {
    await interaction.editReply(commandErrors.guildFetchFailed);

    return;
  }

  const vipRoleId = getRolesProperty(Role.VIP);

  const vipMemberIds = await getMembersByRoleIds(
    guild,
    [vipRoleId].filter((value) => value !== undefined),
  );
  const vipMembers = (
    await Promise.all(
      vipMemberIds.map(
        async (id) => await getMemberFromGuild(id, interaction.guild),
      ),
    )
  ).filter((member) => member !== null);
  const vipMembersFormatted = formatUsers(
    labels.vip,
    vipMembers.map(({ user }) => user),
  );

  await safeReplyToInteraction(interaction, vipMembersFormatted, {
    mentionUsers: false,
  });
};

const handleMembersRegulars = async (
  interaction: ChatInputCommandInteraction,
) => {
  const guild = await getGuild(interaction);

  if (guild === null) {
    await interaction.editReply(commandErrors.guildFetchFailed);

    return;
  }

  const regularRoleId = getRolesProperty(Role.Regulars);
  const irregularRoleId = getRolesProperty(Role.Irregulars);
  const vipRoleId = getRolesProperty(Role.VIP);
  const moderatorRoleId = getRolesProperty(Role.Moderators);
  const adminRoleId = getRolesProperty(Role.Administrators);

  const regularsMembersIds = await getMembersByRoleIdsExtended(
    guild,
    [regularRoleId].filter((value) => value !== undefined),
    [vipRoleId, moderatorRoleId, adminRoleId, irregularRoleId].filter(
      (value) => value !== undefined,
    ),
  );
  const regularsMembers = (
    await Promise.all(
      regularsMembersIds.map(
        async (id) => await getMemberFromGuild(id, interaction.guild),
      ),
    )
  ).filter((member) => member !== null);
  const regularsMemberNames = formatUsers(
    labels.regulars,
    regularsMembers.map(({ user }) => user),
  );

  await safeReplyToInteraction(interaction, regularsMemberNames, {
    mentionUsers: false,
  });
};

const handleMembersBarred = async (
  interaction: ChatInputCommandInteraction,
) => {
  const guild = await getGuild(interaction);

  if (guild === null) {
    await interaction.editReply(commandErrors.guildFetchFailed);

    return;
  }

  const bars = await getBars();

  if (bars === null) {
    await interaction.editReply(commandErrors.barsFetchFailed);

    return;
  }

  if (bars.length === 0) {
    await interaction.editReply(commandResponses.noBarred);

    return;
  }

  const barredMembers = (
    await Promise.all(
      bars
        .map(({ userId }) => userId)
        .map(async (id) => await getMemberFromGuild(id, interaction.guild)),
    )
  ).filter((member) => member !== null);
  const bannedMembersFormatted = formatUsers(
    labels.barred,
    barredMembers.map(({ user }) => user),
  );

  await safeReplyToInteraction(interaction, bannedMembersFormatted, {
    mentionUsers: false,
  });
};

const handleMembersBoosters = async (
  interaction: ChatInputCommandInteraction,
) => {
  const guild = await getGuild(interaction);

  if (guild === null) {
    await interaction.editReply(commandErrors.guildFetchFailed);

    return;
  }

  const boosterRoleId = getRolesProperty(Role.Boosters);
  const boosterMemberIds = await getMembersByRoleIds(
    guild,
    [boosterRoleId].filter((value) => value !== undefined),
  );

  const boosterMembers = (
    await Promise.all(
      boosterMemberIds.map(
        async (id) => await getMemberFromGuild(id, interaction.guild),
      ),
    )
  ).filter((member) => member !== null);
  const boosterMembersFormatted = formatUsers(
    labels.boosters,
    boosterMembers.map(({ user }) => user),
  );

  await safeReplyToInteraction(interaction, boosterMembersFormatted, {
    mentionUsers: false,
  });
};

const handleMembersIrregulars = async (
  interaction: ChatInputCommandInteraction,
) => {
  const guild = await getGuild(interaction);

  if (guild === null) {
    await interaction.editReply(commandErrors.guildFetchFailed);

    return;
  }

  const irregularRoleId = getRolesProperty(Role.Irregulars);
  const vipRoleId = getRolesProperty(Role.VIP);

  const irregularsMembersIds = await getMembersByRoleIdsExtended(
    guild,
    [irregularRoleId].filter((value) => value !== undefined),
    [vipRoleId].filter((value) => value !== undefined),
  );
  const irregularsMembers = (
    await Promise.all(
      irregularsMembersIds.map(
        async (id) => await getMemberFromGuild(id, interaction.guild),
      ),
    )
  ).filter((member) => member !== null);
  const irregularsMemberNames = formatUsers(
    labels.irregulars,
    irregularsMembers.map(({ user }) => user),
  );

  await safeReplyToInteraction(interaction, irregularsMemberNames, {
    mentionUsers: false,
  });
};

const handleMembersManagement = async (
  interaction: ChatInputCommandInteraction,
) => {
  const guild = await getGuild(interaction);

  if (guild === null) {
    await interaction.editReply(commandErrors.guildFetchFailed);

    return;
  }

  const managementRoleId = getRolesProperty(Role.Management);

  const managementMembersIds = await getMembersByRoleIdsExtended(
    guild,
    [managementRoleId].filter((value) => value !== undefined),
    [],
  );
  const managementMembers = (
    await Promise.all(
      managementMembersIds.map(
        async (id) => await getMemberFromGuild(id, interaction.guild),
      ),
    )
  ).filter((member) => member !== null);
  const managementMemberNames = formatUsers(
    labels.management,
    managementMembers.map(({ user }) => user),
  );

  const moderatorRoleId = getRolesProperty(Role.Moderators);
  const adminRoleId = getRolesProperty(Role.Administrators);

  const administrationMembersIds = await getMembersByRoleIds(
    guild,
    [moderatorRoleId, adminRoleId].filter((value) => value !== undefined),
  );
  const administrationMembers = (
    await Promise.all(
      administrationMembersIds.map(
        async (id) => await getMemberFromGuild(id, interaction.guild),
      ),
    )
  ).filter((member) => member !== null);
  const administrationMemberNames = formatUsers(
    labels.administration,
    administrationMembers.map(({ user }) => user),
  );

  await safeReplyToInteraction(
    interaction,
    `${managementMemberNames}\n${administrationMemberNames}`,
    {
      mentionUsers: false,
    },
  );
};

const handleMembersStatistics = async (
  interaction: ChatInputCommandInteraction,
) => {
  const guild = await getGuild(interaction);

  if (guild === null) {
    await interaction.editReply(commandErrors.guildFetchFailed);

    return;
  }

  const regularsRoleId = getRolesProperty(Role.Regulars);
  const irregularsRoleId = getRolesProperty(Role.Irregulars);
  const vipRoleId = getRolesProperty(Role.VIP);
  const managementRoleId = getRolesProperty(Role.Management);
  const moderatorRoleId = getRolesProperty(Role.Moderators);
  const adminRoleId = getRolesProperty(Role.Administrators);

  const totalMembersCount = guild.memberCount;
  const totalBoostersCount = guild.premiumSubscriptionCount;
  const totalRegulars = await getMembersByRoleIdsExtended(
    guild,
    [regularsRoleId].filter((value) => value !== undefined),
    [irregularsRoleId].filter((value) => value !== undefined),
  );
  const totalIrregulars = await getMembersByRoleIdsExtended(
    guild,
    [irregularsRoleId].filter((value) => value !== undefined),
    [vipRoleId].filter((value) => value !== undefined),
  );
  const totalVip = await getMembersByRoleIds(
    guild,
    [vipRoleId].filter((value) => value !== undefined),
  );
  const totalManagement = await getMembersByRoleIds(
    guild,
    [managementRoleId].filter((value) => value !== undefined),
  );
  const totalModerators = await getMembersByRoleIds(
    guild,
    [moderatorRoleId].filter((value) => value !== undefined),
  );
  const totalAdministrators = await getMembersByRoleIds(
    guild,
    [adminRoleId].filter((value) => value !== undefined),
  );

  const output = [
    `${labels.members}: ${totalMembersCount}`,
    `${labels.boosters}: ${totalBoostersCount}`,
    `${labels.regulars}: ${totalRegulars.length}`,
    `${labels.irregulars}: ${totalIrregulars.length}`,
    `${labels.vip}: ${totalVip.length}`,
    `${labels.management}: ${totalManagement.length}`,
    `${labels.moderators}: ${totalModerators.length}`,
    `${labels.administrators}: ${totalAdministrators.length}`,
  ];

  await safeReplyToInteraction(interaction, output.join('\n'));
};

const membersHandlers = {
  barred: handleMembersBarred,
  boosters: handleMembersBoosters,
  count: handleMembersCount,
  irregulars: handleMembersIrregulars,
  management: handleMembersManagement,
  regulars: handleMembersRegulars,
  statistics: handleMembersStatistics,
  vip: handleMembersVip,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const subcommand = interaction.options.getSubcommand(true);

  if (subcommand in membersHandlers) {
    await membersHandlers[subcommand as keyof typeof membersHandlers](
      interaction,
    );
  }
};
