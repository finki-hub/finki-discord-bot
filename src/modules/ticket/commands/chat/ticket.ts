import { InteractionContextType } from 'discord-api-types/v10';
import {
  type AnyThreadChannel,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

import { executeSubcommand } from '@/common/commands/subcommands.js';
import { Channel } from '@/common/schemas/Channel.js';
import { Role } from '@/common/schemas/Role.js';
import { safeReplyToInteraction } from '@/common/utils/messages.js';
import {
  getChannelsProperty,
  getTicketingProperty,
} from '@/configuration/bot/index.js';
import { getTicketCreateComponents } from '@/modules/ticket/components/components.js';
import { getActiveTickets } from '@/modules/ticket/utils/tickets.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponses,
} from '@/translations/commands.js';
import { labels } from '@/translations/labels.js';
import { ticketMessageFunctions } from '@/translations/tickets.js';

export const name = 'ticket';

export const permissions = {
  permissions: [PermissionFlagsBits.ManageMessages],
  roles: [Role.Moderators],
};
const dateFormatter = new Intl.DateTimeFormat('mk-MK', {
  dateStyle: 'long',
  timeStyle: 'short',
});

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Ticket')
  .addSubcommand((command) =>
    command
      .setName('close')
      .setDescription(commandDescriptions['ticket close']),
  )
  .addSubcommand((command) =>
    command.setName('list').setDescription(commandDescriptions['ticket list']),
  )
  .addSubcommand((command) =>
    command
      .setName('send')
      .setDescription(commandDescriptions['ticket send'])
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Канал во кој да се испрати пораката')
          .setRequired(false),
      ),
  )
  .setContexts(InteractionContextType.Guild)
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

const handleTicketClose = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.guild === null) {
    return;
  }

  const ticketsChannel = await getChannelsProperty(
    Channel.Tickets,
    interaction.guild.id,
  );

  if (
    !interaction.channel?.isThread() ||
    interaction.channel.parentId !== ticketsChannel
  ) {
    await interaction.editReply(commandErrors.invalidChannel);

    return;
  }

  await interaction.editReply(commandResponses.ticketClosed);

  await interaction.channel.setLocked(true);
  await interaction.channel.setArchived(true);
};

const handleTicketList = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.guild === null) {
    return;
  }

  const ticketThreads = await getActiveTickets(interaction.guild);

  if (ticketThreads === undefined || ticketThreads.size === 0) {
    await interaction.editReply(commandErrors.noTickets);

    return;
  }

  ticketThreads.sort((a: AnyThreadChannel, b: AnyThreadChannel) => {
    if (!a.createdTimestamp || !b.createdTimestamp) {
      return 0;
    }

    if (a.createdTimestamp < b.createdTimestamp) {
      return -1;
    }

    if (a.createdTimestamp > b.createdTimestamp) {
      return 1;
    }

    return 0;
  });

  const threadLinks = ticketThreads
    .map(
      (thread: AnyThreadChannel) =>
        `- ${thread.url} (${thread.createdAt ? dateFormatter.format(thread.createdAt) : labels.none})`,
    )
    .join('\n');

  await safeReplyToInteraction(interaction, threadLinks);
};

const handleTicketSend = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.guild === null) {
    return;
  }

  const channelOption = interaction.options.getChannel('channel');
  const targetChannel =
    channelOption === null
      ? interaction.channel
      : await interaction.guild.channels.fetch(channelOption.id);

  if (
    targetChannel === null ||
    !targetChannel.isTextBased() ||
    targetChannel.isDMBased()
  ) {
    await interaction.editReply(commandErrors.invalidChannel);

    return;
  }

  const tickets = await getTicketingProperty('tickets', interaction.guild.id);

  if (tickets === undefined || tickets.length === 0) {
    await interaction.editReply(commandErrors.noTickets);

    return;
  }

  const ticketList = tickets
    .map((ticket) => {
      const description = ticket.description ?? '';
      return `- ${ticket.name}${description ? `: ${description}` : ''}`;
    })
    .join('\n');

  const embed = new EmbedBuilder()
    .setTitle('Тикети')
    .setDescription(ticketMessageFunctions.ticketSendMessage(ticketList))
    .setTimestamp();

  const components = getTicketCreateComponents(tickets);

  await targetChannel.send({
    components,
    embeds: [embed],
  });

  await interaction.editReply(commandResponses.ticketMessageSent);
};

const ticketHandlers = {
  close: handleTicketClose,
  list: handleTicketList,
  send: handleTicketSend,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, ticketHandlers);
};
