import {
  type AutocompleteInteraction,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  inlineCode,
  type MessageContextMenuCommandInteraction,
  type ModalSubmitInteraction,
  type UserContextMenuCommandInteraction,
} from 'discord.js';

import { logger } from '@/common/logger/index.js';
import { getMemberFromGuild } from '@/common/utils/guild.js';
import { commandErrors } from '@/translations/commands.js';

import { hasCommandPermission } from '../utils/permissions.js';
import {
  getAutocompleteCommand,
  getButtonCommand,
  getChatCommand,
  getContextMenuCommand,
} from './modules.js';

// Commands that don't require deferReply
const nonDeferredCommands = new Set<string>();

// Helper to safely respond to autocomplete interactions
// Silently handles "already acknowledged" errors which are expected in some cases
const safeAutocompleteRespond = async (
  interaction: AutocompleteInteraction,
  choices: Array<{ name: string; value: string }>,
) => {
  try {
    await interaction.respond(choices);
  } catch (error) {
    // Ignore if already responded or timed out - this is expected in some cases
    const errorMessage = Error.isError(error) ? error.message : String(error);
    if (!errorMessage.includes('already been acknowledged')) {
      logger.error(
        `Failed responding to autocomplete interaction by ${interaction.user.tag}\n${String(error)}`,
      );
    }
  }
};

export const handleChatInputCommand = async (
  interaction: ChatInputCommandInteraction,
) => {
  const command = getChatCommand(interaction.commandName);

  if (command === undefined) {
    logger.warn(`Command for interaction ${interaction.commandName} not found`);
    await interaction.reply({
      content: commandErrors.commandError,
      ephemeral: true,
    });
    return;
  }

  const member = await getMemberFromGuild(
    interaction.user.id,
    interaction.guild,
  );

  if (member === null) {
    logger.error(
      `Failed handling chat input interaction ${interaction.commandName}\nInteraction outside of guild`,
    );
    await interaction.reply({
      content: commandErrors.commandError,
      ephemeral: true,
    });
    return;
  }

  const subcommand = interaction.options.getSubcommand(false);
  const commandWithSubcommand = subcommand
    ? `${interaction.commandName} ${subcommand}`
    : interaction.commandName;

  if (!hasCommandPermission(member, commandWithSubcommand)) {
    await interaction.reply({
      content: commandErrors.commandNoPermission,
      ephemeral: true,
    });
    return;
  }

  if (!nonDeferredCommands.has(interaction.commandName)) {
    try {
      await interaction.deferReply();
    } catch (error) {
      logger.error(
        `Failed deferring chat input interaction ${interaction.commandName}\n${String(error)}`,
      );
      await interaction.reply({
        content: commandErrors.commandError,
        ephemeral: true,
      });
      return;
    }
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(
      `Failed executing chat input command ${inlineCode(interaction.commandName)}\n${String(error)}`,
    );

    const errorMessage =
      interaction.deferred || interaction.replied
        ? commandErrors.commandError
        : commandErrors.commandError;

    await (interaction.deferred || interaction.replied
      ? interaction.editReply(errorMessage)
      : interaction.reply({
          content: errorMessage,
          ephemeral: true,
        }));
  }
};

export const handleButton = async (interaction: ButtonInteraction) => {
  const [commandName, ...args] = interaction.customId.split(':');

  if (!commandName) {
    logger.error(`Command for interaction ${interaction.id} not found`);
    await interaction.reply({
      content: commandErrors.commandError,
      ephemeral: true,
    });
    return;
  }

  const command = getButtonCommand(commandName);

  if (command === undefined) {
    logger.error(`Command for interaction ${interaction.id} not found`);
    await interaction.reply({
      content: commandErrors.commandError,
      ephemeral: true,
    });
    return;
  }

  const member = await getMemberFromGuild(
    interaction.user.id,
    interaction.guild,
  );

  if (member === null) {
    logger.error(
      `Received button interaction ${interaction.customId} outside of a guild`,
    );
    await interaction.reply({
      content: commandErrors.commandError,
      ephemeral: true,
    });
    return;
  }

  if (!hasCommandPermission(member, command.name)) {
    await interaction.reply({
      content: commandErrors.commandNoPermission,
      ephemeral: true,
    });
    return;
  }

  try {
    if (!nonDeferredCommands.has(command.name)) {
      await interaction.deferReply({ ephemeral: true });
    }
    await command.execute(interaction, args);
  } catch (error) {
    logger.error(
      `Failed executing button interaction ${interaction.customId}\n${String(error)}`,
    );

    await (interaction.deferred || interaction.replied
      ? interaction.editReply({
          content: commandErrors.commandError,
        })
      : interaction.reply({
          content: commandErrors.commandError,
          ephemeral: true,
        }));
  }
};

export const handleAutocomplete = async (
  interaction: AutocompleteInteraction,
) => {
  const command = getAutocompleteCommand(interaction.commandName);

  if (command === undefined) {
    await safeAutocompleteRespond(interaction, []);
    return;
  }

  let responded = false;
  const originalRespond = interaction.respond.bind(interaction);

  // Wrap the interaction to track if respond was called
  const wrappedInteraction = Object.assign(interaction, {
    respond: async (
      choices: Array<{ name: string; value: string }>,
    ): Promise<void> => {
      responded = true;
      await originalRespond(choices);
    },
  });

  try {
    await command.execute(wrappedInteraction);
  } catch (error) {
    logger.error(
      `Failed executing autocomplete interaction ${interaction.options.getFocused(true).name}\n${String(error)}`,
    );
  } finally {
    // Ensure we always respond, even if the command didn't or returned early
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!responded) {
      await safeAutocompleteRespond(interaction, []);
    }
  }
};

export const handleUserContextMenuCommand = async (
  interaction: UserContextMenuCommandInteraction,
) => {
  const command = getContextMenuCommand(interaction.commandName);

  const member = await getMemberFromGuild(
    interaction.user.id,
    interaction.guild,
  );

  if (member === null) {
    logger.error(
      `Failed handling user context menu interaction ${interaction.commandName}\nInteraction outside of guild`,
    );
    await interaction.reply({
      content: commandErrors.commandError,
      ephemeral: true,
    });
    return;
  }

  if (command === undefined) {
    logger.warn(`Command for interaction ${interaction.commandName} not found`);
    await interaction.reply({
      content: commandErrors.commandError,
      ephemeral: true,
    });
    return;
  }

  if (!hasCommandPermission(member, interaction.commandName)) {
    await interaction.reply({
      content: commandErrors.commandNoPermission,
      ephemeral: true,
    });
    return;
  }

  try {
    if (!nonDeferredCommands.has(command.name)) {
      await interaction.deferReply();
    }

    await command.execute(interaction);
  } catch (error) {
    logger.error(
      `Failed executing context menu command ${inlineCode(interaction.commandName)}\n${String(error)}`,
    );

    await (interaction.deferred || interaction.replied
      ? interaction.editReply({
          content: commandErrors.commandError,
        })
      : interaction.reply({
          content: commandErrors.commandError,
          ephemeral: true,
        }));
  }
};

export const handleMessageContextMenuCommand = async (
  interaction: MessageContextMenuCommandInteraction,
) => {
  const command = getContextMenuCommand(interaction.commandName);

  const member = await getMemberFromGuild(
    interaction.user.id,
    interaction.guild,
  );

  if (member === null) {
    logger.error(
      `Failed handling message context menu interaction ${interaction.commandName}\nInteraction outside of guild`,
    );
    await interaction.reply({
      content: commandErrors.commandError,
      ephemeral: true,
    });
    return;
  }

  if (command === undefined) {
    logger.warn(`Command for interaction ${interaction.commandName} not found`);
    await interaction.reply({
      content: commandErrors.commandError,
      ephemeral: true,
    });
    return;
  }

  if (!hasCommandPermission(member, interaction.commandName)) {
    await interaction.reply({
      content: commandErrors.commandNoPermission,
      ephemeral: true,
    });
    return;
  }

  try {
    if (!nonDeferredCommands.has(command.name)) {
      await interaction.deferReply();
    }

    await command.execute(interaction);
  } catch (error) {
    logger.error(
      `Failed executing context menu command ${inlineCode(interaction.commandName)}\n${String(error)}`,
    );

    await (interaction.deferred || interaction.replied
      ? interaction.editReply({
          content: commandErrors.commandError,
        })
      : interaction.reply({
          content: commandErrors.commandError,
          ephemeral: true,
        }));
  }
};

export const handleModalSubmit = async (
  interaction: ModalSubmitInteraction,
) => {
  logger.warn(
    `Received unhandled modal submit interaction: ${interaction.customId}`,
  );
  await interaction.reply({
    content: commandErrors.commandError,
    ephemeral: true,
  });
};
