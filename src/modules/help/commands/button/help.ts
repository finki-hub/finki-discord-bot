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

  let page = 0;
  switch (action) {
    case 'first':
      page = 0;

      break;

    case 'last':
      page = pages - 1;

      break;

    case 'next': {
      const currentPage =
        Number(
          interaction.message.embeds[0]?.footer?.text.match(/\d+/gu)?.[0],
        ) - 1;
      page = Math.min(currentPage + 1, pages - 1);

      break;
    }
    case 'previous': {
      const currentPage =
        Number(
          interaction.message.embeds[0]?.footer?.text.match(/\d+/gu)?.[0],
        ) - 1;
      page = Math.max(currentPage - 1, 0);

      break;
    }
    default:
      page = 0;
      break;
  }

  let buttons;
  if (page === 0 && (pages === 0 || pages === 1)) {
    buttons = getPaginationComponents('help');
  } else if (page === 0) {
    buttons = getPaginationComponents('help', 'start');
  } else if (page === pages - 1) {
    buttons = getPaginationComponents('help', 'end');
  } else {
    buttons = getPaginationComponents('help', 'middle');
  }

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
