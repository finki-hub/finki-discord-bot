import {
  type AnyThreadChannel,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { Channel } from '@/common/schemas/Channel.js';
import { Role } from '@/common/schemas/Role.js';
import { safeReplyToInteraction } from '@/common/utils/messages.js';
import { getChannelsProperty } from '@/configuration/bot/index.js';
import { getActiveTickets } from '@/modules/ticket/utils/tickets.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponses,
} from '@/translations/commands.js';
import { labels } from '@/translations/labels.js';

export const name = 'ticket';

export const permissions = {
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
  );

const handleTicketClose = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.guild === null) {
    await interaction.editReply(commandErrors.commandGuildOnly);
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
    await interaction.editReply(commandErrors.commandGuildOnly);
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

import { executeSubcommand } from '@/common/commands/subcommands.js';

const ticketHandlers = {
  close: handleTicketClose,
  list: handleTicketList,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, ticketHandlers);
};
