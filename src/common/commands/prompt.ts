import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import type { ChatOptions } from '../../lib/schemas/Chat.js';

import { EMBEDDING_MODELS, INFERENCE_MODELS } from '../../lib/schemas/Model.js';
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
    )
    .addStringOption((option) =>
      option
        .setName('embeddings-model')
        .setDescription('Моделот за ембедирање')
        .setRequired(false)
        .setChoices(
          EMBEDDING_MODELS.map((model) => ({
            name: model,
            value: model,
          })),
        ),
    )
    .addStringOption((option) =>
      option
        .setName('inference-model')
        .setDescription('Моделот за инференца')
        .setRequired(false)
        .setChoices(
          INFERENCE_MODELS.map((model) => ({
            name: model,
            value: model,
          })),
        ),
    )
    .addNumberOption((option) =>
      option
        .setName('temperature')
        .setDescription('Температурата на моделот')
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(1),
    )
    .addNumberOption((option) =>
      option
        .setName('top-p')
        .setDescription('Top P вредноста на моделот')
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(1),
    )
    .addNumberOption((option) =>
      option
        .setName('max-tokens')
        .setDescription('Максималниот број на токени за одговорот')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(4_096),
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const prompt = interaction.options.getString('prompt', true);
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
    return true;
  },
});
