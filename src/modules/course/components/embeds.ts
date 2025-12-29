import { EmbedBuilder, inlineCode } from 'discord.js';

import {
  getInformation,
  getParticipants,
  getPrerequisites,
  getProfessors,
} from '@/configuration/data/index.js';
import { embedMessages } from '@/translations/embeds.js';
import { labels } from '@/translations/labels.js';

import { type CourseInformation } from '../schemas/CourseInformation.js';
import { type CourseParticipants } from '../schemas/CourseParticipants.js';
import { type CoursePrerequisites } from '../schemas/CoursePrerequisites.js';
import { type CourseStaff } from '../schemas/CourseStaff.js';
import { linkStaff } from './utils.js';

export const getCourseParticipantsEmbed = (information: CourseParticipants) =>
  new EmbedBuilder()
    .setTitle(information.course)
    .setDescription(embedMessages.courseParticipantsInfo)
    .addFields(
      ...Object.entries(information)
        .filter(([year]) => year !== 'course')
        .map(([year, participants]) => ({
          inline: true,
          name: year,
          value: participants.toString(),
        })),
    )
    .setTimestamp();

export const getCourseProfessorsEmbed = (information: CourseStaff) =>
  new EmbedBuilder()
    .setTitle(information.course)
    .setDescription(embedMessages.courseStaffInfo)
    .addFields(
      {
        inline: true,
        name: labels.professors,
        value: linkStaff(information.professors),
      },
      {
        inline: true,
        name: labels.assistants,
        value: linkStaff(information.assistants),
      },
    )
    .setTimestamp();

export const getCoursePrerequisiteEmbed = (information: CoursePrerequisites) =>
  new EmbedBuilder()
    .setTitle(information.course)
    .addFields({
      inline: true,
      name: labels.prerequisites,
      value:
        information.prerequisite === ''
          ? labels.none
          : information.prerequisite,
    })
    .setTimestamp();

export const getCourseInfoEmbed = (information: CourseInformation) =>
  new EmbedBuilder()
    .setTitle(information.course)
    .setDescription(embedMessages.courseInfo)
    .addFields(
      {
        inline: true,
        name: labels.accreditation,
        value: `[${labels.link}](${information.link})`,
      },
      {
        inline: true,
        name: labels.code === '' ? labels.unknown : labels.code,
        value: information.code,
      },
      {
        inline: true,
        name: labels.level === '' ? labels.unknown : labels.level,
        value: information.level.toString(),
      },
    )
    .setTimestamp();

export const getCourseSummaryEmbed = (course: string) => {
  const info = getInformation().find(
    (item) => item.course.toLowerCase() === course.toLowerCase(),
  );
  const prerequisite = getPrerequisites().find(
    (item) => item.course.toLowerCase() === course.toLowerCase(),
  );
  const professors = getProfessors().find(
    (item) => item.course.toLowerCase() === course.toLowerCase(),
  );
  const participants = getParticipants().find(
    (item) => item.course.toLowerCase() === course.toLowerCase(),
  );

  return [
    new EmbedBuilder()
      .setTitle(course)
      .setDescription(embedMessages.courseSummaryInfo),
    new EmbedBuilder().setDescription(embedMessages.courseInfo).addFields(
      {
        name: labels.prerequisites,
        value:
          prerequisite === undefined || prerequisite.prerequisite === ''
            ? labels.none
            : prerequisite.prerequisite,
      },
      {
        inline: true,
        name: labels.accreditation,
        value:
          info === undefined
            ? labels.unknown
            : `[${labels.link}](${info.link})`,
      },
      {
        inline: true,
        name: labels.code === '' ? labels.unknown : labels.code,
        value: info === undefined ? labels.unknown : info.code,
      },
      {
        inline: true,
        name: labels.level === '' ? labels.unknown : labels.level,
        value: info === undefined ? labels.unknown : info.level.toString(),
      },
    ),
    new EmbedBuilder().setDescription(embedMessages.courseStaffInfo).addFields(
      {
        inline: true,
        name: labels.professors,
        value:
          professors === undefined
            ? labels.unknown
            : linkStaff(professors.professors),
      },
      {
        inline: true,
        name: labels.assistants,
        value:
          professors === undefined
            ? labels.unknown
            : linkStaff(professors.assistants),
      },
    ),
    new EmbedBuilder()
      .setDescription(embedMessages.courseParticipantsInfo)
      .addFields(
        ...Object.entries(participants ?? {})
          .filter(([year]) => year !== 'course')
          .map(([year, part]) => ({
            inline: true,
            name: year,
            value: part.toString(),
          })),
      ),
  ];
};

export const getCoursesPrerequisiteEmbed = (course: string) => {
  const courses = getPrerequisites().filter((prerequisite) =>
    prerequisite.prerequisite.toLowerCase().includes(course.toLowerCase()),
  );

  return new EmbedBuilder()
    .setTitle(`Предмети со предуслов ${course}`)
    .setDescription(
      courses.length === 0
        ? labels.none
        : courses
            .map(
              (prerequisite, index) =>
                `${inlineCode((index + 1).toString().padStart(2, '0'))} ${
                  prerequisite.course
                }`,
            )
            .join('\n'),
    )
    .setTimestamp();
};
