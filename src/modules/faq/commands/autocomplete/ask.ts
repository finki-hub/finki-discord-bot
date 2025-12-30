import { type AutocompleteInteraction } from 'discord.js';

import { createAutocompleteOptions } from '@/common/commands/autocomplete.js';
import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import { getQuestionNames } from '@/modules/faq/utils/api.js';

export const name = 'ask';

export const execute = async (interaction: AutocompleteInteraction) => {
  const focused = interaction.options.getFocused(true);

  const questionNames = await getQuestionNames();

  if (questionNames === null) {
    await interaction.respond([]);

    return;
  }

  await interaction.respond(
    createAutocompleteOptions(
      Object.entries(createTransliterationSearchMap(questionNames)),
      focused.value,
    ),
  );
};
