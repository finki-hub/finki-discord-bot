import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { access } from 'node:fs/promises';

import { getSessions } from '../configuration/files.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponseFunctions,
} from '../translations/commands.js';
import { logCommandEvent } from '../utils/analytics.js';
import { getClosestSession } from '../utils/search.js';

const name = 'session';

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

  const path = `./sessions/${information[1]}`;

  try {
    await access(path);
  } catch {
    await interaction.editReply(commandErrors.sessionNotFound);

    return;
  }

  await interaction.editReply({
    content: user ? commandResponseFunctions.commandFor(user.id) : null,
    files: [path],
  });

  await logCommandEvent(interaction, 'session', {
    session: information[0],
  });
};
