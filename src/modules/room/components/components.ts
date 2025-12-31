import {
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  heading,
  HeadingLevel,
  SeparatorSpacingSize,
} from 'discord.js';

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
      textDisplay.setContent(`**Тип:** ${information.type}`),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**Локација:** ${information.location}`),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**Кат:** ${information.floor ?? '-'}`),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**Капацитет:** ${information.capacity ?? '-'}`),
    )
    .addSeparatorComponents((separator) =>
      separator.setDivider(false).setSpacing(SeparatorSpacingSize.Small),
    );

  if (information.description !== undefined) {
    containerBuilder.addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**Опис:**\n${information.description}`),
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
            .setLabel('MRBS')
            .setURL(mrbsUrl)
            .setStyle(ButtonStyle.Link),
        ),
      );
  }

  return containerBuilder;
};
