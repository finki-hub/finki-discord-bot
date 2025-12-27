import {
  channelMention,
  type ChatInputCommandInteraction,
  inlineCode,
  type Interaction,
  type MessageContextMenuCommandInteraction,
  type UserContextMenuCommandInteraction,
} from 'discord.js';

import { getStaff } from '../configuration/files.js';
import { logger } from '../logger.js';
import { embedLabels } from '../translations/embeds.js';
import { labels } from '../translations/labels.js';
import { logErrorFunctions } from '../translations/logs.js';

export const truncateString = (
  string: null | string | undefined,
  length = 100,
) => {
  if (string === null || string === undefined) {
    return '';
  }

  return string.length > length
    ? `${string.slice(0, Math.max(0, length - 3))}...`
    : string;
};

export const getChannelMention = (interaction: Interaction) => {
  if (interaction.channel === null || interaction.channel.isDMBased()) {
    return labels.dm;
  }

  return channelMention(interaction.channel.id);
};

export const getButtonCommand = (command: string) => {
  switch (command) {
    case 'ticketClose':
      return embedLabels.ticketClose;

    case 'ticketCreate':
      return embedLabels.ticketCreate;

    default:
      return command.slice(0, 1).toUpperCase() + command.slice(1);
  }
};

export const getButtonInfo = (command: string, args: string[]) => {
  switch (command) {
    case 'exp':
    case 'help':
    case 'ticketClose':
    case 'ticketCreate':
      return {
        name: getButtonCommand(command),
        value:
          args[0] === undefined ? embedLabels.unknown : inlineCode(args[0]),
      };

    default:
      return {
        name: embedLabels.unknown,
        value: embedLabels.unknown,
      };
  }
};

export const linkStaff = (professors: string) => {
  if (professors === '') {
    return labels.none;
  }

  const allStaff = professors
    .split('\n')
    .map((professor) => [
      professor,
      getStaff().find((staff) => professor.includes(staff.name))?.profile,
    ]);

  const linkedStaff = allStaff
    .map(([professor, finki]) =>
      finki ? `[${professor}](${finki})` : professor,
    )
    .join('\n');

  if (linkedStaff.length < 1_000) {
    return linkedStaff;
  }

  return allStaff.map(([professor]) => professor).join('\n');
};

export const fetchMessageUrl = async (
  interaction:
    | ChatInputCommandInteraction
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction,
) => {
  if (
    interaction.channel === null ||
    !interaction.channel.isTextBased() ||
    interaction.channel.isDMBased()
  ) {
    return null;
  }

  try {
    const { url } = await interaction.fetchReply();

    return {
      url,
    };
  } catch (error) {
    logger.warn(logErrorFunctions.messageUrlFetchError(interaction.id, error));

    return null;
  }
};
