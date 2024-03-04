import { createReminder } from '../data/Reminder.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponseFunctions,
} from '../translations/commands.js';
import { parseDate } from 'chrono-node';
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  time,
} from 'discord.js';

const name = 'reminder';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Reminder')
  .addSubcommand((command) =>
    command
      .setName('create')
      .setDescription(commandDescriptions['reminder create'])
      .addStringOption((option) =>
        option.setName('description').setDescription('Опис').setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('when')
          .setDescription('Датум и/или време')
          .setRequired(true),
      ),
  );

const handleReminderCreate = async (
  interaction: ChatInputCommandInteraction,
) => {
  const description = interaction.options.getString('description', true);
  const when = interaction.options.getString('when', true);

  const date = parseDate(when);

  if (date === null || date === undefined) {
    await interaction.editReply(commandErrors.invalidDateTime);

    return;
  }

  await createReminder({
    channelId: interaction.channelId,
    description,
    privateMessage:
      interaction.channel === null || interaction.channel.isDMBased(),
    timestamp: date,
    userId: interaction.user.id,
  });

  await interaction.editReply({
    allowedMentions: {
      parse: [],
    },
    content: commandResponseFunctions.reminderCreated(
      time(date, 'F'),
      description,
    ),
  });
};

const reminderHandlers = {
  create: handleReminderCreate,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const subcommand = interaction.options.getSubcommand(true);

  if (subcommand in reminderHandlers) {
    await reminderHandlers[subcommand as keyof typeof reminderHandlers](
      interaction,
    );
  }
};
