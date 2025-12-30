import { type AutocompleteInteraction } from 'discord.js';

import { createAutocompleteOptions } from '@/common/commands/autocomplete.js';
import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import { getLinkNames } from '@/modules/faq/utils/api.js';

export const name = 'link';

export const execute = async (interaction: AutocompleteInteraction) => {
  const focused = interaction.options.getFocused(true);

  const linkNames = await getLinkNames();

  if (linkNames === null) {
    await interaction.respond([]);

    return;
  }

  await interaction.respond(
    createAutocompleteOptions(
      Object.entries(createTransliterationSearchMap(linkNames)),
      focused.value,
    ),
  );
};
