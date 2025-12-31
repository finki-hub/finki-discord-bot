import {
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  heading,
  HeadingLevel,
  SeparatorSpacingSize,
} from 'discord.js';

import { labels } from '@/translations/labels.js';

import { type Room } from '../schemas/Room.js';

export const getRoomComponent = (information: Room) => {
  const containerBuilder = new ContainerBuilder();

  containerBuilder
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        heading(
          `${information.name} (${information.location})`,
          HeadingLevel.Two,
        ),
      ),
    )
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Large),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**${labels.type}** ${information.type}`),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**${labels.location}:** ${information.location}`),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `**${labels.floor}:** ${information.floor ?? '-'}`,
      ),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `**${labels.capacity}:** ${information.capacity ?? '-'}`,
      ),
    )
    .addSeparatorComponents((separator) =>
      separator.setDivider(false).setSpacing(SeparatorSpacingSize.Small),
    );

  if (information.description !== undefined) {
    containerBuilder.addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `**${labels.description}:**\n${information.description}`,
      ),
    );
  }

  if (information.mrbs !== undefined) {
    const mrbsUrl = information.mrbs;

    containerBuilder
      .addSeparatorComponents((separator) =>
        separator.setSpacing(SeparatorSpacingSize.Large),
      )
      .addActionRowComponents((actionRow) =>
        actionRow.addComponents(
          new ButtonBuilder()
            .setLabel(labels.mrbs)
            .setURL(mrbsUrl)
            .setStyle(ButtonStyle.Link),
        ),
      );
  }

  return containerBuilder;
};
