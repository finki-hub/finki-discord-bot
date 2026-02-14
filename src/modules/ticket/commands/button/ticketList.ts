import { type AnyThreadChannel, type ButtonInteraction } from 'discord.js';

import { handlePagination } from '@/common/utils/pagination.js';
import { getTicketListComponent } from '@/modules/ticket/components/components.js';
import { getActiveTicketsSorted } from '@/modules/ticket/utils/tickets.js';

export const name = 'ticketList';

export const execute = async (
  interaction: ButtonInteraction,
  args: string[],
) => {
  if (interaction.guild === null) {
    return;
  }

  const ticketThreads = await getActiveTicketsSorted(interaction.guild);

  await handlePagination<AnyThreadChannel>({
    entries: ticketThreads,
    getComponent: getTicketListComponent,
    interaction,
    paginationArguments: args,
  });
};
