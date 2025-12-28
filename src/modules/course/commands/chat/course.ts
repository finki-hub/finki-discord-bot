import {
  type ChatInputCommandInteraction,
  type GuildMember,
  roleMention,
  SlashCommandBuilder,
} from 'discord.js';

import { executeSubcommand } from '@/common/commands/subcommands.js';
import { logger } from '@/common/logger/index.js';
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

const handleCourseRole = async (
  interaction: ChatInputCommandInteraction,
  closestItem: string,
) => {
  const guild = await getGuild(interaction);
  const courses = getFromRoleConfig('courses');

  if (courses === undefined) {
    await interaction.editReply(commandErrors.coursesNotFound);

    return;
  }

  if (guild === null) {
    await interaction.editReply(commandErrors.commandGuildOnly);

    return;
  }

  const roleEntry = Object.entries(courses).find(
    ([, course]) => course.toLowerCase() === closestItem.toLowerCase(),
  );

  if (roleEntry === undefined) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  const cachedRole = guild.roles.cache.find(
    (ro) => ro.name.toLowerCase() === roleEntry[0].toLowerCase(),
  );

  if (cachedRole === undefined) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  let role = cachedRole;

  try {
    // Fetch role to ensure members are loaded
    const fetchedRole = await guild.roles.fetch(cachedRole.id);
    if (fetchedRole !== null) {
      role = fetchedRole;
    }
  } catch (error) {
    logger.error(
      `Failed fetching role ${cachedRole.id} for course role command\n${String(error)}`,
    );
    await interaction.editReply(commandErrors.commandError);

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

const handleCourseToggle = async (
  interaction: ChatInputCommandInteraction,
  closestItem: string,
) => {
  const guild = await getGuild(interaction);

  if (guild === null) {
    await interaction.editReply(commandErrors.commandGuildOnly);

    return;
  }

  const member = interaction.member as GuildMember;
  const role = getCourseRoleByCourseName(guild, closestItem);

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

  if (course !== null) {
    closestItem = getClosestCourse(course);
  } else if (courseRole !== null) {
    closestItem = getClosestCourseRole(courseRole);
  }

  if (closestItem === null) {
    await interaction.editReply(commandErrors.courseNotFound);

    return;
  }

  await executeSubcommand(interaction, courseHandlers, closestItem);
};
