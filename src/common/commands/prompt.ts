import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import type { ChatOptions } from '../../lib/schemas/Chat.js';

import {
  commandDescriptions,
  commandErrors,
} from '../../translations/commands.js';
import { sendPrompt } from '../../utils/chat.js';
import { safeStreamReplyToInteraction } from '../../utils/messages.js';

export const getCommonCommand = (name: keyof typeof commandDescriptions) => ({
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription(commandDescriptions[name])
    .addStringOption((option) =>
      option
        .setName('prompt')
        .setDescription('Промпт за LLM агентот')
        .setRequired(true),
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const prompt = interaction.options.getString('prompt', true);
    const systemPrompt =
      interaction.options.getString('system-prompt') ?? undefined;
    const embeddingsModel =
      interaction.options.getString('embeddings-model') ?? undefined;
    const inferenceModel =
      interaction.options.getString('inference-model') ?? undefined;
    const temperature =
      interaction.options.getNumber('temperature') ?? undefined;
    const topP = interaction.options.getNumber('top-p') ?? undefined;
    const maxTokens = interaction.options.getNumber('max-tokens') ?? undefined;

    const chatOptions: ChatOptions = {
      embeddingsModel,
      inferenceModel,
      maxTokens,
      query: prompt,
      systemPrompt,
      temperature,
      topP,
    };

    try {
      await safeStreamReplyToInteraction(interaction, async (onChunk) => {
        await sendPrompt(chatOptions, async (chunk) => {
          await onChunk(chunk);
        });
      });
    } catch (error) {
      const isLLMUnavailable =
        error instanceof Error && error.message === 'LLM_UNAVAILABLE';

      const errorMessage = isLLMUnavailable
        ? commandErrors.llmUnavailable
        : commandErrors.unknownChatError;

      await (interaction.deferred || interaction.replied
        ? interaction.editReply(errorMessage)
        : interaction.reply({
            content: errorMessage,
            ephemeral: true,
          }));
    }
  },
});
