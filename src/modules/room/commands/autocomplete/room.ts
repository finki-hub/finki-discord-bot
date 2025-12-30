import { type AutocompleteInteraction } from 'discord.js';

import { createAutocompleteOptions } from '@/common/commands/autocomplete.js';
import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import {
  getTransformedRooms,
  setTransformedRooms,
} from '@/modules/room/utils/cache.js';
import { getRooms } from '@/modules/room/utils/data.js';

export const name = 'room';

export const execute = async (interaction: AutocompleteInteraction) => {
  const focused = interaction.options.getFocused(true);

  let transformedRooms = getTransformedRooms();

  if (transformedRooms === null) {
    transformedRooms = Object.entries(
      createTransliterationSearchMap(
        getRooms().map((room) => `${room.name} (${room.location})`),
      ),
    );

    setTransformedRooms(transformedRooms);
  }

  await interaction.respond(
    createAutocompleteOptions(transformedRooms, focused.value),
  );
};
