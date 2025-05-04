import {
  ChannelType,
  type ChatInputCommandInteraction,
  type GuildTextBasedChannel,
  SlashCommandBuilder,
} from 'discord.js';

import { PollCategory } from '../lib/schemas/PollCategory.js';
import {
  commandDescriptions,
  commandErrorFunctions,
  commandErrors,
  commandResponses,
} from '../translations/commands.js';
import {
  endLotteryPoll,
  getLotteryPollInformation,
} from '../utils/polls/core/lottery.js';

const name = 'lottery';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Lottery')
  .addSubcommand((command) =>
    command
      .setName('end')
      .setDescription(commandDescriptions['lottery end'])
      .addStringOption((option) =>
        option.setName('poll').setDescription('Анкета').setRequired(true),
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Канал')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText),
      )
      .addBooleanOption((option) =>
        option.setName('draw').setDescription('Извлечи победници'),
      ),
  );

const handleLotteryEnd = async (interaction: ChatInputCommandInteraction) => {
  const pollId = interaction.options.getString('poll', true);
  const channel = interaction.options.getChannel(
    'channel',
    true,
  ) as GuildTextBasedChannel;
  const drawWinners = interaction.options.getBoolean('draw') ?? true;

  const message = await channel.messages.fetch(pollId);

  if (message.poll === null) {
    await interaction.editReply(commandErrors.pollNotFound);

    return;
  }

  const { pollType } = getLotteryPollInformation(message.content);

  if (pollType === null) {
    await interaction.editReply(
      commandErrorFunctions.pollNotOfCategory(PollCategory.LOTTERY),
    );

    return;
  }

  await endLotteryPoll(message.poll, drawWinners);

  await interaction.editReply(commandResponses.lotteryEnded);
};

const lotteryHandlers = {
  end: handleLotteryEnd,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand in lotteryHandlers) {
    await lotteryHandlers[subcommand as keyof typeof lotteryHandlers](
      interaction,
    );
  }
};
