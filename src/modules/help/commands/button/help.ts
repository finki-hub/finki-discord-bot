import { type ButtonInteraction, MessageFlags } from 'discord.js';

import { getMemberFromGuild } from '@/common/utils/guild.js';
import {
  commandRequiresPermissions,
  getCommandsWithPermission,
} from '@/core/utils/permissions.js';
import { getHelpComponent } from '@/modules/help/components/components.js';
import { commandDescriptions, commandErrors } from '@/translations/commands.js';

export const name = 'help';

export const execute = async (
  interaction: ButtonInteraction,
  args: string[],
) => {
  const [action, pageStr] = args;

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

  const page = action === 'page' && pageStr ? Number.parseInt(pageStr) : 0;

  try {
    await interaction.update({
      components: [getHelpComponent(commands, page)],
      flags: MessageFlags.IsComponentsV2,
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
