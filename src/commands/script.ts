import {
  ChannelType,
  type ChatInputCommandInteraction,
  type GuildBasedChannel,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

import {
  getSpecialRequestComponents,
  getSpecialRequestEmbed,
} from '../components/scripts.js';
import { getTicketCreateComponents } from '../components/tickets.js';
import { getTicketingProperty } from '../configuration/main.js';
import { logger } from '../logger.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponses,
} from '../translations/commands.js';
import { logErrorFunctions } from '../translations/logs.js';
import {
  ticketMessageFunctions,
  ticketMessages,
} from '../translations/tickets.js';

const name = 'script';
const permission = PermissionFlagsBits.Administrator;

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Script')
  .addSubcommand((command) =>
    command
      .setName('special')
      .setDescription(commandDescriptions['script special'])
      .addChannelOption((option) =>
        option.setName('channel').setDescription('Канал').setRequired(true),
      ),
  )
  .addSubcommand((command) =>
    command
      .setName('tickets')
      .setDescription('Register commands')
      .addChannelOption((option) =>
        option.setName('channel').setDescription('Канал').setRequired(true),
      ),
  )
  .setDefaultMemberPermissions(permission);

const handleScriptSpecial = async (
  interaction: ChatInputCommandInteraction,
) => {
  const channel = interaction.options.getChannel(
    'channel',
    true,
  ) as GuildBasedChannel;

  if (!channel.isTextBased() || channel.isDMBased()) {
    await interaction.editReply(commandErrors.invalidChannel);

    return;
  }

  const embed = getSpecialRequestEmbed();
  const components = getSpecialRequestComponents();
  try {
    await channel.send({
      components,
      embeds: [embed],
    });
    await interaction.editReply(commandResponses.scriptExecuted);
  } catch (error) {
    await interaction.editReply(commandErrors.scriptNotExecuted);
    logger.error(logErrorFunctions.scriptExecutionError(error));
  }
};

const handleScriptTickets = async (
  interaction: ChatInputCommandInteraction,
) => {
  const channel = interaction.options.getChannel(
    'channel',
    true,
  ) as GuildBasedChannel;

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
  special: handleScriptSpecial,
  tickets: handleScriptTickets,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const subcommand = interaction.options.getSubcommand(true);

  if (subcommand in listHandlers) {
    await listHandlers[subcommand as keyof typeof listHandlers](interaction);
  }
};
