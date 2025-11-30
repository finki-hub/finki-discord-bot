import { codeBlock, type ModalSubmitInteraction } from 'discord.js';

import { SubmitAocAnswerOptionsSchema } from '../lib/schemas/Aoc.js';
import { commandErrors } from '../translations/commands.js';
import {
  submitAocAnswer,
  submitAocBonusAnswer,
} from '../utils/aoc/requests.js';

export const handleAocSubmitModal = async (
  interaction: ModalSubmitInteraction,
) => {
  const answer = interaction.fields.getTextInputValue('aoc-answer');
  const userId = interaction.user.id;

  const options = SubmitAocAnswerOptionsSchema.parse({
    answer,
    userId,
  });

  const result = await submitAocAnswer(options);

  if (result === null) {
    await interaction.editReply(commandErrors.aocSubmitFailed);

    return;
  }

  await interaction.editReply(result.message);
};

export const handleAocSubmitBonusModal = async (
  interaction: ModalSubmitInteraction,
) => {
  const answer = interaction.fields.getTextInputValue('aoc-bonus-answer');
  const userId = interaction.user.id;

  const options = SubmitAocAnswerOptionsSchema.parse({
    answer,
    userId,
  });

  const result = await submitAocBonusAnswer(options);

  if (result === null) {
    await interaction.editReply(commandErrors.aocSubmitFailed);

    return;
  }

  await interaction.editReply(
    result.message +
      (result.diploma
        ? `\nYour diploma: ${codeBlock('json', result.diploma)}`
        : ''),
  );
};
