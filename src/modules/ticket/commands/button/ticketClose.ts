import { type ButtonInteraction } from 'discord.js';

import { closeTicket } from '@/modules/ticket/utils/tickets.js';
import { commandErrors } from '@/translations/commands.js';

export const name = 'ticketClose';

export const execute = async (
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
