import {
  type ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';

import { safeStreamReplyToInteraction } from '@/common/utils/messages.js';
import { getConfigProperty } from '@/configuration/bot/index.js';
import { commandDescriptions, commandErrors } from '@/translations/commands.js';

import { SendPromptOptionsSchema } from '../schemas/Chat.js';
import { LLM_ERRORS } from './constants.js';
import { sendPrompt } from './requests.js';

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
    const useAgent = interaction.options.getBoolean('use-agent') ?? undefined;

    const models = getConfigProperty('models');

    const options = SendPromptOptionsSchema.parse({
      embeddingsModel: embeddingsModel ?? models.embeddings,
      inferenceModel: inferenceModel ?? models.inference,
      maxTokens,
      prompt,
      systemPrompt,
      temperature,
      topP,
      useAgent,
    });

    try {
      await safeStreamReplyToInteraction(interaction, async (onChunk) => {
        await sendPrompt(options, async (chunk) => {
          await onChunk(chunk);
        });
      });
    } catch (error) {
      if (!Error.isError(error)) {
        throw error;
      }

      const errorMessage =
        LLM_ERRORS[error.message] ?? commandErrors.unknownChatError;

      await (interaction.deferred || interaction.replied
        ? interaction.editReply(errorMessage)
        : interaction.reply({
            content: errorMessage,
            flags: MessageFlags.Ephemeral,
          }));
    }
  },
});
