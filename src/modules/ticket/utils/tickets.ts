import {
  type AnyThreadChannel,
  type ButtonInteraction,
  ChannelType,
  type ChatInputCommandInteraction,
  type Collection,
  type Guild,
  roleMention,
  ThreadAutoArchiveDuration,
} from 'discord.js';

import { logger } from '@/common/logger/index.js';
import { Channel } from '@/common/schemas/Channel.js';
import { getChannel } from '@/common/services/channels.js';
import { getChannelsProperty } from '@/configuration/bot/index.js';
import { client } from '@/core/client.js';
import {
  ticketMessageFunctions,
  ticketMessages,
} from '@/translations/tickets.js';

import { getTicketCloseComponents } from '../components/components.js';
import { type Ticket } from '../schemas/Ticket.js';
import { MAX_TICKET_INACTIVITY_MILLISECONDS } from './constants.js';

export const getActiveTickets = async (
  guild: Guild,
): Promise<Collection<string, AnyThreadChannel> | undefined> => {
  const ticketsChannelId = await getChannelsProperty(Channel.Tickets, guild.id);

  if (ticketsChannelId === undefined) {
    return undefined;
  }

  const threads = guild.channels.cache.filter(
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
): Promise<void> => {
  if (interaction.guild === null) {
    return;
  }

  const ticketsChannel = getChannel(Channel.Tickets, interaction.guild.id);

  if (ticketsChannel?.type !== ChannelType.GuildText) {
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

export const closeTicket = async (ticketId: string, guildId: string) => {
  const ticketsChannel = getChannel(Channel.Tickets, guildId);

  if (ticketsChannel?.type !== ChannelType.GuildText) {
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
  await client.guilds.fetch();

  for (const guild of client.guilds.cache.values()) {
    const ticketsChannelId = await getChannelsProperty(
      Channel.Tickets,
      guild.id,
    );
    if (ticketsChannelId === undefined) {
      continue;
    }

    const ticketThreads = guild.channels.cache.filter(
      (channel): channel is AnyThreadChannel =>
        channel.isThread() &&
        channel.parentId === ticketsChannelId &&
        !channel.archived &&
        !channel.locked,
    );

    if (ticketThreads.size === 0) {
      continue;
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
        MAX_TICKET_INACTIVITY_MILLISECONDS
      ) {
        await closeTicket(thread.id, guild.id);
      }
    }
  }
};
