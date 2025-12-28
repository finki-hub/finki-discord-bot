import { type ButtonInteraction, MessageFlags } from 'discord.js';

import { getPaginationComponents } from '@/common/components/pagination.js';
import { getGuild, getMemberFromGuild } from '@/common/utils/guild.js';
import { getCommandsWithPermission } from '@/core/utils/permissions.js';
import { getHelpEmbed } from '@/modules/help/components/embeds.js';
import { commandErrors } from '@/translations/commands.js';

export const name = 'help';

export const execute = async (
  interaction: ButtonInteraction,
  args: string[],
) => {
  const [action] = args;

  if (
    interaction.message.interactionMetadata?.user.id !== undefined &&
    interaction.user.id !== interaction.message.interactionMetadata.user.id
  ) {
    await interaction.reply({
      content: commandErrors.buttonNoPermission,
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  const guild = await getGuild(interaction);
  const member = guild
    ? await getMemberFromGuild(interaction.user.id, guild)
    : null;

  if (guild === null || member === null) {
    await interaction.reply({
      content: commandErrors.commandGuildOnly,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const commands = getCommandsWithPermission(member);
  const commandsPerPage = 8;
  const pages = Math.ceil(commands.length / commandsPerPage);

  const getCurrentPage = () =>
    Number(interaction.message.embeds[0]?.footer?.text.match(/\d+/gu)?.[0]) - 1;

  let page = 0;
  switch (action) {
    case 'last':
      page = pages - 1;
      break;

    case 'next':
      page = Math.min(getCurrentPage() + 1, pages - 1);
      break;

    case 'previous':
      page = Math.max(getCurrentPage() - 1, 0);
      break;

    default:
      break;
  }

  const getPaginationPosition = (): 'end' | 'middle' | 'none' | 'start' => {
    if (pages === 0 || pages === 1) return 'none';
    if (page === 0) return 'start';
    if (page === pages - 1) return 'end';
    return 'middle';
  };

  const buttons = getPaginationComponents('help', getPaginationPosition());

  const embed = getHelpEmbed(commands, page, commandsPerPage);

  try {
    await interaction.update({
      components: [buttons],
      embeds: [embed],
    });
  } catch (error) {
    const errorMessage = Error.isError(error) ? error.message : String(error);
    if (
      errorMessage.includes('Unknown interaction') ||
      errorMessage.includes('already been acknowledged')
    ) {
      return;
    }
    throw error;
  }
};
