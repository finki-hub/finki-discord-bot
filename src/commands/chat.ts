import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import {
  commandDescriptions,
  commandErrors,
} from '../translations/commands.js';
import { labels } from '../translations/labels.js';
import { getClosestQuestions } from '../utils/chat.js';

const name = 'chat';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('chat')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('closest')
      .setDescription(commandDescriptions['chat closest'])
      .addStringOption((option) =>
        option
          .setName('query')
          .setDescription('Прашање за најблиски прашања')
          .setRequired(true),
      ),
  );

const handleChatClosest = async (interaction: ChatInputCommandInteraction) => {
  const query = interaction.options.getString('query', true);

  const closestQuestions = await getClosestQuestions(query);

  if (closestQuestions === null) {
    await interaction.editReply(commandErrors.dataFetchFailed);

    return;
  }

  if (closestQuestions.length === 0) {
    await interaction.editReply(labels.none);

    return;
  }

  const content = closestQuestions.map(({ name }) => `- ${name}`).join('\n');

  await interaction.editReply(content);
};

const chatHandlers = {
  closest: handleChatClosest,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand in chatHandlers) {
    await chatHandlers[subcommand as keyof typeof chatHandlers](interaction);
  }
};
