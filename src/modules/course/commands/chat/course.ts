import {
  type ChatInputCommandInteraction,
  type GuildMember,
  roleMention,
  SlashCommandBuilder,
} from 'discord.js';

import { getFullCommandName } from '@/common/commands/utils.js';
import { getCourseRoleByCourseName } from '@/common/services/roles.js';
import { getGuild } from '@/common/utils/guild.js';
import {
  getCourses,
  getFromRoleConfig,
  getInformation,
  getParticipants,
  getPrerequisites,
  getProfessors,
} from '@/configuration/data/index.js';
import { logCommandEvent } from '@/modules/analytics/utils/analytics.js';
import {
  getCourseInfoEmbed,
  getCourseParticipantsEmbed,
  getCoursePrerequisiteEmbed,
  getCourseProfessorsEmbed,
  getCourseSummaryEmbed,
} from '@/modules/course/components/embeds.js';
import {
  getClosestCourse,
  getClosestCourseRole,
} from '@/modules/course/utils/search.js';
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
      .setName('role')
      .setDescription(commandDescriptions['course role'])
      .addStringOption((option) =>
        option
          .setName('courserole')
          .setDescription('Предмет')
          .setRequired(true)
          .setAutocomplete(true),
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
  )
  .addSubcommand((command) =>
    command
      .setName('toggle')
      .setDescription(commandDescriptions['course toggle'])
      .addStringOption((option) =>
        option
          .setName('courserole')
          .setDescription('Предмет')
          .setRequired(true)
          .setAutocomplete(true),
      ),
  );

const handleCourseParticipants = async (
  interaction: ChatInputCommandInteraction,
  course: null | string,
) => {
  const user = interaction.options.getUser('user');

  const information = getParticipants().find(
    (participants) =>
      participants.course.toLowerCase() === course?.toLowerCase(),
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
  course: null | string,
) => {
  const user = interaction.options.getUser('user');

  const information = getProfessors().find(
    (staff) => staff.course.toLowerCase() === course?.toLowerCase(),
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

const handleCourseRole = async (
  interaction: ChatInputCommandInteraction,
  courseRole: null | string,
) => {
  const guild = await getGuild(interaction);
  const courses = getFromRoleConfig('courses');

  if (courses === undefined) {
    await interaction.editReply(commandErrors.coursesNotFound);

    return;
  }

  if (guild === null) {
    await interaction.editReply(commandErrors.guildFetchFailed);

    return;
  }

  const roleEntry = Object.entries(courses).find(
    ([, course]) => course.toLowerCase() === courseRole?.toLowerCase(),
  );

  if (roleEntry === undefined) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  const role = guild.roles.cache.find(
    (ro) => ro.name.toLowerCase() === roleEntry[0].toLowerCase(),
  );

  if (role === undefined) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  await interaction.editReply({
    allowedMentions: {
      parse: [],
    },
    content: `${roleMention(role.id)}: ${role.members.size}`,
  });
};

const handleCoursePrerequisite = async (
  interaction: ChatInputCommandInteraction,
  course: null | string,
) => {
  const user = interaction.options.getUser('user');

  const information = getPrerequisites().find(
    (prerequisites) =>
      prerequisites.course.toLowerCase() === course?.toLowerCase(),
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
  course: null | string,
) => {
  const user = interaction.options.getUser('user');

  const information = getInformation().find(
    (info) => info.course.toLowerCase() === course?.toLowerCase(),
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
  course: null | string,
) => {
  const user = interaction.options.getUser('user');

  if (course === null || !getCourses().includes(course)) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  const embeds = getCourseSummaryEmbed(course);
  await interaction.editReply({
    content: user ? commandResponseFunctions.commandFor(user.id) : null,
    embeds,
  });
};

const handleCourseToggle = async (
  interaction: ChatInputCommandInteraction,
  course: null | string,
) => {
  const guild = await getGuild(interaction);

  if (guild === null) {
    await interaction.editReply(commandErrors.guildFetchFailed);

    return;
  }

  if (course === null) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  const member = interaction.member as GuildMember;
  const role = getCourseRoleByCourseName(guild, course);

  if (role === null) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  if (member.roles.cache.has(role.id)) {
    await member.roles.remove(role);
    await interaction.editReply({
      allowedMentions: {
        parse: [],
      },
      content: commandResponseFunctions.courseRemoved(role.id),
    });

    return;
  }

  await member.roles.add(role);
  await interaction.editReply({
    allowedMentions: {
      parse: [],
    },
    content: commandResponseFunctions.courseAdded(role.id),
  });
};

import { executeSubcommand } from '@/common/commands/subcommands.js';

const courseHandlers = {
  info: handleCourseInfo,
  participants: handleCourseParticipants,
  prerequisite: handleCoursePrerequisite,
  professors: handleCourseProfessors,
  role: handleCourseRole,
  summary: handleCourseSummary,
  toggle: handleCourseToggle,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const course = interaction.options.getString('course');
  const courseRole = interaction.options.getString('courserole');

  let closestItem: null | string = null;

  if (course) {
    closestItem = getClosestCourse(course);
  } else if (courseRole) {
    closestItem = getClosestCourseRole(courseRole);
  }

  if (closestItem === null) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  // Wrap handlers to pass closestItem as second parameter
  const wrappedHandlers = Object.fromEntries(
    Object.entries(courseHandlers).map(([key, handler]) => [
      key,
      async (interactionParam: ChatInputCommandInteraction) => {
        await handler(interactionParam, closestItem);
      },
    ]),
  ) as Record<
    string,
    (interaction: ChatInputCommandInteraction) => Promise<void>
  >;

  await executeSubcommand(interaction, wrappedHandlers);

  await logCommandEvent(interaction, {
    basePayload: {
      closestItem,
      options: interaction.options.data,
    },
    eventType: getFullCommandName(interaction),
  });
};
