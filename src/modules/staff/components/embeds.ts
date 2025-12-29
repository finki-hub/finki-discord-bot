import { EmbedBuilder } from 'discord.js';

import { labels } from '@/translations/labels.js';

import { type Staff } from '../schemas/Staff.js';

export const getStaffEmbed = (information: Staff) =>
  new EmbedBuilder()
    .setTitle(information.name)
    .addFields(
      {
        inline: true,
        name: labels.title,
        value: information.title === '' ? labels.none : information.title,
      },
      {
        inline: true,
        name: labels.position,
        value: information.position === '' ? labels.none : information.position,
      },
      {
        inline: true,
        name: labels.cabinet,
        value:
          information.cabinet === ''
            ? labels.none
            : information.cabinet.toString(),
      },
      {
        name: labels.email,
        value: information.email === '' ? labels.none : information.email,
      },
      {
        inline: true,
        name: labels.profile,
        value:
          information.profile === ''
            ? labels.none
            : `[${labels.link}](${information.profile})`,
      },
      {
        inline: true,
        name: labels.courses,
        value:
          information.courses === ''
            ? labels.none
            : `[${labels.link}](${information.courses})`,
      },
      {
        inline: true,
        name: labels.consultations,
        value:
          information.consultations === ''
            ? labels.none
            : `[${labels.link}](${information.consultations})`,
      },
    )
    .setTimestamp();
