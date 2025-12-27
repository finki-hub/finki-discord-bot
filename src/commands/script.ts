import {
  ChannelType,
  type ChatInputCommandInteraction,
  InteractionContextType,
  SlashCommandBuilder,
} from 'discord.js';

import { getTicketCreateComponents } from '../components/tickets.js';
import { getTicketingProperty } from '../configuration/main.js';
import { commandErrors, commandResponses } from '../translations/commands.js';
import {
  ticketMessageFunctions,
  ticketMessages,
} from '../translations/tickets.js';

const name = 'script';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Script')
  .addSubcommand((command) =>
    command
      .setName('tickets')
      .setDescription('Register commands')
      .addChannelOption((option) =>
        option.setName('channel').setDescription('Канал').setRequired(true),
      ),
  )
  .setContexts(InteractionContextType.Guild);

const handleScriptTickets = async (
  interaction: ChatInputCommandInteraction<'cached'>,
) => {
  const channel = interaction.options.getChannel('channel', true);

  if (channel.type !== ChannelType.GuildText) {
    await interaction.editReply(commandErrors.invalidChannel);

    return;
  }

  const tickets = getTicketingProperty('tickets');

  const components = getTicketCreateComponents(tickets ?? []);

  await channel.send({
    allowedMentions: {
      parse: [],
    },
    components,
    content:
      `${ticketMessages.createTicket}\n${ticketMessageFunctions.ticketTypes(
        tickets ?? [],
      )}`.trim(),
  });

  await interaction.editReply(commandResponses.scriptExecuted);
};

const listHandlers = {
  tickets: handleScriptTickets,
};

export const execute = async (
  interaction: ChatInputCommandInteraction<'cached'>,
) => {
  const subcommand = interaction.options.getSubcommand(true);

  if (subcommand in listHandlers) {
    await listHandlers[subcommand as keyof typeof listHandlers](interaction);
  }
};
