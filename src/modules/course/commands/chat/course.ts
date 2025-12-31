import {
  type ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';

import { getMentionComponent } from '@/common/components/mention.js';
import { getCourseComponent } from '@/modules/course/components/components.js';
import { getCourse } from '@/modules/course/utils/data.js';
import { getClosestCourse } from '@/modules/course/utils/search.js';
import { commandDescriptions, commandErrors } from '@/translations/commands.js';

export const name = 'course';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription(commandDescriptions[name])
  .addStringOption((option) =>
    option
      .setName('course')
      .setDescription('Предмет')
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addUserOption((option) =>
    option.setName('user').setDescription('Корисник').setRequired(false),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const courseName = interaction.options.getString('course');

  if (courseName === null) {
    await interaction.editReply(commandErrors.courseNotFound);
    return;
  }

  const closestCourseName = getClosestCourse(courseName);

  if (closestCourseName === null) {
    await interaction.editReply(commandErrors.courseNotFound);
    return;
  }

  const course = getCourse(closestCourseName);

  if (course === undefined) {
    await interaction.editReply(commandErrors.courseNotFound);
    return;
  }

  const user = interaction.options.getUser('user');

  await interaction.editReply({
    components: [
      ...(user ? [getMentionComponent(user)] : []),
      getCourseComponent(course),
    ],
    flags: MessageFlags.IsComponentsV2,
  });
};
