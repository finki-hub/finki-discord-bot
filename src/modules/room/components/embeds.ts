import { EmbedBuilder } from 'discord.js';

import { labels } from '@/translations/labels.js';

import { type Room } from '../schemas/Room.js';

export const getRoomEmbed = (information: Room) =>
  new EmbedBuilder()
    .setTitle(`${information.name.toString()} (${information.location})`)
    .addFields(
      {
        inline: true,
        name: labels.type,
        value: information.type,
      },
      {
        inline: true,
        name: labels.location,
        value: information.location,
      },
      {
        inline: true,
        name: labels.floor,
        value: information.floor.toString(),
      },
      {
        inline: true,
        name: labels.capacity,
        value: information.capacity.toString(),
      },
      {
        name: labels.description,
        value: information.description,
      },
    )
    .setTimestamp();
