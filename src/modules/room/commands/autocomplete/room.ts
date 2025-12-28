import { type AutocompleteInteraction } from 'discord.js';

import { createAutocompleteOptions } from '@/common/commands/autocomplete.js';
import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import { getRooms } from '@/configuration/data/index.js';

let transformedRooms: Array<[string, string]> | null = null;

export const name = 'room';

export const execute = async (interaction: AutocompleteInteraction) => {
  const focused = interaction.options.getFocused(true);

  if (focused.name === 'room') {
    transformedRooms ??= Object.entries(
      createTransliterationSearchMap(
        getRooms().map((room) => `${room.classroom} (${room.location})`),
      ),
    );
    await interaction.respond(
      createAutocompleteOptions(transformedRooms, focused.value),
    );
  }
};
