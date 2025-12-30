import { EmbedBuilder } from 'discord.js';

import { labels } from '@/translations/labels.js';

import { type Room } from '../schemas/Room.js';

export const getRoomEmbed = (information: Room) =>
  new EmbedBuilder()
    .setTitle(`${information.name} (${information.location})`)
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
        value: String(information.floor),
      },
      {
        inline: true,
        name: labels.capacity,
        value: String(information.capacity),
      },
      {
        name: labels.description,
        value: information.description,
      },
    )
    .setTimestamp();
