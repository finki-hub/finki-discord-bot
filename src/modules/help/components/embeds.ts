import { EmbedBuilder } from 'discord.js';

import { getCommandMention } from '@/common/commands/utils.js';
import { getThemeColor } from '@/configuration/bot/index.js';
import { aboutMessage, botName } from '@/translations/about.js';
import { commandDescriptions } from '@/translations/commands.js';
import { embedMessages } from '@/translations/embeds.js';
import { paginationStringFunctions } from '@/translations/pagination.js';

export const getHelpEmbed = (
  commands: string[],
  page: number,
  commandsPerPage = 8,
) =>
  new EmbedBuilder()
    .setColor(getThemeColor())
    .setTitle('Commands')
    .setDescription(embedMessages.allCommands)
    .addFields(
      ...commands
        .slice(commandsPerPage * page, commandsPerPage * (page + 1))
        .map((command) => ({
          name: getCommandMention(command),
          value:
            commandDescriptions[command as keyof typeof commandDescriptions],
        })),
    )
    .setFooter({
      text: paginationStringFunctions.commandPage(
        page + 1,
        Math.max(1, Math.ceil(commands.length / commandsPerPage)),
        commands.length,
      ),
    })
    .setTimestamp();

export const getAboutEmbed = () =>
  new EmbedBuilder()
    .setColor(getThemeColor())
    .setTitle(botName)
    .setDescription(
      aboutMessage(
        getCommandMention('help'),
        getCommandMention('list questions'),
      ),
    )
    .setTimestamp();
