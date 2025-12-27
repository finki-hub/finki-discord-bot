import {
  type AutocompleteInteraction,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  type MessageContextMenuCommandInteraction,
  MessageFlags,
  type ModalSubmitInteraction,
  type UserContextMenuCommandInteraction,
} from 'discord.js';

import { logger } from '../logger.js';
import { commandErrors } from '../translations/commands.js';
import { logErrorFunctions, logShortStrings } from '../translations/logs.js';
import { deleteResponse } from '../utils/channels.js';
import {
  getCommand,
  isContextMenuCommand,
  isSlashCommand,
} from '../utils/commands.js';
import { getMemberFromGuild } from '../utils/guild.js';
import { hasCommandPermission } from '../utils/permissions.js';
import { sendErrorToWebhook } from '../utils/webhooks.js';
import {
  handleClassroomAutocomplete,
  handleCourseAutocomplete,
  handleCourseRoleAutocomplete,
  handleLinkAutocomplete,
  handleProfessorAutocomplete,
  handleQuestionAutocomplete,
  handleSessionAutocomplete,
} from './autocomplete.js';
import { handleTicketCloseButton, handleTicketCreateButton } from './button.js';

const ignoredButtons = new Set(['help']);

export const handleChatInputCommand = async (
  interaction: ChatInputCommandInteraction,
) => {
  try {
    await interaction.deferReply();
  } catch (error) {
    logger.error(
      logErrorFunctions.chatInputInteractionDeferError(interaction, error),
    );
    await interaction.reply(commandErrors.commandError);

    return;
  }

  logger.info(
    `${logShortStrings.chat} ${interaction.user.tag}: ${interaction.toString()} [${
      interaction.channel === null || interaction.channel.isDMBased()
        ? logShortStrings.dm
        : logShortStrings.guild
    }]`,
  );

  const command = await getCommand(interaction.commandName);

  if (command === undefined || !isSlashCommand(command)) {
    logger.warn(logErrorFunctions.commandNotFound(interaction.id));
    await interaction.editReply(commandErrors.commandNotFound);

    return;
  }

  const member = await getMemberFromGuild(
    interaction.user.id,
    interaction.guild,
  );

  if (member === null) {
    await interaction.editReply(commandErrors.commandNoPermission);

    return;
  }

  const commandWithSubcommand = `${interaction.commandName} ${
    interaction.options.getSubcommand(false) ?? ''
  }`.trim();

  if (!hasCommandPermission(member, commandWithSubcommand)) {
    await interaction.editReply(commandErrors.commandNoPermission);

    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(
      logErrorFunctions.chatInputInteractionError(interaction, error),
    );

    await sendErrorToWebhook(
      logErrorFunctions.chatInputCommandExecutionError(interaction, error),
    );

    await (interaction.deferred
      ? interaction.editReply(commandErrors.commandError)
      : interaction.reply(commandErrors.commandError));
  }
};

export const handleUserContextMenuCommand = async (
  interaction: UserContextMenuCommandInteraction,
) => {
  try {
    await interaction.deferReply();
  } catch (error) {
    logger.error(
      logErrorFunctions.userContextMenuInteractionDeferError(
        interaction,
        error,
      ),
    );
    await interaction.reply(commandErrors.commandError);

    return;
  }

  const command = await getCommand(interaction.commandName);

  logger.info(
    `${logShortStrings.user} ${interaction.user.tag}: ${
      interaction.commandName
    } [${
      interaction.channel === null || interaction.channel.isDMBased()
        ? logShortStrings.dm
        : logShortStrings.guild
    }]`,
  );

  if (command === undefined || !isContextMenuCommand(command)) {
    logger.warn(logErrorFunctions.commandNotFound(interaction.id));

    return;
  }

  const member = await getMemberFromGuild(
    interaction.user.id,
    interaction.guild,
  );

  if (member === null) {
    await interaction.editReply(commandErrors.commandNoPermission);

    return;
  }

  if (!hasCommandPermission(member, interaction.commandName)) {
    await interaction.editReply(commandErrors.commandNoPermission);

    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(
      logErrorFunctions.userContextMenuInteractionError(interaction, error),
    );

    await sendErrorToWebhook(
      logErrorFunctions.contextMenuCommandExecutionError(interaction, error),
    );

    await (interaction.deferred
      ? interaction.editReply(commandErrors.commandError)
      : interaction.reply(commandErrors.commandError));
  }
};

export const handleMessageContextMenuCommand = async (
  interaction: MessageContextMenuCommandInteraction,
) => {
  try {
    await interaction.deferReply();
  } catch (error) {
    logger.error(
      logErrorFunctions.messageContextMenuInteractionDeferError(
        interaction,
        error,
      ),
    );
    await interaction.reply(commandErrors.commandError);

    return;
  }

  const command = await getCommand(interaction.commandName);

  logger.info(
    `${logShortStrings.message} ${interaction.user.tag}: ${
      interaction.commandName
    } [${
      interaction.channel === null || interaction.channel.isDMBased()
        ? logShortStrings.dm
        : logShortStrings.guild
    }]`,
  );

  if (command === undefined || !isContextMenuCommand(command)) {
    logger.warn(logErrorFunctions.commandNotFound(interaction.id));

    return;
  }

  const member = await getMemberFromGuild(
    interaction.user.id,
    interaction.guild,
  );

  if (member === null) {
    await interaction.editReply(commandErrors.commandNoPermission);

    return;
  }

  if (!hasCommandPermission(member, interaction.commandName)) {
    await interaction.editReply(commandErrors.commandNoPermission);

    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(
      logErrorFunctions.messageContextMenuInteractionError(interaction, error),
    );

    await sendErrorToWebhook(
      logErrorFunctions.contextMenuCommandExecutionError(interaction, error),
    );

    await (interaction.deferred
      ? interaction.editReply(commandErrors.commandError)
      : interaction.reply(commandErrors.commandError));
  }
};

const buttonInteractionHandlers = {
  ticketClose: handleTicketCloseButton,
  ticketCreate: handleTicketCreateButton,
};

const ephemeralResponseButtons = new Set(['ticketCreate']);

export const handleButton = async (interaction: ButtonInteraction) => {
  const [command, ...args] = interaction.customId.split(':');

  logger.info(
    `${logShortStrings.button} ${interaction.user.tag}: ${
      interaction.customId
    } [${
      interaction.channel === null || interaction.channel.isDMBased()
        ? logShortStrings.dm
        : logShortStrings.guild
    }]`,
  );

  if (command === undefined) {
    logger.warn(logErrorFunctions.commandNotFound(interaction.id));

    return;
  }

  if (ephemeralResponseButtons.has(command)) {
    try {
      const mess = await interaction.deferReply({
        flags: MessageFlags.Ephemeral,
      });
      void deleteResponse(mess, 10_000);
    } catch (error) {
      logger.error(
        logErrorFunctions.buttonInteractionDeferError(interaction, error),
      );
    }
  }

  try {
    if (Object.keys(buttonInteractionHandlers).includes(command)) {
      await buttonInteractionHandlers[
        command as keyof typeof buttonInteractionHandlers
      ](interaction, args);
    } else if (ignoredButtons.has(command)) {
      // Do nothing
    } else {
      logger.warn(logErrorFunctions.commandNotFound(interaction.id));
    }
  } catch (error) {
    logger.error(logErrorFunctions.buttonExecutionError(interaction, error));

    await sendErrorToWebhook(
      logErrorFunctions.buttonExecutionError(interaction, error),
    );

    await (interaction.deferred
      ? interaction.editReply(commandErrors.commandError)
      : interaction.reply({
          content: commandErrors.commandError,
          flags: MessageFlags.Ephemeral,
        }));
  }
};

const autocompleteInteractionHandlers = {
  classroom: handleClassroomAutocomplete,
  course: handleCourseAutocomplete,
  courserole: handleCourseRoleAutocomplete,
  link: handleLinkAutocomplete,
  professor: handleProfessorAutocomplete,
  question: handleQuestionAutocomplete,
  session: handleSessionAutocomplete,
};

export const handleAutocomplete = async (
  interaction: AutocompleteInteraction,
) => {
  const option = interaction.options.getFocused(true);

  logger.info(
    `${logShortStrings.auto} ${interaction.user.tag}: ${option.name} [${
      interaction.channel === null || interaction.channel.isDMBased()
        ? logShortStrings.dm
        : logShortStrings.guild
    }]`,
  );

  try {
    if (Object.keys(autocompleteInteractionHandlers).includes(option.name)) {
      await autocompleteInteractionHandlers[
        option.name as keyof typeof autocompleteInteractionHandlers
      ](interaction);
    } else {
      logger.warn(logErrorFunctions.commandNotFound(interaction.id));
    }
  } catch (error) {
    logger.error(
      logErrorFunctions.autocompleteExecutionError(interaction, error),
    );

    await interaction.respond([]);

    await sendErrorToWebhook(
      logErrorFunctions.autocompleteExecutionError(interaction, error),
    );
  }
};

const modalInteractionHandlers: Record<
  string,
  (interaction: ModalSubmitInteraction) => Promise<void>
> = {};

export const handleModalSubmit = async (
  interaction: ModalSubmitInteraction,
) => {
  const modalId = interaction.customId;

  logger.info(
    `${logShortStrings.button} ${interaction.user.tag}: ${modalId} [${
      interaction.channel === null || interaction.channel.isDMBased()
        ? logShortStrings.dm
        : logShortStrings.guild
    }]`,
  );

  try {
    await interaction.deferReply();
  } catch (error) {
    logger.error(
      logErrorFunctions.modalInteractionDeferError(interaction, error),
    );

    return;
  }

  const handler = modalInteractionHandlers[modalId];

  if (handler === undefined) {
    logger.warn(logErrorFunctions.commandNotFound(interaction.id));

    return;
  }

  try {
    await handler(interaction);
  } catch (error) {
    logger.error(logErrorFunctions.modalExecutionError(interaction, error));

    await sendErrorToWebhook(
      logErrorFunctions.modalExecutionError(interaction, error),
    );

    await interaction.editReply(commandErrors.commandError);
  }
};
