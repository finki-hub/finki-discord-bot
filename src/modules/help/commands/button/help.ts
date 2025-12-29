import { type ButtonInteraction, MessageFlags } from 'discord.js';

import { getPaginationComponents } from '@/common/components/pagination.js';
import { getMemberFromGuild } from '@/common/utils/guild.js';
import {
  commandRequiresPermissions,
  getCommandsWithPermission,
} from '@/core/utils/permissions.js';
import { getHelpEmbed } from '@/modules/help/components/embeds.js';
import { COMMANDS_PER_PAGE } from '@/modules/help/utils/constants.js';
import { commandDescriptions, commandErrors } from '@/translations/commands.js';

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

  let commands: string[];
  if (interaction.guild === null) {
    commands = Object.keys(commandDescriptions).filter(
      (command) => !commandRequiresPermissions(command),
    );
  } else {
    const member = await getMemberFromGuild(
      interaction.user.id,
      interaction.guild,
    );

    if (member === null) {
      await interaction.reply({
        content: commandErrors.commandGuildOnly,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    commands = await getCommandsWithPermission(member);
  }
  const pages = Math.ceil(commands.length / COMMANDS_PER_PAGE);

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

  const embed = getHelpEmbed(commands, page);

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
