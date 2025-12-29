import { EmbedBuilder } from 'discord.js';

import { getCommandMention } from '@/common/commands/utils.js';
import { aboutMessage, botName } from '@/translations/about.js';
import { commandDescriptions } from '@/translations/commands.js';
import { embedMessages } from '@/translations/embeds.js';
import { paginationStringFunctions } from '@/translations/pagination.js';

import { COMMANDS_PER_PAGE } from '../utils/constants.js';

export const getHelpEmbed = (commands: string[], page: number) =>
  new EmbedBuilder()
    .setTitle('Commands')
    .setDescription(embedMessages.allCommands)
    .addFields(
      ...commands
        .slice(COMMANDS_PER_PAGE * page, COMMANDS_PER_PAGE * (page + 1))
        .map((command) => ({
          name: getCommandMention(command),
          value:
            commandDescriptions[command as keyof typeof commandDescriptions],
        })),
    )
    .setFooter({
      text: paginationStringFunctions.commandPage(
        page + 1,
        Math.max(1, Math.ceil(commands.length / COMMANDS_PER_PAGE)),
        commands.length,
      ),
    })
    .setTimestamp();

export const getAboutEmbed = () =>
  new EmbedBuilder()
    .setTitle(botName)
    .setDescription(
      aboutMessage(
        getCommandMention('help'),
        getCommandMention('list questions'),
      ),
    )
    .setTimestamp();
