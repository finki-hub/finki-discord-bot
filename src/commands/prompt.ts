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

  let answer = '';
  let lastEdit = Date.now();

  const maybeEditReply = async () => {
    const now = Date.now();
    if (now - lastEdit > 1_000) {
      lastEdit = now;
      await interaction.editReply(answer);
    }
  };

  await sendPrompt(prompt, async (chunk) => {
    answer += chunk;
    await maybeEditReply();
  });

  await interaction.editReply(answer || commandErrors.promptFailed);
};
