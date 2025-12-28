import { type ButtonInteraction, ChannelType } from 'discord.js';

import { Channel } from '@/common/schemas/Channel.js';
import { getChannel } from '@/common/services/channels.js';
import { getMembersByRoleIds } from '@/common/services/roles.js';
import { getGuild } from '@/common/utils/guild.js';
import {
  getTicketingProperty,
  getTicketProperty,
} from '@/configuration/bot/index.js';
import { createTicket } from '@/modules/ticket/utils/tickets.js';
import { commandErrors } from '@/translations/commands.js';

export const name = 'ticketCreate';

export const execute = async (
  interaction: ButtonInteraction,
  args: string[],
) => {
  const guild = await getGuild(interaction);
  const ticketType = args[0];

  const enabled = getTicketingProperty('enabled');

  if (!enabled) {
    await interaction.editReply(commandErrors.ticketingDisabled);
  }

  if (ticketType === undefined) {
    await interaction.editReply(commandErrors.invalidTicketType);

    return;
  }

  const ticketMetadata = getTicketProperty(ticketType);

  if (ticketMetadata === undefined) {
    await interaction.editReply(commandErrors.invalidTicketType);

    return;
  }

  if (guild === null) {
    await interaction.editReply(commandErrors.commandGuildOnly);
    return;
  }

  const ticketsChannel = getChannel(Channel.Tickets);

  if (
    ticketsChannel === undefined ||
    ticketsChannel.type !== ChannelType.GuildText
  ) {
    await interaction.editReply(commandErrors.invalidChannel);

    return;
  }

  if (ticketMetadata.roles.length === 0) {
    await interaction.editReply(commandErrors.noTicketMembers);

    return;
  }

  const ticketRoleMembers = await getMembersByRoleIds(
    guild,
    ticketMetadata.roles,
  );

  if (ticketRoleMembers.length === 0) {
    await interaction.editReply(commandErrors.noTicketMembers);

    return;
  }

  await createTicket(interaction, ticketMetadata);
};
