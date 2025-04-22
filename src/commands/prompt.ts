import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import {
  commandDescriptions,
  commandErrors,
} from '../translations/commands.js';
import { sendPrompt } from '../utils/chat.js';

const name = 'prompt';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription(commandDescriptions[name])
  .addStringOption((option) =>
    option
      .setName('prompt')
      .setDescription('Промпт за LLM агентот')
      .setRequired(true),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const prompt = interaction.options.getString('prompt', true);

  const response = await sendPrompt(prompt);

  await interaction.editReply(response ?? commandErrors.promptFailed);
};
