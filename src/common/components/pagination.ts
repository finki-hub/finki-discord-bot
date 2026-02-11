import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  heading,
  HeadingLevel,
  SeparatorSpacingSize,
} from 'discord.js';

import type { PaginationComponentData } from '@/common/types/PaginationComponentData.js';

import { paginationStringFunctions } from '@/translations/pagination.js';

export const getPaginationComponent = ({
  buttonId,
  description,
  entries,
  entriesLabel,
  page,
  pageSize,
  title,
}: PaginationComponentData) => {
  const containerBuilder = new ContainerBuilder();

  containerBuilder
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(heading(title, HeadingLevel.Two)),
    )
    .addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Large),
    );

  if (description !== undefined) {
    containerBuilder.addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(description),
    );
  }

  const paginatedEntries = entries.slice(
    pageSize * page,
    pageSize * (page + 1),
  );

  if (paginatedEntries.length > 0) {
    containerBuilder.addSeparatorComponents((separator) =>
      separator.setDivider(false),
    );

    for (const entry of paginatedEntries) {
      containerBuilder.addTextDisplayComponents((textDisplay) =>
        textDisplay.setContent(entry),
      );
    }

    containerBuilder.addSeparatorComponents((separator) =>
      separator.setSpacing(SeparatorSpacingSize.Large),
    );

    const totalPages = Math.ceil(entries.length / pageSize);

    if (totalPages > 1) {
      for (let i = 0; i < totalPages; i += 5) {
        const actionRow = new ActionRowBuilder<ButtonBuilder>();

        for (let j = i; j < Math.min(i + 5, totalPages); j++) {
          const button = new ButtonBuilder()
            .setCustomId(`${buttonId}:page:${j}`)
            .setLabel(`${j + 1}`)
            .setStyle(j === page ? ButtonStyle.Primary : ButtonStyle.Secondary)
            .setDisabled(j === page);

          actionRow.addComponents(button);
        }

        containerBuilder.addActionRowComponents(actionRow);
      }

      containerBuilder.addSeparatorComponents((separator) =>
        separator.setDivider(false),
      );
    }

    containerBuilder.addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        paginationStringFunctions.footer(
          page + 1,
          Math.max(1, totalPages),
          entriesLabel,
          entries.length,
        ),
      ),
    );
  }

  return containerBuilder;
};
