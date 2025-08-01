import {
  type ChatInputCommandInteraction,
  roleMention,
  SlashCommandBuilder,
  userMention,
} from 'discord.js';

import {
  getChannelsProperty,
  getRolesProperty,
} from '../configuration/main.js';
import { Channel } from '../lib/schemas/Channel.js';
import { PollCategory } from '../lib/schemas/PollCategory.js';
import { SpecialPollType } from '../lib/schemas/PollType.js';
import { Role } from '../lib/schemas/Role.js';
import {
  commandDescriptions,
  commandErrorFunctions,
  commandErrors,
  commandResponseFunctions,
  commandResponses,
} from '../translations/commands.js';
import { labels } from '../translations/labels.js';
import { POLL_TYPE_LABELS } from '../translations/polls.js';
import { formatUsers } from '../translations/users.js';
import { getChannel } from '../utils/channels.js';
import { createCommandChoices } from '../utils/commands.js';
import { getGuild, getMemberFromGuild } from '../utils/guild.js';
import { isMemberAdmin, isMemberBarred } from '../utils/members.js';
import { safeReplyToInteraction } from '../utils/messages.js';
import {
  executeBarPollAction,
  executeUnbarPollAction,
} from '../utils/polls/actions/special.js';
import { SPECIAL_POLL_OPTIONS } from '../utils/polls/constants.js';
import {
  createSpecialPoll,
  decideSpecialPollForcefully,
  getActiveSpecialPolls,
  getSpecialPollInformation,
  isSpecialPollDuplicate,
} from '../utils/polls/core/special.js';
import { getVoters } from '../utils/polls/utils.js';
import { getMembersByRoleIds } from '../utils/roles.js';

const name = 'special';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Special')
  .addSubcommand((command) =>
    command.setName('list').setDescription(commandDescriptions['special list']),
  )
  .addSubcommand((command) =>
    command
      .setName('delete')
      .setDescription(commandDescriptions['special delete'])
      .addStringOption((option) =>
        option.setName('poll').setDescription('Анкета').setRequired(true),
      ),
  )
  .addSubcommand((command) =>
    command
      .setName('override')
      .setDescription(commandDescriptions['special override'])
      .addStringOption((option) =>
        option.setName('poll').setDescription('Анкета').setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('decision')
          .setDescription('Одлука')
          .setRequired(false)
          .addChoices(...createCommandChoices(SPECIAL_POLL_OPTIONS)),
      ),
  )
  .addSubcommand((command) =>
    command
      .setName('remaining')
      .setDescription(commandDescriptions['special remaining'])
      .addStringOption((option) =>
        option.setName('poll').setDescription('Анкета').setRequired(true),
      ),
  )
  .addSubcommand((command) =>
    command
      .setName('bar')
      .setDescription(commandDescriptions['special bar'])
      .addUserOption((option) =>
        option.setName('user').setDescription('Корисник').setRequired(true),
      )
      .addBooleanOption((option) =>
        option
          .setName('notify')
          .setDescription('Испрати нотификација')
          .setRequired(false),
      )
      .addBooleanOption((option) =>
        option
          .setName('force')
          .setDescription('Форсирај одлука')
          .setRequired(false),
      ),
  )
  .addSubcommand((command) =>
    command
      .setName('unbar')
      .setDescription(commandDescriptions['special unbar'])
      .addUserOption((option) =>
        option.setName('user').setDescription('Корисник').setRequired(true),
      )
      .addBooleanOption((option) =>
        option
          .setName('notify')
          .setDescription('Испрати нотификација')
          .setRequired(false),
      )
      .addBooleanOption((option) =>
        option
          .setName('force')
          .setDescription('Форсирај одлука')
          .setRequired(false),
      ),
  );

const handleSpecialList = async (interaction: ChatInputCommandInteraction) => {
  const polls = await getActiveSpecialPolls();
  const pollsInfo = polls.map((poll) =>
    getSpecialPollInformation(poll.message.content),
  );

  const output = pollsInfo.map(({ pollType, userId }, index) => {
    if (pollType === null || userId === null) {
      return '';
    }

    return `${index + 1}. ${POLL_TYPE_LABELS[pollType]} ${userMention(userId)}`;
  });

  await safeReplyToInteraction(interaction, output.join('\n'));
};

const handleSpecialDelete = async (
  interaction: ChatInputCommandInteraction,
) => {
  const pollId = interaction.options.getString('poll', true);
  const channel = getChannel(Channel.Management);

  if (channel === undefined) {
    await interaction.editReply(commandErrors.invalidChannel);

    return;
  }

  const message = await channel.messages.fetch(pollId);
  await message.poll?.end();

  await interaction.editReply(commandResponses.pollDeleted);
};

const handleSpecialOverride = async (
  interaction: ChatInputCommandInteraction,
) => {
  const pollId = interaction.options.getString('poll', true);
  const decision = interaction.options.getString('decision');
  const channel = getChannel(Channel.Management);

  if (channel === undefined) {
    await interaction.editReply(commandErrors.invalidChannel);

    return;
  }

  const message = await channel.messages.fetch(pollId);

  if (message.poll === null) {
    await interaction.editReply(commandErrors.pollNotFound);

    return;
  }

  const { pollType } = getSpecialPollInformation(message.content);

  if (pollType === null) {
    await interaction.editReply(
      commandErrorFunctions.pollNotOfCategory(PollCategory.SPECIAL),
    );

    return;
  }

  await decideSpecialPollForcefully(message.poll, decision);

  await interaction.editReply(
    decision
      ? commandResponseFunctions.pollOverriden(decision)
      : commandResponses.pollOverridden,
  );
};

const handleSpecialRemaining = async (
  interaction: ChatInputCommandInteraction,
) => {
  const guild = await getGuild(interaction);

  if (guild === null) {
    await interaction.editReply(commandErrors.guildFetchFailed);

    return;
  }

  const pollId = interaction.options.getString('poll', true);
  const managementChannel = getChannel(Channel.Management);

  if (managementChannel === undefined) {
    await interaction.editReply(commandErrors.invalidChannel);

    return;
  }

  const message = await managementChannel.messages.fetch(pollId);
  const poll = message.poll;

  if (poll === null) {
    await interaction.editReply(commandErrors.pollNotFound);

    return;
  }

  const { pollType } = getSpecialPollInformation(message.content);

  if (pollType === null) {
    await interaction.editReply(
      commandErrorFunctions.pollNotOfCategory(PollCategory.SPECIAL),
    );

    return;
  }

  const managementRole = getRolesProperty(Role.Management);

  if (managementRole === undefined) {
    await interaction.editReply(commandErrors.invalidRole);

    return;
  }

  const voters = await getVoters(poll);
  const allVoters = await getMembersByRoleIds(guild, [managementRole]);
  const missingVoters = allVoters.filter((voter) => !voters.includes(voter));
  const missingVotersMembers = missingVoters
    .map((id) => guild.members.cache.get(id))
    .filter((member) => member !== undefined);
  const missingVotersFormatted = formatUsers(
    labels.remaining,
    missingVotersMembers.map(({ user }) => user),
  );

  await safeReplyToInteraction(interaction, missingVotersFormatted);
};

const handleSpecialBar = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.channel?.isSendable()) {
    await interaction.editReply({
      content: commandErrors.unsupportedChannelType,
    });

    return;
  }

  const user = interaction.options.getUser('user', true);
  const notify = interaction.options.getBoolean('notify') ?? true;
  const force = interaction.options.getBoolean('force') ?? false;
  const managementChannelId = getChannelsProperty(Channel.Management);
  const member = await getMemberFromGuild(user.id, interaction.guild);

  if (member === null) {
    await interaction.editReply(commandErrors.userNotMember);

    return;
  }

  if (force) {
    const authorMember = await getMemberFromGuild(
      interaction.user.id,
      interaction.guild,
    );

    if (!authorMember || !isMemberAdmin(authorMember)) {
      await interaction.editReply(commandErrors.userNotAdmin);

      return;
    }

    await executeBarPollAction(member, labels.yes, true);
    await interaction.editReply(commandResponses.pollOverridden);

    return;
  }

  if (interaction.channelId !== managementChannelId) {
    await interaction.editReply({
      content: commandErrors.invalidChannel,
    });

    return;
  }

  if (user.bot) {
    await interaction.editReply(commandErrors.userBot);

    return;
  }

  if (await isMemberBarred(user.id)) {
    await interaction.editReply(commandErrors.userBarred);

    return;
  }

  if (isMemberAdmin(member)) {
    await interaction.editReply(commandErrors.userAdmin);

    return;
  }

  const isDuplicate = await isSpecialPollDuplicate(
    SpecialPollType.BAR,
    user.id,
  );

  if (isDuplicate) {
    await interaction.editReply(commandErrors.userSpecialPending);

    return;
  }

  const poll = createSpecialPoll(SpecialPollType.BAR, user);
  const managementRoleId = getRolesProperty(Role.Management);

  if (notify && managementRoleId !== undefined) {
    await interaction.channel.send(roleMention(managementRoleId));
  }

  await interaction.editReply(poll);
};

const handleSpecialUnbar = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.channel?.isSendable()) {
    await interaction.editReply({
      content: commandErrors.unsupportedChannelType,
    });

    return;
  }

  const user = interaction.options.getUser('user', true);
  const notify = interaction.options.getBoolean('notify') ?? true;
  const force = interaction.options.getBoolean('force') ?? false;
  const managementChannelId = getChannelsProperty(Channel.Management);
  const member = await getMemberFromGuild(user.id, interaction.guild);

  if (member === null) {
    await interaction.editReply(commandErrors.userNotMember);

    return;
  }

  if (force) {
    const authorMember = await getMemberFromGuild(
      interaction.user.id,
      interaction.guild,
    );

    if (!authorMember || !isMemberAdmin(authorMember)) {
      await interaction.editReply(commandErrors.userNotAdmin);

      return;
    }

    await executeUnbarPollAction(member, labels.yes, true);
    await interaction.editReply(commandResponses.pollOverridden);

    return;
  }

  if (interaction.channelId !== managementChannelId) {
    await interaction.editReply({
      content: commandErrors.invalidChannel,
    });

    return;
  }

  if (!(await isMemberBarred(user.id))) {
    await interaction.editReply(commandErrors.userNotBarred);

    return;
  }

  const isDuplicate = await isSpecialPollDuplicate(
    SpecialPollType.UNBAR,
    user.id,
  );

  if (isDuplicate) {
    await interaction.editReply(commandErrors.userSpecialPending);

    return;
  }

  const poll = createSpecialPoll(SpecialPollType.UNBAR, user);
  const managementRoleId = getRolesProperty(Role.Management);

  if (notify && managementRoleId !== undefined) {
    await interaction.channel.send(roleMention(managementRoleId));
  }

  await interaction.editReply(poll);
};

const specialHandlers = {
  bar: handleSpecialBar,
  delete: handleSpecialDelete,
  list: handleSpecialList,
  override: handleSpecialOverride,
  remaining: handleSpecialRemaining,
  unbar: handleSpecialUnbar,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand in specialHandlers) {
    await specialHandlers[subcommand as keyof typeof specialHandlers](
      interaction,
    );
  }
};
