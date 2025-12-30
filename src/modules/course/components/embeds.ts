import { EmbedBuilder } from 'discord.js';

import { embedMessages } from '@/translations/embeds.js';
import { labels } from '@/translations/labels.js';

import { type Course } from '../schemas/Course.js';
import { extractParticipants, linkStaff } from './utils.js';

const addCurriculumField = (
  embed: EmbedBuilder,
  course: Course,
  year: '2018' | '2023',
) => {
  const code = course[`${year}-code`];
  const level = course[`${year}-level`];
  const semester = course[`${year}-semester`];
  const prerequisite = course[`${year}-prerequisite`];

  embed.addFields({
    inline: true,
    name: `${year} Учебна програма`,
    value: `**Код:** ${code}\n**Ниво:** ${level}\n**Семестар:** ${semester}${
      prerequisite ? `\n**Предуслов:** ${prerequisite}` : ''
    }`,
  });
};

const createParticipantEmbeds = (
  participants: Array<{ count: number; year: string }>,
): EmbedBuilder[] => {
  if (participants.length === 0) {
    return [];
  }

  const embeds: EmbedBuilder[] = [];
  const maxFieldsPerEmbed = 25;

  for (let i = 0; i < participants.length; i += maxFieldsPerEmbed) {
    const chunk = participants.slice(i, i + maxFieldsPerEmbed);
    const participantsEmbed = new EmbedBuilder()
      .setDescription(
        i === 0
          ? embedMessages.courseParticipantsInfo
          : `${embedMessages.courseParticipantsInfo} (продолжение)`,
      )
      .addFields(
        ...chunk.map(({ count, year }) => ({
          inline: true,
          name: year,
          value: count.toString(),
        })),
      )
      .setTimestamp();

    embeds.push(participantsEmbed);
  }

  return embeds;
};

export const getCourseEmbed = (course: Course) => {
  const embeds: EmbedBuilder[] = [];

  // Main course information embed
  const mainEmbed = new EmbedBuilder()
    .setTitle(course.name)
    .setDescription(embedMessages.courseSummaryInfo)
    .setTimestamp();

  // Add curriculum information if available
  if (course['2023-available']) {
    addCurriculumField(mainEmbed, course, '2023');
  }

  if (course['2018-available']) {
    addCurriculumField(mainEmbed, course, '2018');
  }

  embeds.push(mainEmbed);

  // Staff information embed
  const staffEmbed = new EmbedBuilder()
    .setDescription(embedMessages.courseStaffInfo)
    .addFields(
      {
        inline: true,
        name: labels.professors,
        value: linkStaff(course.professors),
      },
      {
        inline: true,
        name: labels.assistants,
        value: linkStaff(course.assistants),
      },
    )
    .setTimestamp();

  embeds.push(staffEmbed);

  // Participants embeds

  const participants = extractParticipants(course);
  if (participants.length > 0) {
    embeds.push(...createParticipantEmbeds(participants));
  }

  return embeds;
};
