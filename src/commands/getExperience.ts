import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  type MessageContextMenuCommandInteraction,
  PermissionFlagsBits,
} from 'discord.js';

import { getExperienceFromMessage } from '../utils/experience.js';

const name = 'Get Experience';

export const data = new ContextMenuCommandBuilder()
  .setName(name)
  .setType(ApplicationCommandType.Message)
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export const execute = async (
  interaction: MessageContextMenuCommandInteraction,
) => {
  const experience = await getExperienceFromMessage(interaction.targetMessage);

  await interaction.editReply(
    `${interaction.targetMessage.url}: ${experience.toString()}`,
  );
};
