import { type ButtonInteraction, ChannelType } from 'discord.js';

import {
  getTicketingProperty,
  getTicketProperty,
} from '../configuration/main.js';
import { Channel } from '../lib/schemas/Channel.js';
import { logger } from '../logger.js';
import { commandErrors } from '../translations/commands.js';
import { logErrorFunctions } from '../translations/logs.js';
import { getChannel } from '../utils/channels.js';
import { getGuild } from '../utils/guild.js';
import { getMembersByRoleIds } from '../utils/roles.js';
import { closeTicket, createTicket } from '../utils/tickets.js';

export const handleTicketCreateButton = async (
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
    logger.warn(
      logErrorFunctions.buttonInteractionOutsideGuildError(
        interaction.customId,
      ),
    );

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

export const handleTicketCloseButton = async (
  interaction: ButtonInteraction,
  args: string[],
) => {
  const ticketId = args[0];

  if (ticketId === undefined) {
    await interaction.reply(commandErrors.invalidTicket);

    return;
  }

  await closeTicket(ticketId);
  await interaction.deferUpdate();
};
