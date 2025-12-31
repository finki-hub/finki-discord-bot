import {
  type ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';

import { getMentionComponent } from '@/common/components/mention.js';
import { getRooms } from '@/modules/room/utils/data.js';
import { commandDescriptions, commandErrors } from '@/translations/commands.js';

import { getRoomComponent } from '../components/components.js';
import { getClosestRoom } from './search.js';

export const getCommonCommand = (name: keyof typeof commandDescriptions) => ({
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
      (cl) => cl.name.toLowerCase() === roomName.toLowerCase(),
    );

    if (rooms.length === 0) {
      await interaction.editReply({
        content: commandErrors.roomNotFound,
      });

      return;
    }

    await interaction.editReply({
      components: [
        ...(user ? [getMentionComponent(user)] : []),
        ...rooms.map(getRoomComponent),
      ],
      flags: MessageFlags.IsComponentsV2,
    });
  },
});
