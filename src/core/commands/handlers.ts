import {
  type AutocompleteInteraction,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  DiscordAPIError,
  inlineCode,
  type MessageContextMenuCommandInteraction,
  MessageFlags,
  type ModalSubmitInteraction,
  type UserContextMenuCommandInteraction,
} from 'discord.js';

import { getFullCommandName } from '@/common/commands/utils.js';
import { logger } from '@/common/logger/index.js';
import { getMemberFromGuild } from '@/common/utils/guild.js';
import { commandErrors } from '@/translations/commands.js';

import {
  commandRequiresPermissions,
  hasCommandPermission,
} from '../utils/permissions.js';
import {
  getAutocompleteCommand,
  getButtonCommand,
  getChatCommand,
  getContextMenuCommand,
} from './modules.js';

const nonDeferredCommands = new Set<string>(['help']);

const isExpectedAutocompleteError = (error: unknown): boolean => {
  const message = Error.isError(error) ? error.message : String(error);
  return (
    message.includes('already been acknowledged') ||
    message.includes('Unknown interaction')
  );
};

const isMissingPermissionsError = (error: unknown): boolean =>
  error instanceof DiscordAPIError &&
  (error.code === 50_001 ||
    error.code === 50_013 ||
    error.message.includes('Missing Permissions') ||
    error.message.includes('Missing Access'));

export const handleChatInputCommand = async (
  interaction: ChatInputCommandInteraction,
) => {
  const commandWithSubcommand = getFullCommandName(interaction);

  logger.info(
    `[Chat] ${interaction.user.tag}: ${commandWithSubcommand} [${interaction.guild?.name ?? 'DM'}]`,
  );

  const command = getChatCommand(interaction.commandName);

  if (command === undefined) {
    logger.warn(`Command for interaction ${interaction.commandName} not found`);
    await interaction.reply({
      content: commandErrors.commandError,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const member = await getMemberFromGuild(
    interaction.user.id,
    interaction.guild,
  );

  if (member === null) {
    if (commandRequiresPermissions(commandWithSubcommand)) {
      logger.warn('Guild-only command used in DMs');
      await interaction.reply({
        content: commandErrors.commandGuildOnly,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
  } else if (!hasCommandPermission(member, commandWithSubcommand)) {
    await interaction.reply({
      content: commandErrors.commandNoPermission,
      flags: MessageFlags.Ephemeral,
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
        flags: MessageFlags.Ephemeral,
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

    const errorMessage = isMissingPermissionsError(error)
      ? commandErrors.botMissingPermissions
      : commandErrors.commandError;

    await (interaction.deferred || interaction.replied
      ? interaction.editReply(errorMessage)
      : interaction.reply({
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        }));
  }
};

export const handleButton = async (interaction: ButtonInteraction) => {
  logger.info(
    `[Button] ${interaction.user.tag}: ${interaction.customId} [${interaction.guild?.name ?? 'DM'}]`,
  );

  const [commandName, ...args] = interaction.customId.split(':');

  if (!commandName) {
    logger.error(`Command for interaction ${interaction.id} not found`);
    await interaction.reply({
      content: commandErrors.commandError,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const command = getButtonCommand(commandName);

  if (command === undefined) {
    logger.error(`Command for interaction ${interaction.id} not found`);
    await interaction.reply({
      content: commandErrors.commandError,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const member = await getMemberFromGuild(
    interaction.user.id,
    interaction.guild,
  );

  if (member !== null && !hasCommandPermission(member, command.name)) {
    await interaction.reply({
      content: commandErrors.commandNoPermission,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  try {
    if (!nonDeferredCommands.has(command.name)) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    }
    await command.execute(interaction, args);
  } catch (error) {
    logger.error(
      `Failed executing button interaction ${interaction.customId}\n${String(error)}`,
    );

    const errorMessage = isMissingPermissionsError(error)
      ? commandErrors.botMissingPermissions
      : commandErrors.commandError;

    await (interaction.deferred || interaction.replied
      ? interaction
          .editReply({
            content: errorMessage,
          })
          .catch(() => {})
      : interaction
          .reply({
            content: errorMessage,
            flags: MessageFlags.Ephemeral,
          })
          .catch(() => {}));
  }
};

export const handleAutocomplete = async (
  interaction: AutocompleteInteraction,
) => {
  logger.info(
    `[Autocomplete] ${interaction.user.tag}: ${interaction.commandName} [${interaction.guild?.name ?? 'DM'}]`,
  );

  const command = getAutocompleteCommand(interaction.commandName);

  if (command === undefined) {
    await interaction.respond([]).catch(() => {});
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    if (!isExpectedAutocompleteError(error)) {
      logger.error(
        `Failed executing autocomplete interaction ${interaction.commandName}\n${String(error)}`,
      );
    }
  } finally {
    await interaction.respond([]).catch(() => {});
  }
};

const executeContextMenuCommand = async (
  interaction:
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction,
  logPrefix: string,
) => {
  logger.info(
    `${logPrefix} ${interaction.user.tag}: ${interaction.commandName} [${interaction.guild?.name ?? 'DM'}]`,
  );

  const command = getContextMenuCommand(interaction.commandName);

  if (command === undefined) {
    logger.warn(`Command for interaction ${interaction.commandName} not found`);
    await interaction.reply({
      content: commandErrors.commandError,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const member = await getMemberFromGuild(
    interaction.user.id,
    interaction.guild,
  );

  if (
    member !== null &&
    !hasCommandPermission(member, interaction.commandName)
  ) {
    await interaction.reply({
      content: commandErrors.commandNoPermission,
      flags: MessageFlags.Ephemeral,
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

    const errorMessage = isMissingPermissionsError(error)
      ? commandErrors.botMissingPermissions
      : commandErrors.commandError;

    await (interaction.deferred || interaction.replied
      ? interaction.editReply({
          content: errorMessage,
        })
      : interaction.reply({
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        }));
  }
};

export const handleUserContextMenuCommand = async (
  interaction: UserContextMenuCommandInteraction,
) => {
  await executeContextMenuCommand(interaction, '[User Context]');
};

export const handleMessageContextMenuCommand = async (
  interaction: MessageContextMenuCommandInteraction,
) => {
  await executeContextMenuCommand(interaction, '[Message Context]');
};

export const handleModalSubmit = async (
  interaction: ModalSubmitInteraction,
) => {
  logger.info(
    `[Modal] ${interaction.user.tag}: ${interaction.customId} [${interaction.guild?.name ?? 'DM'}]`,
  );
  logger.warn(
    `Received unhandled modal submit interaction: ${interaction.customId}`,
  );
  await interaction.reply({
    content: commandErrors.commandError,
    flags: MessageFlags.Ephemeral,
  });
};
