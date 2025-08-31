import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';

import { getThemeColor } from '../configuration/main.js';
import { specialStrings } from '../translations/special.js';

export const getSpecialRequestEmbed = () =>
  new EmbedBuilder()
    .setColor(getThemeColor())
    .setTitle(specialStrings.requestTitle)
    .setDescription(specialStrings.requestText);

export const getSpecialRequestComponents = () => {
  const components = [];

  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('irregulars:request')
      .setLabel(specialStrings.irregularsButton)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('vip:request')
      .setLabel(specialStrings.vipButton)
      .setStyle(ButtonStyle.Primary),
  );
  components.push(row);

  return components;
};

export const getVipConfirmEmbed = () =>
  new EmbedBuilder()
    .setColor(getThemeColor())
    .setTitle(specialStrings.oath)
    .setDescription(specialStrings.vipOath);

export const getVipConfirmComponents = () => {
  const components = [];

  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('vip:confirm')
      .setLabel(specialStrings.accept)
      .setStyle(ButtonStyle.Success),
  );
  components.push(row);

  return components;
};

export const getVipAcknowledgeComponents = () => {
  const components = [];

  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('vip:acknowledge')
      .setLabel(specialStrings.accept)
      .setStyle(ButtonStyle.Success),
  );
  components.push(row);

  return components;
};

export const getIrregularsConfirmEmbed = () =>
  new EmbedBuilder()
    .setColor(getThemeColor())
    .setTitle(specialStrings.oath)
    .setDescription(specialStrings.irregularsOath);

export const getIrregularsConfirmComponents = () => {
  const components = [];

  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('irregulars:confirm')
      .setLabel(specialStrings.accept)
      .setStyle(ButtonStyle.Success),
  );
  components.push(row);

  return components;
};

export const getIrregularsAcknowledgeComponents = () => {
  const components = [];

  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('irregulars:acknowledge')
      .setLabel(specialStrings.accept)
      .setStyle(ButtonStyle.Success),
  );
  components.push(row);

  return components;
};
