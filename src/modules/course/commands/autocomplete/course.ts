import { type AutocompleteInteraction } from 'discord.js';

import { createAutocompleteOptions } from '@/common/commands/autocomplete.js';
import { createTransliterationSearchMap } from '@/common/utils/transliteration.js';
import { getCourses, getFromRoleConfig } from '@/configuration/data/index.js';

let transformedCourses: Array<[string, string]> | null = null;
let transformedCourseRoles: Array<[string, string]> | null = null;

export const name = 'course';

export const execute = async (interaction: AutocompleteInteraction) => {
  const focused = interaction.options.getFocused(true);

  if (focused.name === 'course') {
    transformedCourses ??= Object.entries(
      createTransliterationSearchMap(getCourses()),
    );
    await interaction.respond(
      createAutocompleteOptions(transformedCourses, focused.value),
    );
  } else if (focused.name === 'courserole') {
    const courses = getFromRoleConfig('courses');
    if (courses === undefined) {
      await interaction.respond([]);
      return;
    }
    transformedCourseRoles ??= Object.entries(
      createTransliterationSearchMap(Object.values(courses)),
    );
    await interaction.respond(
      createAutocompleteOptions(transformedCourseRoles, focused.value),
    );
  }
};
