import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { executeSubcommand } from '@/common/commands/subcommands.js';
import {
  getCourses,
  getInformation,
  getParticipants,
  getPrerequisites,
  getProfessors,
} from '@/configuration/data/index.js';
import {
  getCourseInfoEmbed,
  getCourseParticipantsEmbed,
  getCoursePrerequisiteEmbed,
  getCourseProfessorsEmbed,
  getCourseSummaryEmbed,
} from '@/modules/course/components/embeds.js';
import { getClosestCourse } from '@/modules/course/utils/search.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponseFunctions,
} from '@/translations/commands.js';

export const name = 'course';

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Course')
  .addSubcommand((command) =>
    command
      .setName('participants')
      .setDescription(commandDescriptions['course participants'])
      .addStringOption((option) =>
        option
          .setName('course')
          .setDescription('Предмет')
          .setRequired(true)
          .setAutocomplete(true),
      )
      .addUserOption((option) =>
        option.setName('user').setDescription('Корисник').setRequired(false),
      ),
  )
  .addSubcommand((command) =>
    command
      .setName('professors')
      .setDescription(commandDescriptions['course professors'])
      .addStringOption((option) =>
        option
          .setName('course')
          .setDescription('Предмет')
          .setRequired(true)
          .setAutocomplete(true),
      )
      .addUserOption((option) =>
        option.setName('user').setDescription('Корисник').setRequired(false),
      ),
  )
  .addSubcommand((command) =>
    command
      .setName('prerequisite')
      .setDescription(commandDescriptions['course prerequisite'])
      .addStringOption((option) =>
        option
          .setName('course')
          .setDescription('Предмет')
          .setRequired(true)
          .setAutocomplete(true),
      )
      .addUserOption((option) =>
        option.setName('user').setDescription('Корисник').setRequired(false),
      ),
  )
  .addSubcommand((command) =>
    command
      .setName('info')
      .setDescription(commandDescriptions['course info'])
      .addStringOption((option) =>
        option
          .setName('course')
          .setDescription('Предмет')
          .setRequired(true)
          .setAutocomplete(true),
      )
      .addUserOption((option) =>
        option.setName('user').setDescription('Корисник').setRequired(false),
      ),
  )
  .addSubcommand((command) =>
    command
      .setName('summary')
      .setDescription(commandDescriptions['course summary'])
      .addStringOption((option) =>
        option
          .setName('course')
          .setDescription('Предмет')
          .setRequired(true)
          .setAutocomplete(true),
      )
      .addUserOption((option) =>
        option.setName('user').setDescription('Корисник').setRequired(false),
      ),
  );

const handleCourseParticipants = async (
  interaction: ChatInputCommandInteraction,
  closestItem: string,
) => {
  const user = interaction.options.getUser('user');

  const information = getParticipants().find(
    (participants) =>
      participants.course.toLowerCase() === closestItem.toLowerCase(),
  );

  if (information === undefined) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  const embed = getCourseParticipantsEmbed(information);
  await interaction.editReply({
    content: user ? commandResponseFunctions.commandFor(user.id) : null,
    embeds: [embed],
  });
};

const handleCourseProfessors = async (
  interaction: ChatInputCommandInteraction,
  closestItem: string,
) => {
  const user = interaction.options.getUser('user');

  const information = getProfessors().find(
    (staff) => staff.course.toLowerCase() === closestItem.toLowerCase(),
  );

  if (information === undefined) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  const embed = getCourseProfessorsEmbed(information);
  await interaction.editReply({
    content: user ? commandResponseFunctions.commandFor(user.id) : null,
    embeds: [embed],
  });
};

const handleCoursePrerequisite = async (
  interaction: ChatInputCommandInteraction,
  closestItem: string,
) => {
  const user = interaction.options.getUser('user');

  const information = getPrerequisites().find(
    (prerequisites) =>
      prerequisites.course.toLowerCase() === closestItem.toLowerCase(),
  );

  if (information === undefined) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  const embed = getCoursePrerequisiteEmbed(information);
  await interaction.editReply({
    content: user ? commandResponseFunctions.commandFor(user.id) : null,
    embeds: [embed],
  });
};

const handleCourseInfo = async (
  interaction: ChatInputCommandInteraction,
  closestItem: string,
) => {
  const user = interaction.options.getUser('user');

  const information = getInformation().find(
    (info) => info.course.toLowerCase() === closestItem.toLowerCase(),
  );

  if (information === undefined) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  const embed = getCourseInfoEmbed(information);
  await interaction.editReply({
    content: user ? commandResponseFunctions.commandFor(user.id) : null,
    embeds: [embed],
  });
};

const handleCourseSummary = async (
  interaction: ChatInputCommandInteraction,
  closestItem: string,
) => {
  if (!getCourses().includes(closestItem)) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  const user = interaction.options.getUser('user');

  const embeds = getCourseSummaryEmbed(closestItem);
  await interaction.editReply({
    content: user ? commandResponseFunctions.commandFor(user.id) : null,
    embeds,
  });
};

const courseHandlers = {
  info: handleCourseInfo,
  participants: handleCourseParticipants,
  prerequisite: handleCoursePrerequisite,
  professors: handleCourseProfessors,
  summary: handleCourseSummary,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const course = interaction.options.getString('course');

  if (course === null) {
    await interaction.editReply(commandErrors.courseNotFound);
    return;
  }

  const closestItem = getClosestCourse(course);

  if (closestItem === null) {
    await interaction.editReply(commandErrors.courseNotFound);
    return;
  }

  await executeSubcommand(interaction, courseHandlers, closestItem);
};
