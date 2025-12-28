import { type AutocompleteInteraction } from 'discord.js';

import { createAutocompleteOptions } from '@/common/commands/autocomplete.js';
import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import { getStaff } from '@/configuration/data/index.js';

let transformedProfessors: Array<[string, string]> | null = null;

export const name = 'staff';

export const execute = async (interaction: AutocompleteInteraction) => {
  const focused = interaction.options.getFocused(true);

  if (focused.name === 'professor') {
    transformedProfessors ??= Object.entries(
      createTransliterationSearchMap(
        getStaff().map((professor) => professor.name),
      ),
    );
    await interaction.respond(
      createAutocompleteOptions(transformedProfessors, focused.value),
    );
  }
};
