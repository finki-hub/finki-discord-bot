import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  heading,
  HeadingLevel,
  SeparatorSpacingSize,
} from 'discord.js';

import type { Question } from '../schemas/Question.js';

import { getNormalizedUrl } from '../utils/links.js';

export const getQuestionComponent = (question: Question) => {
  const containerBuilder = new ContainerBuilder();

  containerBuilder
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(heading(question.name, HeadingLevel.Two)),
    )
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Large),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(question.content),
    );

  if (question.links !== null) {
    const linkEntries = Object.entries(question.links).filter(
      ([name, url]) => name !== '' && url !== '',
    );

    if (linkEntries.length > 0) {
      containerBuilder.addSeparatorComponents((separator) =>
        separator.setSpacing(SeparatorSpacingSize.Large),
      );

      for (let i = 0; i < linkEntries.length; i += 5) {
        const chunk = linkEntries.slice(i, i + 5);
        const actionRow = new ActionRowBuilder<ButtonBuilder>();

        for (const [name, url] of chunk) {
          actionRow.addComponents(
            new ButtonBuilder()
              .setLabel(name)
              .setURL(getNormalizedUrl(url))
              .setStyle(ButtonStyle.Link),
          );
        }

        containerBuilder.addActionRowComponents(actionRow);
      }
    }
  }

  return containerBuilder;
};
