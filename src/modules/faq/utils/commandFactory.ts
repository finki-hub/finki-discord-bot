import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { logCommandEvent } from '@/modules/analytics/utils/analytics.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponseFunctions,
} from '@/translations/commands.js';

import {
  getQuestionComponents,
  getQuestionEmbed,
} from '../components/embeds.js';
import { getClosestQuestion } from './search.js';

export const getCommonCommand = (name: keyof typeof commandDescriptions) => ({
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription(commandDescriptions[name])
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription('Прашање')
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addUserOption((option) =>
      option.setName('user').setDescription('Корисник').setRequired(false),
    ),

  execute: async (interaction: ChatInputCommandInteraction) => {
    const keyword = interaction.options.getString('question', true);
    const user = interaction.options.getUser('user');

    const question = await getClosestQuestion(keyword);

    if (question === null) {
      await interaction.editReply(commandErrors.faqNotFound);

      return;
    }

    const embed = getQuestionEmbed(question);
    const components = getQuestionComponents(question);
    await interaction.editReply({
      components,
      content: user ? commandResponseFunctions.commandFor(user.id) : null,
      embeds: [embed],
    });

    await logCommandEvent(interaction, {
      basePayload: {
        content: question.content,
        keyword,
        question: question.name,
      },
      eventType: 'faq',
    });
  },
});
