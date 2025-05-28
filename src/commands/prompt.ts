import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { commandDescriptions } from '../translations/commands.js';
import { sendPrompt } from '../utils/chat.js';
import { safeStreamReplyToInteraction } from '../utils/messages.js';

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

  await safeStreamReplyToInteraction(interaction, async (onChunk) => {
    await sendPrompt(prompt, async (chunk) => {
      await onChunk(chunk);
    });
  });
};
