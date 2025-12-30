import { type AutocompleteInteraction } from 'discord.js';

import { createAutocompleteOptions } from '@/common/commands/autocomplete.js';
import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import {
  getTransformedProfessors,
  setTransformedProfessors,
} from '@/modules/staff/utils/cache.js';
import { getStaff } from '@/modules/staff/utils/data.js';

export const name = 'staff';

export const execute = async (interaction: AutocompleteInteraction) => {
  const focused = interaction.options.getFocused(true);

  let transformedProfessors = getTransformedProfessors();

  if (transformedProfessors === null) {
    transformedProfessors = Object.entries(
      createTransliterationSearchMap(
        getStaff().map((professor) => professor.name),
      ),
    );

    setTransformedProfessors(transformedProfessors);
  }

  await interaction.respond(
    createAutocompleteOptions(transformedProfessors, focused.value),
  );
};
