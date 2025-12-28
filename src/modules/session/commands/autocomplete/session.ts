import { type AutocompleteInteraction } from 'discord.js';

import { createAutocompleteOptions } from '@/common/commands/autocomplete.js';
import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import { getSessions } from '@/configuration/data/index.js';

let transformedSessions: Array<[string, string]> | null = null;

export const name = 'session';

export const execute = async (interaction: AutocompleteInteraction) => {
  const focused = interaction.options.getFocused(true);

  if (focused.name === 'session') {
    transformedSessions ??= Object.entries(
      createTransliterationSearchMap(Object.keys(getSessions())),
    );
    await interaction.respond(
      createAutocompleteOptions(transformedSessions, focused.value),
    );
  }
};
