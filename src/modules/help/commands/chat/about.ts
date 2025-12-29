import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { getAboutEmbed } from '@/modules/help/components/embeds.js';
import { commandDescriptions, commandErrors } from '@/translations/commands.js';

export const name = 'about';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription(commandDescriptions[name]);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const embed = getAboutEmbed();
  await interaction.editReply({
    embeds: [embed],
  });
};
