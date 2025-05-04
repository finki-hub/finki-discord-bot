import {
  ChannelType,
  type ChatInputCommandInteraction,
  type GuildTextBasedChannel,
  SlashCommandBuilder,
} from 'discord.js';

import { getRolesProperty } from '../configuration/main.js';
import { LotteryPollType } from '../lib/schemas/PollType.js';
import { Role } from '../lib/schemas/Role.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponseFunctions,
  commandResponses,
} from '../translations/commands.js';
import { recreateRegularsTemporaryChannel } from '../utils/channels.js';
import { getMemberFromGuild } from '../utils/guild.js';
import {
  isMemberBarred,
  isMemberInRegulars,
  isMemberInVip,
} from '../utils/members.js';
import { createLotteryPoll } from '../utils/polls/core/lottery.js';

const name = 'regulars';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Regulars')
  .addSubcommand((command) =>
    command
      .setName('add')
      .setDescription(commandDescriptions['regulars add'])
      .addUserOption((option) =>
        option
          .setName('user')
          .setDescription('Предлог корисник за член на редовните')
          .setRequired(true),
      ),
  )
  .addSubcommand((command) =>
    command
      .setName('lottery')
      .setDescription(commandDescriptions['regulars lottery'])
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Канал во кој ќе се спроведе лотаријата')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText),
      )
      .addIntegerOption((option) =>
        option
          .setName('duration')
          .setDescription('Времетраење на лотаријата во часови')
          .setRequired(true)
          .setMinValue(1),
      )
      .addBooleanOption((option) =>
        option
          .setName('weighted')
          .setDescription(
            'Дали учесниците со повеќе поени за активност да имаат поголема шанса',
          ),
      )
      .addIntegerOption((option) =>
        option
          .setName('winners')
          .setDescription('Број на извлечени победници')
          .setMinValue(1),
      ),
  )
  .addSubcommand((command) =>
    command
      .setName('remove')
      .setDescription(commandDescriptions['regulars remove'])
      .addUserOption((option) =>
        option
          .setName('user')
          .setDescription('Предлог корисник за член на редовните')
          .setRequired(true),
      ),
  )
  .addSubcommand((command) =>
    command
      .setName('recreate')
      .setDescription(commandDescriptions['regulars recreate']),
  );

const handleRegularsAdd = async (interaction: ChatInputCommandInteraction) => {
  const user = interaction.options.getUser('user', true);
  const member = await getMemberFromGuild(user.id, interaction.guild);

  const regularRole = getRolesProperty(Role.Regulars);

  if (regularRole === undefined) {
    await interaction.editReply(commandErrors.invalidRole);

    return;
  }

  if (member === null) {
    await interaction.editReply(commandErrors.userNotMember);

    return;
  }

  if (await isMemberBarred(user.id)) {
    await interaction.editReply(commandErrors.userBarred);

    return;
  }

  if (isMemberInVip(member)) {
    await interaction.editReply(commandErrors.userVipMember);

    return;
  }

  if (isMemberInRegulars(member)) {
    await interaction.editReply(commandErrors.userRegular);

    return;
  }

  await member.roles.add(regularRole);

  await interaction.editReply(commandResponses.userGivenRegular);
};

const handleRegularsLottery = async (
  interaction: ChatInputCommandInteraction,
) => {
  if (!interaction.channel?.isSendable()) {
    await interaction.editReply({
      content: commandErrors.unsupportedChannelType,
    });

    return;
  }

  const channel = interaction.options.getChannel(
    'channel',
    true,
  ) as GuildTextBasedChannel;
  const duration = interaction.options.getInteger('duration', true);
  const weighted = interaction.options.getBoolean('weighted') ?? false;
  const winnerCount = interaction.options.getInteger('winners') ?? 1;

  const poll = createLotteryPoll(
    LotteryPollType.REGULARS_LOTTERY,
    weighted,
    winnerCount,
    duration,
  );

  await channel.send(poll);

  await interaction.editReply(
    commandResponseFunctions.lotteryPollCreated(channel.id),
  );
};

const handleRegularsRemove = async (
  interaction: ChatInputCommandInteraction,
) => {
  const user = interaction.options.getUser('user', true);
  const member = await getMemberFromGuild(user.id, interaction.guild);

  const regularRole = getRolesProperty(Role.Regulars);

  if (regularRole === undefined) {
    await interaction.editReply(commandErrors.invalidRole);

    return;
  }

  if (member === null) {
    await interaction.editReply(commandErrors.userNotMember);

    return;
  }

  if (isMemberInVip(member)) {
    await interaction.editReply(commandErrors.userVipMember);

    return;
  }

  await member.roles.remove(regularRole);

  await interaction.editReply(commandResponses.userRemovedRegular);
};

const handleRegularsRecreate = async (
  interaction: ChatInputCommandInteraction,
) => {
  await recreateRegularsTemporaryChannel();

  await interaction.editReply(commandResponses.temporaryChannelRecreated);
};

const regularsHandlers = {
  add: handleRegularsAdd,
  lottery: handleRegularsLottery,
  recreate: handleRegularsRecreate,
  remove: handleRegularsRemove,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand in regularsHandlers) {
    await regularsHandlers[subcommand as keyof typeof regularsHandlers](
      interaction,
    );
  }
};
