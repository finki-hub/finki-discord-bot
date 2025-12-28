import { type AutocompleteInteraction } from 'discord.js';

import { createAutocompleteOptions } from '@/common/commands/autocomplete.js';
import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import { getCourses } from '@/configuration/data/index.js';

let transformedCourses: Array<[string, string]> | null = null;

export const name = 'courses';

export const execute = async (interaction: AutocompleteInteraction) => {
  const focused = interaction.options.getFocused(true);

  if (focused.name === 'course') {
    transformedCourses ??= Object.entries(
      createTransliterationSearchMap(getCourses()),
    );
    await interaction.respond(
      createAutocompleteOptions(transformedCourses, focused.value),
    );
  }
};
