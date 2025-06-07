import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  type MessageContextMenuCommandInteraction,
} from 'discord.js';

import type { ChatOptions } from '../lib/schemas/Chat.js';

import { getConfigProperty } from '../configuration/main.js';
import { commandErrors } from '../translations/commands.js';
import { sendPrompt } from '../utils/chat.js';
import { safeStreamReplyToInteraction } from '../utils/messages.js';

const name = 'Ask Chatbot';

export const data = new ContextMenuCommandBuilder()
  .setName(name)
  .setType(ApplicationCommandType.Message);

export const execute = async (
  interaction: MessageContextMenuCommandInteraction,
) => {
  const message = interaction.targetMessage;

  const models = getConfigProperty('models');

  const chatOptions: ChatOptions = {
    embeddingsModel: models.embeddings,
    inferenceModel: models.inference,
    query: message.content,
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
};
