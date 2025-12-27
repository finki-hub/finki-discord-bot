import { type ButtonInteraction, ChannelType, MessageFlags } from 'discord.js';

import { getRemindersComponents } from '../components/reminders.js';
import {
  getTicketingProperty,
  getTicketProperty,
} from '../configuration/main.js';
import {
  deleteReminder,
  getReminderById,
  getRemindersByUserId,
} from '../data/database/Reminder.js';
import { Channel } from '../lib/schemas/Channel.js';
import { logger } from '../logger.js';
import { commandErrors, commandResponses } from '../translations/commands.js';
import { logErrorFunctions } from '../translations/logs.js';
import { getChannel } from '../utils/channels.js';
import { getGuild } from '../utils/guild.js';
import { getMembersByRoleIds } from '../utils/roles.js';
import { closeTicket, createTicket } from '../utils/tickets.js';

export const handleReminderDeleteButton = async (
  interaction: ButtonInteraction,
  args: string[],
) => {
  const [reminderId, authorId] = args;

  if (reminderId === undefined || authorId === undefined) {
    await interaction.reply({
      content: commandErrors.commandError,
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  const reminder = await getReminderById(reminderId);

  if (authorId !== interaction.user.id) {
    await interaction.reply({
      content: commandErrors.reminderNoPermission,
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  if (reminder === null) {
    const newReminders = await getRemindersByUserId(authorId);
    const newComponents = getRemindersComponents(newReminders ?? []);

    await interaction.message.edit({
      components: newComponents,
    });

    return;
  }

  if (reminder.userId !== interaction.user.id) {
    return;
  }

  await deleteReminder(reminderId);

  await interaction.reply({
    content: commandResponses.reminderDeleted,
    flags: MessageFlags.Ephemeral,
  });

  const reminders = await getRemindersByUserId(interaction.user.id);
  const components = getRemindersComponents(reminders ?? []);
  await interaction.message.edit({
    components,
  });
};

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
