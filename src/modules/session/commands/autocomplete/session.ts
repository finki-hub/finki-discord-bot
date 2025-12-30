import { type AutocompleteInteraction } from 'discord.js';

import { createAutocompleteOptions } from '@/common/commands/autocomplete.js';
import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import {
  getTransformedSessions,
  setTransformedSessions,
} from '@/modules/session/utils/cache.js';
import { getSessions } from '@/modules/session/utils/data.js';

export const name = 'session';

export const execute = async (interaction: AutocompleteInteraction) => {
  const focused = interaction.options.getFocused(true);

  let transformedSessions = getTransformedSessions();

  if (transformedSessions === null) {
    transformedSessions = Object.entries(
      createTransliterationSearchMap(Object.keys(getSessions())),
    );

    setTransformedSessions(transformedSessions);
  }

  await interaction.respond(
    createAutocompleteOptions(transformedSessions, focused.value),
  );
};
