import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { getStaff } from '@/configuration/data/index.js';
import { getStaffEmbed } from '@/modules/staff/components/embeds.js';
import { getClosestStaff } from '@/modules/staff/utils/search.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponseFunctions,
} from '@/translations/commands.js';

export const name = 'staff';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription(commandDescriptions[name])
  .addStringOption((option) =>
    option
      .setName('professor')
      .setDescription('Професор')
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addUserOption((option) =>
    option.setName('user').setDescription('Корисник').setRequired(false),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const professor = interaction.options.getString('professor', true);
  const user = interaction.options.getUser('user');

  const closestStaff = getClosestStaff(professor);

  const information = getStaff().find(
    (staff) => staff.name.toLowerCase() === closestStaff?.toLowerCase(),
  );

  if (information === undefined) {
    await interaction.editReply(commandErrors.staffNotFound);

    return;
  }

  const embed = getStaffEmbed(information);
  await interaction.editReply({
    content: user ? commandResponseFunctions.commandFor(user.id) : null,
    embeds: [embed],
  });
};
