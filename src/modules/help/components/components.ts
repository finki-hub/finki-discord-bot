import {
  ContainerBuilder,
  heading,
  HeadingLevel,
  SeparatorSpacingSize,
} from 'discord.js';

import { getCommandMention } from '@/common/commands/utils.js';
import { getPaginationComponent } from '@/common/components/pagination.js';
import { aboutMessage, botName } from '@/translations/about.js';
import { commandDescriptions } from '@/translations/commands.js';
import { componentMessages } from '@/translations/components.js';
import { labels } from '@/translations/labels.js';

import { name } from '../commands/button/help.js';
import { COMMANDS_PER_PAGE } from '../utils/constants.js';

export const getHelpComponent = (commands: string[], page: number) =>
  getPaginationComponent({
    buttonId: name,
    description: componentMessages.allCommands,
    entries: commands.map(
      (command) =>
        `${getCommandMention(command)}\n${commandDescriptions[command as keyof typeof commandDescriptions]}`,
    ),
    entriesLabel: labels.commands,
    page,
    pageSize: COMMANDS_PER_PAGE,
    title: labels.commands,
  });

export const getAboutComponent = () => {
  const containerBuilder = new ContainerBuilder();

  containerBuilder
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(heading(botName, HeadingLevel.Two)),
    )
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Large),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        aboutMessage(
          getCommandMention('help'),
          getCommandMention('list questions'),
        ),
      ),
    );

  return containerBuilder;
};
