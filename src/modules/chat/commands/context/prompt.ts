import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  type MessageContextMenuCommandInteraction,
  MessageFlags,
} from 'discord.js';

import { logger } from '@/common/logger/index.js';
import { safeStreamReplyToInteraction } from '@/common/utils/messages.js';
import { DEFAULT_CONFIGURATION } from '@/configuration/bot/defaults.js';
import { getConfigProperty } from '@/configuration/bot/index.js';
import { SendPromptOptionsSchema } from '@/modules/chat/schemas/Chat.js';
import { LLM_ERRORS } from '@/modules/chat/utils/constants.js';
import { sendPrompt } from '@/modules/chat/utils/requests.js';
import { commandErrors } from '@/translations/commands.js';

export const name = 'Prompt';

export const data = new ContextMenuCommandBuilder()
  .setName(name)
  .setType(ApplicationCommandType.Message);

export const execute = async (
  interaction: MessageContextMenuCommandInteraction,
) => {
  const prompt = interaction.targetMessage.content;

  if (prompt.length === 0) {
    await interaction.reply({
      content: commandErrors.unknownChatError,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const models =
    interaction.guild === null
      ? DEFAULT_CONFIGURATION.models
      : await getConfigProperty('models', interaction.guild.id);

  const options = SendPromptOptionsSchema.parse({
    embeddingsModel: models.embeddings,
    inferenceModel: models.inference,
    prompt,
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

    const isLLMUnavailable = error.message === 'LLM_UNAVAILABLE';

    if (isLLMUnavailable) {
      logger.warn('LLM unavailable when executing Prompt context command', {
        guildId: interaction.guild?.id,
      });
    } else {
      const messageParts = [
        'Failed executing Prompt context command',
        error.message,
        error.stack,
      ].filter(Boolean);

      logger.error(messageParts.join('\n'), {
        guildId: interaction.guild?.id,
      });
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
};
