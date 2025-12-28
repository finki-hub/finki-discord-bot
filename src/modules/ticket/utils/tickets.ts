import {
  type AnyThreadChannel,
  type ButtonInteraction,
  ChannelType,
  type ChatInputCommandInteraction,
  roleMention,
  ThreadAutoArchiveDuration,
} from 'discord.js';

import { logger } from '@/common/logger/index.js';
import { Channel } from '@/common/schemas/Channel.js';
import { getChannel } from '@/common/services/channels.js';
import { getGuild } from '@/common/utils/guild.js';
import {
  getChannelsProperty,
  getTicketingProperty,
} from '@/configuration/bot/index.js';
import {
  ticketMessageFunctions,
  ticketMessages,
} from '@/translations/tickets.js';

import { getTicketCloseComponents } from '../components/components.js';
import { type Ticket } from '../schemas/Ticket.js';

export const getActiveTickets = async (
  interaction?: ChatInputCommandInteraction,
) => {
  const guild = await getGuild(interaction);
  const ticketsChannelId = getChannelsProperty(Channel.Tickets);

  const threads = guild?.channels.cache.filter(
    (channel): channel is AnyThreadChannel =>
      channel.isThread() &&
      channel.parentId === ticketsChannelId &&
      !channel.archived &&
      !channel.locked,
  );

  return threads;
};

export const createTicket = async (
  interaction: ButtonInteraction | ChatInputCommandInteraction,
  ticketMetadata: Ticket,
) => {
  const ticketsChannel = getChannel(Channel.Tickets);

  if (
    ticketsChannel === undefined ||
    ticketsChannel.type !== ChannelType.GuildText
  ) {
    return;
  }

  const ticketChannel = await ticketsChannel.threads.create({
    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
    invitable: false,
    name: `${interaction.user.tag} - ${ticketMetadata.name}`,
    type: ChannelType.PrivateThread,
  });

  await ticketChannel.send(
    ticketMessageFunctions.ticketCreated(interaction.user.id),
  );

  const components = getTicketCloseComponents(ticketChannel.id);
  await ticketChannel.send({
    components,
    content: ticketMessages.sendMessage,
  });

  await interaction.editReply(
    ticketMessageFunctions.ticketLink(ticketChannel.url),
  );

  const collector = ticketChannel.createMessageCollector({
    time: 1_800_000,
  });

  collector.once('collect', async () => {
    await ticketChannel.send(
      ticketMessageFunctions.ticketStarted(
        ticketMetadata.roles.map((role) => roleMention(role)).join(' '),
      ),
    );

    collector.stop();
  });

  collector.on('end', async (messages) => {
    if (messages.size > 0) {
      return;
    }

    await ticketChannel.delete();
  });
};

export const closeTicket = async (ticketId: string) => {
  const ticketsChannel = getChannel(Channel.Tickets);

  if (
    ticketsChannel === undefined ||
    ticketsChannel.type !== ChannelType.GuildText
  ) {
    return;
  }

  const ticketChannel = ticketsChannel.threads.cache.get(ticketId);

  if (ticketChannel === undefined) {
    return;
  }

  await ticketChannel.setLocked(true);
  await ticketChannel.setArchived(true);

  logger.info(`Closed ticket ${ticketId}`);
};

export const closeInactiveTickets = async () => {
  const allowedInactivityDays = getTicketingProperty('allowedInactivityDays');

  const maxTicketInactivityMilliseconds = allowedInactivityDays * 86_400_000;

  const ticketThreads = await getActiveTickets();

  if (ticketThreads === undefined || ticketThreads.size === 0) {
    return;
  }

  for (const thread of ticketThreads.values()) {
    await thread.messages.fetch();
    const lastMessage = thread.lastMessage;

    if (lastMessage === null) {
      continue;
    }

    const lastMessageDate = lastMessage.createdAt;

    if (
      Date.now() - lastMessageDate.getTime() >
      maxTicketInactivityMilliseconds
    ) {
      await closeTicket(thread.id);
    }
  }
};
