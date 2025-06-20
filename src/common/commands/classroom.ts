import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { getClassroomEmbed } from '../../components/commands.js';
import { getClassrooms } from '../../configuration/files.js';
import { type Command } from '../../lib/types/Command.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponseFunctions,
} from '../../translations/commands.js';
import { logCommandEvent } from '../../utils/analytics.js';
import { getClosestClassroom } from '../../utils/search.js';

export const getCommonCommand = (
  name: keyof typeof commandDescriptions,
): Command => ({
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription(commandDescriptions[name])
    .addStringOption((option) =>
      option
        .setName('classroom')
        .setDescription('Просторија')
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addUserOption((option) =>
      option.setName('user').setDescription('Корисник').setRequired(false),
    ),

  execute: async (interaction: ChatInputCommandInteraction) => {
    const classroom = interaction.options.getString('classroom', true);
    const user = interaction.options.getUser('user');

    const closestClassroom = getClosestClassroom(classroom) ?? classroom;

    const charPos = closestClassroom.indexOf('(');
    const classroomName =
      charPos === -1
        ? closestClassroom
        : closestClassroom.slice(0, charPos).trim();
    const classrooms = getClassrooms().filter(
      (cl) =>
        cl.classroom.toString().toLowerCase() === classroomName.toLowerCase(),
    );

    if (classrooms.length === 0) {
      await interaction.editReply({
        content: commandErrors.classroomNotFound,
      });

      return;
    }

    const embeds = classrooms.map((cl) => getClassroomEmbed(cl));
    await interaction.editReply({
      content: user ? commandResponseFunctions.commandFor(user.id) : null,
      embeds,
    });

    await logCommandEvent(interaction, 'classroom', {
      classroom: closestClassroom,
      keyword: classroom,
      matchedClassrooms: classrooms,
    });
  },
});
