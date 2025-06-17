import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import {
  getQuestionComponents,
  getQuestionEmbed,
} from '../../components/commands.js';
import { UsageEventSchema } from '../../lib/schemas/Analytics.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponseFunctions,
} from '../../translations/commands.js';
import { logEvent } from '../../utils/analytics.js';
import { getClosestQuestion } from '../../utils/search.js';

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

    const metadata: Record<string, unknown> = {
      callerId: interaction.user.id,
      channelId: interaction.channel?.id ?? null,
      commandName: interaction.commandName,
      guildId: interaction.guild?.id ?? null,
    };

    const payload: Record<string, unknown> = {
      content: question.content,
      keyword,
      question: question.name,
    };

    if (user === null) {
      const fetched = await interaction.channel?.messages.fetch({ limit: 5 });
      const context = Array.from(fetched?.values() ?? [])
        .slice(-5)
        .map((m) => ({
          authorId: m.author.id,
          content: m.content,
          messageId: m.id,
          timestamp: new Date(m.createdTimestamp).toISOString(),
        }));
      if (context.length > 0) {
        payload['context'] = context;
      }
    } else {
      metadata['targetUserId'] = user.id;
      payload['targetUserMessage'] = question.content;
    }

    const data = UsageEventSchema.parse({
      eventType: 'faq',
      metadata,
      payload,
    });

    await logEvent(data);
  },
});
