import {
  type ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';

import { executeSubcommand } from '@/common/commands/subcommands.js';
import { getMemberFromGuild } from '@/common/utils/guild.js';
import { client } from '@/core/client.js';
import {
  commandRequiresPermissions,
  getCommandsWithPermission,
} from '@/core/utils/permissions.js';
import { getLinks, getQuestions } from '@/modules/faq/utils/api.js';
import {
  getListCommandsComponent,
  getListLinksComponent,
  getListQuestionsComponent,
} from '@/modules/list/components/components.js';
import { commandDescriptions, commandErrors } from '@/translations/commands.js';

export const name = 'list';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('List')
  .addSubcommand((command) =>
    command
      .setName('commands')
      .setDescription(commandDescriptions['list commands']),
  )
  .addSubcommand((command) =>
    command.setName('links').setDescription(commandDescriptions['list links']),
  )
  .addSubcommand((command) =>
    command
      .setName('questions')
      .setDescription(commandDescriptions['list questions']),
  );

export const handleListCommands = async (
  interaction: ChatInputCommandInteraction,
) => {
  await client.application?.commands.fetch();

  let commands: string[];

  if (interaction.guild === null) {
    commands = Object.keys(commandDescriptions).filter(
      (command) => !commandRequiresPermissions(command),
    );
  } else {
    const member = await getMemberFromGuild(
      interaction.user.id,
      interaction.guild,
    );

    if (member === null) {
      await interaction.reply({
        content: commandErrors.commandNoPermission,
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    commands = await getCommandsWithPermission(member);
  }

  await interaction.reply({
    components: [getListCommandsComponent(commands, 0)],
    flags: MessageFlags.IsComponentsV2,
  });
};

const handleListLinks = async (interaction: ChatInputCommandInteraction) => {
  const links = await getLinks();

  if (links === null) {
    await interaction.reply({
      content: commandErrors.linksFetchFailed,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.reply({
    components: [getListLinksComponent(links, 0)],
    flags: MessageFlags.IsComponentsV2,
  });
};

const handleListQuestions = async (
  interaction: ChatInputCommandInteraction,
) => {
  const questions = await getQuestions();

  if (questions === null) {
    await interaction.reply({
      content: commandErrors.questionsFetchFailed,
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  await interaction.reply({
    components: [getListQuestionsComponent(questions, 0)],
    flags: MessageFlags.IsComponentsV2,
  });
};

const listHandlers = {
  commands: handleListCommands,
  links: handleListLinks,
  questions: handleListQuestions,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await executeSubcommand(interaction, listHandlers);
};
