import {
  ContainerBuilder,
  heading,
  HeadingLevel,
  SeparatorSpacingSize,
} from 'discord.js';

import { getCommandMention } from '@/common/commands/utils.js';
import { aboutMessage, botName } from '@/translations/about.js';
import { commandDescriptions } from '@/translations/commands.js';
import { componentMessages } from '@/translations/components.js';
import { labels } from '@/translations/labels.js';
import { paginationStringFunctions } from '@/translations/pagination.js';

import { COMMANDS_PER_PAGE } from '../utils/constants.js';

export const getHelpComponent = (commands: string[], page: number) => {
  const containerBuilder = new ContainerBuilder();

  containerBuilder
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(heading(labels.commands, HeadingLevel.Two)),
    )
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Large),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(componentMessages.allCommands),
    );

  const paginatedCommands = commands.slice(
    COMMANDS_PER_PAGE * page,
    COMMANDS_PER_PAGE * (page + 1),
  );

  if (paginatedCommands.length > 0) {
    containerBuilder.addSeparatorComponents((separator) =>
      separator.setDivider(false),
    );

    for (const command of paginatedCommands) {
      containerBuilder.addTextDisplayComponents((textDisplay) =>
        textDisplay.setContent(
          `${getCommandMention(command)}\n${commandDescriptions[command as keyof typeof commandDescriptions]}`,
        ),
      );
    }

    containerBuilder
      .addSeparatorComponents((separator) =>
        separator.setSpacing(SeparatorSpacingSize.Large),
      )
      .addTextDisplayComponents((textDisplay) =>
        textDisplay.setContent(
          paginationStringFunctions.commandPage(
            page + 1,
            Math.max(1, Math.ceil(commands.length / COMMANDS_PER_PAGE)),
            commands.length,
          ),
        ),
      );
  }

  return containerBuilder;
};

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
