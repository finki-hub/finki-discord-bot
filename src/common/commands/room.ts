import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { getRoomEmbed } from '../../components/commands.js';
import { getRooms } from '../../configuration/files.js';
import { type Command } from '../../lib/types/Command.js';
import {
  commandDescriptions,
  commandErrors,
  commandResponseFunctions,
} from '../../translations/commands.js';
import { logCommandEvent } from '../../utils/analytics.js';
import { getClosestRoom } from '../../utils/search.js';

export const getCommonCommand = (
  name: keyof typeof commandDescriptions,
): Command => ({
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription(commandDescriptions[name])
    .addStringOption((option) =>
      option
        .setName('room')
        .setDescription('Просторија')
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addUserOption((option) =>
      option.setName('user').setDescription('Корисник').setRequired(false),
    ),

  execute: async (interaction: ChatInputCommandInteraction) => {
    const room = interaction.options.getString('room', true);
    const user = interaction.options.getUser('user');

    const closestRoom = getClosestRoom(room) ?? room;

    const charPos = closestRoom.indexOf('(');
    const roomName =
      charPos === -1 ? closestRoom : closestRoom.slice(0, charPos).trim();
    const rooms = getRooms().filter(
      (cl) => cl.classroom.toString().toLowerCase() === roomName.toLowerCase(),
    );

    if (rooms.length === 0) {
      await interaction.editReply({
        content: commandErrors.roomNotFound,
      });

      return;
    }

    const embeds = rooms.map((cl) => getRoomEmbed(cl));
    await interaction.editReply({
      content: user ? commandResponseFunctions.commandFor(user.id) : null,
      embeds,
    });

    await logCommandEvent(interaction, name, {
      keyword: room,
      matchedRooms: rooms,
      room: closestRoom,
    });
  },
});
