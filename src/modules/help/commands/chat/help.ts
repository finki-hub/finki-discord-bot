import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { getPaginationComponents } from '@/common/components/pagination.js';
import { getGuild, getMemberFromGuild } from '@/common/utils/guild.js';
import { client } from '@/core/client.js';
import { getCommandsWithPermission } from '@/core/utils/permissions.js';
import { getHelpEmbed } from '@/modules/help/components/embeds.js';
import { commandDescriptions, commandErrors } from '@/translations/commands.js';

export const name = 'help';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription(commandDescriptions[name]);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const guild = await getGuild(interaction);

  if (guild === null) {
    await interaction.editReply(commandErrors.guildFetchFailed);

    return;
  }

  const member = await getMemberFromGuild(
    interaction.user.id,
    interaction.guild,
  );

  if (member === null) {
    await interaction.editReply(commandErrors.commandNoPermission);
    return;
  }

  await client.application?.commands.fetch();

  const commands = getCommandsWithPermission(member);
  const commandsPerPage = 8;
  const pages = Math.ceil(commands.length / commandsPerPage);
  const embed = getHelpEmbed(commands, 0, commandsPerPage);
  const components = [
    pages === 0 || pages === 1
      ? getPaginationComponents('help')
      : getPaginationComponents('help', 'start'),
  ];

  await interaction.editReply({
    components,
    embeds: [embed],
  });
};
