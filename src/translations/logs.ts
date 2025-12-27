/* eslint-disable @typescript-eslint/restrict-template-expressions */

import {
  type AutocompleteInteraction,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  inlineCode,
  type MessageContextMenuCommandInteraction,
  type ModalSubmitInteraction,
  type UserContextMenuCommandInteraction,
} from 'discord.js';

export const logShortStrings = {
  auto: '[Auto]',
  button: '[Button]',
  chat: '[Chat]',
  dm: 'DM',
  guild: 'Guild',
  message: '[Message]',
  user: '[User]',
};

export const logMessages = {
  channelsInitialized: 'Channels initialized',
  commandsRegistered: 'Commands registered',
  rolesInitialized: 'Roles initialized',
};

export const logMessageFunctions = {
  channelNotGuildTextBased: (channelId: string) =>
    `Channel ${channelId} is not a guild text-based channel`,

  closedTicket: (ticketThreadId: string) => `Closed ticket ${ticketThreadId}`,

  configPropertyChanged: (property: string) =>
    `Config property ${property} changed, refreshing...`,

  cronJobInitialized: (jobName: string, nextRun: string) =>
    `Cron job ${jobName} initialized. Next run: ${nextRun}`,

  fillEmbeddingsCompleted: (model: string) =>
    `Embeddings filled for model ${model}`,

  logCommandEvent: (commandName: string) =>
    `Logging command ${commandName} in analytics...`,

  loggedIn: (username: string | undefined) =>
    `Bot is ready! Logged in as ${username ?? 'an unknown user'}`,

  membersInitialized: (memberCount: number) =>
    `Initialized ${memberCount} members`,

  noRefreshNeeded: (property: string) => `No refresh needed for ${property}`,

  promptAnswered: (answer: string) => `Prompt answered: ${answer}`,
};

export const logErrorFunctions = {
  addReactionError: (error: unknown) => `Failed adding reaction\n${error}`,

  aocLeaderboardError: (error: unknown) =>
    `Failed getting AOC leaderboard\n${error}`,

  aocProblemError: (error: unknown) => `Failed getting AOC problem\n${error}`,

  aocSubmitError: (error: unknown) => `Failed submitting AOC answer\n${error}`,

  autocompleteExecutionError: (
    interaction: AutocompleteInteraction,
    error: unknown,
  ) =>
    `Failed executing autocomplete interaction ${interaction.options.getFocused(true).name}\n${error}`,

  autocompleteResponseError: (userTag: string, error: unknown) =>
    `Failed responding to autocomplete interaction by ${userTag}\n${error}`,

  buttonExecutionError: (interaction: ButtonInteraction, error: unknown) =>
    `Failed executing button interaction ${interaction.customId}\n${error}`,

  buttonInteractionDeferError: (
    interaction: ButtonInteraction,
    error: unknown,
  ) => `Failed deferring button interaction ${interaction.customId}\n${error}`,

  buttonInteractionOutsideGuildError: (customId: string) =>
    `Received button interaction ${customId} outside of a guild`,

  channelFetchError: (channelId: string, error: unknown) =>
    `Failed fetching channel ${channelId}\n${error}`,

  chatInputCommandExecutionError: (
    interaction: ChatInputCommandInteraction,
    error: unknown,
  ) =>
    `Failed executing chat input command ${inlineCode(interaction.commandName)}\n${error}`,

  chatInputInteractionDeferError: (
    interaction: ChatInputCommandInteraction,
    error: unknown,
  ) => `Failed deferring chat input interaction ${interaction}\n${error}`,

  chatInputInteractionError: (
    interaction: ChatInputCommandInteraction,
    error: unknown,
  ) => `Failed handling chat input interaction ${interaction}\n${error}`,

  closestQuestionsError: (error: unknown) =>
    `Failed getting closest questions\n${error}`,

  collectorEndError: (command: string, error: unknown) =>
    `Failed ending ${command} collector\n${error}`,

  commandNotFound: (interactionId: string) =>
    `Command for interaction ${interactionId} not found`,

  commandsRegistrationError: (error: unknown) =>
    `Failed registering application commands\n${error}`,

  configSetError: (error: unknown) => `Failed setting config\n${error}`,

  contextMenuCommandExecutionError: (
    interaction:
      | MessageContextMenuCommandInteraction
      | UserContextMenuCommandInteraction,
    error: unknown,
  ) =>
    `Failed executing context menu command ${inlineCode(interaction.commandName)}\n${error}`,

  crosspostError: (channelId: string, error: unknown) =>
    `Failed crossposting message in channel ${channelId}\n${error}`,

  interactionUpdateError: (command: string, error: unknown) =>
    `Failed updating ${command} interaction\n${error}`,

  logAnalyticsError: (error: unknown) =>
    `Failed logging analytics event\n${error}`,

  loginFailed: (error: unknown) => `Failed logging in\n${error}`,

  membersFetchError: (error: unknown) => `Failed fetching members\n${error}`,

  messageContextMenuInteractionDeferError: (
    interaction: MessageContextMenuCommandInteraction,
    error: unknown,
  ) =>
    `Failed deferring message context menu interaction ${interaction.commandName}\n${error}`,

  messageContextMenuInteractionError: (
    interaction: MessageContextMenuCommandInteraction,
    error: unknown,
  ) =>
    `Failed handling message context menu interaction ${interaction.commandName}\n${error}`,

  modalExecutionError: (interaction: ModalSubmitInteraction, error: unknown) =>
    `Failed executing modal interaction ${interaction.customId}\n${error}`,

  modalInteractionDeferError: (
    interaction: ModalSubmitInteraction,
    error: unknown,
  ) => `Failed deferring modal interaction ${interaction.customId}\n${error}`,

  removeReactionError: (error: unknown) => `Failed removing reaction\n${error}`,

  responseDeleteError: (messageId: string, error: unknown) =>
    `Failed deleting message ${messageId}\n${error}`,

  roleFetchError: (roleId: string, error: unknown) =>
    `Failed fetching role ${roleId}\n${error}`,

  supportedModelsError: (error: unknown) =>
    `Failed getting supported models\n${error}`,

  unembeddedQuestionsError: (error: unknown) =>
    `Failed getting unembedded questions\n${error}`,

  unknownInteractionError: (userId: string) =>
    `Unknown interaction from ${userId}`,

  userContextMenuInteractionDeferError: (
    interaction: UserContextMenuCommandInteraction,
    error: unknown,
  ) =>
    `Failed deferring user context menu interaction ${interaction.commandName}\n${error}`,

  userContextMenuInteractionError: (
    interaction: UserContextMenuCommandInteraction,
    error: unknown,
  ) =>
    `Failed handling user context menu interaction ${interaction.commandName}\n${error}`,

  webhookSendError: (error: unknown) =>
    `Failed sending error to webhook\n${error}`,
};

export const bootMessage = (dateString: string) =>
  `Bot successfully started at ${inlineCode(dateString)}`;

export const exitMessages = {
  beforeExit: 'Exiting...',
  databaseConnectionClosed: 'Database connection closed.',
  goodbye: 'Goodbye.',
  shutdownGracefully: 'Shutting down gracefully...',
};

export const exitMessageFunctions = {
  databaseConnectionError: (error: unknown) =>
    `Error during shutdown\n${error}`,

  shutdownWithError: (error: string) =>
    `Bot has been shut down with error ${error}`,
};
