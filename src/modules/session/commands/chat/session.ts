import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { getDataStorageUrl } from '@/configuration/environment.js';
import { getSessions } from '@/modules/session/utils/data.js';
import { getClosestSession } from '@/modules/session/utils/search.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponseFunctions,
} from '@/translations/commands.js';

export const name = 'session';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription(commandDescriptions[name])
  .addStringOption((option) =>
    option
      .setName('session')
      .setDescription('Сесија')
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addUserOption((option) =>
    option.setName('user').setDescription('Корисник').setRequired(false),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const session = interaction.options.getString('session', true);
  const user = interaction.options.getUser('user');

  const closestSession = getClosestSession(session);

  const information = Object.entries(getSessions()).find(
    ([key]) => key.toLowerCase() === closestSession?.toLowerCase(),
  );

  if (information === undefined) {
    await interaction.editReply(commandErrors.sessionNotFound);

    return;
  }

  const baseUrl = getDataStorageUrl();

  if (!baseUrl) {
    await interaction.editReply(commandErrors.sessionNotFound);

    return;
  }

  const filename = information[1];
  const fileUrl = `${baseUrl}/sessions/${filename}`;

  const content = user
    ? `${commandResponseFunctions.commandFor(user.id)}\n${fileUrl}`
    : fileUrl;

  await interaction.editReply({
    content,
  });
};
