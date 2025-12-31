import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  heading,
  HeadingLevel,
  hyperlink,
  SeparatorSpacingSize,
} from 'discord.js';

import { type Staff } from '../schemas/Staff.js';

export const getStaffComponent = (information: Staff) => {
  const containerBuilder = new ContainerBuilder();

  containerBuilder
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(heading(information.name, HeadingLevel.Two)),
    )
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Large),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**Звање:** ${information.title}`),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**Позиција:** ${information.position}`),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**Кабинет:** ${information.cabinet ?? '-'}`),
    )
    .addSeparatorComponents((separator) =>
      separator.setDivider(false).setSpacing(SeparatorSpacingSize.Small),
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        `**Електронска пошта:**\n${hyperlink(information.email, `mailto:${information.email}`)}`,
      ),
    );

  const actionRow = new ActionRowBuilder<ButtonBuilder>();

  if (information.profile !== undefined) {
    actionRow.addComponents(
      new ButtonBuilder()
        .setLabel('Профил')
        .setURL(information.profile)
        .setStyle(ButtonStyle.Link),
    );
  }

  if (information.courses !== undefined) {
    actionRow.addComponents(
      new ButtonBuilder()
        .setLabel('Предмети')
        .setURL(information.courses)
        .setStyle(ButtonStyle.Link),
    );
  }

  if (information.consultations !== undefined) {
    actionRow.addComponents(
      new ButtonBuilder()
        .setLabel('Консултации')
        .setURL(information.consultations)
        .setStyle(ButtonStyle.Link),
    );
  }

  if (actionRow.components.length > 0) {
    containerBuilder
      .addSeparatorComponents((separator) =>
        separator.setSpacing(SeparatorSpacingSize.Large),
      )
      .addActionRowComponents(actionRow);
  }

  return containerBuilder;
};
